import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RequestService } from '../services/request.service';
import { RequestCustomerVO } from '../models/request-customer-vo';
import { isNullOrUndefined } from '../utils/string-utils';
import { CONSTANTS } from '../constants/constants';

@ Injectable({
  providedIn: 'root'
})
export class CustomerMonitoringResolver implements Resolve< Observable< RequestCustomerVO[]>> {
  customerId: string;
  isEntreprise: boolean
  constructor(private requestService: RequestService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable< RequestCustomerVO[]> {
    this .customerId = route.paramMap.get('customerId');
     this.isEntreprise = ( route.queryParamMap.get('typeCustomer') === CONSTANTS.TYPE_COMPANY );
    if (isNullOrUndefined(this .customerId)) {
      this .customerId = route.parent.paramMap.get('customerId');
    }
    
    return this .requestService.getRequestsByFilters(this .customerId, null, null, this.isEntreprise)
    .pipe(catchError(() => of([])));
  }

}
