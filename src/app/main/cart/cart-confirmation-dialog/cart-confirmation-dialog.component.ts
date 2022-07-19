import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cart-confirmation-dialog',
  templateUrl: './cart-confirmation-dialog.component.html',
  styleUrls: ['./cart-confirmation-dialog.component.scss']
})
export class CartConfirmationDialogComponent implements OnInit {

 
  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  @Input() isCancelBtnVisible = true;

  constructor(private readonly activeModal: NgbActiveModal) { }

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
