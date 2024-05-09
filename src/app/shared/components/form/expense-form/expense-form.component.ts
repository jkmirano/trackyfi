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
  @Input() dropdownItems: any[] = [];
  @Output() expenseFormValues: EventEmitter<any> = new EventEmitter();
  destroyed = new Subject<void>();
  form: FormGroup | any;

  constructor() {}

  ngOnInit(): void {
    this.formInit();
  }

  formInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      due: new FormControl(null),
      expected: new FormControl(null),
      actual: new FormControl(null),
    });
    this.form.valueChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe((formVal: any) => this.expenseFormValues.emit(formVal));
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
