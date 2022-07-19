import { CustomerForClotureVO } from './../models/customer-for-cloture-vo';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

import { CustomerVO } from '../../_core/models/models';
import { HttpBaseService } from './http-base.service';
import { environment } from '../../../environments/environment';
import { MembrePerson } from '../../_core/models/membre-person';
import { Person } from '../../_core/models/person';
import { InfoClientDashboardsLight } from '../../_core/models/info-client-dashboards-light';
import { PersonNoteVo } from '../models/person-note';
import { InterlocutorVO } from '../../_core/models/interlocutor-vo';
import { CustomersLight } from '../models/customers_light';
import { BeneficiaryVO } from '../models/beneficiaryVO';
import { Interlocutor } from '../../_core/models/interlocutor/crud/interlocutor';
import { InfoCustomerHomologation } from '../models/info-customer-homologation-vo';
/**
 * Service pour gérer les customers
 */
@Injectable({
  providedIn: 'root'
})
export class PersonService extends HttpBaseService<CustomerVO> {
  /**
   * Cnstructeur
   * @param httpClient client http
   */
  constructor(httpClient: HttpClient) {
    super(httpClient, 'persons');
  }

  /**
   * rechercher les personnes et les produits 
   * @param pattern 
   * @param page 
   * @param size 
   */
  searchPersonsAndProducts(pattern: String): Observable<MembrePerson[]> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/searchPersonsAndProduits?pattern=${pattern}`)
      .pipe(map((data: any) => <MembrePerson[]>data));
  }

  /**
   *
   * @param pattern
   */
  getMembers(pattern: String): Observable<Person[]> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/getMembers?pattern=${pattern}`)
      .pipe(map((data: any) => <Person[]>data));
  }

  /**
   *
   * @param pattern
   */
  getNonMembers(pattern: String): Observable<Person[]> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/getNonMembers?pattern=${pattern}`)
      .pipe(map((data: any) => <Person[]>data));
  }

  /**
   *
   * @param pattern
   */
  getMembersAndNonMembers(pattern: String): Observable<Person[]> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/getMembersAndNonMembersByBillAccountPattern?pattern=${pattern}`)
      .pipe(map((data: any) => <Person[]>data));
  }

    /**
   *
   * @param pattern
   */
  getContacts(pattern: String): Observable<Person[]> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/getContactsNonMembres?pattern=${pattern}`)
      .pipe(map((data: any) => <Person[]>data));
  }
  
   /**
   *
   * @param pattern
   */
  getProspects(pattern: String): Observable<Person[]> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/searchProspects?pattern=${pattern}`)
      .pipe(map((data: any) => <Person[]>data));
  }

  /**
   *
   * @param pattern
   */
  getResilier(pattern: String): Observable<Person[]> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/getResilierNonMembres?pattern=${pattern}`)
      .pipe(map((data: any) => <Person[]>data));
  }
  
   /**
   * Permet de récuperer les interlocuteurs en se basant sur searchPattern
   * @param searchPattern
   * @returns Observable<Person[]
   */
  getInterlocutors(pattern: String): Observable<Person[]> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/getInterlocutors?searchPattern=${pattern}`)
      .pipe(map((data: any) => <Person[]>data));
  }
  
  /**
   * Permet de récuperer les interlocuteurs en se basant sur searchPattern
   * @param searchPattern
   * @returns Observable<Person[]
   */
  getInfoClient(id: string): Observable<InfoClientDashboardsLight> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/getinfoclient?customerId=${id}`)
      .pipe(map((data: any) => <InfoClientDashboardsLight>data));
  }

  getContactsIntrelocutors(idCustomer: string): Observable<InterlocutorVO> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/getCordonnes?customerId=${idCustomer}`)
      .pipe(map((data: any) => <InterlocutorVO>data));
  }

  /**
	 * qui permet de recupere la liste des contrats (nich , statut , offre) a partir de id 
	 * @param idCustomer
	 * @return
	 */
  getSeveralTitCustomersBy(idCustomer: string): Observable<CustomersLight[]> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/getalltitcustomerbyid?customerId=${idCustomer}`)
      .pipe(map((data: any) => <CustomersLight[]>data));
  }

   /**
   * Permet de récuperer les interlocuteurs en se basant sur customerId
   * @param customerId
   * @returns Observable<Person[]
   */
  getInterlocutorsRequest(customerId: string): Observable<Person[]> {
      return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/getInterlocutorsRequest?customerId=${customerId}`)
      .pipe(map((data: any) => <Person[]>data));
  }

   /**
   * Permet de récuperer les destinataires en se basant sur customerId
   * @param customerId
   * @returns Observable<BeneficiaryVO[]>
   */
    getRecipientsRequest(customerId: string): Observable<BeneficiaryVO[]> {
      return this.httpClient
      .get<BeneficiaryVO[]>(`${environment.baseUrl}/${this.endpoint}/getRecepientsForRequest?id=${customerId}`);
  }

  /**
   * permet de recupere les interlocutor 
   * @param idCustomer 
   */
  getPersonAndInterlocutorsByCustomerId(customerId: string): Observable<InterlocutorVO> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/getinterlocutorsbycustomerid?customerId=${customerId}`)
      .pipe(map((data: any) => <InterlocutorVO>data));
  }

  /**
   * permet valider de valider le moyen contact 
   * @param  idCm
   */
  validerCm(idCm: number): Observable<Boolean> {
    console.log(`${environment.baseUrl}/${this.endpoint}/validercm/${idCm}`, idCm);
    return this.httpClient
    .put(`${environment.baseUrl}/${this.endpoint}/validercm/${idCm}`, idCm)
    .pipe(map(data => <Boolean>data));
  }

  getDestinataires(id: string, isEntreprise: boolean): Observable<BeneficiaryVO[]> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/getdestinataire?id=${id}&isTitular=${isEntreprise}`)
      .pipe(map((data: any) => <BeneficiaryVO[]>data));
  }

  saveInterlocutor(interlocutor: Interlocutor): Observable<boolean> {
    return this.httpClient
    .post<boolean>(`${environment.baseUrl}/${this.endpoint}/saveinterlocutor` , interlocutor)
    .pipe(catchError(async (data) => false));

  }

  updateInterlocutor(interlocutor: Interlocutor): Observable<boolean> {
    return this.httpClient
    .post<boolean>(`${environment.baseUrl}/${this.endpoint}/updateinterlocutor` , interlocutor)
    .pipe(catchError(async (data) => false));

  }

  updateTitulaire(interlocutor: Interlocutor): Observable<boolean> {
    return this.httpClient
    .post<boolean>(`${environment.baseUrl}/${this.endpoint}/updatetitulaire` , interlocutor)
    .pipe(catchError(async (data) => false));

  }

  deleteInterlocutor(idPersonIntr: number, customerId: number): Observable<boolean> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/deleteInterlocutor?idPersonIntr=${idPersonIntr}&customerId=${customerId}`)
      .pipe(map((data: any) => data as boolean));
  }

  isAffectOtherInterlocutor(customerId: number, roleKey: string, personId: number): Observable<string> {
    return this.httpClient
    .get<string>(`${environment.baseUrl}/${this.endpoint}/isAffectOtherInterlocutor?customerId=${customerId}&roleKey=${roleKey}&personId=${personId}`)
    .pipe(map((data: any) => data as string));
  }

  getInfoCustomerForHomologation(customerId: string): Observable<InfoCustomerHomologation> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/getInfoCustomerForHomologation?customerId=${customerId}`)
      .pipe(map((data: any) => data as InfoCustomerHomologation));   
  } 

  getInfoCustomerForCloture(customerId: string): Observable<CustomerForClotureVO> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/customer-cloture/${customerId}`)
      .pipe(map((data: any) => data as CustomerForClotureVO));   
  } 

  getEntrepriseRecoveryDate(severalCustomerTitWithoutInactiveContract: string[]) {
    return this.httpClient
    .post<Date>(`${environment.baseUrl}/${this.endpoint}/entrepise-daterecovery` , severalCustomerTitWithoutInactiveContract);
  }

  getCompanyNameByCustomerIdAndRoleEntrepriseAndBenef(personId: number, customerId: string): Observable<string> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/getCompanyNameByCustomerIdAndRoleEntrepriseAndBenef?personId=${personId}&customerId=${customerId}`)
    .pipe(map((data: string) => (data)));
  }
  
  getTotalNumberOfRecouverement(customerId: string): Observable<number> {
    return this.httpClient.get<number>(`${environment.baseUrl}/${this.endpoint}/getTotalNumberOfRecouverement/${customerId}`);
  }

}
