import { ParcLigneService } from './../services/parc-ligne.service';
import { CustomerHardwareParkItemVO } from './../models/models';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
@Injectable({
    'providedIn':'root'
})
export class CustomerHardwardResolver implements Resolve<Observable<CustomerHardwareParkItemVO>>{

    constructor(private readonly parcLigneService:ParcLigneService){}

    resolve(route: ActivatedRouteSnapshot): Observable<CustomerHardwareParkItemVO> {
         const hardwareId =  route.queryParamMap.get('hardwardId')
         return this.parcLigneService.getCustomerHardware(Number(hardwareId));
      }
}
