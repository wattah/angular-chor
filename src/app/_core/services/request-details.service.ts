
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base.service';
import { Observable } from 'rxjs';
import { RequestCustomerVO } from '../models/request-customer-vo';
import { environment } from 'src/environments/environment';

@ Injectable({
  providedIn: 'root'
})
export class RequestDetailsService extends HttpBaseService<RequestCustomerVO> {

    /**
   * Cnstructeur
   * @param httpClient client http
   */
  constructor(httpClient: HttpClient) {
    super(httpClient, 'requests');
  }
 
  getDetailsByRquestId(id: Number): Observable<RequestCustomerVO> {
    return this.httpClient
    .get<RequestCustomerVO>(`${environment.baseUrl}/requests/detail/${id}`);

  }
/*
  getRequestByRequestId(requestId: number): Observable<RequestVO> {
    return this.httpClient
    .get<RequestVO>(`${environment.baseUrl}/requests/detail/${requestId}`);

  }
*/
  /**
   * qui permet de re-ouvrir une demande
   * @param id 
   */
  reOpenRequest(idRequest: number): Observable<RequestCustomerVO> {
    return this.httpClient
    .get<RequestCustomerVO>(`${environment.baseUrl}/requests/reOpenRequest?idRequest=${idRequest}`)
   
  }


  /**
   * qui permet de recupere les ids by Contrat
   * @param id 
   */
  getIdsRequestByIdCustomer(id: string, selectedStatusList: String[], selectedTypesList:Number[], isEntreprise : boolean)
  : Observable<Number[]> {
    let url = environment.baseUrl + '/requests/getidsrequestbyidcontrat?id=' + id;
    if ( selectedStatusList && selectedStatusList !== null && selectedStatusList.length >0 ) {
      selectedStatusList.forEach( s => url += '&status=' + s);
    } else {
      url += '&status=';
    }

    if ( selectedTypesList && selectedTypesList !== null && selectedTypesList.length >0) {
      selectedTypesList.forEach( tr => url += '&requestTypes=' + Number(tr));
    } else {
      url += '&requestTypes=';
    }
    url += `&isEntreprise=${isEntreprise} `
    return this .httpClient.get<Number[]>(url);
  }

  /**
   * qui permet de switcher le next de la demande 
   * @param id 
   */
  getPreviousOrNextRequestId(next: Boolean, id: Number, idCustomer: string, idRequestNavigated : Number,selectedStatusList:string[],
    selectedTypesList:Number[], isEntreprise:boolean ): Observable<RequestCustomerVO> {
    let url = environment.baseUrl + '/requests/getPreviousOrNextRequestId?next=' + next +'&id='+id+ '&idCustomer='+idCustomer+ 
    '&idRequestWanted='+idRequestNavigated;
    if ( selectedStatusList && selectedStatusList !== null && selectedStatusList.length >0) {
      selectedStatusList.forEach( s => url += '&status=' + s);
    } else {
      url += '&status=';
    }

    if (selectedTypesList && selectedTypesList !== null && selectedTypesList.length >0) {
      selectedTypesList.forEach( tr => url += '&requestTypes=' + Number(tr));
    } else {
      url += '&requestTypes=';
    }
    url += `&isEntreprise=${isEntreprise} `
    return this.httpClient.get<RequestCustomerVO>(url);
  }
  
    getLightDetailByIdRequest(id: number): Observable<RequestCustomerVO> {
    return this.httpClient
    .get<RequestCustomerVO>(`${environment.baseUrl}/requests/light-detail?id=${id}`);
  }
}
