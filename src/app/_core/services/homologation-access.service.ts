import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { HomologationService } from './homologation.service';
import { HomologationAccessPopupComponent } from './../../main/_shared/homologation-access-popup/homologation-access-popup.component';

@Injectable({
  providedIn: 'root'
})
export class HomologationAccessService {

  constructor(readonly homologationService: HomologationService, readonly modalService: NgbModal) { }

  openHomologationPopup(homologationIds: number[], customerId: string, customerType: string, isProcedure: boolean, 
    taskId: number, isFromTaskMonitoring = false): void {
    const homologationModal = this.modalService.open(HomologationAccessPopupComponent, { centered: true,windowClass: 'centerpopup ' });
    homologationModal.componentInstance.homologationsIds = homologationIds;
    homologationModal.componentInstance.customerId = customerId;
    homologationModal.componentInstance.customerType = customerType;
    homologationModal.componentInstance.isProcedure = isProcedure;
    homologationModal.componentInstance.taskId = taskId;
    homologationModal.componentInstance.isFromTaskMonitoring = isFromTaskMonitoring;
  }
}
