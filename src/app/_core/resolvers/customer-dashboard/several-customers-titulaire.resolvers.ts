import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CustomersLight } from '../../models/customers_light';
import { isNullOrUndefined } from '../../utils/string-utils';
import { PersonService } from '../../services';

@Injectable({
  providedIn: 'root'
})
export class SeveralCustomersTitulaireResolver implements Resolve<Observable<CustomersLight[]>> {
  customerId: string;
  constructor(private persoService: PersonService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<CustomersLight[]> {
    this.customerId = route.paramMap.get('customerId');

    if (isNullOrUndefined(this.customerId)) {
      this.customerId = route.parent.paramMap.get('customerId');
    }

    return this.persoService.getSeveralTitCustomersBy(this.customerId)
    .pipe(catchError(() => of([])));
  }
}
