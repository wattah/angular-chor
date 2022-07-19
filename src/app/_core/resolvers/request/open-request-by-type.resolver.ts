import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CONSTANTS } from '../../constants/constants';
import { RequestCustomerVO } from '../../models/request-customer-vo';
import { RequestService } from '../../services/request.service';

@ Injectable({
  providedIn: 'root'
})
export class OpenRequestByTypeResolver implements Resolve< Observable< RequestCustomerVO[]>> {
  customerId: string;
  isEntreprise: boolean;
  typeRequest: string;
  constructor(private readonly requestService: RequestService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable< RequestCustomerVO[]> {
    this.customerId = route.parent.paramMap.get('customerId');
    this.isEntreprise = ( route.queryParamMap.get('typeCustomer') === CONSTANTS.TYPE_COMPANY );
    this.typeRequest = route.queryParamMap.get('technicalKey');
   
    return this.requestService.getOpenRequestsByTypeRequestAndCustomeId(this .customerId, this.typeRequest , this.isEntreprise)
    .pipe(catchError(() => of([])));
  }

}
