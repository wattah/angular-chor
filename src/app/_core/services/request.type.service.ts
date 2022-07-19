import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { RequestTypeVO } from '../models/request-type-vo';
import { HttpBaseService } from './http-base.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestTypeService extends HttpBaseService<RequestTypeVO> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'request-type');
  }
  
  getActiveTypesRequest(): Observable<RequestTypeVO[]> {
    return this.httpClient.get<RequestTypeVO[]>(`${environment.baseUrl}/request-type/active`);
  }

  getReqTypeByTechnicalKey(techKey: string): Observable<RequestTypeVO> {
    return this.httpClient.get<RequestTypeVO>(`${environment.baseUrl}/request-type/byTechnicalKey?techKey=${techKey}`);
  }

  getAllRequestType(): Observable<RequestTypeVO[]> {
    return this.httpClient.get<RequestTypeVO[]>(`${environment.baseUrl}/request-type/all`);
  }
}
