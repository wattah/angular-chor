import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

import { CustomerVO } from '../../_core/models/models';
import { HttpBaseService } from './http-base.service';
import { environment } from '../../../environments/environment';
import { CustomerAutocomplete } from '../../_core/models/customer-autocomplete';
import { CustomerView } from '../../_core/models/customer-view';
import { BeneficiaireView } from '../../_core/models/profil-infos-dashboard';
import { CustomerReferentLight } from '../models/customer-referent-light';
import { CustomerComplaint } from '../models/customer-complaint';
import { LiveEngageView } from '../models/abc-view';
import { AcquisitionCanalVO } from '../models/acquisition-canal-vo';
import { CanalMotifHomologation } from '../models/Canal-Motif-homologation-vo';
import { CustomerProfileVO } from '../models/customer-profile-vo';
import { TotalsWallet } from '../models';


/**
 * Servuce pour gérer les customers
 */
@Injectable({
  providedIn: 'root'
})
export class CustomerService extends HttpBaseService<CustomerVO> {
  /**
   * Cnstructeur
   * @param httpClient client http
   */
  constructor(httpClient: HttpClient) {
    super(httpClient, 'customers');
  }

  /**
   * Renvoie le résultat d'un autocomplete
   * @param value valeur à rechercher
   * @param idNiche
   * @param companyCustomer
   * @param limit
   * @param status
   */
  autocomplete(value: string, idNiche: number, companyCustomer: string, limit: boolean, status: string[]): Observable<CustomerAutocomplete[]> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/autocomplete?value=${value}&idNiche=${idNiche}&companyCustomer=${companyCustomer}&limit=${limit}&status=${status}`)
      .pipe(map((data: any) => <CustomerAutocomplete[]>data));
  }

  /**
   * Récupère les informations pour la fiche bénéficiaire
   * @param id customerId
   */
  getCustomer(id: string): Observable<CustomerView> {
    return this.httpClient
       // .get(`http://localhost:4200/assets/mock/` + id + '.json')
      .get(`${environment.baseUrl}/${this.endpoint}/benefcard?customerId=${id}`)
      .pipe(map((data: any) => <CustomerView>data));
  }

  getProfilView(id: string, isParticular: boolean, isTitular: boolean): Observable<BeneficiaireView> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/profilView?customerId=${id}&isParticular=${isParticular}&isTitular=${isTitular}`)
      .pipe(map((data: any) => <BeneficiaireView>data));
  }

  getProfilViewByNicheIdentifier(idNiche: string): Observable<BeneficiaireView> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/profilView?nicheIdentifier=${idNiche}`)
      .pipe(map((data: any) => <BeneficiaireView>data));
  }
  
  /**
   * Modification des informations de la fiche bénéficiaire.
   *
   * @param {CustomerView} item
   * @returns {Observable<CustomerView>}
   */
  updateCustomer(item: CustomerView): Observable<CustomerView> {
    return this.httpClient
      .put<CustomerView>(`${environment.baseUrl}/${this.endpoint}/${item.id}`, item)
      .pipe(map(data => <CustomerView>data));
  }

  
  /**
   *  récupérer la liste des référents
   */
  getListReferents(id:string) : Observable<CustomerReferentLight> {
    return this.httpClient
    .get<CustomerReferentLight>(`${environment.baseUrl}/${this.endpoint}/listReferents?customerId=${id}`);
  }

  getComplaintMessageForCustomer(id:string) : Observable<CustomerComplaint>{
    return this.httpClient
    .get<CustomerComplaint>(`${environment.baseUrl}/${this.endpoint}/customerComplaint?customerId=${id}`);

  }


  getLiveEngageData(id:string) : Observable<LiveEngageView> {
    console.log(`${environment.baseUrl}/${this.endpoint}/getLiveEngageData?opaqueId=${id}`)
    return this.httpClient
    .get<LiveEngageView>(`${environment.baseUrl}/${this.endpoint}/getLiveEngageData?opaqueId=${id}`);
  }
  
  
  getFullCustomer(customerId: string){
    return this.httpClient.get<CustomerProfileVO>(`${environment.baseUrl}/${this.endpoint}/customer-full/${customerId}`);
  }

  getCustomerProfile(customerId: string){
    return this.httpClient.get<CustomerProfileVO>(`${environment.baseUrl}/${this.endpoint}/getCustomerProfile/${customerId}`);
  }

  

  /**
   * Modification des informations de la fiche bénéficiaire.
   *
   * @param {CustomerView} item
   * @returns {Observable<CustomerView>}
   */
  updateFullCustomer(item: CustomerProfileVO): Observable<CustomerProfileVO> {
    return this.httpClient
      .put<CustomerProfileVO>(`${environment.baseUrl}/${this.endpoint}/full/${item.id}`, item);
  }
  

  autoCompleteClient(value: string, idNiche: number, status: string[], 
    companyCustomer: string, limit: boolean) : Observable<CustomerAutocomplete[]> {
    return this.httpClient
    .get<CustomerAutocomplete[]>
    (`${environment.baseUrl}/${this.endpoint}/autocompleteclient?value=${value}&idNiche=${idNiche}&status=${status}&companyCustomer=${companyCustomer}&limit=${limit}`);
  }

    /**
   *  récupérer la liste des référents
   */
  getAcquisitionsCanalsByCustomerId(id:string) : Observable<AcquisitionCanalVO[]> {
    return this.httpClient
    .get<AcquisitionCanalVO[]>(`${environment.baseUrl}/${this.endpoint}/listAcquisitionsCanal/${id}`);
  }

  saveAcquisitionCanalAndMembershipReason(canalMotifHomologation: CanalMotifHomologation): Observable<boolean> {
    return this.httpClient.post<boolean>(`${environment.baseUrl}/${this.endpoint}/saveAcquisitionCanalAndMembershipReason`, canalMotifHomologation);
  }

  getCustomerOfferStatus(id: string): Observable<string> {
    return this.httpClient.get<string>(`${environment.baseUrl}/${this.endpoint}/offre-status/${id}`);
  }
  
  

  saveCustomerProfile(customerProfileVO: CustomerProfileVO): Observable<CustomerProfileVO> {
    return this.httpClient.post<CustomerProfileVO>(`${environment.baseUrl}/${this.endpoint}/saveCustomerProfile`, customerProfileVO);
  }

  getApollonUrl(): Observable<string> {
    return this.httpClient
    .get<string>(`${environment.baseUrl}/${this.endpoint}/apollon-url`)
    .pipe(map((data: any) => data as string));
  }

  calculateNbrCustomerByStatusAndReferent(id: number): Observable<TotalsWallet[]> {
    return this.httpClient.get<TotalsWallet[]>(`${environment.baseUrl}/${this.endpoint}/totals-wallet?idReferent=${id}`);
  }
}