
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ProcessDefinitionVO } from '../../models/ProcessDefinitionVO';
import { WorkflowService } from '../../services/workflow.service';
import { CmPostalAddressVO } from '../../models/cm-postaladdress-vo';
import { PostalAdressService } from '../../services/postal_adresse.service';
import { isNullOrUndefined } from '../../utils/string-utils'; 


@Injectable({
  providedIn: 'root'
})
  
  export class listAdressRdvRsRpPro implements Resolve<Observable<CmPostalAddressVO[]>> {

    customerId: string;
  constructor(private postalAdress: PostalAdressService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CmPostalAddressVO[]> {
    this.customerId = route.paramMap.get('customerId');

    if (isNullOrUndefined(this.customerId)) { 
      this.customerId = route.parent.paramMap.get('customerId');
    }

    return this.postalAdress.getListAdresseRdvByRpProRs(this.customerId)
        .pipe(catchError(() => of(null)));
  }

}
