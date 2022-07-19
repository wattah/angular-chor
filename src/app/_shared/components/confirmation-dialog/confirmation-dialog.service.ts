import { Injectable } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  constructor(readonly modalService: NgbModal) { }

  confirm(
    title: string,
    message: string,
    btnOkText: string = 'Oui',
    btnCancelText: string = 'Non',
    dialogSize: 'sm'|'lg' = 'sm',
    isCancelBtnVisible = true ): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { centered: true,windowClass: 'centerpopup ' });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.isCancelBtnVisible = isCancelBtnVisible;

    return modalRef.result;
  }

}
