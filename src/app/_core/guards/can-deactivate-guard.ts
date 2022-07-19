import { RedirectionService } from './../services/redirection.service';
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ComponentCanDeactivate } from './component-can-deactivate';
import { CancelConfirmationPopUpComponent } from '../../_shared/components/cancel-confirmation-pop-up/cancel-confirmation-pop-up.component';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {
 
  constructor(private readonly modalService: NgbModal ,
              private readonly redirectionService : RedirectionService
     ) {}

  canDeactivate(component: ComponentCanDeactivate): boolean | Promise<boolean> {
    if (component.canDeactivate()) {
      if(this.redirectionService.getSessionTimeout()){
       return true;
      }
      const confirmationModal = this.modalService.open(CancelConfirmationPopUpComponent, { centered: true });
      confirmationModal.componentInstance.message = component.message;
      confirmationModal.componentInstance.btnOkText = component.btnOkText;
      confirmationModal.componentInstance.btnCancelText = component.btnCancelText;
      
      return confirmationModal.result.then( value => {
        if (value) {
          component.doSomethingBeforeLeavePage();
        }
        return value;
      });
    } 
    return true;
  }
}
