import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CartService } from '../services/cart.service';
import { CartVO } from '../models/cart-vo';


@Injectable({
  providedIn: 'root'
})
export class CartResolver implements Resolve<Observable<CartVO[]>> {

    requestId: string;
   

  constructor(readonly cartService: CartService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CartVO[]> {
    this.requestId = route.paramMap.get('idRequest');
  
    console.log( " this.cartService.getCartByRequest(Number(this.requestId)).pipe(catchError(() => of([])))")
    console.log(this.cartService.getCartByRequest(Number(this.requestId)).pipe(catchError(() => of([]))));
    return this.cartService.getCartByRequest(Number(this.requestId))
      .pipe(catchError(() => of([])));
    
  }
}
