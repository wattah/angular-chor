import { PostalAdresseVO } from './../models/postalAdresseVO';
import { DestinataireVO } from './../models/destinataireVO';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { HttpBaseService } from './http-base.service';
import { InterlocutorVO } from '../models/interlocutor-vo';
import { CmInterlocutorVO } from '../models/cm-Interlocutor-vo';
import { CmUsageVO } from '../models/cm-usage-vo';
import { Interlocutor } from '../models/interlocutor/crud/interlocutor';
import { CmPostalAddressVO } from '../models/cm-postaladdress-vo';
import { ContactMethodVO } from '../models/models';
import { ContactMethodNew } from '../models/interlocutor/crud/contact-methode-new';

@Injectable({
  providedIn: 'root'
})
export class ContactMethodService extends HttpBaseService<InterlocutorVO> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'contacts');
  }
  
  getListDestinataireForMail(customerId: string, isEntreprise: boolean): Observable<InterlocutorVO[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/getListDestinataireForMail?customerId=${customerId}&isEntreprise=${isEntreprise}`)
    .pipe(map((data: any) => <InterlocutorVO[]>data));
  }

  getListDestinataireForSMS(customerId: string, isEntreprise: boolean): Observable<DestinataireVO[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/sms/destinataires/${customerId}/${isEntreprise}`)
    .pipe(map((data: any) => <DestinataireVO[]>data));
  }

  getContactMethods(customerId: string): Observable<CmInterlocutorVO[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/getContactMethods/${customerId}`)
    .pipe(map((data: any) => <CmInterlocutorVO[]>data));
  }

  getListPostalAddress(personId: number){
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/postal-adresse/${personId}`)
    .pipe(map((data: any) => data as PostalAdresseVO[]));
  }

  getLastPostalAddressTemporaire(personId: number){
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/getLastPostalAddressTemporaire/${personId}`)
    .pipe(map((data: any) => data as PostalAdresseVO));
  }

  getUsagesByCustomerId(customerId: string): Observable<CmUsageVO[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/usages?customerId=${customerId}`)
    .pipe(map((data: any) => (data as CmUsageVO[])));
  }

  getAddressById(addressId : number): Observable<PostalAdresseVO> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/postal-adresses/${addressId}`)
    .pipe(map((data: any) => (data as PostalAdresseVO)));
  }
  
   getUsagesTypesCreatedForCustomerId(customerId: string): Observable<string[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/usagesTypesCreated/${customerId}`)
    .pipe(map((data: any) => (data as string[])));
  }

  getContactMethodsByRefMedia(personId: number, refMedia: string): Observable<CmInterlocutorVO[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/getContactMethodsByRefMedia/${personId}/${refMedia}`)
    .pipe(map((data: any) => (data as CmInterlocutorVO[])));
  }

  getphoneNumberByPersonId(personId: number): Observable<ContactMethodVO[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/listphoneNumbers?personId=${personId}`)
    .pipe(map((data: any) => (data as ContactMethodVO[])));
  }
  getphoneNumberNewByPersonId(personId: number): Observable<ContactMethodVO[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/listPhoneNumberNew?personId=${personId}`)
    .pipe(map((data: any) => (data as ContactMethodVO[])));
  }

  
  getUsageByCustomerIdAndRefKey(customerId: string, refKey: string): Observable<CmUsageVO[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/getUsageByCustomerIdAndRefKey/${customerId}/${refKey}`)
    .pipe(map((data: any) => (data as CmUsageVO[])));
  }

  saveUsages(customerId: string, usageRefKey: string, item: CmUsageVO[]): Observable<boolean> {
    return this.httpClient.post<boolean>(`${environment.baseUrl}/${this.endpoint}/saveUsages/${customerId}/${usageRefKey}`, item);
  }


  findInterlocutorByPersonId(personId: number, customerId: number): Observable<Interlocutor> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/findinterlocutorbypersonId/${personId}/${customerId}`)
    .pipe(map((data: any) => (data as Interlocutor)));
  }


  deleteContactMethodById(ids: number[]): Observable< boolean> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/deleteContactMethodById?ids=${ids}`)
    .pipe(map((data: any) => (data as boolean)));
    }

    addAddress(item: CmPostalAddressVO): Observable<PostalAdresseVO> {
      return this.httpClient
        .post<PostalAdresseVO>(`${environment.baseUrl}/${this.endpoint}/addAddress`, item)
        .pipe(map((data: any) => data as PostalAdresseVO));
    }

  getUsageByCustomerIdAndRefKeyAndMedia(customerId: string, usageRefKey: string, mediaRefKey: string): Observable<CmUsageVO> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/usage?customerId=${customerId}` +
      `&usageRefKey=${usageRefKey}&mediaRefKey=${mediaRefKey}`)
      .pipe(map((data: any) => (data as CmUsageVO)));
  }

  useCmInPeniche(cmId: number): Observable<boolean> {
    return this.httpClient.put<boolean>(`${environment.baseUrl}/${this.endpoint}/useCmInPeniche/${cmId}`, null);
  }

  /**
   * permet de recuperer les moyens contact a partir customerId et refMedia
   * @param customerId
   * @param refMedia
   * @returns
   */
  getContactMethodsByCustomerIdAndRefMedia(customerId: number, refMedia: string): Observable<InterlocutorVO[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/getContactMethodsByCustomerIdAndRefMedia/${customerId}/${refMedia}`)
    .pipe(map((data: any) => (data as InterlocutorVO[])));
  }

  saveMailTemporary(customerId: string, item: ContactMethodNew): Observable<InterlocutorVO> {
    return this.httpClient.post<InterlocutorVO>(`${environment.baseUrl}/${this.endpoint}/saveMailTemporary/${customerId}`, item);
  }

}
