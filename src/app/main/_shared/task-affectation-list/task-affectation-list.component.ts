import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RequestVO } from 'src/app/_core/models/request/crud/request';
import { CustomerInteractionVO } from 'src/app/_core/models/request/crud/customer-interaction';
import { WorkflowTaskVO } from '../../../_core/models/WorkflowTaskVo';
import { UserVO } from 'src/app/_core/models/models';
import { RequestService } from '../../../_core/services/request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskAffectationComponent } from './task-affectation/task-affectation.component';
import { ProcessInstanceVO } from 'src/app/_core/models/ProcessInstanceVO';
import { ComponentCanDeactivate } from '../../../_core/guards/component-can-deactivate';
import { isValid } from 'date-fns';
import { of } from 'rxjs';
import { RequestAnswersVO } from '../../../_core/models/request-answers-vo';

@Component({
  selector: 'app-task-affectation-list',
  templateUrl: './task-affectation-list.component.html',
  styleUrls: ['./task-affectation-list.component.scss']
})
export class TaskAffectationListComponent implements OnInit {
  loading = false;
  customerId: string;
  @Input()
  request: RequestVO;
  @Input()
  attachedUserId: number;
  
  @Input()
  requestId: number;
  @Input()
  customerInteraction: CustomerInteractionVO;
  @Input()
  tasks: Array<ProcessInstanceVO>;
  @Input()
  users: Array<UserVO>;
  @Input()
  requestAnswers : Array<RequestAnswersVO>;
  isValide :boolean;
  @Input()
  precision : boolean;
  @Input()
  notCancel : boolean;

  @Input() detailRequest: RequestVO;

  @Input()
  isClosureTask = false;

  @Input()
  hasNotInteraction = false;

  formSubmitted: boolean;
  @ViewChildren(TaskAffectationComponent) tasksViews: QueryList<TaskAffectationComponent>;
  typeCustomer: string;
  form: FormGroup;
  forms: FormGroup[] = [];
  toutETValide = false;
  ArrayOfBolean : boolean[]= [];
  submitted: boolean;
  @Output() onFormGroupChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() onCanceledChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onSubmittedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  constructor(private readonly requestService: RequestService,
     private readonly router: Router,
      private readonly route: ActivatedRoute,
      private readonly datePipe: DatePipe) { 
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => this.typeCustomer = params.get('typeCustomer'));
    this.customerId = this.route.parent.snapshot.paramMap.get('customerId');
  }

  enregistrer(): void {
    this.loading=true;
    // cas de création de demande
    if (this.request && this.request != null) {
      console.log('request sent' , this.request);
      this.setCreationDate();
      this.requestService.saveRequest(this.request).subscribe(requestResult => { 
        this.requestService.saveRequestAnswers(requestResult.id, this.requestAnswers).subscribe(saveAnswersResult => {
          this.requestId = requestResult.id;
          console.log(requestResult.id)
          if( this.hasNotInteraction) {
            this.saveTask(requestResult.id);
          } else {
          this.customerInteraction.requestId = requestResult.id;
          this.customerInteraction.description = requestResult.description;
          this.customerInteraction.creationDate = requestResult.createdAt;
          this.customerInteraction.creatorId = requestResult.createdById;
          this.customerInteraction.interlocuteurId = requestResult.interlocuteurId;
          this.customerInteraction.creationDateStr = this.datePipe.transform(this.customerInteraction.creationDate, 'dd/MM/yyyy HH:mm');
          this.customerInteraction.startDateStr = this.customerInteraction.creationDateStr;
          this.requestService.saveCustomerInteraction(this.customerInteraction).subscribe(customerInterResult => {
            this.saveTask(requestResult.id);
          });
        }
      });
      });
    }
    // Cas de cloture de tâche
    else{
      this.loading=false;
      this.saveTask(this.requestId);
    }
  }

  setCreationDate() {
    this.request.creationDateAsString = this.datePipe.transform(this.request.createdAt, 'dd/MM/yyyy HH:mm');
    this.request.modifiedAtAsString = this.request.creationDateAsString;
  }

  saveTask(requestId: number) {
    let compteur = 0;
    const taskComponentArray = this.tasksViews.toArray();
    if (taskComponentArray && taskComponentArray.length > 0) {
      taskComponentArray.forEach(taskComponent => {
        taskComponent.setRequestId(requestId);
        taskComponent.createTask();
        taskComponent.isTaskCreated.subscribe(value => {
          if (value) { compteur++; }
          if (compteur === taskComponentArray.length) {
            this.goToTaskList(requestId);
          }
        })
      });
    }
  }

  goToTaskList(idRequest: number): void { 
    this.router.navigate(
      ['/customer-dashboard', this.customerId, 'detail', 'request', idRequest],
      { queryParamsHandling: 'merge' }
    );
  }


  formGroupChange( form: FormGroup): void {
    this.form=form;
    this.onFormGroupChange.emit(form); 
    if(form.status=="VALID"){
      this.ArrayOfBolean.push(true);
      if(this.ArrayOfBolean.length===this.tasks.length){
        this.toutETValide=true;
      }
    }
  }

  cancelCreation(canceled: boolean): void {
    this.onCanceledChange.emit(canceled);
  }
  onSubmittedForm(submitted: boolean): void {
    this.onSubmittedChange.emit(submitted);
  }

  annuler(): void {
    this.onCanceledChange.emit(true);
    if ( this.isClosureTask) {
      this.router.navigate(
        [
          '/customer-dashboard',
          this.customerId,
          'detail',
          'request',
          this.requestId
        ],
        { queryParamsHandling: 'merge' }
      );
    } else {
      this.router.navigate(
        ['/customer-dashboard', this.customerId, 'request', 'parcours'],
        { queryParamsHandling: 'merge' }
      );
    }
  }

  /**
   * @role catch the boolean sent from 
   * @author yfathi
   */
  public onFormSubmitted(formSubmittedEnvent){
    this.formSubmitted = formSubmittedEnvent;
  }

}
