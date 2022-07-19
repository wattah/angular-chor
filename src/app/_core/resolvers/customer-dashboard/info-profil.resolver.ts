import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CustomerService } from '../../services';
import { BeneficiaireView } from '../../../_core/models/profil-infos-dashboard';
import { CONSTANTS } from '../../constants/constants';
import { CustomerDashboardService } from '../../../main/customer-dashboard/customer-dashboard.service';
import { isNullOrUndefined } from '../../utils/string-utils';

@Injectable({
  providedIn: 'root'
})
export class InfoProfilResolver implements Resolve<Observable<BeneficiaireView>> {
  customerId: string;
  constructor(private customerService: CustomerService, private customerDashboardService: CustomerDashboardService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<BeneficiaireView> {
    this.customerId = route.paramMap.get('customerId');
    if (isNullOrUndefined(this .customerId)) {
      this.customerId = route.parent.paramMap.get('customerId');
    }
    
    const isParticular = ( route.queryParamMap.get('typeCustomer') === CONSTANTS.TYPE_PARTICULAR );
    const isTitular = ( route.queryParamMap.get('typeCustomer') === CONSTANTS.TYPE_COMPANY );
    return this.customerService.getProfilView(this.customerId, Boolean(isParticular), Boolean(isTitular))
    .pipe(catchError(() => of(null)));
  }
}
