import { PaginatedList } from './../models/paginated-list';
import { RequestSearchCriteria } from './../models/request-search-criteria';
import { RequestVO as RequestMonitoring } from './../models/models.d';
import { RequestCustomerVO } from '../../_core/models/request-customer-vo';
import { RequestVO } from '../models/request/crud/request';
import { CustomerInteractionVO } from '../models/request/crud/customer-interaction';
import { HttpBaseService } from './http-base.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, empty } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { RequestStatut } from '../enum/request-statut.enum';
import { CartSavVO } from '../models/models';
import { RequestAnswersVO } from '../models/request-answers-vo';

const REQUEST_TYPES_PARAM = '&requestTypes=';

/**
 * Servuce pour gérer les customers
 */
@ Injectable({
    providedIn: 'root'
  })
export class RequestService extends HttpBaseService< RequestCustomerVO> {

/**
   * Cnstructeur
   * @param httpClient client http
   */
  constructor(httpClient: HttpClient) {
    super(httpClient, 'requests');
  }
  /**
   * Récupère les demandes et les taches associées à un client
   * @param id customerId
   */
  
  getRequestCustomer(id: string, isEntreprise: boolean): Observable< RequestCustomerVO[]> {
    return this .httpClient
    .get< RequestCustomerVO[]>(`${environment.baseUrl}/requests/requestsCustomer?customerId=${id}&isEntreprise=${isEntreprise}`)

  }

  getRequestsForCreationInteraction(id: string, isEntreprise: boolean): Observable< RequestCustomerVO[]> {
    return this .httpClient
    .get< RequestCustomerVO[]>(`${environment.baseUrl}/requests/getrequestsforcreationinteraction?customerId=${id}&isEntreprise=${isEntreprise}`)

  }

  getRequestsByFilters(id: string , statuts: RequestStatut[], requestTypes: number[], 
    isEntreprise: boolean): Observable< RequestCustomerVO[]> {
    let url = environment.baseUrl + '/requests/requestsByFilters?customerId=' + id;
    if ( statuts !== null) {
      statuts.forEach( s => url += '&status=' + s);
    } else {
      url += '&status=';
    }

    if ( requestTypes !== null) {
      requestTypes.forEach( tr => url += REQUEST_TYPES_PARAM + tr);
    } else {
      url += REQUEST_TYPES_PARAM;
    }
    url += `&isEntreprise=${isEntreprise} `
    return this .httpClient.get< RequestCustomerVO[]>(url);
  }

  getIdRequestRecouvrementByIdCustomerLessTwelveMouth(id: string): Observable< Number> {
    return this.httpClient
    .get<Number>(`${environment.baseUrl}/requests/getidrequestrecouvrementtwelvemounth?customerId=${id}`);

  }

  getIdRequestSavByIdCustomerLessTwelveMouth(id: string): Observable<Number> {
    return this.httpClient
    .get<Number>(`${environment.baseUrl}/requests/getidrequestsavtwelvemounth?customerId=${id}`);

  }

  getIdRequestSavHomeByIdCustomerLessTwelveMouth(id: string): Observable<Number> {
    return this.httpClient
    .get<Number>(`${environment.baseUrl}/requests/getidrequestsavhometwelvemounth?customerId=${id}`);
  }

    /**
   * Enregister la requete
   *
   * @param {RequestVO} item
   * @returns {Observable<RequestVO>}
   */
  saveRequest(item: RequestVO): Observable<RequestVO> {
    return this.httpClient.post<RequestVO>(`${environment.baseUrl}/requests/createRequest`, item);
  }

  /**
   * Enregister la requete
   *
   * @param {RequestVO} item
   * @returns {Observable<RequestVO>}
   */
  updateRequest(item: RequestVO): Observable<RequestVO> {
    return this.httpClient.post<RequestVO>(`${environment.baseUrl}/requests/updateRequest`, item);
  }

