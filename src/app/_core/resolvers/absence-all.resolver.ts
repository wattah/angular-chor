import { DatePipe } from '@angular/common';
import { PaginatedList } from './../models/models';
import { Injectable } from '@angular/core';
import { AbsenceService } from './../services/absence.service';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AbsenceVO } from './../models/AbsenceVO';
@ Injectable({
    providedIn: 'root'
  })
export class AbsenceAllResolver
  implements Resolve<Observable<PaginatedList<AbsenceVO>>> {
  criteriaVO = {} as AbsenceVO;
  datePattern = 'dd/MM/yyyy HH:mm';
  constructor(private readonly absenceService: AbsenceService , private readonly datePipe: DatePipe) {}

  resolve(route: ActivatedRouteSnapshot): Observable<PaginatedList<AbsenceVO>> {
    this.criteriaVO.beginDateStr = this.datePipe.transform(
                                new Date(),
                                this.datePattern
                                );
    this.criteriaVO.endDateStr = this.datePipe.transform(
                                    new Date(),
                                    this.datePattern
                                    );
    this.criteriaVO.page = 0;
    this.criteriaVO.pageSize = 0;
    this.criteriaVO.sortField = 'CREATEDAT';
    this.criteriaVO.sortOrder = 'DESC';
    return this.absenceService.filterAbsences(this.criteriaVO);
  }
}
