
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ContractsOffersVO } from '../../models/contracts-offers-vo';
import { CustomerTotalsDebtService } from '../../services/customer-totals-debt.service';
import { isNullOrUndefined } from '../../utils/string-utils';

@Injectable({
  providedIn: 'root'
})
  
  export class ContractOffersResolver implements Resolve<Observable<ContractsOffersVO>> {
  customerId: string;
  constructor(private contractOffers: CustomerTotalsDebtService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<ContractsOffersVO> {
    this.customerId = route.paramMap.get('customerId');
    if (isNullOrUndefined(this .customerId)) {
      this.customerId = route.parent.paramMap.get('customerId');
    }
    return this.contractOffers.getContractsOffers(this.customerId)
        .pipe(catchError(() => of(null)));
  }

}
