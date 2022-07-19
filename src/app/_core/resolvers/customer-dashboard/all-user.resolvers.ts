import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UserVo } from '../../models/user-vo';
import { UserService } from '../../services/user-service';

@Injectable({
  providedIn: 'root'
})
export class AllUserResolver implements Resolve<Observable<UserVo[]>> {
  constructor(private userService: UserService) {
  }

  resolve(): Observable<UserVo[]> {
    return this.userService.getAllUserList()
      .pipe(catchError(() => of([])));
  }
}
