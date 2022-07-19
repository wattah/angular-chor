
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CustomerService } from '../../services';
import { LiveEngageView } from '../../models/abc-view';

@Injectable({
  providedIn: 'root'
})
  
  export class LiveEngageResolver implements Resolve<Observable<LiveEngageView>> {
    opaqueId: string;
  constructor(private customerService: CustomerService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<LiveEngageView> {
    this.opaqueId = route.paramMap.get('opaqueId');
    return this.customerService.getLiveEngageData(this.opaqueId)
        .pipe(catchError(() => of(null)));
  }

}
