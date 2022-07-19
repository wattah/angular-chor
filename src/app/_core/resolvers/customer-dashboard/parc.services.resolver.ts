import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ParcLigneService } from '../../../_core/services';
import { CustomerParcServiceVO } from '../../../_core/models/customer-parc-service-vo';

@Injectable({
  providedIn: 'root'
})
export class ParcServicesResolver implements Resolve<Observable<CustomerParcServiceVO[]>> {
  customerId: string;
  constructor(private parcLigneService: ParcLigneService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CustomerParcServiceVO[]> {
    this.customerId = route.paramMap.get('customerId');
    return this.parcLigneService.getParcServicesByCustomer(this.customerId)
    .pipe(catchError(() => of([])));
  }
}
