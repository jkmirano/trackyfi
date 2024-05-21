import { Component, Inject, OnInit } from '@angular/core';
import { ModalService } from 'carbon-components-angular';

@Component({
  selector: 'app-expense-form-modal',
  templateUrl: './expense-form-modal.component.html',
  styleUrls: ['./expense-form-modal.component.scss'],
})
export class ExpenseFormModalComponent implements OnInit {
  formExpenseVal$: any;

  constructor(
    @Inject('formType') public formType: string = 'expense',
    @Inject('modalSize') public modalSize: any = 'lg',
    @Inject('openModal') public openModal: boolean = false,
    @Inject('showCloseButton') public showCloseButton: boolean = true,
    @Inject('categories') public categories: any[] = [],
    @Inject('statusList') public statusList: any[] = [],
    @Inject('updateData') public updateData: any,
    @Inject('data') public data: any,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {}

  closeModal(hasData: boolean = false) {
    this.openModal = false;
    this.modalService.destroy();
    if (hasData) this.data.next(this.formExpenseVal$);
  }

  getExpenseFormValues(formExpenseVal: any) {
    this.formExpenseVal$ = formExpenseVal;
  }
}
