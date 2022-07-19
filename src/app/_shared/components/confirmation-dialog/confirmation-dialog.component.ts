import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  @Input() isCancelBtnVisible = true;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  decline(): void {
    this.activeModal.close(false);
  }

  accept(): void {
    this.activeModal.close(true);
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }

}
