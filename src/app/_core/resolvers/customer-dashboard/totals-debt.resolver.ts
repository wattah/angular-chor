import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { CustomerTotalsDebtService } from '../../services/customer-totals-debt.service';
import { CustomerTotalsDebt } from '../../models/customer-totals-debt';
import { isNullOrUndefined } from '../../utils/string-utils';
import { catchError } from 'rxjs/operators';
import { DebteService } from '../../services/debt.service';

@Injectable({
  providedIn: 'root'
})
export class TotalsDebtResolver implements Resolve<Observable<CustomerTotalsDebt>> {
  customerId: string;
  constructor(private readonly totalDebt: CustomerTotalsDebtService, private readonly debtService: DebteService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CustomerTotalsDebt> {
    this.customerId = route.paramMap.get('customerId');
    if (isNullOrUndefined(this.customerId)) {
      this.customerId = route.parent.paramMap.get('customerId');
    }
    return this.totalDebt.getTotalsDebt(this.customerId)
      .pipe(catchError(() => {
        this.debtService.errorInBill$.next(true);
        return of(null);
      }));
  }
}
