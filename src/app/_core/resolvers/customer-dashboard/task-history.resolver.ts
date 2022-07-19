import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TaskService } from '../../services/task-service';
import { HistoryItemVO } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class TaskHistoryResolver implements Resolve<Observable<HistoryItemVO>> {
  constructor(private taskService: TaskService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<HistoryItemVO> {
    const taskId = Number(route.paramMap.get('taskId'));
    return this.taskService.taskHistory(taskId)
    .pipe(catchError( () => of(null)));
  }
}
