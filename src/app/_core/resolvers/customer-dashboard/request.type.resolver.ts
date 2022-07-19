import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RequestTypeService } from '../../services/request.type.service';
import { RequestTypeVO } from '../../models/request-type-vo';

@Injectable({
  providedIn: 'root'
})
export class RequestTypeResolver implements Resolve<Observable<RequestTypeVO>> {
  constructor(private requestTypeService: RequestTypeService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<RequestTypeVO> {
    const technicalKey = route.queryParamMap.get('technicalKey');
    console.log('technicalKey: ', technicalKey);
    return this.requestTypeService.getReqTypeByTechnicalKey(technicalKey)
    .pipe(catchError( () => of(null)));
  }
}
