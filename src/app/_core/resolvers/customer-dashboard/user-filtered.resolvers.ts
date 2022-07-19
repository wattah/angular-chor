import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UserVo } from '../../models/user-vo';
import { UserService } from '../../services/user-service';

@Injectable({
  providedIn: 'root'
})
export class UserFilteredResolver implements Resolve<Observable<UserVo[]>> {
  constructor(readonly userService: UserService) {
  }

  resolve(): Observable<UserVo[]> {
    return this.userService.getUsersByNiche(true)
      .pipe(catchError(() => of([])));
    
  }
}
