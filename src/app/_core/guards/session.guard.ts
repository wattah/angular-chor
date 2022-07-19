import { RedirectionService } from './../services/redirection.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SessionGuard implements CanActivate {
  constructor(private readonly redirectionService: RedirectionService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.redirectionService.getLogout()) {
      return true;
    }
    window.location.href = `/`;
    return false;
  }
}
