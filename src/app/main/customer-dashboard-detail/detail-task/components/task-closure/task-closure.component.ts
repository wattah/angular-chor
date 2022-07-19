import { DatePipe } from '@angular/common';
import { Component, OnInit, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowTaskVO } from 'src/app/_core/models/WorkflowTaskVo';
import { DynamicFormQuestionComponent } from 'src/app/main/_shared/dynamic-form-question/dynamic-form-question.component';
import { TaskVo } from 'src/app/_core/models/Task-vo';
import { WorkflowService } from 'src/app/_core/services/workflow.service';
import { UserVo } from 'src/app/_core/models/user-vo';
import { TaskService } from 'src/app/_core/services/task-service';
import { ProcessInstanceVO } from 'src/app/_core/models/ProcessInstanceVO';
import { TaskAnswerVO } from '../../../../../_core/models/task-answer-vo';
import { isNullOrUndefined } from '../../../../../_core/utils/string-utils';


@Component({
  selector: 'app-task-closure',
  templateUrl: './task-closure.component.html',
  styleUrls: ['./task-closure.component.scss']
})
export class TaskClosureComponent implements OnInit {

  constructor(private readonly fb: FormBuilder,
     private readonly route: ActivatedRoute,
      private readonly router: Router,
      private readonly workflowService: WorkflowService,
    private readonly _componentFactoryResolver: ComponentFactoryResolver,
     private readonly taskService: TaskService,
     private readonly datePipe:DatePipe) {
    this.taskClosureForm = this.createFormGroup();
  }
  loading = false;
  @ViewChild("alertContainer", { read: ViewContainerRef, static: true }) container;
  taskClosureForm: FormGroup;
  task: TaskVo = {} as TaskVo;
  idRequest: number;
  idTask: number;
  requestTitle: string;
  taskTitle: string;
  currentDate: Date = new Date();
  currentHour = this.currentDate.getHours();
  currentMinutes = this.currentDate.getMinutes();
  questions: Array<WorkflowTaskVO> = [];
  processInstanceId: string;
  thetisTaskId: string;
  listUsers: UserVo[];
  tasksToAffect: Array<ProcessInstanceVO> = [];
  isQuestionsAsked = false;
  typeCustomer: string;
  customerId: number;
  taskAnswers: Array<TaskAnswerVO> = [];
  
  ngOnInit() {
    this.idRequest = Number.parseInt(this.route.snapshot.queryParamMap.get('idRequest'), 10);
    this.processInstanceId = this.route.snapshot.queryParamMap.get('processInstanceId');
    this.requestTitle = this.route.snapshot.queryParamMap.get('requestTitle');
    this.taskTitle = this.route.snapshot.queryParamMap.get('taskTitle');
    this.thetisTaskId = this.route.snapshot.queryParamMap.get('thetisTaskId');
    this.idTask = Number.parseInt(this.route.snapshot.paramMap.get('idTask'), 10);

    this.route.queryParamMap.subscribe(params => {
      this.typeCustomer = params.get('typeCustomer')
    });

    this.route.paramMap.subscribe(params => {
      this.customerId = Number.parseInt(params.get('customerId'), 10);
    });

    this.route.data.subscribe(resolversData => {
      this.listUsers = resolversData['listUsers'];
      //this.referenceDataList = resolversData['referenceDataList'].itemsVO;;
    });


    this.workflowService.getCurrentTask(this.thetisTaskId, this.processInstanceId).subscribe(task => {

      //si la tache thetis liée à la tache chorniche existe est toujours pas cloturée.
      if (task && task != null) {
        this.getNextQuestion();
      }

    });

    this.dateChanged();
  }

