import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpBaseService } from './http-base.service';
import { environment } from '../../../environments/environment';
import { isNullOrUndefined } from '../utils/string-utils';
import { DocumentVO } from '../models/documentVO';
import { PdfDocumentVO } from '../models/PdfDocumentVO';
import { InterventionReportVO } from '../models/cri/intervention-report-vo';

@Injectable({ 
  providedIn: 'root' 
})
export class InterventionReportService extends HttpBaseService<InterventionReportVO>{

  constructor(httpClient: HttpClient){
    super(httpClient, 'interventionReport');
  }

  searchInterventionReport(customerId : string): Observable<any[]>{
 
    return this.httpClient.get(`${environment.baseUrl}/${this.endpoint}/search?customerId=${customerId}`)
        .pipe(map((data: any) => data as any[]));
  }

    // getCartByRequest(requestId: number): Observable<CartVO[]> {
    //     return this.httpClient
    //     .get(`${environment.baseUrl}/${this.endpoint}/carts/${requestId}`)
    //     .pipe(map((data: any) => data as CartVO[]));
    //   }

    /* get the id of cri by task id */
  getInterventionReportByTask(taskId: number): Observable<number> {
    return this.httpClient.get(`${environment.baseUrl}/${this.endpoint}/getInterventionReportByTask?taskId=${taskId}`)
    .pipe(map((data: any) => data as number));
  }

   /* get the document by cri id */
  getDocumentsByInterventionReport(criId: number): Observable<DocumentVO[]> {
    return this.httpClient.get(`${environment.baseUrl}/${this.endpoint}/getDocumentByInterventionReport?criId=${criId}`)
    .pipe(map((data: any) => data as DocumentVO[]));
  }


  getInterventionReportByTaskId(taskId: number): Observable<InterventionReportVO> {
   
    return this.httpClient.get(`${environment.baseUrl}/${this.endpoint}/getInterventionReportByTaskId?taskId=${taskId}`)
    .pipe(map((data: any) => data as InterventionReportVO));
  }

  /**
   * @author fsmail
   * save or update intervention Report
   */
 
  saveInterventionReport(item: InterventionReportVO): Observable<InterventionReportVO> {
    return this.httpClient
      .post<InterventionReportVO>(`${environment.baseUrl}/${this.endpoint}/saveInterventionReport`, item)
  }
  
  generateFicheRecap(interventionReportId: number,taskId: number): Observable<PdfDocumentVO> {
    const data: FormData = new FormData();
    data.append('interventionReportId', interventionReportId.toString());
    data.append('taskId', taskId.toString());
    return this.httpClient.post<PdfDocumentVO>(`${environment.baseUrl}/${this.endpoint}/generateFicheRecap`, data);
  }
}
