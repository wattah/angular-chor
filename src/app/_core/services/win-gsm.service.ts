import { CartItemVO as CartItemVOAlpha } from './../models/models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';
import { StoreWinGsmVO } from '../models/store-win-gsm-vo';
import { CartItemVO } from '../models/cart-item-vo';

@Injectable({
  providedIn: 'root'
})
export class WinGsmService extends HttpBaseService<StoreWinGsmVO> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wingsm');
  }


  checkAvailabilityOfItems(items: CartItemVO[]): Observable<StoreWinGsmVO[]> {
    return this.httpClient
    .post(`${environment.baseUrl}/${this.endpoint}/checkAvailabilityOfItems`, items)
    .pipe(map((data: any) => data as StoreWinGsmVO[]));
  }

  checkAvailabilityOfItemsAlpha(items: CartItemVOAlpha[]): Observable<StoreWinGsmVO[]> {
    return this.httpClient
    .post(`${environment.baseUrl}/${this.endpoint}/checkAvailabilityOfItems`, items)
    .pipe(map((data: any) => data as StoreWinGsmVO[]));
  }

}
