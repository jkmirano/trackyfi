import { Component, Inject, OnInit } from '@angular/core';
import { ModalService } from 'carbon-components-angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  formExpenseVal$: any;

  constructor(
    @Inject('formType') public formType: string = 'expense',
    @Inject('modalSize') public modalSize: any = 'lg',
    @Inject('openModal') public openModal: boolean = false,
    @Inject('showCloseButton') public showCloseButton: boolean = true,
    @Inject('categories') public categories: any[] = [],
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
