import { Injectable } from '@angular/core';
import { CartSavVO } from '../models/models';
import { HttpClient } from '@angular/common/http';
import { HttpBaseService } from './http-base.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartSavService  extends HttpBaseService<CartSavVO>{

  constructor(httpClient: HttpClient){
    super(httpClient, 'cartsav')
}

  /**
   * Enregister le cartSAV
   *
   * @param {CartSavVO} cartSAV
   * @returns {Observable<CartSavVO>}
   */
  saveOrUpdateCartSAV(cartSAV: CartSavVO): Observable<CartSavVO> {
    return this.httpClient.post<CartSavVO>(`${environment.baseUrl}/${this.endpoint}/saveOrUpdateCartSAV`, cartSAV);
  }
}
