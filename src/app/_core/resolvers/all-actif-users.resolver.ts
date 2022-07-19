import { UserVo } from './../models/user-vo';
import { Injectable } from '@angular/core';
import { UserService } from './../services/user-service';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AllActifUsersResolver implements Resolve<Observable<UserVo[]>> {

  constructor(private readonly userSetvice: UserService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<UserVo[]> {
    return this.userSetvice.getActifUsers();
  }
}
