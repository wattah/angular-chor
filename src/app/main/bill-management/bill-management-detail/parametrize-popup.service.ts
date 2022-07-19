import { ParametrizePopupComponent } from './../parametrize-popup/parametrize-popup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametrizePopupService {

  constructor(private readonly modalService: NgbModal) { }
  /**
   * 
   * @param message
   * @param firstChoseMessage 
   * @param secondChoseMessage 
   * @param firstChose 
   * @param secondChose 
   * @param isCancelBtnVisible 
   */
  config(
    message: string,
    firstChoseMessage: string,
    secondChoseMessage: string,
    thirdChoseMessage: string = '',
    firstChose: {value: string , valide: boolean},
    secondChose: {value: string , valide: boolean},
    thirdChose: {value: string , valide: boolean},
    isCancelBtnVisible = true ): Promise<boolean> {
    const modalRef = this.modalService.open(ParametrizePopupComponent, { centered: true,windowClass: 'centerpopup ' });
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.firstChose = firstChose;
    modalRef.componentInstance.secondChose = secondChose;
    modalRef.componentInstance.thirdChose = thirdChose;
    modalRef.componentInstance.firstChoseMessage = firstChoseMessage;
    modalRef.componentInstance.secondChoseMessage = secondChoseMessage;
    modalRef.componentInstance.thirdChoseMessage = thirdChoseMessage;
    modalRef.componentInstance.isCancelBtnVisible = isCancelBtnVisible;

    return modalRef.result;
  }
}