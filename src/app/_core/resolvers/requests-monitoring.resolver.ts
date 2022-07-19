import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RequestService } from './../services/request.service';
import { PaginatedList } from './../models/paginated-list';
import { RequestSearchCriteria } from './../models/request-search-criteria';
import { RequestVO } from './../models/models.d';

@ Injectable({
  providedIn: 'root'
})
export class RequestsMonitoringResolver implements Resolve<Observable<PaginatedList<RequestVO>>> {

  constructor(readonly requestService: RequestService) {
  }

  resolve(): Observable<PaginatedList<RequestVO>> {
    const date3MonthsAgo = new Date();
    date3MonthsAgo.setMonth(date3MonthsAgo.getMonth() - 3);
    const requestSearchCriteria: RequestSearchCriteria = {
      roleId : null,
      userId : null,
      customerId : null,
      fromDate : date3MonthsAgo,
      toDate : new Date(),
      requestTypeLabel : null,
      status : null,
      pendingStatus : null,
      taskHandlerRoleId : null,
      page : 0,
      pageSize : 20,
      sortField : 'CREATEDAT',
      sortOrder : 'DESC',
      accountManagerUserId : null,
      idCreatedByListVO : null,
      referentId : null,
      customerOfferId : null,
      isAutomaticRequestType : false,
      requestId : null,
      campaignName : null,
      campaignDate : null
    };
    return this.requestService.requestsMonitoring(requestSearchCriteria)
    .pipe(catchError(() => of(null)));
  }
}
