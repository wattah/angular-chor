import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { CatalogeService } from '../services/http-catalog.service';
import { FamilyVO } from '../models/family-vo';
@Injectable({
    providedIn: 'root'
  })
export class CategorieMasterProductResolver implements Resolve<Observable<FamilyVO[]>>{

    constructor(private readonly catalogService:CatalogeService){}

    resolve():Observable<FamilyVO[]>  {
        return this.catalogService.getListFamilyProducts(-1);
    }
    

}
