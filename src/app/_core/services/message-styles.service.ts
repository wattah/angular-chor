import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { HttpBaseService } from './http-base.service';
import { ObjectContextVO } from '../models/models';
@Injectable({
  providedIn: 'root'
})
export class MessageStylesService extends HttpBaseService<ObjectContextVO> {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'messages');
  }

  getListMessageStyle(): Observable<ObjectContextVO[]> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/messagestyles`)
      .pipe(map((data: any) => <ObjectContextVO[]>data));
  }
}
