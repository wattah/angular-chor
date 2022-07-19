import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ParcLigneService } from '../../../_core/services';

import { isNullOrUndefined } from '../../utils/string-utils';
import { CustomerParkItemServicesOptionsVO } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
 export class CustomerParkItemCurrentResolver implements Resolve<CustomerParkItemServicesOptionsVO> {
  cpiId: string;
  constructor(private readonly parcLigneService: ParcLigneService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<CustomerParkItemServicesOptionsVO> {
    this.cpiId = route.paramMap.get('id');
    if (isNullOrUndefined(this.cpiId)) {
      this.cpiId = route.parent.paramMap.get('id');
    }
    
    return this.parcLigneService.getCustomerParkItemById(Number(this.cpiId))
          .pipe(catchError ( () => of(null)));
  }
}
