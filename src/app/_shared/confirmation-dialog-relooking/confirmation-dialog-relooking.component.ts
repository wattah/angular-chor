import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog-relooking',
  templateUrl: './confirmation-dialog-relooking.component.html',
  styleUrls: ['./confirmation-dialog-relooking.component.scss']
})
export class ConfirmationDialogRelookingComponent {

  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  @Input() isCancelBtnVisible = true;

  files: File[] = [];

  constructor(private readonly activeModal: NgbActiveModal) { }



  decline(): void {
    this.activeModal.close(false);
  }

  accept(event: any): void {
  
    this.activeModal.close(true);
  }

  onSelectFile(event: any): void {
    this.files = [];
    this.files.push(event.addedFiles);
    this.activeModal.close(this.files);
  }
  dismiss(): void {
    this.activeModal.dismiss();
  }

}
