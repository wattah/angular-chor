import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UserVo } from '../../models/user-vo';
import { UserService } from '../../services/user-service';
import { GassiMockLoginService } from '../../services/gassi-mock-login.service';

@Injectable({
  providedIn: 'root'
})
export class UserConnectedResolver implements Resolve<Observable<UserVo>> {
  currentUserCuid: string;
  constructor(private userService: UserService, private gassiMockLoginService: GassiMockLoginService ) {
    this.currentUserCuid = this.gassiMockLoginService.getCurrentCUID().getValue();
  }

  resolve(): Observable<UserVo> {
    return this.userService.getUserByFTUID(this.currentUserCuid)
      .pipe(catchError(() => of(null)));   
  }
}
