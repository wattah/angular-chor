import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserVo } from '../models/user-vo';
import { HttpBaseService } from './http-base.service';
import { RoleVO } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends HttpBaseService<RoleVO> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'roles');
  }
  // roles utilisant 
  getRolesByNiche(): Observable<RoleVO[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/getRolesbByNiche`)
    .pipe(map((data: any) => data as RoleVO[]));
  }

  getRolesNames(): Observable<string[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/name`)
    .pipe(map((data: any) => data as string[]));
  }

}
