import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { HttpBaseService } from './http-base.service';
import { TypeDocument } from '../../_core/models/Type-Document';

@Injectable({
  providedIn: 'root'
})
export class TypeDocumentService extends HttpBaseService<TypeDocument> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'documents');
  }
  getDocumentsTypeDocs(): Observable<TypeDocument[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/alltypedocuments`)
    .pipe(map((data: any) => <TypeDocument[]>data));
  }
}
