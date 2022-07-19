import { CustomerHardwareParkItemVO } from './../models/models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CustomerParcItemVO, CustomerParkLigne } from '../../_core/models/customer-parc-item-vo';
import { CustomerParcServiceVO } from '../../_core/models/customer-parc-service-vo';
import { HttpBaseService } from './http-base.service';
import { BeneficiaireView } from '../models/profil-infos-dashboard';
import { RenewalMobileVO } from '../models/models';
import { CustomerParcLigneDetailVO } from '../../_core/models/customer-parc-ligne-detail-vo';
import { CustomerParkItemVO } from '../models/customer-park-item-vo';
import { ParkBillPenicheCustomerVO } from '../models/park-bill-peniche-customer-vo';

@Injectable({
  providedIn: 'root'
})
export class ParcLigneService extends HttpBaseService<CustomerParcItemVO> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'costumer-park-item');
  }

  getParcLigneEnCoursByCustomer(customer: string, showDetail: boolean): Observable<CustomerParcItemVO> {
    return this.httpClient
    .get<CustomerParcItemVO>(`${environment.baseUrl}/${this.endpoint}/all?customer=${customer}&showDetail=${showDetail}`);
  }

  getParcServicesByCustomer(customer: string): Observable<CustomerParcServiceVO[]> {
    return this.httpClient
    .get<CustomerParcServiceVO[]>(`${environment.baseUrl}/costumer-hardware-park-item/all?customer=${customer}`);
  }

  getParcLignesBeneficiaireByCustomer(customer: string): Observable<CustomerParkLigne[]> {
    return this.httpClient
    .get<CustomerParkLigne[]>(`${environment.baseUrl}/costumer-park-item/all/entreprise?customer=${customer}`);
  }
  
  getParcServicesByCustomerEntreprise(customer: string): Observable<CustomerParcServiceVO[]>{
    return this.httpClient
    .get<CustomerParcServiceVO[]>(`${environment.baseUrl}/costumer-hardware-park-item/getCHP?customer=${customer}`);
  }

  getParcServicesHardwareFullByCustomer(customer: string, showInactif = false): Observable<CustomerParcServiceVO[]> {
    return this.httpClient
    .get<CustomerParcServiceVO[]>(`${environment.baseUrl}/costumer-hardware-park-item/getfullcustomerhardwarepark?idCustomer=${customer}&showInactif=${showInactif}`);
  }

  getParcServicesDetailsByCustomerEntreprise(customer: string, showInactif = false): Observable<CustomerParcServiceVO[]>{
    return this.httpClient
    .get<CustomerParcServiceVO[]>(`${environment.baseUrl}/costumer-hardware-park-item/getCHPFullForTitular?idCustomer=${customer}&showInactif=${showInactif}`);
  }

  getDetailHardwareParkItem(id: Number): Observable<CustomerParcServiceVO>{
    return this.httpClient
    .get<CustomerParcServiceVO>(`${environment.baseUrl}/costumer-hardware-park-item/getdetailhardwareparkitem?id=${id}`);
  }

  getBeneficiairyByWebServiceIdentifier(webServiceIdentifier: string, beneficiairyIdentifier: string): Observable<BeneficiaireView>{
    return this.httpClient
    .get<BeneficiaireView>(`${environment.baseUrl}/${this.endpoint}/beneficiairy?webServiceIdentifier=${encodeURIComponent(webServiceIdentifier)}&beneficiairyIdentifier=${beneficiairyIdentifier}`);
  }


  getAllByCustomerForMessage(customerId: string, category: string, wantedHolderBeneficiary: boolean): Observable<CustomerParkItemVO[]>{
    return this.httpClient
    .get<CustomerParkItemVO[]>(`${environment.baseUrl}/${this.endpoint}/getAllByCustomerForMessage?customerId=${customerId}&category=${category}&wantedHolderBeneficiary=${wantedHolderBeneficiary}`);
  }

  getCustomerParkItemById(id: number): Observable<CustomerParkItemVO> {
    return this.httpClient
    .get<CustomerParkItemVO>(`${environment.baseUrl}/${this.endpoint}/getCustomerParkItemById?id=${id}`);
  }
  
 unlockCustomerParkItem(id: number): Observable<boolean> {
    return this.httpClient
      .get<boolean>(`${environment.baseUrl}/${this.endpoint}/unlock-customer-park-item?customerParkItemId=${id}`);
  }
 getDetailLigneParkItem(id: number): Observable<CustomerParcLigneDetailVO>{
    return this.httpClient
    .get<CustomerParcLigneDetailVO>(`${environment.baseUrl}/${this.endpoint}/detail-ligne-parkItem?customerParkItemId=${id}`);
  }
  
   suspendOrActiveLine(customerParkItemId: number, toSuspend: boolean): Observable<void> {
    return this.httpClient
      .get<void>(`${environment.baseUrl}/${this.endpoint}/suspend-or-active-line?customerParkItemId=${customerParkItemId}&toSuspend=${toSuspend}`);
  }
  
  getListRenewalMobileById(customerParkItemId: number): Observable<RenewalMobileVO[]> {
    return this.httpClient
    .get<RenewalMobileVO[]>(`${environment.baseUrl}/${this.endpoint}/getListRenewalMobileById?customerParkItemId=${customerParkItemId}`);
  }
  deleteCustomerParkItem(id: number): Observable<boolean> {
    return this.httpClient
      .get<boolean>(`${environment.baseUrl}/${this.endpoint}/delete-customer-park-item?customerParkItemId=${id}`);
  }

  getParkItemsFull(custId: string): Observable<CustomerParkItemVO[]>{
    return this.httpClient
    .get<CustomerParkItemVO[]>(`${environment.baseUrl}/${this.endpoint}/parkitemsfull?customerId=${custId}`);
  }

 
  updateCustomerParkItem(parcCustomerParkItemVo: ParkBillPenicheCustomerVO): Observable<CustomerParkItemVO> {
    return this.httpClient.post<CustomerParkItemVO>(`${environment.baseUrl}/${this.endpoint}/update-customer-park-item`, parcCustomerParkItemVo);
  }


  saveCustomerParkItemWithCRAndCF( cpiVO: CustomerParkItemVO): Observable<any> {
    return this.httpClient.post<any>(`${environment.baseUrl}/${this.endpoint}/savecpi`, cpiVO);
 
  }

  refreshCustomerPark(customerParkItemId: number, userId: number): Observable<CustomerParkItemVO> {
    return this.httpClient
      .get<CustomerParkItemVO>(`${environment.baseUrl}/${this.endpoint}/refreshcustomerpark?idCustomerParkItem=${customerParkItemId}&userId=${userId}`);
  }
  
  
  getParkItemsOfBeneficiariesByHolderId(customerId: string): Observable<CustomerParkItemVO[]> {
    return this.httpClient
    .get<CustomerParkItemVO[]>(`${environment.baseUrl}/${this.endpoint}/park-items-enterprise-full?customerId=${customerId}`);
  }
  

  createCustomerHardwareParkItem(customerHardwareParkItemVO: CustomerHardwareParkItemVO){
    return this.httpClient
    .post<CustomerParkItemVO>(`${environment.baseUrl}/costumer-hardware-park-item/create` , customerHardwareParkItemVO);
  }

  getCustomerHardware(hardwareId: number): Observable<CustomerHardwareParkItemVO> {
    return this.httpClient
    .get<CustomerHardwareParkItemVO>(`${environment.baseUrl}/costumer-hardware-park-item/${hardwareId}`);  
  }

  getImpactLine(customerId): Observable<CustomerParkItemVO[]> {
    return this.httpClient
    .get<CustomerParkItemVO[]>(`${environment.baseUrl}/${this.endpoint}/search-list-park-item/${customerId}`);  
  }

  searchParkByNumString(numPhone: string, typeWebservice: number): Observable<CustomerParkItemVO> {
    return this.httpClient
    .get<CustomerParkItemVO>(`${environment.baseUrl}/${this.endpoint}/searchParkByNumString?numPhone=${numPhone}&typeWebservice=${typeWebservice}`);
  }

  getBillAccountLineOffers(numLines: string[]): Observable<CustomerParkItemVO[]> {
    return this.httpClient
    .post<CustomerParkItemVO[]>(`${environment.baseUrl}/${this.endpoint}/get-bill-account-Line-offers`, numLines);
  }

  /**
   * save customerParkItem with bill account and peniche customer
   * @param cpibpVO 
   */
  saveParkWithCRAndCF( cpibpVO: ParkBillPenicheCustomerVO): Observable<any> {
    return this.httpClient.post<any>(`${environment.baseUrl}/${this.endpoint}/savecpiwithcfandcr`, cpibpVO);
 
  }

  hasMultipleParcTelcoActif(callSeqNum: string): Observable<boolean>{
    return this.httpClient.get<boolean>(`${environment.baseUrl}/${this.endpoint}/hasMultipleParcTelcoActif/${callSeqNum}`);
  }
}
