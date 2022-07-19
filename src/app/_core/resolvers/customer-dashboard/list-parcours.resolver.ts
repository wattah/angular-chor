
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ProcessDefinitionVO } from '../../models/ProcessDefinitionVO';
import { WorkflowService } from '../../services/workflow.service';

@Injectable({
  providedIn: 'root'
})
  
  export class ListParcoursResolver implements Resolve<Observable<ProcessDefinitionVO[]>> {
  constructor(private workflowService: WorkflowService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<ProcessDefinitionVO[]> {
    return this.workflowService.getListParcours()
        .pipe(catchError(() => of(null)));
  }

}
