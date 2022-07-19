import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CustomerDebtService } from '../../services/customer-debt.service';

@Injectable({
  providedIn: 'root'
})
export class DateRecouvrementResolver implements Resolve<Observable<Date>> {
  customerId: string;
  constructor(private customerDebt: CustomerDebtService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Date> {
    this.customerId = route.paramMap.get('customerId');
   return this.customerDebt.getRecoveryDate(this.customerId)
    .pipe(catchError(() => of(null)));
  }
}
