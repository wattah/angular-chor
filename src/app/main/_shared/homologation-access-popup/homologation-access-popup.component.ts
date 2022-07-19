import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ProcedureService } from './../../../_core/services/procedure.service';

@Component({
  selector: 'app-homologation-access-popup',
  templateUrl: './homologation-access-popup.component.html',
  styleUrls: ['./homologation-access-popup.component.scss']
})
export class HomologationAccessPopupComponent {

  homologationsIds: number[];
  selectedHomologationId: number;
  customerType: string;
  customerId: string;
  isProcedure: boolean;
  taskId: number;
  isAmendment = false;
  isFromTaskMonitoring: boolean;

  constructor(readonly router: Router, readonly activeModal: NgbActiveModal,
              readonly procedureService: ProcedureService) { }

  selectHomologation(homologationId: number, order: number): void {
    this.selectedHomologationId = homologationId;
    this.isAmendment = order >= 1;
  }

  decline(): void {
    this.activeModal.close(false);
  }

  accept(): void {
    this.activeModal.close(true);
    if (this.isProcedure) {
      this.procedureService.runTaskHomologationProcedure(this.taskId, this.selectedHomologationId).subscribe(
        (resp) => this.goToHomologationPage(),
        (error) => console.log(error)
      );

    } else {
      this.goToHomologationPage();
    }
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }

  goToHomologationPage(): void {
    const contractQueryParams = { typeCustomer: this.customerType, isAmendment: this.isAmendment };
    const amendmentQueryParams = { typeCustomer: this.customerType, isAmendment: this.isAmendment, holderHomoId: this.homologationsIds[0] };
    const URL_PATTERN = ['/customer-dashboard', this.customerId, 'detail', 'homologation', this.selectedHomologationId];
    if (this.isFromTaskMonitoring) {
      const url = this.router.serializeUrl(this.router.createUrlTree(
        URL_PATTERN,
      { queryParams: this.isAmendment ? amendmentQueryParams: contractQueryParams, queryParamsHandling: 'merge' }
      ));
      window.open(`#${url}`, '_blank');
    } else {
      this.router.navigate(
        URL_PATTERN,
      { queryParams: this.isAmendment ? amendmentQueryParams: contractQueryParams, queryParamsHandling: 'merge' }
      );
    }
  }

}
