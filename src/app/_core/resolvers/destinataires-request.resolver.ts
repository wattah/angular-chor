import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { Observable, of} from 'rxjs';

import { BeneficiaryVO } from '../models/beneficiaryVO';
import { PersonService } from '../services';
import { catchError } from 'rxjs/operators';
import { isNullOrUndefined } from '../utils/string-utils';
import { CONSTANTS } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
  
  export class DestinatairesRequestResolver implements Resolve<Observable<BeneficiaryVO[]>> {
  
 customerId: string;
 isTitular: boolean;

  constructor(private personService: PersonService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<BeneficiaryVO[]> {
    this.customerId = route.paramMap.get('customerId');
    if (isNullOrUndefined(this .customerId)) {
      this.customerId = route.parent.paramMap.get('customerId');
      this.isTitular = ( route.queryParamMap.get('typeCustomer') === CONSTANTS.TYPE_COMPANY );
    }
    return this.personService.getDestinataires(this.customerId, this.isTitular)
    .pipe(catchError(() => of([])));

  }
}
