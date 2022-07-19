import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ParcLigneService } from '../../services';
import { CustomerParcServiceVO } from '../../../_core/models/customer-parc-service-vo';

@Injectable({
  providedIn: 'root'
})
export class ParcServicesEntrepriseResolver implements Resolve<Observable<CustomerParcServiceVO[]>> {
  customerId: string;
  constructor(private parcLigneService: ParcLigneService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CustomerParcServiceVO[]> {
    this.customerId = route.paramMap.get('customerId');
    return this.parcLigneService.getParcServicesByCustomerEntreprise(this.customerId)
      .pipe(catchError(() => of([])));
  }
}
