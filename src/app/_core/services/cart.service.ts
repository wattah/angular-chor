import { CartItemVO } from './../models/cart-item-vo';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartVO } from '../models/cart-vo';

import { HttpBaseService } from './http-base.service';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';
import { RecapCartVo } from '../models/recap-cart-vo';

import { PdfDocumentVO } from '../models/PdfDocumentVO';

@Injectable({
  providedIn: 'root'
})
export class CartService extends HttpBaseService<CartVO> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'cart');
  }


  getCartByRequest(requestId: number): Observable<CartVO[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/carts/${requestId}`)
    .pipe(map((data: any) => data as CartVO[]));
  }

  getRecapCartByCartId(cartId: number): Observable<RecapCartVo> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/recapCart/${cartId}`)
    .pipe(map((data: any) => data as RecapCartVo));
  }

  getCartByRequestLight(requestId: number): Observable<CartVO[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/cartLight/${requestId}`)
    .pipe(map((data: any) => data as CartVO[]));
  }

  generateCartQuotation(cartId: number, withLogo: string): Observable<PdfDocumentVO> {
    const data: FormData = new FormData();
    data.append('cartId', cartId.toString());
    data.append('withLogo', withLogo);
    return this.httpClient.post<PdfDocumentVO>(`${environment.baseUrl}/${this.endpoint}/generateCartQuotation`, data);
  }

  generateCartTinyBill(cartId: number, withLogo: string): Observable<PdfDocumentVO> {
    const data: FormData = new FormData();
    data.append('cartId', cartId.toString());
    data.append('withLogo', withLogo);
    return this.httpClient.post<PdfDocumentVO>(`${environment.baseUrl}/${this.endpoint}/generateCartTinyBill`, data);
  }

  generateInstallationPv(cartId: number, withLogo: string): Observable<PdfDocumentVO> {
    const data: FormData = new FormData();
    data.append('cartId', cartId.toString());
    data.append('withLogo', withLogo);
    return this.httpClient.post<PdfDocumentVO>(`${environment.baseUrl}/${this.endpoint}/generateInstallationPv`, data);
  }

  getDeletedCartItems(cartId: number){
    const options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/deleted-items/${cartId}` , options)
    .pipe(map((data: any) => data as CartItemVO[]));
  }

  recaculatePrices(cart: CartVO){
    return this.httpClient
    .post(`${environment.baseUrl}/${this.endpoint}/recalculate-prices` , cart)
    .pipe(map((data: any) => data as RecapCartVo[]));
  }

  getIfCartHasBlockedItemByRequestId(requestId : number) : Observable< boolean>{
      return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/getIfCartHasBlockedItemByRequestId/${requestId}`)
      .pipe(map((data: any) => (data as boolean)));
  }

}
