import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss'],
})
export class ExpenseFormComponent implements OnInit {
  @Input() dropdownItems: any[] = [];
  form: FormGroup | any;

  constructor() {}

  ngOnInit(): void {
    this.formInit();
  }

  formInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      expected: new FormControl(null),
      actual: new FormControl(null),
    });
  }

  dropdownSelect(e: any) {
    console.log(e);
  }
}
