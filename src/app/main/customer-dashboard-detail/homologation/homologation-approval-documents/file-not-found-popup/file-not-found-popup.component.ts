import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-not-found-popup',
  templateUrl: './file-not-found-popup.component.html',
  styleUrls: ['./file-not-found-popup.component.scss']
})
export class FileNotFoundPopupComponent implements OnInit {

  constructor(readonly activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  onClickOnOk(){
    this.activeModal.close(true);
  }

}
