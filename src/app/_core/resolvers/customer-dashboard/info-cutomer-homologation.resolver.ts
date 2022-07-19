import { isNullOrUndefined } from '../../utils/string-utils';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { PersonService } from '../../services';
import { InfoCustomerHomologation } from '../../models/info-customer-homologation-vo';
@Injectable({
  providedIn: 'root',
})
export class InfoCustomerHomologationResolver
  implements Resolve<Observable<InfoCustomerHomologation>> {
  
  constructor(private readonly personService: PersonService) {}
  
  resolve(route: ActivatedRouteSnapshot): Observable<InfoCustomerHomologation> {
    let customerId = route.paramMap.get('customerId');
    if (isNullOrUndefined(customerId)) {
      customerId = route.parent.paramMap.get('customerId');
    }
    return this.personService.getInfoCustomerForHomologation(customerId);
  }
}
