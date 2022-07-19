import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { TaskVo } from '../models/Task-vo';
import { HttpBaseService } from './http-base.service';
import { TaskLight } from '../models/task-customer-vo';
import { HistoryItemVO, TaskVO, PaginatedList } from '../models/models';
import { MonitoringTaskVO } from '../models/monitoring-task-vo';
import { TaskFilterVo } from '../models/task-filter';
import { TaskAnswerVO } from '../models/task-answer-vo';
/**
 * Service pour gérer les customers
 */
@Injectable({
  providedIn: 'root'
})
  export class TaskService extends HttpBaseService<TaskVo> {
    /**
     * Cnstructeur
     * @param httpClient client http
     */
  constructor(httpClient: HttpClient) {
    super(httpClient, 'tasks');
  }

  addTask(item: TaskVo): Observable<TaskVo> {
    return this.httpClient
      .post<TaskVo>(`${environment.baseUrl}/${this.endpoint}/create`, item)
      .pipe(map(data => <TaskVo>data));
  }

  /**
	 * Permet de récuperer le détail d'une tâche by id
	 * inclunant une résumé de la demande associée
	 * @param taskId
	 * return TaskLight
	 */
  taskDetail(taskId: number): Observable<TaskLight> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/datail/${taskId}`)
      .pipe(map((data: any) => <TaskLight>data));
  }

  /**
	 * Permet de récuperer l'historique d'une tâche by id
	 * @param taskId
	 * return List of HistoryItemVO
	 */
  taskHistory(taskId: number): Observable<HistoryItemVO> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/datail/${taskId}/history`)
      .pipe(map((data: any) => <HistoryItemVO>data));
  }

  saveAnswers(taskId : number, answers : Array<TaskAnswerVO>): Observable<any>{
    return this.httpClient.post<any>(`${environment.baseUrl}/${this.endpoint}/saveAnswers?idTask=${taskId}`, answers);
  }

  getCurrentTask(taskId : number):Observable<TaskVo>{
    return this.httpClient.get<TaskVo>(`${environment.baseUrl}/${this.endpoint}/getCurrentTask?idTask=${taskId}`);
   }

   /**
	 * Permet de récuperer les tasks a traiter (id)
	 * @param userId
	 */
  getTasksToProcess(idUser: number): Observable<MonitoringTaskVO[]> {
    return this.httpClient
      .get(`${environment.baseUrl}/${this.endpoint}/tasksTobeTreated/${idUser}`)
      .pipe(map((data: any) => data as MonitoringTaskVO[]));
  }

    /**
	 * Permet de récuperer les tasks de pilotage des taches (id)
	 * @param taskFilter
	 */
  getTasksMonotoring(taskFilter: TaskFilterVo): Observable<PaginatedList<MonitoringTaskVO>> {
    return this.httpClient.post<PaginatedList<MonitoringTaskVO>>(`${environment.baseUrl}/${this.endpoint}/monitoringTask`, taskFilter);
  }
}
