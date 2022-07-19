import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HomologationService } from '../services/homologation.service';
import { HomologationVO } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HomologationResolver implements Resolve<Observable<HomologationVO>> {
   
  constructor(readonly homologationService: HomologationService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<HomologationVO> {
    const id = Number(route.paramMap.get('id'));
    return this.homologationService.getHomologationById(id)
      .pipe(catchError(() => of(null)));
    
  }
}
