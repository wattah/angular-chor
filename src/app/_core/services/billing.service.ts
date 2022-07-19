import { PenicheBillCreditComplementaryVO } from './../models/peniche-bill-credit-complementary-vo';
import { PenicheRelookingResponseVO } from './../models/peniche-relooking-response-vo';
import { PenicheClientLivrablesResponseVO } from './../models/peniche-client-livrables-response-vo';
import { PenicheRefreshedAccountResponseVO } from './../models/peniche-refreshe-account-response-vo';
import { PenicheAccountHistoryResponseVO } from './../models/peniche-account-history-respons-vo';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { HttpBaseService } from './http-base.service';
import { StatsCustomerBillsVO } from '../models/stats-customer-bills-vo';
import { PaginatedList } from '../models/paginated-list';
import { PayementVO } from '../models/payement';
import { PenicheBillAccountLightVO } from './../models/models';
import { BillCriteriaVO } from './../models/BillCriteriaVO';
import { PenicheCustomerResponseVO } from '../models/peniche-customer-response-vo';
import { PenicheBillAccountVO } from './../models/peniche-bill-account-vo';
import { LivrableVO } from '../models/livrable-vo';
import { StatFactureMassResponseVO } from '../models/statFactureMass-vo';
import { Excel50DJsonResponseVO } from '../models/excel-50-d-json-response-vo';
import { Excel50DResponseVo } from '../models/excel-50-d-response-vo';

@Injectable({
  providedIn: 'root'
})
export class BillingService extends HttpBaseService<PaginatedList<StatsCustomerBillsVO>> {

  httpOptions = {
    observe: 'response' as const,
    responseType  : 'arraybuffer' as 'json',
  };
  private readonly file = 'file';

  private readonly livrable = 'livrable';

  private readonly contentType = "application/json";

  constructor(httpClient: HttpClient) {
    super(httpClient, 'billing');
  }

  invoices(trigrammeNiche: string, status: string, addBillReport: boolean, 
    userId: number, page: number, pageSize: number): Observable<PaginatedList<StatsCustomerBillsVO>[]> {

    return this.httpClient.get<PaginatedList<StatsCustomerBillsVO>[]>(`${environment.baseUrl}/${this.endpoint}/invoices?`+
    `trigrammeNiche=${trigrammeNiche}&status=${status}&addBillReport=${addBillReport}&userId=${userId}&page=${page}&pageSize=${pageSize}`);
  }

  getBillAccounts(billCriteria: BillCriteriaVO){
    return this.httpClient.post<PenicheBillAccountLightVO[]>(`${environment.baseUrl}/${this.endpoint}/bill-accounts` , billCriteria);
  }

  savePayement(payement: Partial<PayementVO>): Observable<PayementVO> {
    return this.httpClient.post<PayementVO>(`${environment.baseUrl}/${this.endpoint}/payement` , payement);
  }

  getPayement(payementId: number): Observable<PayementVO> {
    return this.httpClient.get<PayementVO>(`${environment.baseUrl}/${this.endpoint}/payement?payementId=${payementId}`);
  }

  askInfoPayement(payementId: number): Observable<string> {
    const httpOptions = { responseType  : 'text' as 'json' } ;
    return this.httpClient.get<string>(`${environment.baseUrl}/${this.endpoint}/ask-info-payement?payementId=${payementId}`, httpOptions);
  }

  getBillCRDetailsByPeniche(trigrammeNiche: string, customerNicheIdentifier: string): Observable<PenicheCustomerResponseVO> {
    return this.httpClient.get<PenicheCustomerResponseVO>(`${environment.baseUrl}/${this.endpoint}/getBillCRDetailsByPeniche?`+
    `trigrammeNiche=${trigrammeNiche}&customerNicheIdentifier=${customerNicheIdentifier}`);
  }

  saveBillCustomer(cuid: string, peniche: PenicheCustomerResponseVO): Observable<PenicheCustomerResponseVO> {
    return this.httpClient.post<PenicheCustomerResponseVO>(`${environment.baseUrl}/${this.endpoint}/savebillcustomer/${cuid}` , peniche);
  }

  getBillAccountByPeniche(customerIdentifier: string, billAccountIdentifer: string): Observable<PenicheBillAccountVO> {
    return this.httpClient.get<PenicheBillAccountVO>(`${environment.baseUrl}/${this.endpoint}/billAccountByPeniche?` +
    `customerIdentifier=${customerIdentifier}&billAccountIdentifer=${billAccountIdentifer}`);
  }

  saveBillAccount(penicheBillAccount: PenicheBillAccountVO): Observable<PenicheBillAccountVO> {
    return this.httpClient.post<PenicheBillAccountVO>(`${environment.baseUrl}/${this.endpoint}/saveBillAccount` , penicheBillAccount);
  }

  getAccountSoldHistory(account: string){
    return this.httpClient.get<PenicheAccountHistoryResponseVO>(`${environment.baseUrl}/${this.endpoint}/sold-history/${account}`);
  }

  refreshSoldeAccountFacturation(account: number){
    return this.httpClient.get<PenicheRefreshedAccountResponseVO>(`${environment.baseUrl}/${this.endpoint}/refresh-account/${account}`);
  }

