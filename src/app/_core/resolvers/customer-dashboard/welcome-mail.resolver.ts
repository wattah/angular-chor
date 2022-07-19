import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { WelcomeMailVO } from '../../models';
import { WelcomeMailService } from '../../../_core/services/welcome-mail.service';

@Injectable({
  providedIn: 'root'
})
export class WelcomeMailResolver implements Resolve<Observable<WelcomeMailVO>> {
  constructor(private readonly welcomeService: WelcomeMailService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<WelcomeMailVO> {
    const idRequest = route.paramMap.get('idRequest');
    return this.welcomeService.getWelcomeMail(idRequest).pipe(catchError( () => of(null)));
  }
}
