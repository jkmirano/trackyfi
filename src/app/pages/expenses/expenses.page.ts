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
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { formatDate } from '@angular/common';
import { CategoryEnum } from 'src/app/shared/enums/category.enum';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
})
export class ExpensesPage implements OnInit, AfterContentInit {
  // general
  destroyed = new Subject<void>();
  loading: boolean = false;
  updateExpense: boolean = false;
  filter?: Object = {};
  categories: any[] = [];
  notificationConfig: ToastContent = {
    type: 'success',
    title: 'Sample toast',
    subtitle: 'Sample subtitle message',
    caption: 'Sample caption',
    lowContrast: true,
    showClose: true,
  };
  expenseFormData$: Observable<any> = new Subject<any>();

  // Filter Form
  filterForm: FormGroup | any;
  keyword$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  category$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  get searchCtrl() {
    return this.filterForm.get('keyword') as FormControl;
  }
  get categoryCtrl() {
    return this.filterForm.get('category') as FormControl;
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
    protected modalService: ModalService
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
    });
  }

  initData() {
    this.loading = true;
    this.filter = {
      pageNumber: 1,
      pageSize: 10,
    };
    this.initFirstExpenses();
    this.initGetCategories();
  }

  initFirstExpenses() {
    this.expenseService
      .getExpenses(this.filter)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (expenses: any) => {
          if (expenses && expenses.status === 200) {
            this.initializeDataObservable();
          }
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
          if (resp) {
            this.categories = resp.map((item: any) => {
              return {
                ...item,
                content: item.name,
              };
            });
          }
        },
        error: (err) => console.log(err),
      });
  }

  evalExpensePieData() {
    if (this.categories.length > 0 && this.tableData.length > 0) {
      let billsVal = 0;
      let foodVal = 0;
      let miscVal = 0;
      let housingVal = 0;
      this.tableData.forEach((data) => {
        if (data.category.type === CategoryEnum.Bills) billsVal += data.actual;
        if (data.category.type === CategoryEnum.Food) foodVal += data.actual;
        if (data.category.type === CategoryEnum.Misc) miscVal += data.actual;
        if (data.category.type === CategoryEnum.Housing)
          housingVal += data.actual;
      });
      this.pieData = this.categories.map((category) => {
        return {
          group: category.content,
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
    }
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

    combineLatest({
      keyword: this.keyword$,
      category: this.category$,
      pageLength: pageLength$,
      page: page$,
    })
      .pipe(
        tap((_) => {
          this.loading = true;
        }),
        switchMap(({ keyword, category, pageLength, page }) => {
          return this.expenseService.getExpenses({
            keyword,
            category,
            pageLength,
            page,
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
            new TableHeaderItem({ data: 'Actions' }),
          ];

          if (response && response.status === 200) {
            const data = response.data;
            this.tableData = data;

            this.tableModel.data = this.prepareData(data);
            this.tableModel.currentPage = response?.meta?.page || 1;
            this.tableModel.pageLength = response?.meta?.displayItem || 10;
            this.tableModel.totalDataLength = response?.meta?.total || 0;
            this.evalExpensePieData();
            this.evalExpenseLineData(data);
          } else {
            this.tableModel.data = [];
            this.tableModel.currentPage = response?.meta?.page || 1;
            this.tableModel.pageLength = response?.meta?.displayItem || 10;
            this.tableModel.totalDataLength = response?.meta?.total || 0;
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
      newRow.push(new TableItem({ data: data.category.name }));
      newRow.push(
        new TableItem({ data: data.expected, template: this.tableCurrencyRef })
      );
      newRow.push(
        new TableItem({ data: data.actual, template: this.tableCurrencyRef })
      );
      newRow.push(
        new TableItem({ data: variance, template: this.tableCurrencyRef })
      );
      newRow.push(
        new TableItem({
          data: data.due
            ? formatDate(new Date(data.due), 'MMMM d, y', 'en-us')
            : 'n/a',
        })
      );
      newRow.push(
        new TableItem({ data: data, template: this.tableActionsRef })
      );
      return newRow;
    });
    return tableData;
  }

  evalExpenseLineData(data: any) {
    const expectedData = data.map((d: any) => {
      return {
        group: 'Expected',
        key: formatDate(new Date(d.due), 'MMM-d', 'en-us'),
        value: d.expected,
      };
    });
    const actualData = data.map((d: any) => {
      return {
        group: 'Actual',
        key: formatDate(new Date(d.due), 'MMM-d', 'en-us'),
        value: d.actual,
      };
    });
    this.lineData = [...expectedData, ...actualData];
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

  openExpenseModal(expenseData: any = undefined) {
    if (expenseData) this.updateExpense = true;
    this.modalService.create({
      component: ModalComponent,
      inputs: {
        formType: 'expense',
        modalSize: 'sm',
        openModal: true,
        showCloseButton: true,
        categories: this.categories,
        updateData: expenseData,
        data: this.expenseFormData$,
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
    // Will Trigger once create button is clicked
    // Will process the data for saving...
    this.expenseFormData$.subscribe((expenseFormData) => {
      if (expenseFormData) {
        const payload = {
          ...expenseFormData,
          category: {
            name: expenseFormData.category.name,
            type: expenseFormData.category.type,
          },
          due: new Date(expenseFormData.due).toISOString(),
        };
        this.loading = true;

        if (!this.updateExpense) {
          // Create Expense
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
        } else {
          // Update Expense
          this.updateExpense = false;
          this.expenseService
            .updateExpense(expenseFormData._id, payload)
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
      }
    });
  }

  selectedCategory(e: any) {
    this.categoryCtrl.patchValue(e.value);
  }
}
