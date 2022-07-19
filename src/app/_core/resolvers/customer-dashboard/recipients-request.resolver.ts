import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { PersonService } from '../../services';
import { BeneficiaryVO } from '../../models/beneficiaryVO';
import { isNullOrUndefined } from '../../utils/string-utils';

@Injectable({
  providedIn: 'root'
})
export class RecipientsRequestResolver implements Resolve<Observable<BeneficiaryVO[]>> {
  customerId: string;
  constructor(private readonly personService: PersonService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<BeneficiaryVO[]> {
   
    this.customerId = route.parent.paramMap.get('customerId');

    return this.personService.getRecipientsRequest(this.customerId)
    .pipe(
      map( recipients => (recipients && recipients.length>0) ? recipients.sort( (a, b ) => a.status.localeCompare( b.status )) : []), 
      catchError( () => of([]))
    );

    
  }
}
