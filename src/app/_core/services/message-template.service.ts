import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// tslint:disable-next-line: origin-ordered-imports
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageTemplateLightVO } from '../models/models';
import { HttpBaseService } from './http-base.service';
import { map } from 'rxjs/operators';
import { ParamVo } from '../models/param-vo';

@Injectable({
  providedIn: 'root'
})
export class MessageTemplateService extends HttpBaseService<MessageTemplateLightVO> {

  /**
   * Constructeur
   * @param httpClient client http
   */
  constructor(httpClient: HttpClient) {
    super(httpClient, 'messages');
  }

  /**
   * rechercher les modèles des messages 
   * @param requestTypeId 
   * @param category 
   * @param customerId 
   */
  getListFormatedMessage(requestTypeId: number, category: string, language: string, customerId: string): Observable<MessageTemplateLightVO[]> {
    return this.httpClient
      // tslint:disable-next-line: max-line-length
      .get(`${environment.baseUrl}/${this.endpoint}/getlistformatedmessage?requestTypeId=${requestTypeId}&category=${category}&language=${language}&customerId=${customerId}`)
      .pipe(map((data: any) => data as MessageTemplateLightVO[]));
  }

  getFormatedMessage(messageTemplateId: number, customerId: string, userId: number): Observable<MessageTemplateLightVO> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/getFormatedMessage?messageTemplateId=${messageTemplateId}&customerId=${customerId}&userId=${userId}`)
      .pipe(map((data: any) => <MessageTemplateLightVO>data));
  }
}
