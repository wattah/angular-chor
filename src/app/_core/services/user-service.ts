import { MyNicheVO } from './../models/models';
import { UserVo } from '../models/user-vo';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { HttpBaseService } from './http-base.service';
import { AbsenceLight } from '../models/absence-light';

@Injectable({
  providedIn: 'root'
})
export class UserService extends HttpBaseService<UserVo> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'users');
  }
  // Actifs and useCorniche and role!== exploitant
  getUsersByNiche(withFilter: boolean): Observable<UserVo[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/getuserbyniche?withFilter=${withFilter}`)
    .pipe(map((data: any) => <UserVo[]>data));
  }

  // utilisateurs qui ont déjà créés une interaction
  getAllUserList(): Observable<UserVo[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/list-creator-interaction`)
    .pipe(map((data: any) => <UserVo[]>data));
  }

  getBuildVersion(): Observable<string> {
    return this.httpClient
    .get<string>(`${environment.baseUrl}/${this.endpoint}/getBuildVersion`)
    .pipe(map((data: any) => <string>data));
  }

  getUserByFTUID(cuid: string): Observable<UserVo> {
    return this.httpClient
    .get<UserVo>(`${environment.baseUrl}/${this.endpoint}/userbycuid/${cuid}`)
    .pipe(map((data: any) => <UserVo>data));
  }

  getUserByRole(role: string): Observable<any> {
    return this.httpClient
    .get<any>(`${environment.baseUrl}/${this.endpoint}/${role}`)
    .pipe(map((data: any) => data));
  }

  usersByRole(roleName: string, nicheId: number): Observable<UserVo[]> {
    return this.httpClient
    .get<UserVo>(`${environment.baseUrl}/${this.endpoint}/usersByRole?roleName=${roleName}&nicheId=${nicheId}`)
    .pipe(map((data: any) => <UserVo[]>data));
  }

  getUsersByIdRole(roleId: number): Observable<UserVo[]> {
    return this.httpClient
    .get<UserVo>(`${environment.baseUrl}/${this.endpoint}/usersByIdRole?roleId=${roleId}`)
    .pipe(map((data: any) => data as UserVo[]));
  }

  getUsersByRoleList(roles: number[]): Observable<UserVo[]> {
    return this.httpClient
    .post<UserVo[]>(`${environment.baseUrl}/${this.endpoint}/usersByRoleList`, roles);
  }
  
  getUserBackup(userId: number): Observable<AbsenceLight> {
    return this.httpClient
    .get<UserVo>(`${environment.baseUrl}/${this.endpoint}/userBakeup?userId=${userId}`)
    .pipe(map((data: any) => data as AbsenceLight));
  }

  getUsers(): Observable<UserVo[]> {
    return this.httpClient
    .get<UserVo>(`${environment.baseUrl}/${this.endpoint}/all`)
    .pipe(map((data: any) => data as UserVo[]));
  }

  getActifUsers(): Observable<UserVo[]> {
    return this.httpClient
    .get<UserVo>(`${environment.baseUrl}/${this.endpoint}/allActifUsers`)
    .pipe(map((data: any) => data as UserVo[]));
  }

  getNicheByUserId(userId: number): Observable<MyNicheVO[]> {
    return this.httpClient
    .get<MyNicheVO[]>(`${environment.baseUrl}/${this.endpoint}/niche/${userId}`)
    .pipe(map((data: any) => data as MyNicheVO[]));
  }

  getUsersActifByIdRole(roleName: string, nicheId: number): Observable<UserVo[]> {
    return this.httpClient
    .get<UserVo>(`${environment.baseUrl}/${this.endpoint}/getUsersActifByIdRole?roleName=${roleName}&nicheId=${nicheId}`)
    .pipe(map((data: any) => data as UserVo[]));
  }

  // Actifs and useCorniche and role!== exploitant and role = tech et resp tech
  getUsersTechByNiche(): Observable<UserVo[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/getuserstechbyniche`)
    .pipe(map((data: any) => data as UserVo[]));
  }

   // Actifs and useCorniche and role!== exploitant and role = tech et resp tech
   getUsersHorsTechByNiche(): Observable<UserVo[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}/getusershorstechbyniche`)
    .pipe(map((data: any) => data as UserVo[]));
  }

  getUserVoById(id: number): Observable<UserVo> {
    return this.httpClient
    .get<UserVo>(`${environment.baseUrl}/${this.endpoint}/userbyId/${id}`)
    .pipe(map((data: any) => data as UserVo));
  }

  changeCurrentRole(roleId: number , userId: number){
    return this.httpClient.get(`${environment.baseUrl}/${this.endpoint}/changeRole/${roleId}/${userId}`);
  }
}
