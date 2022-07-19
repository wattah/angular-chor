import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RequestTypeService } from './../services/request.type.service';
import { RequestTypeVO } from './../models/request-type-vo';

@Injectable({
  providedIn: 'root'
})
export class AllRequestTypeResolver implements Resolve<Observable<RequestTypeVO[]>> {
  constructor(readonly requestTypeService: RequestTypeService) {
  }

  resolve(): Observable<RequestTypeVO[]> {
    
    return this.requestTypeService.getAllRequestType()
    .pipe(catchError(() => of([])));
  }
}
