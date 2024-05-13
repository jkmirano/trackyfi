import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss'],
})
export class ExpenseFormComponent implements OnInit, OnDestroy {
  @Input() data: any;
  @Input() dropdownItems: any[] = [];
  @Output() expenseFormValues: EventEmitter<any> = new EventEmitter();
  destroyed = new Subject<void>();
  form: FormGroup | any;

  constructor() {}

  ngOnInit(): void {
    this.formInit();
    this.initDataUpdate();
  }

  formInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      due: new FormControl(null),
      expected: new FormControl(null),
      actual: new FormControl(null),
      _id: new FormControl(null),
    });
    this.form.valueChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe((formVal: any) => this.expenseFormValues.emit(formVal));
  }

  initDataUpdate() {
    if (this.data) {
      let selectedItem;
      this.dropdownItems.forEach((item) => {
        item.selected = false;
        if (item.type === this.data.category.type) {
          item.selected = true;
          selectedItem = item;
        }
        return item;
      });

      this.form.patchValue({
        name: this.data.name,
        due: new Date(this.data.due),
        category: selectedItem,
        expected: this.data.expected,
        actual: this.data.actual,
        _id: this.data._id ? this.data._id : undefined,
      });
    }
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
