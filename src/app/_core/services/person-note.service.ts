import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

import { HttpBaseService } from './http-base.service';
import { environment } from '../../../environments/environment';
import { PersonNoteVo } from '../models/person-note';
/**
 * Service pour gérer les customers
 */
@Injectable({
  providedIn: 'root'
})
export class PersonNoteService extends HttpBaseService<PersonNoteVo> {
  /**
   * Cnstructeur
   * @param httpClient client http
   */
  constructor(httpClient: HttpClient) {
    super(httpClient, 'personnote');
  }

  /**
   * Permet de récuperer le bon à savoir en passant comme parametre le customerId
   * @param searchPattern
   * @returns Observable<Person[]
   */
  getGoodToKnow(customerId: string): Observable<PersonNoteVo> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/getgoodtoknow?customerId=${customerId}`)
      .pipe(map((data: any) => <PersonNoteVo>data));
  }

  /**
   * Permet de récuperer le bon à savoir en passant comme parametre le customerId
   * @param searchPattern
   * @returns Observable<Person[]
   */
  getInfoFacturation(customerId: string): Observable<PersonNoteVo> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/getinfofacturation?customerId=${customerId}`)
      .pipe(map((data: any) => <PersonNoteVo>data));
  }

  updateInfoNoteFacture(personIdNote: number, value: string, currentUserId: number ): Observable<boolean> {
    return this.httpClient.put<boolean>(`${environment.baseUrl}/${this.endpoint}/update/${personIdNote}?currentUserId=${currentUserId}`, value);
  }

  saveInfoNoteFacture(customerId: string, value: string, currentUserId: number  ): Observable<boolean> {
    return this.httpClient.put<boolean>(`${environment.baseUrl}/${this.endpoint}/save/${customerId}?currentUserId=${currentUserId}`, value);
  }

  updateInfoNoteGoodToKhow(personIdNote: number, value: string, currentUserId: number ): Observable<boolean> {
    return this.httpClient
    .put<boolean>(`${environment.baseUrl}/${this.endpoint}/updateGoodToKhow/${personIdNote}?currentUserId=${currentUserId}`, value)
    .pipe(map(data => data));
  }

  saveInfoNoteGoodToKhow(customerId: string, value: string, currentUserId: number ): Observable<boolean> {
    return this.httpClient
    .put<boolean>(`${environment.baseUrl}/${this.endpoint}/saveGoodToKhow/${customerId}?currentUserId=${currentUserId}`, value)
    .pipe(map(data => data));
  }
}
