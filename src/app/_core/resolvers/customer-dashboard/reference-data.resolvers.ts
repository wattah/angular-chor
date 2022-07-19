import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ReferenceDataService } from '../../services';
import { ReferenceData } from '../../models/reference-data';

@Injectable({
  providedIn: 'root'
})
export class ReferenceDataResolver implements Resolve<Observable<ReferenceData[]>> {
  constructor(private referenceDataService: ReferenceDataService) {
  }

  resolve(): Observable<ReferenceData[]> {
    return this.referenceDataService.getReferenceListByType('TASK_TYPOLOGY', 1)
      .pipe(catchError(() => of([])));
    
  }
}
