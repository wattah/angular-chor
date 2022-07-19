import { DestinataireVO } from './../models/destinataireVO';
import { isNullOrUndefined } from 'src/app/_core/utils/string-utils';
import { ContactMethodService } from './../services/contact-method.service';
import { InterlocutorVO } from 'src/app/_core/models/interlocutor-vo';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
  
  export class DestinatairesSMSResolver implements Resolve<Observable<DestinataireVO[]>> {
  
  customerId: string;
  isEntreprise: boolean;

  constructor(private contactMethodService: ContactMethodService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DestinataireVO[]> {
    this.customerId = route.paramMap.get('customerId');
    if ( route.paramMap.get('typeCustomer') === 'company') {
      this.isEntreprise = true;
    } else {
      this.isEntreprise = false;
    }
    if (isNullOrUndefined(this .customerId)) {
      this.customerId = route.parent.paramMap.get('customerId');
    }
    return this.contactMethodService.getListDestinataireForSMS(this.customerId, this.isEntreprise)
    .pipe(
      map( data =>  {
        if (!isNullOrUndefined(data)) {
          data.sort( (first, second) => {
            first.firstName ??= '';
            first.lastName ??= '';
            second.firstName ??= '';
            second.lastName ??= '';
            return  first.lastName.localeCompare( second.lastName ) || first.firstName.localeCompare( second.firstName );
          });
        }
        return data;
      }),
      catchError(() => of([])));

  }
}
