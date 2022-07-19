import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { PersonNoteVo } from '../../models/person-note';
import { PersonNoteService } from '../../services/person-note.service';

@Injectable({
  providedIn: 'root'
})
export class InfoNoteFacturationResolver implements Resolve<Observable<PersonNoteVo>> {
  customerId: string;
  constructor(private personNoteService: PersonNoteService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<PersonNoteVo> {
    this.customerId = route.paramMap.get('customerId');
    return this.personNoteService.getInfoFacturation(this.customerId)
    .pipe(catchError(() => of(null)));
  }
}
