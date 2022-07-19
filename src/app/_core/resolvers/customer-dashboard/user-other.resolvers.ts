import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UserVo } from '../../models/user-vo';
import { UserService } from '../../services/user-service';

@Injectable({
  providedIn: 'root'
})
export class UserOtherResolver implements Resolve<Observable<UserVo[]>> {
  constructor(private readonly  userService: UserService) {
  }

  resolve(): Observable<UserVo[]> {
    return this.userService.getUsersHorsTechByNiche()
      .pipe(catchError(() => of([])));
    
  }
}
