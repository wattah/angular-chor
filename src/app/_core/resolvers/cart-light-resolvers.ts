import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CartService } from '../services/cart.service';
import { CartVO } from '../models/cart-vo';
import { CartCreationService } from '../../main/cart/cart/cart-creation.service';


@Injectable({
  providedIn: 'root'
})
export class CartLightResolver implements Resolve<Observable<CartVO[]>> {

    requestId: string;
  

  constructor(readonly cartService: CartService,
     private readonly cartCreationService:CartCreationService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CartVO[]> {
    this.requestId = route.paramMap.get('idRequest');
    if(!this.cartCreationService.isFromCancel){
    return this.cartService.getCartByRequestLight(Number(this.requestId))
      .pipe(catchError(() => of([])));
    }
    else{
      return this.cartCreationService.getCartLightVO();
    }
    
  }
}
