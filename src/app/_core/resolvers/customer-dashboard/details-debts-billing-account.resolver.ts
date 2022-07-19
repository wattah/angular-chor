import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DetailsDebtsBillingAccountService } from '../../services/details-debts-billing-account.service';
import { DetailsBillingAccounts } from '../../models/details-billing-accounts';

@Injectable({
  providedIn: 'root'
})
export class DetailsDebtsBillingAccountResolver implements Resolve<Observable<DetailsBillingAccounts>> { 
  nicheIdentifier: string;
  univers: string;
  constructor(private detailsDebtsBillingAccountService: DetailsDebtsBillingAccountService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DetailsBillingAccounts> {
    this.nicheIdentifier = route.queryParamMap.get('nicheIdentifier');
    this.univers = route.queryParamMap.get('univers');
    return this.detailsDebtsBillingAccountService.getDetailsDebts(this.nicheIdentifier, this.univers, 'Actif' )
    .pipe(catchError(() => of({} as DetailsBillingAccounts)));
  }
}
