import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../../_core/services/notification.service';

@Component({
  selector: 'app-popup-delete-article',
  templateUrl: './popup-delete-article.component.html',
  styleUrls: ['./popup-delete-article.component.scss']
})
export class PopupDeleteArticleComponent implements OnInit {

  constructor(readonly activeModal: NgbActiveModal,
    private readonly notificationService: NotificationService) { }

  ngOnInit() {
  }

  onDeleteCartItem(){
    this.notificationService.onDeletCartItem(true);
    this.activeModal.close(true);
  }
  destroy() {
    this.notificationService.onDeletCartItem(false);
    this.activeModal.close(true);
  }
}
