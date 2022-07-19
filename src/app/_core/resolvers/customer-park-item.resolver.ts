import { isNullOrUndefined } from '../../_core/utils/string-utils';
import { ParcLigneService } from './../services/parc-ligne.service';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CustomerParkItemVO } from '../models/customer-park-item-vo';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class CustomerParkItemResolver implements Resolve<Observable<CustomerParkItemVO[]>> {
    customerId;
    constructor(private readonly parcLigneService: ParcLigneService){

    }
    resolve(route: ActivatedRouteSnapshot): Observable<CustomerParkItemVO[]> {
        this.customerId = route.paramMap.get('customerId');
        if (isNullOrUndefined(this .customerId)) {
          this .customerId = route.parent.paramMap.get('customerId');
        }
        return this.parcLigneService.getParkItemsFull(this.customerId);
      }
}
