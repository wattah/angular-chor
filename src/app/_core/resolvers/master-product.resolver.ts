import { Observable, of } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { MasterProductVo } from '../models';
import { CatalogeService } from '../services/http-catalog.service';
import { catchError } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
  })
export class MasterProductResolver implements Resolve<Observable<MasterProductVo>>{

    constructor(private readonly catalogService:CatalogeService){}

    resolve(route: ActivatedRouteSnapshot): Observable<MasterProductVo> {
         const masterProductId = Number(route.paramMap.get('idMasterPoduct'));
         return this.catalogService.getMasterProductById(masterProductId).pipe(catchError(() => of(null)));
      }
}
