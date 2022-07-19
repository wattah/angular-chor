import { HttpBaseService } from './http-base.service';
import { ProductVO } from '../../_core/models/productVO';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { CmPostalAddressVO } from '../models/cm-postaladdress-vo';


@Injectable({
  providedIn: 'root'
})
export class PostalAdressService extends HttpBaseService<CmPostalAddressVO> {

      /**
   * Cnstructeur
   * @param httpClient client http
   */

  constructor(httpClient: HttpClient) {
    super(httpClient, 'adressepostale');
  }

  /**
   * rechercher  les produits 
   * @param pattern 
   */
  getListAdresseRdvByRpProRs(id: string): Observable<CmPostalAddressVO[]> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/listAdresseRdvByRpProRs?id=${id}`)
      .pipe(map((data: any) => <CmPostalAddressVO[]>data));
  }
}