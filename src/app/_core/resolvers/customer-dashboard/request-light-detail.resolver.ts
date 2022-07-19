import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RequestDetailsService } from '../../services/request-details.service';
import { RequestCustomerVO } from '../../models/request-customer-vo';

@ Injectable({
  providedIn: 'root'
})
export class RequestLightDetailResolver implements Resolve<Observable<RequestCustomerVO>> {
  requestId: string;
  constructor(private requestDetailService: RequestDetailsService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<RequestCustomerVO> {
    this.requestId = route.paramMap.get('idRequest');
    return this .requestDetailService.getLightDetailByIdRequest(Number(this.requestId))
    .pipe(catchError(() => of(null)));
  }
}
