import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ParcLigneService } from '../../services';
import { CustomerParcLigneDetailVO } from '../../models/customer-parc-ligne-detail-vo';


@Injectable({
  providedIn: 'root'
})
export class ParcLignesDetailResolver implements Resolve<Observable<CustomerParcLigneDetailVO>> {
  id: string;
  constructor(readonly parcLigneService: ParcLigneService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CustomerParcLigneDetailVO> {
    this.id = route.paramMap.get('id');
    return this.parcLigneService.getDetailLigneParkItem(Number(this.id))
      .pipe(catchError(() => of(null)));
  }
  
}
