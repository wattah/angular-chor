import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ReferenceDataVO } from '../../models/reference-data-vo';
import { ReferenceDataService } from '../../services/reference-data.service';

@Injectable({
  providedIn: 'root'
})
 export class StoreDataResolver implements Resolve<Observable<ReferenceDataVO[]>> {

  typeData: string;

  constructor(private readonly referencesDataService: ReferenceDataService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<ReferenceDataVO[]> {
    return this.referencesDataService.getReferencesData('STORE');
  }

}
