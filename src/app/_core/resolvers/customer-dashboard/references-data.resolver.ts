import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ReferenceDataVO } from '../../models/reference-data-vo';
import { ReferenceDataService } from '../../services/reference-data.service';

@Injectable({
  providedIn: 'root'
})
 export class ReferencesDataResolver implements Resolve<Observable<ReferenceDataVO[]>> {

  typeData: string;

  constructor(private referencesDataService: ReferenceDataService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<ReferenceDataVO[]> {
    this.typeData = route.paramMap.get('typeData');
    if (!this.typeData) {
      this.typeData = route.data.typeData;
    }
    if(this.typeData === null || this.typeData===undefined) {
      this.typeData = 'LINE_ORIGIN';
    }
    return this.referencesDataService.getReferencesData(this.typeData);
  }

}
