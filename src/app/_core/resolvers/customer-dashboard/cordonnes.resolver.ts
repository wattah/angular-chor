import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { InterlocutorVO } from '../../../_core/models/interlocutor-vo';
import { PersonService } from '../../services';
import { isNullOrUndefined } from '../../utils/string-utils'; 

@Injectable({
  providedIn: 'root'
})
export class CordonnesResolver implements Resolve<Observable<InterlocutorVO>> {
  customerId: string;
  constructor(private cordonnesService: PersonService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<InterlocutorVO> {
    this.customerId = route.paramMap.get('customerId');

    if (isNullOrUndefined(this.customerId)) { 
      this.customerId = route.parent.paramMap.get('customerId');
    }

    return this.cordonnesService.getContactsIntrelocutors(this.customerId)
    .pipe(catchError(() => of(null)));
  }
}
