import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { HttpBaseService } from './http-base.service';
import { HomologationVO } from '../models/homologation/homologation-vo';
import { environment } from '../../../environments/environment';
import { getDefaultStringEmptyValue } from '../utils/string-utils';
import { ApprovalDocumentVO } from '../models/homologation/approval-document-vo';

@Injectable({
  providedIn: 'root'
})
export class HomologationService extends HttpBaseService<HomologationVO> {
  
  editedDocument: ApprovalDocumentVO;

  constructor(httpClient: HttpClient) {
    super(httpClient, 'homologation');
  }

  getHomologationById(id: number): Observable<HomologationVO> {
    return this.httpClient.get<HomologationVO>(`${environment.baseUrl}/${this.endpoint}/${id}`);
  }

  getHomologationListByCustomerId(customerId: string): Observable<number[]> {
    return this.httpClient.get<number[]>(`${environment.baseUrl}/${this.endpoint}/list/${customerId}`);
  }

  untokenizeTokenIBAN(ibanTokenCodeIban: string, ibanTokenCodeBanque: string,
    ibanTokenCodeGuichet: string, ibanTokenNumeroCompte: string, ibanTokenCleRib: string): Observable<string> {
    let url = `${environment.baseUrl}/${this.endpoint}/untokenizeToken?`;
    url += `ibanTokenCodeIban=${ibanTokenCodeIban}&`;
    url += `ibanTokenCodeBanque=${ibanTokenCodeBanque}&`;
    url += `ibanTokenCodeGuichet=${ibanTokenCodeGuichet}&`;
    url += `ibanTokenNumeroCompte=${ibanTokenNumeroCompte}&`;
    url += `ibanTokenCleRib=${ibanTokenCleRib}`;

    const httpOptions = { responseType  : 'text' as 'json' } ;
    return this.httpClient.get(url, httpOptions)
    .pipe( 
      map( iban => getDefaultStringEmptyValue(iban.toString())),
      catchError((_error) => {
        console.error(_error);
        return of('L\'iban n\'a pas pu être restitué.');
      } )
    );
  }

  /* retrieve the document to edit and upload */
  getDocumentToEdit(): ApprovalDocumentVO {
    return this.editedDocument;
  }

  setDocumentToEdit(newDocument: ApprovalDocumentVO): void {
    this.editedDocument = newDocument;
  }

  saveHomologation(homologation: HomologationVO, selectedRole: string, isAmendment: boolean): Observable<HomologationVO> { 
    return this.httpClient.post<HomologationVO>(`${environment.baseUrl}/${this.endpoint}` +
    `/saveHomologation?selectedRole=${selectedRole}&isAmendment=${isAmendment}`, homologation);
  }
}
