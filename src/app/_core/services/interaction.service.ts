import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { HttpBaseService } from './http-base.service';
import { environment } from '../../../environments/environment';
import { ReferenceDataVO } from '../models/reference-data-vo';
import { InteractionReasonVO } from '../models/request/crud/interaction-reason';
import { InteractionLight } from '../models/interaction-vo';
import { MailInteractionVo } from '../models/mailInteractionVo';
import { CustomerInteractionVO } from '../models/request/crud/customer-interaction';
import { InteractionsSearchCriteria } from './../models/interactions-search-criteria';
import { PaginatedList } from '../models/paginated-list';
import { InteractionWallet } from '../models';

@Injectable({
  providedIn: 'root'
})
export class InteractionService extends HttpBaseService<ReferenceDataVO> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'interaction');
  }

  listUniversesForInteractionReasons(requestTypeId: Number, availability: string, isRendezVous: boolean): Observable<ReferenceDataVO[]> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/universesForInteractionReasons?` +
      `requestTypeId=${requestTypeId}&availability=${availability}&isRendezVous=${isRendezVous}`)
      .pipe(map((data: any) => <ReferenceDataVO[]>data));
  }

  listInteractionReasons(universId: Number, requestTypeId: Number, availability: string, 
    isRendezVous: boolean, isShowNotWithRequestType: boolean): Observable<InteractionReasonVO[]> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/listInteractionReasons?` +
      `universId=${universId}&requestTypeId=${requestTypeId}&availability=${availability}&isRendezVous=${isRendezVous}&isShowNotWithRequestType=${isShowNotWithRequestType}`)
      .pipe(map((data: any) => <InteractionReasonVO[]>data));
  }

  getInteractionReasons(): Observable<InteractionReasonVO[]> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/interaction-reasons`)
      .pipe(map((data: any) => <InteractionReasonVO[]>data));
  }
  /**
   * 
   * @param interactionId qui permet de recupere les details de l'interaction
   */
  getInteractionDetails(interactionId: Number): Observable<InteractionLight> {
    return this.httpClient
  .get<InteractionLight>(`${environment.baseUrl}/interaction/interactionDetails?interactionId=${interactionId}`);
  }

  getInteractionMailDetail(interactionId: Number): Observable<MailInteractionVo> {
    return this.httpClient
  .get<MailInteractionVo>(`${environment.baseUrl}/interaction/interactionMailDetails?interactionId=${interactionId}`);
  
  }
  
  /**
   * Enregister la customerInteraction
   *
   */

  saveCustomerInteraction(item: CustomerInteractionVO): Observable<CustomerInteractionVO> {
    return this.httpClient.
    post<CustomerInteractionVO>(`${environment.baseUrl}/${this.endpoint}/saveInteraction`, item);
  }

  /**
   * Interactions Monitoring search
   *
   * @param {InteractionsSearchCriteria} item
   * @returns {Observable<PaginatedList<InteractionsSearchCriteria>>}
   */
  interactionsHistoryByCustomerIdAndFilter(requestSearchCriteria: InteractionsSearchCriteria): 
  Observable<PaginatedList<InteractionLight>> {
    return this.httpClient.post<PaginatedList<InteractionLight>>(`${environment.baseUrl}/interaction/history`, requestSearchCriteria);
  }

  getInteraction(interactionId: number): Observable<CustomerInteractionVO> {
    return this.httpClient
  .get<CustomerInteractionVO>(`${environment.baseUrl}/interaction/${interactionId}`);
  }

  getInteractionsForWalletOfConnectedUser(userId: Number, statusCustomer:string): Observable<InteractionWallet[]> {
    return this.httpClient
  .get<InteractionWallet[]>(`${environment.baseUrl}/interaction/wallet?userId=${userId}&statusCustomer=${statusCustomer}`);
  }
}
