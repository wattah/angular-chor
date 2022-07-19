import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpBaseService } from './http-base.service';
import { environment } from '../../../environments/environment';
import { InfoBodySendRIBVO } from '../models/info-body-send-rib-vo';
import { GassiMockLoginService } from './gassi-mock-login.service';
import { ResponseIbanTransactionVO } from '../models/reponse-iban-transaction-vo';
import { ResponseIbanDetailsVO } from '../models/response-iban-details-vo';
import { PayementVO } from '../models/payement';
import { TransactionResponseVO } from '../models/transaction-response-vo';
import { MouvementPaginationCriteria } from '../models/mouvement-pagination-criteria';
import { MouvementECVO } from '../models/mouvementECVO';
import { PaginatedList } from '../models/paginated-list';
import { InvoiceVO } from '../models/invoice-vo';
import { FacturePaginationCriteria } from '../models/factures-pagination-criteria';

@Injectable({ 
  providedIn: 'root' 
})
export class InvoiceService extends HttpBaseService<any> {

  constructor(httpClient: HttpClient, readonly gassiMockLogin: GassiMockLoginService) {
    super(httpClient, 'invoices');
  }

  postIbanRib(infoBodySendRIB: InfoBodySendRIBVO): Observable<ResponseIbanTransactionVO> {
    return this.httpClient
      .post<ResponseIbanTransactionVO>(`${environment.baseUrl}/${this.endpoint}/postIbanRib`, infoBodySendRIB);
  }

  getDetailsIbanRib(uuid: string): Observable<ResponseIbanDetailsVO> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/ibanResponse/${uuid}`).
      pipe(map((data: any) => data as ResponseIbanDetailsVO));
  }

  callIban(url: string): Observable<string> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/ibancall?url=${url}`).
      pipe(map((data: any) => data as string));
  }

  getUrlPayment(userId: number, payment: PayementVO): Observable<PayementVO> {
    return this.httpClient
    .post<PayementVO>(`${environment.baseUrl}/${this.endpoint}/getUrlPayment/${userId}`, payment);
  }

  getToken(transactionType: string, numClient: string, customerId: number,
     amount: number, paymentRefNumber: string): Observable<TransactionResponseVO> {
    const data: FormData = new FormData();
    data.append('transactionType', transactionType);
    data.append('numClient', numClient);
    data.append('customerId', customerId.toString());
    data.append('amount', amount.toString());
    data.append('paymentRefNumber', paymentRefNumber);
    return this.httpClient
    .post<TransactionResponseVO>(`${environment.baseUrl}/${this.endpoint}/getPaymentToken`, data);
  }

  getIbanFromAsMetiers(billAccountNumber: string): Observable<string> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/getIbanFromAsMetiers?billAccountNumber=${billAccountNumber}`).
      pipe(map((data: any) => data as string));
  }

  /**
   * permet de recupere des mouvements a partir numero compte facturation 
   * @param mouvementPaginationCriteria 
   * @returns 
   */
   getMouvementsByBillAccount(mouvementPaginationCriteria: MouvementPaginationCriteria): Observable<PaginatedList<MouvementECVO>> {
    return this.httpClient.post<PaginatedList<MouvementECVO>>(`${environment.baseUrl}/${this.endpoint}/getMouvementsByBillAccount`, mouvementPaginationCriteria);
  }

  /**
   * permet de recupere des factures a partir numero compte facturation 
   * @param FacturePaginationCriteria 
   * @returns 
   */
   getFacturesByBillAccount(facturePaginationCriteria: FacturePaginationCriteria): Observable<PaginatedList<InvoiceVO>> {
    return this.httpClient.post<PaginatedList<InvoiceVO>>(`${environment.baseUrl}/${this.endpoint}/getFacturesByBillAccount`, facturePaginationCriteria);
  }


}
