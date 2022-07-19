import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { HttpBaseService } from './http-base.service';
import { RequestAnswersVO } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class RequestAnswersService extends HttpBaseService<RequestAnswersVO> {

  /**
   * Cnstructeur
   * @param httpClient client http
   */
  constructor(httpClient: HttpClient) {
    super(httpClient, 'requests');
  }

  /**
   * Récupère les réponses liées à une demande
   * @param idRequest
   */
  
  getRequestAnswers(idRequest: Number): Observable< RequestAnswersVO[]> {
    return this .httpClient
    .get< RequestAnswersVO[]>(`${environment.baseUrl}/requests/getrequestsanswers?idRequest=${idRequest}`);
  }
}
