import { MessageVO } from './../models/models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { HttpBaseService } from './http-base.service';
import { environment } from '../../../environments/environment';
import { MessageMailVo } from '../models/message-mail-vo';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends HttpBaseService<MessageVO> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'messages');
  }
 
  sendMessage(message: MessageMailVo): Observable<any> {
    return this.httpClient.post<any>(`${environment.baseUrl}/${this.endpoint}/savemessage` ,  message);
  }
}
