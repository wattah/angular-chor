import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ObjectContextVO } from '../../models/models';
import { MessageStylesService } from '../../services/message-styles.service';

@Injectable({
  providedIn: 'root'
})
  
  export class MessageStyleResolver implements Resolve<Observable<ObjectContextVO[]>> {
  customerId: string;
  requestTypeId: string;

  constructor(private messageStyleService: MessageStylesService) {
  }

  resolve(): Observable<ObjectContextVO[]> { 
    return this.messageStyleService.getListMessageStyle()
    .pipe( catchError( () => of(null)));
  }
}
