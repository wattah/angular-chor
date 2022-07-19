import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ParcLigneService } from '../../services';
import { CustomerParcServiceVO } from '../../models/customer-parc-service-vo';
import { isNullOrUndefined } from '../../utils/string-utils';
import { CONSTANTS } from '../../constants/constants';


@Injectable({
  providedIn: 'root'
})
export class ParcServicesHardwareFullResolver implements Resolve<Observable<CustomerParcServiceVO[]>> {
  customerId: string;
  constructor(private parcLigneService: ParcLigneService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<CustomerParcServiceVO[]> {
    this.customerId = route.paramMap.get('customerId');

    if (isNullOrUndefined(this.customerId)) {
      this.customerId = route.parent.paramMap.get('customerId');
    }
    const typeCustomer = route.queryParamMap.get('typeCustomer');

    if (typeCustomer === CONSTANTS.TYPE_COMPANY) {
      return this.parcLigneService.getParcServicesDetailsByCustomerEntreprise(this.customerId);
    }
    
    return this.parcLigneService.getParcServicesHardwareFullByCustomer(this.customerId)
    .pipe(catchError(() => of([])));
    
  }
}
