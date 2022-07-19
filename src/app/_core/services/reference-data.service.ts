import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { HttpBaseService } from './http-base.service';
import { environment } from '../../../environments/environment';
import { ReferenceDataVO } from '../models';
import { ReferenceData } from '../models/reference-data';

@Injectable({
  providedIn: 'root'
})
export class ReferenceDataService extends HttpBaseService<ReferenceDataVO> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'dataReferences');
  }
  
  getReferencesData(typeData: string): Observable<ReferenceDataVO[]> {
    return this.httpClient.get<ReferenceDataVO[]>(`${environment.baseUrl}/references/list?typeData=${typeData}`);
  }
  
  getReferenceListByType(type: string, nicheId: number): Observable<ReferenceData[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/dataReferences/referenceListByType?type=${type}&nicheId=${nicheId}`)
    .pipe(map((data: any) => <ReferenceData[]>data));
  }
  
  getListReferenceDataForBlocRecupInfoCRI() : Observable<ReferenceDataVO[]> {
    return this.httpClient.get<ReferenceDataVO[]>(`${environment.baseUrl}/${this.endpoint}/listReferenceDataForBlocRecupInfoCRI`);
  }

  getListRefDataAndChildrenByTypeData(typeData: string): Observable<ReferenceDataVO[]> {
    return this.httpClient.get<ReferenceDataVO[]>(`${environment.baseUrl}/references/getListRefDataAndChildrenByTypeData?typeData=${typeData}`);
  }

  getReferenceDataById(id: number) : Observable<ReferenceDataVO> {
    return this.httpClient.get<ReferenceDataVO>(`${environment.baseUrl}/${this.endpoint}/getReferenceDataById?id=${id}`);
  }
}