  /**
   * Enregister la customerInteraction
   *
   * @param {CustomerInteractionVO} item
   * @returns {Observable<CustomerInteractionVO>}
   */
  saveCustomerInteraction(item: CustomerInteractionVO): Observable<CustomerInteractionVO> {
    return this.httpClient.post<CustomerInteractionVO>(`${environment.baseUrl}/requests/createCustomerInteraction`, item);
  }

  /**
   * 
   * @param id qui permet de recupere la demande pour la modifier
   */
  getRequestForUpdate(id: Number): Observable<RequestVO> {
    return this.httpClient
    .get<RequestVO>(`${environment.baseUrl}/requests/getrequestforupdate?id=${id}`);

  }

  clotureRequest(request: RequestVO): Observable<RequestVO> {
    return this.httpClient
    .post<RequestVO>(`${environment.baseUrl}/requests/cloture` , request)
    .pipe(catchError(data=> empty()));

  }

  saveRequestAnswers(idRequest : number, answers : Array<RequestAnswersVO>): Observable<any>{
    return this.httpClient.post<any>(`${environment.baseUrl}/${this.endpoint}/saveRequestAnswers?idRequest=${idRequest}`, answers);
  }

   /**
   * Requests Monitoring search
   *
   * @param {RequestSearchCriteria} item
   * @returns {Observable<PaginatedList<RequestMonitoring>>}
   */
  requestsMonitoring(requestSearchCriteria: RequestSearchCriteria): Observable<PaginatedList<RequestMonitoring>> {
    return this.httpClient.post<PaginatedList<RequestMonitoring>>(`${environment.baseUrl}/requests/monitoring`, requestSearchCriteria);
  }
  
  getOpenRequestsByTypeRequestAndCustomeId( idCustomer: string , requestType: string, 
    isEntreprise: boolean): Observable< RequestCustomerVO[]> {
    let url = `${environment.baseUrl}/${this.endpoint}/open-requests`;
    url += `?customerId=${idCustomer}&requestType=${requestType}&isEntreprise=${isEntreprise}`;
    return this .httpClient.get< RequestCustomerVO[]>(url);
  }

  /**
   * Traier les factures à récupérer et à vérifier
   *
   * @param {RequestSearchCriteria} item
   * @returns {Observable<PaginatedList<RequestMonitoring>>}
   */
  traiterFactures(trigrammeNiche: string, customerId: string, status: string, addBillReport: boolean, 
    userId: number, selectedRole: string): Observable<string> {

    return this.httpClient.get<string>(`${environment.baseUrl}/${this.endpoint}/traiterFactures?`+
    `trigrammeNiche=${trigrammeNiche}&customerId=${customerId}&status=${status}&addBillReport=${addBillReport}&userId=${userId}&selectedRole=${selectedRole}`);
  }

  /**
   * Récupère les demandes et les taches associées à un client
   * @param id customerId
   */
  
  getCartSavByRequest(idRequest: number): Observable<CartSavVO> {
    return this.httpClient
    .get<CartSavVO>(`${environment.baseUrl}/requests/getCartSav?idRequest=${idRequest}`);

  }

  getPaginatedListRequestsByFilters(id: string , statuts: RequestStatut[], requestTypes: number[], 
    isEntreprise: boolean, page: number, pageSize: number, sortField: string, sortOrder: string): Observable<PaginatedList<RequestCustomerVO>> {
    let url = `${environment.baseUrl}/requests/getPaginatedListRequestsByFilters?customerId=${id}`;
  
    if ( statuts !== null) {
      statuts.forEach( s => url += `&status=${s}`);
    } else {
      url += '&status=';
    }

    if ( requestTypes !== null) {
      requestTypes.forEach( tr => url += `&requestTypes=${tr}`);
    } else {
      url += REQUEST_TYPES_PARAM;
    }
    url += `&isEntreprise=${isEntreprise}&page=${page}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder} `
    return this .httpClient.get<PaginatedList<RequestCustomerVO>>(url);
  }
  
}
