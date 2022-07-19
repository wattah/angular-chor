import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ParcLigneService } from '../../../_core/services';
import { CustomerParcItemVO } from '../../../_core/models/customer-parc-item-vo';
import { isNullOrUndefined } from '../../utils/string-utils';

@Injectable({
  providedIn: 'root'
})
 export class ParcLigneResolver implements Resolve<CustomerParcItemVO> {
  customerId: string;
  constructor(private parcLigneService: ParcLigneService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<CustomerParcItemVO> {
    this.customerId = route.paramMap.get('customerId');
    if (isNullOrUndefined(this.customerId)) {
      this.customerId = route.parent.paramMap.get('customerId');
    }
    const showDetail = Boolean(route.data['showDetail']);
    return this.parcLigneService.getParcLigneEnCoursByCustomer(this.customerId, showDetail)
          .pipe(catchError ( () => of(null)));
  }
}
