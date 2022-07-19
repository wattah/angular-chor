import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RequestCustomerVO } from '../../models/request-customer-vo';
import { isNullOrUndefined } from '../../utils/string-utils';
import { RequestVO } from '../../models/request/crud/request';
import { RequestService } from '../../services/request.service';

@ Injectable({
  providedIn: 'root'
})
export class RequestDetailForUpdateResolver implements Resolve<Observable<RequestVO>> {
  requestId: string;
  constructor(private requestService: RequestService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<RequestVO> {
    this.requestId = route.paramMap.get('idRequest');
    if (isNullOrUndefined(this.requestId)) {
      this.requestId = route.parent.paramMap.get('idRequest');
    }
    return this .requestService.getRequestForUpdate(Number(this.requestId))
    .pipe(catchError(() => of(null)));
  }
}
