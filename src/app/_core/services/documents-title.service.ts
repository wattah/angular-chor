import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { DocumentTitleVO } from '../models/models';
import { HttpBaseService } from './http-base.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentsTitleService extends HttpBaseService<DocumentTitleVO> {

  constructor(httpClient: HttpClient) { 
    super(httpClient, 'documents');
  }

  getAllTitleDocs(): Observable<DocumentTitleVO[]> {
    return this.httpClient.get<DocumentTitleVO[]>(`${environment.baseUrl}/${this.endpoint}/alltitledocuments`);
  }

  getSuggestionsOfTitles(targetId: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`${environment.baseUrl}/${this.endpoint}/titles?targetId=${targetId}`);
  }

}
