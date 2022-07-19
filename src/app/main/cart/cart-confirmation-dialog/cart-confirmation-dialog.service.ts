import { Injectable } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartConfirmationDialogComponent } from './cart-confirmation-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class CartConfirmationDialogService {

  constructor(readonly modalService: NgbModal) { }

  confirmCartConfirmationDialog(
    title: string,
    message: string,
    btnOkText = 'Oui',
    btnCancelText = 'Non',
    dialogSize: 'sm'|'lg' = 'sm',
    isCancelBtnVisible = true ): Promise<boolean> {
    const modalRef = this.modalService.open(CartConfirmationDialogComponent, { centered: true,windowClass: 'centerpopup ' });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.isCancelBtnVisible = isCancelBtnVisible;

    return modalRef.result;
  }

}
