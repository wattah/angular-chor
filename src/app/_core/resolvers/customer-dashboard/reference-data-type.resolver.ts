import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ReferenceDataTypeService } from '../../services/reference-data-type.service';
import { ReferenceDataVO } from '../../models/reference-data-vo';

@Injectable({
  providedIn: 'root'
})
export class ReferenceDataTypeResolver implements Resolve<Observable<ReferenceDataVO[]>> {
  constructor(private referenceDataTypeService: ReferenceDataTypeService) {
  }

  resolve(router: ActivatedRouteSnapshot): Observable<ReferenceDataVO[]> {
    const typeData = String(router.data['typeData']);

    return this.referenceDataTypeService.getReferenceDatasByType(typeData)
      .pipe(catchError(() => of([])));
  }
}
