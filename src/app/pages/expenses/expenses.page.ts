import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  IconService,
  ModalService,
  TableHeaderItem,
  TableItem,
  TableModel,
  ToastContent,
} from 'carbon-components-angular';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { ExpensesService } from 'src/app/shared/services/expenses.service';
import { Filter16, Edit16, TrashCan16 } from '@carbon/icons';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { formatDate } from '@angular/common';
import { CategoryEnum } from 'src/app/shared/enums/category.enum';
import { DeleteModalComponent } from 'src/app/shared/components/modal/delete-modal/delete-modal.component';
import { StatusService } from 'src/app/shared/services/status.service';
import { StatusEnum } from 'src/app/shared/enums/status.enum';
import { ExpenseCostEnum } from 'src/app/shared/enums/expense.enum';
import { ExpenseFormModalComponent } from 'src/app/shared/components/modal/expense-form-modal/expense-form-modal.component';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
})
export class ExpensesPage implements OnInit, AfterContentInit {
  // general
  destroyed = new Subject<void>();
  loading: boolean = false;
  updateExpense$: boolean = false;
  filter?: Object = {};
  categories: any[] = [{ _id: '0', name: 'None', selected: true }];
  statusList: any[] = [{ _id: '0', name: 'None', selected: true }];
  notificationConfig: ToastContent = {
    type: 'success',
    title: 'Sample toast',
    subtitle: 'Sample subtitle message',
    caption: 'Sample caption',
    lowContrast: true,
    showClose: true,
  };
  expenseFormData$: Observable<any> = new Subject<any>();
  delExpense$: Observable<any> = new Subject<any>();

  // Filter Form
  filterForm: FormGroup | any;
  keyword$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  category$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  status$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  get searchCtrl() {
    return this.filterForm.get('keyword') as FormControl;
  }
  get categoryCtrl() {
    return this.filterForm.get('category') as FormControl;
  }
  get statusCtrl() {
    return this.filterForm.get('status') as FormControl;
  }

  // table
  @ViewChild('tableActionsRef', { static: false })
  // @ts-expect-error
  protected tableActionsRef: TemplateRef<any>;
  @ViewChild('tableCurrencyRef', { static: false })
  // @ts-expect-error
  protected tableCurrencyRef: TemplateRef<any>;

  // Pie
  pieData: any[] = [];
  pieOptions: any = {
    title: 'Expenses - Categories',
    resizable: true,
    height: '400px',
    pie: {
      alignment: 'center',
    },
    legend: {
      alignment: 'center',
    },
    theme: 'g90',
    color: {
      scale: {
        Housing: '#8b3ffc',
        Food: '#0cbdba',
        Miscellaneous: '#FFD53D',
        Bills: '#4589ff',
      },
    },
  };
  // -- Line
  lineData: any[] = [];
  lineOptions: any = {
    title: 'Expenses - Expected/Actual',
    axes: {
      bottom: {
        title: '2024 Annual Expenses',
        mapsTo: 'key',
        scaleType: 'labels',
      },
      left: {
        mapsTo: 'value',
        title: 'Cost (₱)',
        scaleType: 'linear',
      },
    },
    height: '400px',
    theme: 'g90',
    color: {
      scale: {
        Actual: '#8b3ffc',
        Expected: '#0cbdba',
      },
    },
  };

  // Table
  tableModel: TableModel = new TableModel();
  tableData: any[] = [];

  constructor(
    private expenseService: ExpensesService,
    private is: IconService,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoriesService,
    private statusService: StatusService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.initIcons();
    this.initForm();
    this.initData();
  }

  initIcons() {
    this.is.registerAll([Filter16, Edit16, TrashCan16]);
  }

  initForm() {
    this.filterForm = new FormGroup({
      keyword: new FormControl(null),
      category: new FormControl(null),
      status: new FormControl(null),
    });
  }

  initData() {
    this.loading = true;
    this.filter = {
      pageNumber: 1,
      pageSize: 10,
    };
    this.initGetCategories();
    this.initStatus();
    this.initializeDataObservable();
  }

