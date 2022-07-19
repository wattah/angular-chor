import { ParcLigneService } from '../../_core/services';
import { isNullOrUndefined } from '../../_core/utils/string-utils';
import { CustomerParkItemVO } from './../models/customer-park-item-vo';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn:'root'
})
export class ImpactParkItemLinesResolver implements Resolve<Observable<CustomerParkItemVO[]>>{
    constructor(private readonly parcLigneService: ParcLigneService){}
    resolve(route: ActivatedRouteSnapshot): Observable<CustomerParkItemVO[]> {
        let customerId = route.paramMap.get('customerId');
        if (isNullOrUndefined(customerId)) {
          customerId = route.parent.paramMap.get('customerId');
          if (isNullOrUndefined(customerId)) {
            customerId = route.parent.parent.parent.paramMap.get('customerId');
          }
        } 
        return this.parcLigneService.getImpactLine(customerId);
      }
}
