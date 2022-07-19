import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ParcLigneService } from '../../services';
import { CustomerParcServiceVO } from '../../models/customer-parc-service-vo';


@Injectable({
  providedIn: 'root'
})
export class ParcServicesDetailResolver implements Resolve<Observable<CustomerParcServiceVO>> {
  id: string;
  constructor(private parcLigneService: ParcLigneService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CustomerParcServiceVO> {
    this.id = route.paramMap.get('id');
    return this.parcLigneService.getDetailHardwareParkItem(Number(this.id))
      .pipe(catchError(() => of(null)));
  }
  
}
