import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { HttpBaseService } from './http-base.service';
import { CustomerTotalsDebt } from '../models/customer-totals-debt';
import { MouvementECVO } from '../models/mouvementECVO';
import { PaginatedList } from './../models/paginated-list';
import { ContractsOffersVO } from '../models/contracts-offers-vo';

@Injectable({
  providedIn: 'root'
})
export class CustomerTotalsDebtService extends HttpBaseService<CustomerTotalsDebt> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'billing');
  }
  getTotalsDebt(customerId: string): Observable<CustomerTotalsDebt> {
    return this.httpClient
    .get<CustomerTotalsDebt>(`${environment.baseUrl}/${this.endpoint}/totalsDebt?customerId=${customerId}`);
  }

  getMouvementsByNicheIdentifier(nicheIdentifier: string, pageNumber: number, pageSize: number, 
    sortField: string, sortOrder: string): Observable<PaginatedList<MouvementECVO>> {
    return this.httpClient.get<PaginatedList<MouvementECVO>>
    (`${environment.baseUrl}/${this.endpoint}/mouvementsEC?nicheIdentifier=${nicheIdentifier}&pageNumber=${pageNumber}&` +
    `pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`);
  }

  getContractsOffers(customerId: string): Observable<ContractsOffersVO> {
    return this.httpClient
    .get<ContractsOffersVO>(`${environment.baseUrl}/${this.endpoint}/contactsOffers?customerId=${customerId}`);
  }

  getXlsFile(nicheIdentifier: string):any {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/exportToXlsFile?nicheIdentifier=${nicheIdentifier}`,{responseType: 'arraybuffer'});

}


}
