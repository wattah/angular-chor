import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base.service';
import { ProcessDefinitionVO } from '../models/ProcessDefinitionVO';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProcessInstanceVO } from '../models/ProcessInstanceVO';
import { RequestCreationContextVO, TaskVO } from '../models/models';
import { FormFieldVO } from '../models/FormFieldVO';
import { WorkflowTaskVO } from '../models/WorkflowTaskVo';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class WorkflowService extends HttpBaseService<ProcessDefinitionVO> {

  processInstance : ProcessInstanceVO;
  parcoursList : ProcessDefinitionVO[]

  constructor(httpClient: HttpClient) {
    super(httpClient, 'workflows');
   }

   getListParcours(): Observable<ProcessDefinitionVO[]>{
    return this.httpClient.get<ProcessDefinitionVO[]>(`${environment.baseUrl}/${this.endpoint}/getWorkflows`)
    .pipe(
      tap(parcoursList => this.parcoursList = parcoursList)
    );
   }

  instantiateParcours(requestCreationContext : RequestCreationContextVO, selectedRole : string): Observable<ProcessInstanceVO>{
    return this.httpClient.post<ProcessInstanceVO>(`${environment.baseUrl}/${this.endpoint}/instantiateParcours?selectedRole=${selectedRole}`, requestCreationContext)
    .pipe(
      tap(processInstance => this.processInstance = processInstance)
    );
   }

   getNextQuestions(instanceId : string, isMainProcess : boolean, processInstanceId : string):Observable<WorkflowTaskVO[]>{
    return this.httpClient.get<WorkflowTaskVO[]>(`${environment.baseUrl}/${this.endpoint}/getNextQuestions?instanceId=${instanceId}&isMainProcess=${isMainProcess}&processInstanceId=${processInstanceId}`);
   }

   submitCamundaForm(taskId : string, idAthenaTask : number, requestInstanceId : string, answers : {[k:string]:any}): Observable<any>{
    return this.httpClient.post<any>(`${environment.baseUrl}/${this.endpoint}/submitCamundaForm?taskId=${taskId}&idAthenaTask=${idAthenaTask}
    &requestInstanceId=${requestInstanceId}`, answers);
   }

   getWorkflowTasks(instanceId : string):Observable<ProcessInstanceVO[]>{
    return this.httpClient.get<ProcessInstanceVO[]>(`${environment.baseUrl}/${this.endpoint}/getWorkflowTasks?instanceId=${instanceId}`);
   }

   getCurrentTask(thetisTaskId : string, processInstanceId : string):Observable<ProcessInstanceVO>{
    return this.httpClient.get<ProcessInstanceVO>(`${environment.baseUrl}/${this.endpoint}/getCurrentTask?thetisTaskId=${thetisTaskId}&processInstanceId=${processInstanceId}`);
   }

   cancelClosure(processInstanceId : string, taskId : number, thetisTaskId :string):Observable<Boolean>{
    return this.httpClient.get<Boolean>(`${environment.baseUrl}/${this.endpoint}/cancelClosure?instanceId=${processInstanceId}&taskId=${taskId}&thetisTaskId=${thetisTaskId}`);
   }

   confirmClosure(processInstanceId : string, thetisTaskId :string, taskId : number, roleActive : string):Observable<ProcessInstanceVO[]>{
    return this.httpClient.get<ProcessInstanceVO[]>(`${environment.baseUrl}/${this.endpoint}/confirmCloture?instanceId=${processInstanceId}&thetisTaskId=${thetisTaskId}&taskId=${taskId}&roleActive=${roleActive}`);
   } 

   cancelQuestionsOfRequest(requestCreationContext : RequestCreationContextVO, processInstanceId : string, selectedRole : string):Observable<ProcessInstanceVO>{
    return this.httpClient.post<ProcessInstanceVO>(`${environment.baseUrl}/${this.endpoint}/cancelQuestionsOfRequest?instanceId=${processInstanceId}&selectedRole=${selectedRole}`, 
      requestCreationContext);
   }

   killInstanceOfRequest(processInstanceId : string):Observable<boolean>{
    return this.httpClient.get<boolean>(`${environment.baseUrl}/${this.endpoint}/killInstanceOfRequest?instanceId=${processInstanceId}`);
   }
   
   checkIfWorkflowOfRequestAllowedToCRI(requestTypeId:number):Observable<boolean>{
    return this.httpClient.get<boolean>(`${environment.baseUrl}/${this.endpoint}/checkIfWorkflowOfRequestAllowedToCRI?requestTypeId=${requestTypeId}`);
   }
   

}
