import { Injectable } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogRelookingComponent } from './confirmation-dialog-relooking.component';


@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogRelookingService {

  constructor(readonly modalService: NgbModal) { }

  confirm(
    title: string,
    message: string,
    btnOkText = 'Oui',
    btnCancelText = 'Non',
    dialogSize: 'sm'|'lg' = 'sm',
    isCancelBtnVisible = true ): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationDialogRelookingComponent, { centered: true,windowClass: 'centerpopup ' });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.isCancelBtnVisible = isCancelBtnVisible;

    return modalRef.result;
  }

}
