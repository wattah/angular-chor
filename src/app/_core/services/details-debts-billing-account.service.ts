import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { HttpBaseService } from './http-base.service';
import { CompteFacturation } from '../models/compte-facturation-vo';
import { DetailsBillingAccounts } from '../models/details-billing-accounts';

@Injectable({
  providedIn: 'root'
})
export class DetailsDebtsBillingAccountService extends HttpBaseService<CompteFacturation> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'billing');
  }
  getDetailsDebts(nicheIdentifier: String, univers: string, state: string ): Observable<DetailsBillingAccounts> {
    return this.httpClient
    .get<DetailsBillingAccounts>(`${environment.baseUrl}/${this.endpoint}/detailsDebts?nicheIdentifier=${nicheIdentifier}&univers=${univers}&state=${state}`);
  }

  getBillingAccountListByNicheIdentifierAndEtat(nicheIdentifier: String, univers: string, state: string ): Observable<CompteFacturation[]> {
    return this.httpClient
    .get<CompteFacturation[]>(`${environment.baseUrl}/${this.endpoint}/billingAccounts?nicheIdentifier=${nicheIdentifier}&univers=${univers}&state=${state}`);
  }

  getForcerRenvoi50D(idCompteFacturation: string, insertOrUpdate: boolean){
    return this.httpClient
    .get<CompteFacturation>(`${environment.baseUrl}/${this.endpoint}/forceReturns50D?idCompteFacturation=${idCompteFacturation}&insertOrUpdate=${insertOrUpdate}`);
    
  }

}
