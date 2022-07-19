import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TaskLight } from '../../models/task-customer-vo';
import { TaskService } from '../../services/task-service';

@Injectable({
  providedIn: 'root'
})
export class TaskDetailResolver implements Resolve<Observable<TaskLight>> {
  constructor(private taskService: TaskService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<TaskLight> {
    const taskId = Number(route.paramMap.get('taskId'));
    return this.taskService.taskDetail(taskId)
    .pipe(catchError( () => of(null)));
  }
}
