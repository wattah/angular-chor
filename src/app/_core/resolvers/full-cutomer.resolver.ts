import { isNullOrUndefined } from '../utils/string-utils';
import { CustomerService } from './../services/customer.service';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CustomerProfileVO } from '../models/customer-profile-vo';
@Injectable({
  providedIn: 'root',
})
export class FullCustomerResilver
  implements Resolve<Observable<CustomerProfileVO>> {
  customerId: string;
  constructor(private readonly customerService: CustomerService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<CustomerProfileVO> {
    this.customerId = route.paramMap.get('customerId');
    if (isNullOrUndefined(this.customerId)) {
      this.customerId = route.parent.paramMap.get('customerId');
      if (isNullOrUndefined(this.customerId)) {
        this.customerId = route.parent.parent.parent.paramMap.get('customerId');
      }
    } 
    return this.customerService.getFullCustomer(this.customerId);
  }
}
