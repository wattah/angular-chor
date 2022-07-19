import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { PersonService } from '../../services';
import { InfoClientDashboardsLight } from '../../models/info-client-dashboards-light';

@Injectable({
  providedIn: 'root'
})
export class InfoClientResolver implements Resolve<Observable<InfoClientDashboardsLight>> {
  customerId: string;
  constructor(private personService: PersonService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<InfoClientDashboardsLight> {
    this.customerId = route.paramMap.get('customerId');
    return this.personService.getInfoClient(this.customerId)
    .pipe( catchError( () => of(null)));
  }
}
