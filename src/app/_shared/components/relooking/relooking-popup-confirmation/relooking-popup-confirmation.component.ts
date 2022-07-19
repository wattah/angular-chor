import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-relooking-popup-confirmation',
  templateUrl: './relooking-popup-confirmation.component.html',
  styleUrls: ['./relooking-popup-confirmation.component.scss']
})
export class RelookingPopupConfirmationComponent implements OnInit {
  message = '';

  constructor(readonly activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  onClickOnOk(){
    this.activeModal.close(true);
  }

  onClickOnNo(){
    this.activeModal.close(false);
  }

}
