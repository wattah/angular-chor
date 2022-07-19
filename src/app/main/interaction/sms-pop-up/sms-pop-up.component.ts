import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sms-pop-up',
  templateUrl: './sms-pop-up.component.html',
  styleUrls: ['./sms-pop-up.component.scss']
})
export class SmsPopUpComponent implements OnInit {
  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit() {
    
  }

  destroy(){
    this.activeModal.close(true);
  }
}
