import { RequestChangeAbsenceStatusVO } from './../models/RequestChangeAbsenceStatusVO';
import { PaginatedList } from './../models/models';
import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base.service';
import { environment } from './../../../environments/environment';
import { AbsenceVO } from './../models/AbsenceVO';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ 
    providedIn: 'root' 
})
export class AbsenceService extends HttpBaseService<AbsenceVO>{

    editedAbsence: AbsenceVO;

    constructor(httpClient: HttpClient){
        super(httpClient, 'absences');
    }

  getAbsenceToEdit(): AbsenceVO {
    return this.editedAbsence;
  }

  setAbsenceToEdit(newAbsence: AbsenceVO): void {
    this.editedAbsence = newAbsence;
  }

    getAbsences(criteria: AbsenceVO): Observable<PaginatedList<AbsenceVO>>{
        return this.httpClient.post<PaginatedList<AbsenceVO>>(`${environment.baseUrl}/absences/all` , criteria);
    }

    filterAbsences(criteria: AbsenceVO): Observable<PaginatedList<AbsenceVO>>{
        return this.httpClient.post<PaginatedList<AbsenceVO>>(`${environment.baseUrl}/absences/filter` , criteria);
    }

    changeAbsenceStatus(changeAbsenceStatusRequest: RequestChangeAbsenceStatusVO){
        return this.httpClient.put(`${environment.baseUrl}/absences/change-status` , changeAbsenceStatusRequest);
    }

  saveAbsence(idUser: number, absence: AbsenceVO): Observable<any> {
    console.log('from service');
    return this.httpClient.post<AbsenceVO>(`${environment.baseUrl}/absences/add-absence?idUser=${idUser}`, absence);
  }
}
