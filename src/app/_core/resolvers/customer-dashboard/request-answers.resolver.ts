import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { isNullOrUndefined } from '../../utils/string-utils';
import { RequestAnswersVO } from '../../models';
import { RequestAnswersService } from '../../services/request-answers.service';

@ Injectable({
  providedIn: 'root'
})
export class RequestAnswersResolver implements Resolve<Observable<RequestAnswersVO[]>> {
  idRequest: string;
  constructor(private requestAnswersService: RequestAnswersService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<RequestAnswersVO[]> {
    this.idRequest = route.paramMap.get('idRequest');
    if (isNullOrUndefined(this.idRequest)) {
      this.idRequest = route.parent.paramMap.get('idRequest');
    }
    if (isNullOrUndefined(this.idRequest)) {
      this.idRequest = route.params['idRequest'];
    }
    return this.requestAnswersService.getRequestAnswers(Number(this.idRequest))
    .pipe(catchError(() => of(null)));
  }
}
