import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckBrowserVersionGuard implements CanActivate {

  constructor(private translate: TranslateService) {

  }
  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    const ua = navigator.userAgent;
    let version = '';
    if ((ua.indexOf('Firefox')) >= 0) {
      version = ua.match(/Firefox\/([0-9]+(?:\.[0-9]+)*)/)[1];
      if (Number(version) < 52.0) {
        this.translate.get('Page.HomeComponent.alertVersionFireFox').subscribe((res: string) => {
          alert(res);
        });
      }
    }
    return true;
  }
}
