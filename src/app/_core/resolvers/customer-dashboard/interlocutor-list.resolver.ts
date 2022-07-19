import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { PersonService } from '../../services';
import { isNullOrUndefined } from '../../utils/string-utils';
import { InterlocutorVO } from '../../models/interlocutor-vo';

@Injectable({
  providedIn: 'root'
})
export class InterlocutorListResolver implements Resolve<Observable<InterlocutorVO[]>> {
  customerId: string;
  constructor(private personService: PersonService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<InterlocutorVO[]> {
    this.customerId = route.paramMap.get('customerId');
    if (isNullOrUndefined(this.customerId)) {
      this.customerId = route.parent.paramMap.get('customerId');
    }
    return this.personService.getPersonAndInterlocutorsByCustomerId(this.customerId)
    .pipe( catchError( () => of(null)));
  }
}