  initStatus() {
    this.statusService
      .getStatus()
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (resp: any) => {
          if (resp)
            resp.map((item: any) => {
              this.statusList.push({
                ...item,
                content: item.name,
              });
            });
        },
        error: (err) => console.log(err),
      });
  }

  initGetCategories() {
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (resp: any) => {
          if (resp)
            resp.map((item: any) => {
              this.categories.push({
                ...item,
                content: item.name,
              });
            });
        },
        error: (err) => console.log(err),
      });
  }

  initializeDataObservable() {
    this.selectPage(1);
    let page$ = this.route.queryParamMap.pipe(
      map((paramMap) => {
        let page = paramMap?.get('page') || '1';
        return parseFloat(page);
      }),
      distinctUntilChanged()
    );

    let pageLength$ = this.route.queryParamMap.pipe(
      map((paramMap) => {
        let pageLength = paramMap?.get('pageLength') || '10';
        return parseFloat(pageLength);
      }),
      distinctUntilChanged()
    );

    this.keyword$.next(this.searchCtrl.value);
    this.category$.next(this.categoryCtrl.value);
    this.status$.next(this.statusCtrl.value);

    this.searchCtrl.valueChanges
      .pipe(
        takeUntil(this.destroyed),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe({
        next: (keyword) => {
          this.selectPage(1);
          this.keyword$.next(keyword);
        },
      });

    this.categoryCtrl.valueChanges
      .pipe(takeUntil(this.destroyed), distinctUntilChanged())
      .subscribe({
        next: (category) => {
          this.selectPage(1);
          this.category$.next(category);
        },
      });

    this.statusCtrl.valueChanges
      .pipe(takeUntil(this.destroyed), distinctUntilChanged())
      .subscribe({
        next: (status) => {
          this.selectPage(1);
          this.status$.next(status);
        },
      });

    combineLatest({
      keyword: this.keyword$,
      category: this.category$,
      status: this.status$,
      pageSize: pageLength$,
      pageNumber: page$,
    })
      .pipe(
        tap((_) => {
          this.loading = true;
        }),
        switchMap(({ keyword, category, status, pageSize, pageNumber }) => {
          return this.expenseService.getExpenses({
            keyword,
            category,
            status,
            pageSize,
            pageNumber,
          });
        }),
        takeUntil(this.destroyed)
      )
      .subscribe({
        next: (response: any) => {
          this.tableData = [];
          this.tableModel.header = [
            new TableHeaderItem({ data: 'Name' }),
            new TableHeaderItem({ data: 'Category' }),
            new TableHeaderItem({ data: 'Expected' }),
            new TableHeaderItem({ data: 'Actual' }),
            new TableHeaderItem({ data: 'Variance' }),
            new TableHeaderItem({ data: 'Due' }),
            new TableHeaderItem({ data: 'Status' }),
            new TableHeaderItem({ data: 'Actions' }),
          ];

          if (response && response.status === 200) {
            const data = response.data;
            this.tableData = data;

            this.tableModel.data = this.prepareData(data);
            this.tableModel.currentPage = response?.meta?.pageNumber || 1;
            this.tableModel.pageLength = response?.meta?.pageSize || 10;
            this.tableModel.totalDataLength = response?.meta?.totalCount || 0;
            this.evalExpensePieData(data);
            this.evalExpenseLineData(data);
          } else {
            this.tableModel.data = [];
            this.tableModel.currentPage = response?.meta?.pageNumber || 1;
            this.tableModel.pageLength = response?.meta?.pageSize || 10;
            this.tableModel.totalDataLength = response?.meta?.totalCount || 0;
            this.pieData = [];
          }

          this.loading = false;
        },
        error: (err) => console.log('@TODO' + err),
      });
  }

  prepareData(responseData: any) {
    let tableData: TableItem[][] = responseData.map((data: any) => {
      let newRow: TableItem[] = [];
      let variance = 'n/a';
      const category = this.categories.find(
        (cat) => cat.type === data.category
      );
      const status = this.statusList.find((stat) => stat.type === data.status);

      if (data.expected && data.actual) {
        variance = (data.expected - data.actual).toString();
      } else if (
        (data.expected && !data.actual) ||
        (!data.expected && data.actual)
      ) {
        variance =
          data.expected && !data.actual
            ? data.expected.toString()
            : !data.expected && data.actual.toString()
            ? data.actual
            : 'n/a';
      }

      newRow.push(new TableItem({ data: data.name }));
      newRow.push(new TableItem({ data: category.name }));
      newRow.push(
        new TableItem({
          data: data.expected ? data.expected : null,
          template: this.tableCurrencyRef,
        })
      );
      newRow.push(
        new TableItem({
          data: data.actual ? data.actual : null,
          template: this.tableCurrencyRef,
        })
      );
      newRow.push(
        new TableItem({ data: variance, template: this.tableCurrencyRef })
      );
      newRow.push(
        new TableItem({
          data: data.due
            ? formatDate(new Date(data.due), 'MMMM dd, y', 'en-us')
            : 'n/a',
        })
      );
      newRow.push(new TableItem({ data: status.name }));
      newRow.push(
        new TableItem({ data: data, template: this.tableActionsRef })
      );
      return newRow;
    });
    return tableData;
  }

  evalExpensePieData(respData: any) {
    if (respData.length > 0) {
      let billsVal = 0;
      let foodVal = 0;
      let miscVal = 0;
      let housingVal = 0;
      respData.forEach((data: any) => {
        if (data.category === CategoryEnum.Bills) billsVal += data.actual;
        if (data.category === CategoryEnum.Food) foodVal += data.actual;
        if (data.category === CategoryEnum.Misc) miscVal += data.actual;
        if (data.category === CategoryEnum.Housing) housingVal += data.actual;
      });
      this.pieData = this.categories.map((category) => {
        return {
          group: category.name,
          value:
            category.type === CategoryEnum.Bills
              ? billsVal
              : category.type === CategoryEnum.Food
              ? foodVal
              : category.type === CategoryEnum.Misc
              ? miscVal
              : category.type === CategoryEnum.Housing
              ? housingVal
              : 0,
        };
      });
    } else {
      this.pieData = [];
    }
  }

  evalExpenseLineData(data: any) {
    const expectedData = data.map((d: any) => {
      return {
        group: ExpenseCostEnum.Expected,
        key: new Date(d.due),
        value: d.expected,
      };
    });
    const actualData = data.map((d: any) => {
      return {
        group: ExpenseCostEnum.Actual,
        key: new Date(d.due),
        value: d.actual,
      };
    });
    this.lineData = [...expectedData, ...actualData];
    this.lineData.sort((a: any, b: any) => a.key - b.key);
    this.lineData.forEach((d) => {
      d.key = formatDate(new Date(d.key), 'MMM-d', 'en-us');
    });
  }

  overflowOnClick = (event: any) => {
    event.stopPropagation();
  };

  selectPage(page: number): void {
    this.router.navigate([], {
      queryParams: {
        page: page,
        pageLength: this.tableModel.pageLength,
      },
    });
  }

  async openExpenseModal(expenseData: any) {
    this.updateExpense$ = expenseData ? true : false;
    if (!expenseData) {
      this.categories.forEach((cat) => delete cat.selected);
      this.statusList.forEach((stat) => delete stat.selected);
    }

    this.modalService.create({
      component: ExpenseFormModalComponent,
      inputs: {
        formType: 'expense',
        modalSize: 'sm',
        openModal: true,
        showCloseButton: true,
        categories: this.categories,
        statusList: this.statusList,
        updateData: expenseData,
        data: this.expenseFormData$,
      },
    });
  }

  openDeleteExpenseModal(expenseData: any) {
    this.modalService.create({
      component: DeleteModalComponent,
      inputs: {
        formType: 'expense',
        modalSize: 'sm',
        openModal: true,
        showCloseButton: true,
        data: expenseData,
        delExpense: this.delExpense$,
      },
    });
  }

  createExpense(payload: any) {
    this.expenseService
      .createExpense(payload)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (resp) => {
          if (resp.status === 201) {
            this.initData();
          }
        },
        error: (err) => {
          this.loading = false;
          console.log(err.message);
        },
      });
  }

  updateExpense(_id: string, payload: any) {
    this.updateExpense$ = false;
    this.expenseService
      .updateExpense(_id, payload)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (resp) => {
          if (resp.status === 201) {
            this.initData();
          }
        },
        error: (err) => {
          this.loading = false;
          console.log(err.message);
        },
      });
  }

  deleteExpense(expenseData: any) {
    this.loading = true;
    this.expenseService
      .deleteExpense(expenseData._id)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (resp) => {
          if (resp.status === 200) {
            this.initData();
          }
        },
        error: (err) => {
          this.loading = false;
          console.log(err);
        },
      });
  }

  ngAfterContentInit(): void {
    // Create/Update Expense
    // Will Trigger once create button is clicked
    // Will process the data for saving...
    this.expenseFormData$.subscribe((expenseFormData) => {
      if (expenseFormData) {
        const payload = {
          ...expenseFormData,
          category: expenseFormData.category.type,
          status: expenseFormData.status.type,
          due: new Date(expenseFormData.due).toISOString(),
        };
        this.loading = true;

        if (!this.updateExpense$) {
          // Create Expense
          this.createExpense(payload);
        } else {
          // Update Expense
          this.updateExpense(expenseFormData._id, payload);
        }
      }
    });

    // Delete Expense
    this.delExpense$.subscribe((delExp) => {
      this.deleteExpense(delExp);
    });
  }

  selectedCategory(e: any) {
    this.categoryCtrl.patchValue(e.value);
    this.categories.forEach((cat) => {
      cat.selected = cat.type === e.value ? true : false;
    });
  }

  selectedStatus(e: any) {
    this.statusCtrl.patchValue(e.value);
    this.statusList.forEach((stat) => {
      stat.selected = stat.type === e.value ? true : false;
    });
  }
}
