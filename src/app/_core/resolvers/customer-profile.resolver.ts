import { isNullOrUndefined } from '../utils/string-utils';
import { CustomerService } from './../services/customer.service';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CustomerProfileVO } from '../models/customer-profile-vo';

@Injectable({
    providedIn: 'root',
  })
export class CustomerProfileResolver implements Resolve<Observable<CustomerProfileVO>> {
    id: string;
    constructor(private readonly custSevice: CustomerService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<CustomerProfileVO> {
      this.id = route.paramMap.get('customerId');
      if (isNullOrUndefined(this.id)) {
        this.id = route.parent.paramMap.get('customerId');
        if (isNullOrUndefined(this.id)) {
          this.id = route.parent.parent.parent.paramMap.get('customerId');
        }
      }
      return this.custSevice.getCustomerProfile(this.id);
    }
}
