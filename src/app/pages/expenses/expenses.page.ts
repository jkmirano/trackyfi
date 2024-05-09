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

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
})
export class ExpensesPage implements OnInit, AfterContentInit {
  // general
  destroyed = new Subject<void>();
  loading: boolean = true;
  dataSaving: boolean = false;
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
  pieData = [
    {
      group: 'Bills',
      value: 10000,
    },
    {
      group: 'Housing',
      value: 300,
    },
    {
      group: 'Food',
      value: 1500,
    },
    {
      group: 'Miscellaneous',
      value: 800,
    },
  ];
  pieOptions: any = {
    title: 'Expenses',
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
  lineData: any = [
    {
      group: 'Dataset 1',
      key: 'Qty',
      value: 34200,
    },
    {
      group: 'Dataset 1',
      key: 'More',
      value: 23500,
    },
    {
      group: 'Dataset 1',
      key: 'Sold',
      value: 53100,
    },
    {
      group: 'Dataset 1',
      key: 'Restocking',
      value: 42300,
    },
    {
      group: 'Dataset 1',
      key: 'Misc',
      value: 12300,
    },
    {
      group: 'Dataset 2',
      key: 'Qty',
      value: 34200,
    },
    {
      group: 'Dataset 2',
      key: 'More',
      value: 53200,
    },
    {
      group: 'Dataset 2',
      key: 'Sold',
      value: 42300,
    },
    {
      group: 'Dataset 2',
      key: 'Restocking',
      value: 21400,
    },
    {
      group: 'Dataset 2',
      key: 'Misc',
      value: 0,
    },
    {
      group: 'Dataset 3',
      key: 'Qty',
      value: 41200,
    },
    {
      group: 'Dataset 3',
      key: 'More',
      value: 18400,
    },
    {
      group: 'Dataset 3',
      key: 'Sold',
      value: 34210,
    },
    {
      group: 'Dataset 3',
      key: 'Restocking',
      value: 1400,
    },
    {
      group: 'Dataset 3',
      key: 'Misc',
      value: 42100,
    },
    {
      group: 'Dataset 4',
      key: 'Qty',
      value: 22000,
    },
    {
      group: 'Dataset 4',
      key: 'More',
      value: 1200,
    },
    {
      group: 'Dataset 4',
      key: 'Sold',
      value: 9000,
    },
    {
      group: 'Dataset 4',
      key: 'Restocking',
      value: 24000,
      audienceSize: 10,
    },
    {
      group: 'Dataset 4',
      key: 'Misc',
      value: 3000,
      audienceSize: 10,
    },
  ];
  lineOptions: any = {
    title: 'Income/Savings',
    axes: {
      bottom: {
        title: '2019 Annual Sales Figures',
        mapsTo: 'key',
        scaleType: 'labels',
      },
      left: {
        mapsTo: 'value',
        title: 'Conversion rate',
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
    this.filter = {
      pageNumber: 1,
      pageSize: 10,
    };
    this.expenseService
      .getExpenses(this.filter)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (expenses: any) => {
          if (expenses && expenses.length) {
            this.tableData = expenses;
            this.initializeDataObservable();
          }
        },
        error: (err) => console.log(err),
      });
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

    this.categoryCtrl.valueChanges.pipe(takeUntil(this.destroyed)).subscribe({
      next: (role) => {
        this.selectPage(1);
        setTimeout(() => this.category$.next(role));
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

          if (response && response.length > 0) {
            const data = response;
            this.tableData = data;

            this.tableModel.data = this.prepareData(data);
            this.tableModel.currentPage = response?.meta?.page || 1;
            this.tableModel.pageLength = response?.meta?.displayItem || 10;
            this.tableModel.totalDataLength = response?.meta?.total || 0;
          } else {
            this.tableModel.data = [];
            this.tableModel.currentPage = response?.meta?.page || 1;
            this.tableModel.pageLength = response?.meta?.displayItem || 10;
            this.tableModel.totalDataLength = response?.meta?.total || 0;
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
      newRow.push(new TableItem({ data: data.category }));
      newRow.push(
        new TableItem({ data: data.expected, template: this.tableCurrencyRef })
      );
      newRow.push(
        new TableItem({ data: data.actual, template: this.tableCurrencyRef })
      );
      newRow.push(
        new TableItem({ data: variance, template: this.tableCurrencyRef })
      );
      newRow.push(new TableItem({ data: data.due ? data.due : 'n/a' }));
      newRow.push(
        new TableItem({ data: data, template: this.tableActionsRef })
      );
      return newRow;
    });
    return tableData;
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

  openAddExpenseModal() {
    this.modalService.create({
      component: ModalComponent,
      inputs: {
        formType: 'expense',
        modalSize: 'sm',
        openModal: true,
        showCloseButton: true,
        categories: this.categories,
        data: this.expenseFormData$,
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
          category: expenseFormData.category.name,
        };
        this.dataSaving = true;
        this.expenseService
          .createExpense(payload)
          .pipe(takeUntil(this.destroyed))
          .subscribe({
            next: (resp) => {
              this.dataSaving = false;
              if (resp.status === 201) {
                this.initializeDataObservable();
              }
            },
            error: (err) => {
              this.dataSaving = false;
              console.log(err.message);
            },
          });
      }
    });
  }
}
