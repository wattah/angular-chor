import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-creation-confirmation-pop-up',
  templateUrl: './task-creation-confirmation-pop-up.component.html',
  styleUrls: ['./task-creation-confirmation-pop-up.component.scss']
})
export class TaskCreationConfirmationPopUpComponent {

  @Input() customerId: number;

  @Input() idRequest: number;

  constructor(private activeModal: NgbActiveModal, private router: Router) { 
  }

  closeConfirmationPopUp(): void {
    this.activeModal.close();
  }

  cancelCreationTask(): void {
    this.activeModal.dismiss('');
    this.goToTaskList();
  }

  goToTaskList(): void {
    this.router.navigate(
      ['/customer-dashboard', this.customerId , 'detail', 'request', this.idRequest],
      { queryParamsHandling: 'merge' }
    );
  }

}
