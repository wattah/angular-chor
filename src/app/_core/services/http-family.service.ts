import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base.service';
import { FamilyVO } from './../models/models';
import { environment } from '../../../environments/environment';
@Injectable({
    'providedIn': 'root'
})
export class HttpFamilyService extends HttpBaseService<FamilyVO>{
    constructor(httpClient: HttpClient){
        super(httpClient, 'categories')
    }

    getUnReferencedFamily(){
        return this.httpClient.get<Array<FamilyVO>>(`${environment.baseUrl}/${this.endpoint}/unreferenced`);
    }


}
