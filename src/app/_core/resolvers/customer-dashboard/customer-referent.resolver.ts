
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CustomerService } from '../../services';
import { CustomerReferentLight } from '../../models/customer-referent-light';
import { isNullOrUndefined } from '../../utils/string-utils';

@Injectable({
  providedIn: 'root'
})
  
  export class CustomerReferentResolver implements Resolve<Observable<CustomerReferentLight>> {
  customerId: string;
  constructor(private customerService: CustomerService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CustomerReferentLight> {
    this.customerId = route.paramMap.get('customerId');
    if (isNullOrUndefined(this.customerId)) {
      this.customerId = route.parent.paramMap.get('customerId');
    }
    return this.customerService.getListReferents(this.customerId)
        .pipe(catchError(() => of(null)));
  }

}
