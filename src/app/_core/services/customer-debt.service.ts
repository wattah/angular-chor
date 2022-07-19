import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CustomerParcItemVO, CustomerParkLigne } from '../models/customer-parc-item-vo';
import { CustomerParcServiceVO } from '../models/customer-parc-service-vo';
import { HttpBaseService } from './http-base.service';
import { CustomerDebt } from '../models/custome-debt-vo';

@Injectable({
  providedIn: 'root'
})
export class CustomerDebtService extends HttpBaseService<CustomerDebt> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'costumerdebt');
  }
  getDateRecouvrement(customerId: string): Observable<Date> {
    return this.httpClient
    .get<Date>(`${environment.baseUrl}/${this.endpoint}/daterecouvrement?customerId=${customerId}`);
  }

  getRecoveryDate(customerId: string): Observable<Date>{
    return this.httpClient
    .get<Date>(`${environment.baseUrl}/${this.endpoint}/daterecovery?customerId=${customerId}`);

  }

}
