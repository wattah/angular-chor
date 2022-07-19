import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RequestService } from '../services/request.service';
import { CartSavVO } from '../../_core/models/models';
import { CartCreationService } from '../../main/cart/cart/cart-creation.service';

@Injectable({
  providedIn: 'root'
})
export class CartSavResolver implements Resolve<Observable<CartSavVO>> {

  requestId: string;
   
  constructor(readonly requestService: RequestService ,
    private readonly cartCreationService:CartCreationService 
    ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CartSavVO> {
    this.requestId = route.paramMap.get('idRequest');
    if (!this.cartCreationService.isFromCancel) {
      return this.requestService.getCartSavByRequest(Number(this.requestId))
      .pipe(catchError(() => of(null)));
    } else {
      return this.cartCreationService.getCartSavVo();
    }
  }
}
