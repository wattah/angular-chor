import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-peniche-is-down-popup',
  templateUrl: './peniche-is-down-popup.component.html',
  styleUrls: ['./peniche-is-down-popup.component.scss']
})
export class PenicheIsDownPopupComponent implements OnInit {

  constructor(private readonly activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  onClickOnOk(){
    this.activeModal.close(true);
  }

}
