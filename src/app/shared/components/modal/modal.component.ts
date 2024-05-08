import { Component, Inject, OnInit } from '@angular/core';
import { ModalService } from 'carbon-components-angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  constructor(
    @Inject('formType') public formType: string = 'expense',
    @Inject('modalSize') public modalSize: any = 'lg',
    @Inject('openModal') public openModal: boolean = false,
    @Inject('showCloseButton') public showCloseButton: boolean = true,
    @Inject('categories') public categories: any[] = [],
    private modalService: ModalService
  ) {}

  ngOnInit(): void {}

  closeModal() {
    this.openModal = false;
  }
}
