import { Injectable } from '@angular/core';
import { RoleService } from './../services/role-service';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RolesNameResolver implements Resolve<Observable<string[]>> {
  constructor(private readonly roleService: RoleService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<string[]> {
    return this.roleService.getRolesNames();
  }
}
