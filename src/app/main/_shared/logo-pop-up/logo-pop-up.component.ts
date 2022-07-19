import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { NotificationService } from '../../../_core/services/notification.service';

@Component({
  selector: 'app-logo-pop-up',
  templateUrl: './logo-pop-up.component.html',
  styleUrls: ['./logo-pop-up.component.scss']
})
export class LogoPopUpComponent implements OnInit {

  constructor(readonly activeModal: NgbActiveModal, readonly notificationService: NotificationService) { }

  ngOnInit() {
  }

  decline(): void {
    this.notificationService.setWithLogo(false);
    this.activeModal.close(false);
  }

  accept(): void {
    this.notificationService.setWithLogo(true);
    this.activeModal.close(true);
  }

}