  getClientLivrablesBy(clientNich: string , month: string , inclureLivrableAbsent:boolean){
    return this.httpClient.get<PenicheClientLivrablesResponseVO>(`${environment.baseUrl}/${this.endpoint}/client-livrables/${clientNich}/${month}/${inclureLivrableAbsent}`);
  }

  recupererLivrablesUnivers(idNiche: number, idUnivers: number, mois: string): Observable<LivrableVO[]> {
    return this.httpClient.get<LivrableVO[]>(`${environment.baseUrl}/${this.endpoint}/recupererLivrablesUnivers?` +
    `idNiche=${idNiche}&idUnivers=${idUnivers}&mois=${mois}`);
  }

  getStatFactureMass(idNiche: number, mois: string): Observable<StatFactureMassResponseVO[]> {
    return this.httpClient.get<StatFactureMassResponseVO[]>(`${environment.baseUrl}/${this.endpoint}/statFactureMass?` +
    `idNiche=${idNiche}&mois=${mois}`);
  }
  checkIfPenicheIsConnected(){
    return this.httpClient.get<Boolean>(`${environment.baseUrl}/${this.endpoint}/checkConnectionToPeniche`);
  }

  genererFactureRelookee(relookingLivrables: LivrableVO[]): Observable<PenicheRelookingResponseVO[]> {
    return this.httpClient.post<PenicheRelookingResponseVO[]>(`${environment.baseUrl}/${this.endpoint}/relooking-standard` , relookingLivrables);
  }


  replaceRelookedBill( nomFichier: string, livrable: LivrableVO , file): Observable<LivrableVO> {
    const formData = new FormData();
    formData.append(this.file , file);
    formData.append(this.livrable, new Blob([JSON.stringify(livrable)], {type: this.contentType}));
    return this.httpClient.post<LivrableVO>(`${environment.baseUrl}/${this.endpoint}/replaceRelookedBill?` +
    `nomFichier=${nomFichier}`,formData);
  }
  markBillAsPaid(livrable: LivrableVO): Observable<PenicheRelookingResponseVO> {
    return this.httpClient.post<PenicheRelookingResponseVO>(`${environment.baseUrl}/${this.endpoint}/mark-bill-paid` , livrable);
  }

  archiverBill(livrablesIds: number[]): Observable<PenicheRelookingResponseVO[]> {
    return this.httpClient.post<PenicheRelookingResponseVO[]>(`${environment.baseUrl}/${this.endpoint}/archive-bill` , livrablesIds);
  }


  deleteBill(livrable: LivrableVO): Observable<PenicheRelookingResponseVO> {
    return this.httpClient.post<PenicheRelookingResponseVO>(`${environment.baseUrl}/${this.endpoint}/delete-bill` , livrable);
  }

  /**
   * 
   */
  uploadBills(billsName: string[]): Observable<LivrableVO[]> {
    return this.httpClient.post<LivrableVO[]>(`${environment.baseUrl}/${this.endpoint}/upload-bills` , billsName);
  }

  updateStatusLivrable(livrable: LivrableVO , chose:boolean): Observable<LivrableVO>{
    return this.httpClient.post<LivrableVO>(`${environment.baseUrl}/${this.endpoint}/update-bill/${chose}` , livrable);
  }
  saveFileExcel50D(file: File, fileName: string): Observable<Excel50DJsonResponseVO> {
    const data: FormData = new FormData();
    data.append('file', file);
    data.append('fileName', fileName);
    return this.httpClient.post<Excel50DJsonResponseVO>(`${environment.baseUrl}/${this.endpoint}/saveFileExcel50D`, data);
  }

  getExcel50DByCodeNiche(codeNiche: string): Observable<Excel50DResponseVo[]> {
    return this.httpClient.get<Excel50DResponseVo[]>(`${environment.baseUrl}/${this.endpoint}/getExcel50DByCodeNiche?`+
    `codeNiche=${codeNiche}`);
  }

  checkIfCRExists(period: Date, nicheIdentifier : string): Observable<boolean> {
    const month = period.getMonth();
    const year = period.getFullYear();
    return this.httpClient.get<boolean>(`${environment.baseUrl}/${this.endpoint}/isExistingReport?month=${month}&year=${year}&nicheIdentifier=${nicheIdentifier}`);
  }

  deleteExistingReport(period: Date, nicheIdentifier : string): Observable<boolean> {
    const month = period.getMonth();
    const year = period.getFullYear();
    return this.httpClient.get<boolean>(`${environment.baseUrl}/${this.endpoint}/deleteExistingReport?month=${month}&year=${year}&nicheIdentifier=${nicheIdentifier}`);
  }

  saveBillCreditCompl(billCreditComplVO: PenicheBillCreditComplementaryVO): Observable<boolean> {
    return this.httpClient.post<boolean>(`${environment.baseUrl}/${this.endpoint}/saveBillCreditComplementary` , billCreditComplVO);
  }
  

  downloadBillAsZip(files: string): Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/${this.endpoint}/zip/factures` , files , this.httpOptions);
  }
}
