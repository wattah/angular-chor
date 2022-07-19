import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { ParcLigneService } from '../../../_core/services';
import { CustomerParkLigne } from '../../../_core/models/customer-parc-item-vo';
import { catchError } from 'rxjs/operators';
import { isNullOrUndefined } from '../../utils/string-utils';

@Injectable({
  providedIn: 'root'
})
export class BeneficiairesResolver implements Resolve<Observable<CustomerParkLigne[]>> {
  customerId: string;
  constructor(private parcLigneService: ParcLigneService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CustomerParkLigne[]> {
    this.customerId = route.paramMap.get('customerId');
    if (isNullOrUndefined(this.customerId)) {
      this.customerId = route.parent.paramMap.get('customerId');
    }
    return this.parcLigneService.getParcLignesBeneficiaireByCustomer(this.customerId)
      .pipe(catchError(() => of([])));
  }
}