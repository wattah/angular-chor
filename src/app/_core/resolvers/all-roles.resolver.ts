import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RoleService } from './../services/role.service';
import { RoleVO } from './../models/role-vo';

@ Injectable({
  providedIn: 'root'
})
export class AllRolesResolver implements Resolve<Observable<RoleVO[]>> {

  constructor(readonly roleService: RoleService) {
  }

  resolve(): Observable<RoleVO[]> {  
    return this.roleService.findRolesByIdNiche(1)
    .pipe(catchError(() => of(null)));
  }
}
