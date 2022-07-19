import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mail-sending-pop-up',
  templateUrl: './mail-sending-pop-up.component.html',
  styleUrls: ['./mail-sending-pop-up.component.scss']
})
export class MailSendingPopUpComponent {

  constructor(private activeModal: NgbActiveModal) { }

}
