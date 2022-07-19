import { HttpClient } from '@angular/common/http';
import { HttpBaseService } from './http-base.service';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { NomenclatureVO } from '../models/nomenclature-vo';
import { Observable } from 'rxjs';
@Injectable({
    'providedIn': 'root'
})
export class NomenclatureService extends HttpBaseService<NomenclatureVO>{
    constructor(httpClient: HttpClient){
        super(httpClient, 'nomenclature')
    }

    findByNomenclatureParentValue(value: string){
        return this.httpClient.get<Array<NomenclatureVO>>(`${environment.baseUrl}/${this.endpoint}/findByNomenclatureParentValue/${value}`);
    }

    findByNomenclatureByValue(value: string): Observable<Array<NomenclatureVO>>{
        return this.httpClient.get<Array<NomenclatureVO>>(`${environment.baseUrl}/${this.endpoint}/findByNomenclatureByValue/${value}`);
    }

    findByNomenclatureParentId(id: number): Observable<Array<NomenclatureVO>>{
        return this.httpClient.get<Array<NomenclatureVO>>(`${environment.baseUrl}/${this.endpoint}/findByNomenclatureParentId/${id}`);
    }

    


}