import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpBaseService } from './http-base.service';
import { environment } from '../../../environments/environment';
import { ReferenceDataVO } from '../models';
@Injectable({
  providedIn: 'root'
})
export class ReferenceDataTypeService extends HttpBaseService<ReferenceDataVO> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'references');
  }
  
  getReferenceDatasByType(typeData: string): Observable<ReferenceDataVO[]> {
    return this.httpClient.get<ReferenceDataVO[]>(`${environment.baseUrl}/${this.endpoint}/list?typeData=${typeData}`)
    .pipe(map((data: any) => <ReferenceDataVO[]>data));
  }


  getReferenceDatasByTypeAndNiche(typeData: string, myNiche: number): Observable<ReferenceDataVO[]> {
    return this.httpClient.get<ReferenceDataVO[]>(`${environment.baseUrl}/${this.endpoint}/getReferenceDatasByTypeAndNiche?type=${typeData}&nicheId=${myNiche}`)
    .pipe(map((data: any) => data as ReferenceDataVO[]));
  }
  
  getReferenceDatasByTypeAndNicheAndOrdinal(typeData: string, myNiche: number): Observable<ReferenceDataVO[]> {
    return this.httpClient.get<ReferenceDataVO[]>(`${environment.baseUrl}/${this.endpoint}/getReferenceDatasByTypeAndNicheAndOrdinal?type=${typeData}&nicheId=${myNiche}`)
    .pipe(map((data: any) => data as ReferenceDataVO[]));
  }

  
  getParentAndChildRefByTypeData(typeData: string, myNiche: number): Observable<ReferenceDataVO[]> {
    return this.httpClient.get<ReferenceDataVO[]>(`${environment.baseUrl}/${this.endpoint}/getParentAndChildRefByTypeData?type=${typeData}&nicheId=${myNiche}`)
    .pipe(map((data: any) => data as ReferenceDataVO[]));
  }
  

  getRefDataByKey(key: string): Observable<ReferenceDataVO> {
    return this.httpClient.get<ReferenceDataVO>(`${environment.baseUrl}/${this.endpoint}/getrefdatadykey?key=${key}`)
    .pipe(map((data: any) => data as ReferenceDataVO));
  }
}
