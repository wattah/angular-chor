import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { PersonService } from '../../services';
import { Person } from './../../models/person';
import { isNullOrUndefined } from '../../utils/string-utils';
import { CartCreationService } from '../../../main/cart/cart/cart-creation.service';

@Injectable({
  providedIn: 'root'
})
export class InterlocutorsRequestResolver implements Resolve<Observable<Person[]>> {
  customerId: string;
  constructor(private readonly personService: PersonService,
    private readonly cartCreationService:CartCreationService
    ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Person[]> {
   
    if(!this.cartCreationService.isFromCancel){
      this.customerId = route.paramMap.get('customerId');
    if (isNullOrUndefined(this.customerId)) {
      this.customerId = route.parent.paramMap.get('customerId');
    }
    return this.personService.getInterlocutorsRequest(this.customerId)
    .pipe( catchError( () => of(null)));

      }
      else{
        return this.cartCreationService.getInterlocuterus();
      }
  }
}
