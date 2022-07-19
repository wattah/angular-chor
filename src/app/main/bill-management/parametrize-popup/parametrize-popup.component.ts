import { BILL_RELOOKED_MANUALLY, CANCEL } from '../../../_core/constants/bill-constant';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parametrize-popup',
  templateUrl: './parametrize-popup.component.html',
  styleUrls: ['./parametrize-popup.component.scss']
})
export class ParametrizePopupComponent implements OnInit {
  firstChose: {value:string , valide: boolean};
  secondChose: {value:string , valide: boolean};
  thirdChose: {value:string , valide: boolean};
  firstChoseMessage:string = '';
  secondChoseMessage: string = '';
  thirdChoseMessage: string = '';
  isCancelBtnVisible: boolean;
  message = '';
  langueMessage: boolean;
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.langueMessage = this.firstChoseMessage === BILL_RELOOKED_MANUALLY;
  }
  
  decline(): void {
    this.activeModal.close(CANCEL);
  }

  onFirstChose(): void {
    this.activeModal.close(this.firstChose);
  }

  onSecondChose(): void {
    this.activeModal.close(this.secondChose);
  }

  onThirdChose(): void{
    this.activeModal.close(this.thirdChose);
  }
}
