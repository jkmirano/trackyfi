import { Component, Inject } from '@angular/core';
import { ModalService } from 'carbon-components-angular';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteModalComponent {
  constructor(
    @Inject('formType') public formType: string = 'expense',
    @Inject('modalSize') public modalSize: any = 'lg',
    @Inject('openModal') public openModal: boolean = false,
    @Inject('showCloseButton') public showCloseButton: boolean = true,
    @Inject('data') public data: any,
    @Inject('delExpense') public delExpense: any,
    private modalService: ModalService
  ) {}

  closeModal(delExpense: boolean = false) {
    this.openModal = false;
    this.modalService.destroy();
    if (delExpense) this.delExpense.next(this.data);
  }
}