  getNextQuestion(): void {
    this.workflowService.getNextQuestions(this.thetisTaskId, false, this.processInstanceId).subscribe(taskList => {
      if (taskList !== null && taskList.length > 0) {
        this.questions = taskList;
        this.questions.forEach(task => {
          const factory: ComponentFactory<DynamicFormQuestionComponent> = this._componentFactoryResolver.resolveComponentFactory(DynamicFormQuestionComponent);
          const componentRef: ComponentRef<DynamicFormQuestionComponent> = this.container.createComponent(factory);
          componentRef.instance.questions = task.formFields;
          componentRef.instance.taskId = task.id;
          componentRef.instance.getNextTasks.subscribe(getNextQuestion => {
            if (getNextQuestion === true) {
              this.getNextQuestion();
            }
          });
          componentRef.instance.outputResponses.subscribe(responses => {
            if (responses != null && responses.length > 0 && !isNullOrUndefined(task.formFields) ){
              task.formFields.forEach((formFieldVo , index)=> {
                const taskAnswerVO : TaskAnswerVO  = {} as TaskAnswerVO 
                taskAnswerVO.value = responses[index].toString();
                taskAnswerVO.formfieldId =  !isNullOrUndefined(formFieldVo.id) ? formFieldVo.id : null;
                taskAnswerVO.type = !isNullOrUndefined(formFieldVo.type) ? formFieldVo.type.name : null;
                if(taskAnswerVO.type === 'boolean'){
                  taskAnswerVO.value =  !isNullOrUndefined(taskAnswerVO.value) &&
                   taskAnswerVO.value === 'true' ? formFieldVo.label + ' : Oui' :
                    formFieldVo.label + ' : Non' ;
                }
                taskAnswerVO.label =  formFieldVo.label;
                this.taskAnswers.push(taskAnswerVO);
              });
            }
          });
        });
      }
      else {
        //Après la réponse de toutes les questions, on les persitent dans la table task-answers
        this.taskService.saveAnswers(this.idTask, this.taskAnswers).subscribe(saveResult => {
          if (saveResult) {
            console.log("answers persisted");
          }

          this.workflowService.getWorkflowTasks(this.processInstanceId).subscribe(listTasks => {
            console.log(listTasks);
            this.tasksToAffect = listTasks ? listTasks : [];
          });
        });
      }
    });
  }

  dateChanged(): void {
    if (this.currentDate) {
      this.task.endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(),
        this.currentDate.getDate(), this.currentHour, this.currentMinutes);
    }
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      endDate: this.fb.control({ disabled: true }, [Validators.required]),
      currentHour: this.fb.control(null, [Validators.required]),
      currentMinutes: this.fb.control(null, [Validators.required]),
      priority: this.fb.control(''),
      comment: this.fb.control(''),
      dureeHour: this.fb.control(''),
      dureeMinute: this.fb.control('')
    });
  }

  closeTask(): void {
    
    if (this.taskClosureForm.valid) {
      this.loading=true;
      const datePattern = 'dd/MM/yyyy HH:mm';
      //TODO revoir cette partie de modification d'une tache existante
      this.isQuestionsAsked = this.tasksToAffect.length > 0;
      this.task.id = this.idTask;
      this.task.endDate = this.taskClosureForm.value.endDate;
      this.task.endDateAsString = this.datePipe.transform(this.task.endDate , datePattern)
      this.task.resolutionDuration = (this.taskClosureForm.value.currentHour * 60) + this.taskClosureForm.value.currentMinutes;
      this.task.statut = "DONE";
      this.task.resolutionComment = this.taskClosureForm.value.comment;
      console.log('task assignment ' , this.task);
      this.taskService.addTask(this.task).subscribe(savedTask => {
        if(this.tasksToAffect == null || this.tasksToAffect.length == 0){
          this.goToTaskList(savedTask.requestId);
        }
      });
    }
  }



  goToTaskList(idRequest: number): void {
    this.router.navigate(
      ['/customer-dashboard', this.customerId, 'detail', 'request', idRequest],
      { queryParamsHandling: 'merge' }
    );
  }

  cancelCreation() {

  }

}
