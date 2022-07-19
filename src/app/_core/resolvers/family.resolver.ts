import { HttpFamilyService } from './../services/http-family.service';
import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { FamilyVO } from './../models/models';
@Injectable({
    providedIn: 'root'
  })
export class FamilyResolver implements Resolve<Observable<Array<FamilyVO>>>{

    constructor(private readonly httpFamilyService:HttpFamilyService){}

    resolve():Observable<Array<FamilyVO>>  {
        return this.httpFamilyService.getUnReferencedFamily();
    }
    

}
