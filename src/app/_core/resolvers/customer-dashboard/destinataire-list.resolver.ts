import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { InterlocutorVO } from '../../models/interlocutor-vo';
import { isNullOrUndefined } from '../../utils/string-utils';
import { ContactMethodService } from '../../services/contact-method.service';

@Injectable({
  providedIn: 'root'
})
  
  export class DestinataireListResolver implements Resolve<Observable<InterlocutorVO[]>> {
  
  customerId: string;
  isEntreprise: boolean;

  constructor(private contactMethodService: ContactMethodService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<InterlocutorVO[]> {
    this.customerId = route.paramMap.get('customerId');
    if ( route.paramMap.get('typeCustomer') === 'company') {
      this.isEntreprise = true;
    } else {
      this.isEntreprise = false;
    }
    if (isNullOrUndefined(this .customerId)) {
      this.customerId = route.parent.paramMap.get('customerId');
    }
    return this.contactMethodService.getListDestinataireForMail(this.customerId, this.isEntreprise)
    .pipe(catchError(() => of([])));

  }
}
