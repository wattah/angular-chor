import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ReferenceDataService } from '../services/reference-data.service';
import { ReferenceDataVO } from '../models';

@Injectable({
  providedIn: 'root'
})
 export class ModaliteDataResolver implements Resolve<Observable<ReferenceDataVO[]>> {

  constructor(private readonly referencesDataService: ReferenceDataService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<ReferenceDataVO[]> {
    return this.referencesDataService.getReferencesData('INTERVENTION_MODALITY');
  }

}
