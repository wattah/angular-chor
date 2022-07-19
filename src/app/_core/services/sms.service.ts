import { MessageVO } from './../models/models.d';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { RequestTypeVO } from '../models/request-type-vo';
import { HttpBaseService } from './http-base.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SMSService extends HttpBaseService<MessageVO> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'request-type');
  }
 
  snedSMS(SMS: MessageVO): Observable<MessageVO> {
    return this.httpClient.post<MessageVO>(`${environment.baseUrl}/messages/sms` , SMS);
  }
}
