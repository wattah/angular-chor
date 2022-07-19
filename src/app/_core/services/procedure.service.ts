import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { CmPostalAddressVO } from '../models/cm-postaladdress-vo';
import { HttpBaseService } from './http-base.service';

@Injectable({
  providedIn: 'root'
})
export class ProcedureService extends HttpBaseService<CmPostalAddressVO> {

      /**
   * Cnstructeur
   * @param httpClient client http
   */

  constructor(httpClient: HttpClient) {
    super(httpClient, 'procedure');
  }

  /**
   * rechercher  les produits 
   * @param pattern 
   */
  runTaskProcedure(procedureName: string, idTask: number, userId: number): Observable<Object> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/runTaskProcedure/${procedureName}?taskId=${idTask}&userId=${userId}`)
      .pipe(map((data: any) => data));
  }

  runTaskHomologationProcedure(idTask: number, homologationId: number): Observable<number> {
    return this.httpClient
      .get<number>(`${environment.baseUrl}/${this.endpoint}/runTaskHomologationProcedure?taskId=${idTask}&homologationId=${homologationId}`);
  }
}
