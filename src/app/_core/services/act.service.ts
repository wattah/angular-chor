import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActVo } from '../models/act-vo';

@Injectable({ 
    providedIn: 'root' 
})
export class ActService extends HttpBaseService<ActVo>{

    constructor(httpClient: HttpClient){
        super(httpClient, 'act');
    }

    findAll(): Observable<ActVo[]>{
        return this.httpClient.get<ActVo[]>(`${environment.baseUrl}/act/all`);
    }


}
