import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { HttpBaseService } from './http-base.service';
import { TaskAnswerVO } from '../../_core/models/task-answer-vo';

@Injectable({
  providedIn: 'root'
})
export class TaskAnswersService extends HttpBaseService<TaskAnswerVO> {

  /**
   * Cnstructeur
   * @param httpClient client http
   */
  constructor(httpClient: HttpClient) {
    super(httpClient, 'task-answer');
  }

  /**
   * Récupère les réponses liées à une demande
   * @param idRequest
   */
  
  getTaskAnswers(idTask: number): Observable<TaskAnswerVO[]> {
    return this .httpClient
    .get<TaskAnswerVO[]>(`${environment.baseUrl}/${this.endpoint}/taskanswers?idTask=${idTask}`);
  }

  getTasksAnswers(tasksIds: number[]): Observable<TaskAnswerVO[]> {
    return this .httpClient
    .post<TaskAnswerVO[]>(`${environment.baseUrl}/${this.endpoint}/tasksanswers` , tasksIds);
  }
}
