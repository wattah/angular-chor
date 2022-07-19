import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { HttpBaseService } from './http-base.service';
import { RoleVO } from './../models/role-vo';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends HttpBaseService<RoleVO> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'roles');
  }
  
  findRolesByIdNiche(nicheId: number): Observable<RoleVO[]> {
    return this.httpClient.get<RoleVO[]>(`${environment.baseUrl}/roles/all?nicheId=${nicheId}`);
  }
}
