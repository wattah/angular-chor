import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { HttpBaseService } from './http-base.service';
import { ApplicationUserVO } from '../models/application-user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GassiMockLoginService extends HttpBaseService<ApplicationUserVO> {

  private currentCUID$ = new BehaviorSubject('');
  private currentUserId$ : BehaviorSubject<number> = new BehaviorSubject(0);
  private readonly currentConnectedUser$ : BehaviorSubject<ApplicationUserVO> = new BehaviorSubject({} as ApplicationUserVO);
  private readonly jiraUrl$ : BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(httpClient: HttpClient) {
    super(httpClient, 'authegassi');
    this.jiraUrl$.next(`${environment.urlJira}`);
  }
  isMockLogin(): Observable<ApplicationUserVO> {
    return this.httpClient
    .get<ApplicationUserVO>(`${environment.baseUrl}/${this.endpoint}/userconnectegassi`)
    .pipe(map((data: any) => <ApplicationUserVO>data));
  }

  isMockLoginTest(): Observable<string> {
    return this.httpClient
    .get<string>(`${environment.baseUrl}/${this.endpoint}/userconnectegassitest`)
    .pipe(map((data: any) => <string>data));
  }

  setCurrentCUID( cuid: string): void {
    this.currentCUID$.next(cuid);
  }
  
  getCurrentCUID(): BehaviorSubject<string> {
    return this.currentCUID$;
  }

  setCurrentConnectedUserId( user: ApplicationUserVO): void {
    this.currentConnectedUser$.next(user);
  }

  getCurrentConnectedUser(): BehaviorSubject<ApplicationUserVO> {
    return this.currentConnectedUser$;
  }

  setCurrentUserId( currentUserId: number): void {
    this.currentUserId$.next(currentUserId);
  }
  
  getCurrentUserId(): BehaviorSubject<number> {
    return this.currentUserId$;
  }

  setJiraUrl(url: string) {
    this.jiraUrl$.next(url);
  }

  getJiraUrl() {
    return this.jiraUrl$;
  }

}