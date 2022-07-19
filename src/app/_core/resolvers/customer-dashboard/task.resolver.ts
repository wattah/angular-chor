import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TaskService } from 'src/app/_core/services/task-service';
import { TaskVo } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class TaskResolver implements Resolve<Observable<TaskVo>> {
  idTask: string;
  constructor(private taskService: TaskService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<TaskVo> {
    this.idTask = route.paramMap.get('idTask');
    
    return this.taskService.getCurrentTask(Number(this.idTask))
    .pipe(catchError(() => of(null)));
  }
}
