import { HttpBaseService } from './http-base.service';
import { ProductVO } from '../../_core/models/productVO';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { CustomerHardwareParkItemVO, CustomerParkItemTerminalMobileVO, RenewalMobileVO } from '../models/models';


@Injectable({
  providedIn: 'root'
})
export class ProductService extends HttpBaseService<ProductVO> {

      /**
   * Cnstructeur
   * @param httpClient client http
   */
  constructor(httpClient: HttpClient) {
    super(httpClient, 'persons');
  }

  /**
   * rechercher  les produits 
   * @param pattern 
   */
  searchProducts(pattern: String): Observable<ProductVO[]> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/searchProducts?pattern=${pattern}`)
      .pipe(map((data: any) => <ProductVO[]>data));
  }

  /**
   * telecharger le fichier description de produit
   * @param pattern 
   */
  downloadDescriptionProduct(productDescriptionName: string): Observable<any> {
    const downloadURL = `${environment.baseUrl}/products/downloadProductDescription/${productDescriptionName}`;
    const httpOptions = {
      observe: 'response' as const,
      responseType  : 'arraybuffer' as 'json',
    };
    return this.httpClient.get(downloadURL, httpOptions);
  }

  /**
   * get list renewalMobile by serial number
   * @param pattern 
   */
   listRenewalMobileBySerialPart(searchPattern: String, serpAll : boolean,productId: string, productSourceTable : string): Observable<RenewalMobileVO[]> {
    return this.httpClient.get<RenewalMobileVO[]>(`${environment.baseUrl}/products/getRenewalMobile?searchKey=${searchPattern}&serpAll=${serpAll}&productId=${productId}&productSourceTable=${productSourceTable}`);
  }

  /**
   * get list customerParkItemTerminalMobile by serial number
   * @param pattern 
   */
   listCustomerParkItemTerminalMobileBySerialPart(searchPattern: String, serpAll : boolean, productId : string, productSourceTable : string): Observable<CustomerParkItemTerminalMobileVO[]> {
    return this.httpClient
      .get<CustomerParkItemTerminalMobileVO[]>(`${environment.baseUrl}/products/getCustomerParkItemTerminalMobile?searchKey=${searchPattern}&serpAll=${serpAll}&productId=${productId}&productSourceTable=${productSourceTable}`);
  }

   /**
   * get list CustomerHardwareParkItem by serial number
   * @param pattern 
   */
    listHardwareParkItemBySerialPart(searchPattern: String, serpAll : boolean, productId: string, productSourceTable : string): Observable<CustomerHardwareParkItemVO[]> {
      return this.httpClient
        .get<CustomerHardwareParkItemVO[]>(`${environment.baseUrl}/products/getHardwareParkItem?searchKey=${searchPattern}&serpAll=${serpAll}&productId=${productId}&productSourceTable=${productSourceTable}`);
    }
}