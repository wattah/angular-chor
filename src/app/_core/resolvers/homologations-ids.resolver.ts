import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HomologationService } from './../services/homologation.service';

@Injectable({
  providedIn: 'root'
})
export class HomologationsIdsResolver implements Resolve<Observable<number[]>> {

  constructor(readonly homologationService: HomologationService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<number[]> {
    let customerId = route.paramMap.get('customerId');
    if (!customerId) {
      customerId = route.parent.paramMap.get('customerId');
    }
    return this.homologationService.getHomologationListByCustomerId(customerId)
    .pipe(catchError(() => of([])));
  }
}
