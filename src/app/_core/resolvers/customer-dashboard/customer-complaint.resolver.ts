import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CustomerService } from '../../services';


import { isNullOrUndefined } from '../../utils/string-utils';
import { CustomerComplaint } from '../../models/customer-complaint';

@Injectable({
  providedIn: 'root'
})
export class CustomerComplaintResolver implements Resolve<Observable<CustomerComplaint>> {
  customerId: string;
  constructor(private customerService: CustomerService) {
  }
  resolve(route: ActivatedRouteSnapshot): Observable<CustomerComplaint> {
    this.customerId = route.paramMap.get('customerId');
    if (isNullOrUndefined(this .customerId)) {
      this.customerId = route.parent.paramMap.get('customerId');
    }
    return this.customerService.getComplaintMessageForCustomer(this.customerId)
    .pipe(catchError(() => of(null)));
  }
}
