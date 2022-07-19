import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { RequestDetailsService } from '../../services/request-details.service';
import { RequestCustomerVO } from '../../models/request-customer-vo';
import { isNullOrUndefined } from '../../utils/string-utils';
import { WorkflowService } from '../../services/workflow.service';
import { CartCreationService } from '../../../main/cart/cart/cart-creation.service';

@ Injectable({
  providedIn: 'root'
})
export class RequestDetailsResolver implements Resolve<Observable<RequestCustomerVO>> {
  requestId: string;
  constructor(
    private readonly requestDetailService: RequestDetailsService,
    private readonly workflowService: WorkflowService,
    private readonly router: ActivatedRoute,
    private readonly cartCreationService:CartCreationService  
    ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if(!this.cartCreationService.isFromCancel){
    this.requestId = route.paramMap.get('idRequest');
    if (isNullOrUndefined(this.requestId)) {
      this.requestId = route.parent.paramMap.get('idRequest');
    }
    if(isNullOrUndefined(this.requestId)) {
      this.requestId = route.params['idRequest'];
    }
    const isRefresh = route.queryParamMap.get('refresh');
    const taskIdToModify = Number(route.queryParamMap.get('taskId'));
    const thetisTaskIdToModify = route.queryParamMap.get('thetisTaskId');
    const processInstanceIdToModify = route.queryParamMap.get('processInstanceId');

    console.log("*************************************************")
    console.log('isRefresh : ', isRefresh);
    if (isRefresh) {
      const obs1$ = this.workflowService.cancelClosure(processInstanceIdToModify, taskIdToModify, thetisTaskIdToModify);
      const obs2$ = obs1$.pipe(
        mergeMap( param => this.requestDetailService.getDetailsByRquestId(Number(this.requestId)))
      );

      console.log("*************************************************")

      return obs2$;
    }
    return this .requestDetailService.getDetailsByRquestId(Number(this.requestId))
      .pipe(catchError(() => of(null))); 
  }

  else{
    return this.cartCreationService.getDdetailRequestVO();
  }
}
}
