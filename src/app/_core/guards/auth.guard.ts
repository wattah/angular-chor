import { isNullOrUndefined } from '../utils/string-utils';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor() {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = sessionStorage.getItem('token');
    if (!isNullOrUndefined(token)) {
      return true;
    }
    window.location.href = `${environment.accessNotAuthenticatedRedirectUrl}`;
    return false;
  }
}
