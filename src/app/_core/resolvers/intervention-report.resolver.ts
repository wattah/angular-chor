import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { InterventionReportVO } from '../models/cri/intervention-report-vo';
import { InterventionReportService } from '../services/intervention-report.service';


@Injectable({
  providedIn: 'root'
})
export class InterventionReporResolver implements Resolve<Observable<InterventionReportVO>> {
  idTask: string;
  constructor(private readonly interventionReportService: InterventionReportService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<InterventionReportVO> {
    this.idTask = route.paramMap.get('idTask');
    return this.interventionReportService.getInterventionReportByTaskId(Number(this.idTask))
    .pipe(catchError(() => of(null)));
  }
}
