import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RequestCustomerVO } from '../../models/request-customer-vo';
import { RequestService } from '../../services/request.service';
import { isNullOrUndefined } from '../../utils/string-utils';
import { CONSTANTS } from '../../constants/constants';

@ Injectable({
  providedIn: 'root'
})
export class RequestCustomerResolver implements Resolve< Observable< RequestCustomerVO[]>> {
  customerId: string;
  constructor(private requestService: RequestService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable< RequestCustomerVO[]> {
    this .customerId = route.paramMap.get('customerId');
    if (isNullOrUndefined(this .customerId)) {
      this .customerId = route.parent.paramMap.get('customerId');
    }
    const isEntreprise = ( route.queryParamMap.get('typeCustomer') === CONSTANTS.TYPE_COMPANY );
    return this .requestService.getRequestCustomer(this .customerId, Boolean(isEntreprise))
    .pipe(catchError(() => of([])));
  }
}
