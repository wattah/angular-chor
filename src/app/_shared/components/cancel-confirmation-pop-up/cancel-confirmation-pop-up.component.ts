import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cancel-confirmation-pop-up',
  templateUrl: './cancel-confirmation-pop-up.component.html',
  styleUrls: ['./cancel-confirmation-pop-up.component.scss']
})
export class CancelConfirmationPopUpComponent {

  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  
  constructor(private readonly activeModal: NgbActiveModal) { }

  closeConfirmationPopUp(): void {
    this.activeModal.close(false);
  }

  cancelCreationTask(): void {
    this.activeModal.close(true);
  }
}
