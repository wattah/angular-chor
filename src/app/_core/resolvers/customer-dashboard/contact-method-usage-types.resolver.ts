
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {ContactMethodService } from '../../services';
import { isNullOrUndefined } from '../../utils/string-utils';

@Injectable({
  providedIn: 'root'
})
  
  export class ContactMethodUsageTypesResolver implements Resolve<Observable<string>> {
  customerId: string; 
  constructor(private readonly contactMethodService: ContactMethodService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<string> {
    this.customerId = route.paramMap.get('customerId');
    if (isNullOrUndefined(this .customerId)) {
      this.customerId = route.parent.paramMap.get('customerId');
    }
    return this.contactMethodService.getUsagesTypesCreatedForCustomerId(this.customerId)
        .pipe(catchError(() => of(null)));
  }

}
