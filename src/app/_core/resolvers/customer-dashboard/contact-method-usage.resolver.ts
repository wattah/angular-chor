
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {ContactMethodService } from '../../services';
import { isNullOrUndefined } from '../../utils/string-utils';
import { CmUsageVO } from '../../models/cm-usage-vo';

@Injectable({
  providedIn: 'root'
})
  
  export class ContactMethodUsageResolver implements Resolve<Observable<CmUsageVO[]>> {
  customerId: string; 
  usageRefKey: string;
  constructor(private readonly contactMethodService: ContactMethodService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CmUsageVO[]> {
    this.customerId = route.paramMap.get('customerId');
    this.usageRefKey = route.paramMap.get('usageRefKey');
    if (isNullOrUndefined(this .customerId)) {
      this.customerId = route.parent.paramMap.get('customerId');
    }
    return this.contactMethodService.getUsageByCustomerIdAndRefKey(this.customerId, this.usageRefKey)
        .pipe(catchError(() => of(null)));
  }

}
