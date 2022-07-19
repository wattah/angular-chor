import { AuthTokenService } from './../../../../_core/services/auth_token';
import { CustomerForClotureVO } from './../../../../_core/models/customer-for-cloture-vo';
import { PersonService } from './../../../../_core/services/person.service';
import { RequestVO } from '../../../../_core/models/request/crud/request';
import { Component, OnInit, Output, EventEmitter, Input, ComponentFactory,
   ComponentRef, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { WorkflowTaskVO } from '../../../../_core/models/WorkflowTaskVo';
import { TaskVo, UserVo } from '../../../../_core/models';
import { WorkflowService } from '../../../../_core/services/workflow.service';
import { TaskService } from '../../../../_core/services/task-service';
import { ProcessInstanceVO } from '../../../../_core/models/ProcessInstanceVO';
import { RequestService } from '../../../../_core/services/request.service';
import { DateFormatPipeFrench } from '../../../../_shared/pipes';
import { DynamicFormQuestionComponent } from '../../../../main/_shared/dynamic-form-question/dynamic-form-question.component';
import { ConfirmationDialogService } from '../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { RESOLUTION_TASK_STATUS } from '../../../../_core/constants/constants';
import { TaskAnswerVO } from '../../../../_core/models/task-answer-vo';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';


const FORMAT_HEURE_H_MIN = "HH'h'mm";

@Component({
  selector: 'app-task-assignment-form',
  templateUrl: './task-assignment-form.component.html',
  styleUrls: ['./task-assignment-form.component.scss'],
  providers: [DatePipe]
})

export class AssignmentTaskFormComponent implements OnInit  {

  @Output() onFormGroupChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() onSubmittedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onCanceledChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onToAffectChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onToclosurRequestChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onLoadingChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() customerId: string;
  @Input() thetisTaskId: string;
  @Input() processInstanceId: string;
  @Input() idRequest: number;
  @Input() nextIdTask = 0;
  @Input() isNextTask: boolean;
  @Input() task: TaskVo;
  @Input() users: UserVo;
  @Input() attachedUserId: number;

  clotureFromPencel = false;
  clotureForm: FormGroup;
  questions: Array<WorkflowTaskVO> = [];
  request: RequestVO = {} as RequestVO;
  taskPrecedent: TaskVo;
  taskAnswers: Array<TaskAnswerVO> = [];
  tasksToAffect: Array<ProcessInstanceVO> = [];
  dateFin: Date;
  commentaire: string;
  resolution = 'OK';
  minDateFin: Date;
  minHour = 0;
  minMinute = 0;
  defaultHour = 0;
  defaultMinute = 0;
  endHourreal = 0;
  endMinutereal = 0;
  hourResoultion = 0;
  minuteRsolution = 0;
  isclosureInDemande = false;
  toClotureRequest = false;
  toAffect = false;
  toClotureTask = true;
  isValide = false;
  loading = false;
  resolutionOfStatut = RESOLUTION_TASK_STATUS;

  @ViewChild('QuestionDynamique', { read: ViewContainerRef, static: true } ) container;

  constructor(private readonly route: ActivatedRoute, private readonly datePipe: DatePipe,
           private readonly router: Router, private readonly fb: FormBuilder,
           private readonly workflowService: WorkflowService,
           private readonly _componentFactoryResolver: ComponentFactoryResolver,
           private readonly taskService: TaskService, private readonly requestService: RequestService,
           private readonly dateFormatPipeFrench: DateFormatPipeFrench,
           private readonly confirmationDialogService: ConfirmationDialogService,
           private readonly personService: PersonService,
           private readonly tokenService: AuthTokenService) {
    this.dateFin = new Date();
  }

  ngOnInit(): void {

    this.clotureFromPencel = Boolean(this.route.snapshot.data['clotureFromPencel']);
    this.minDateFin = new Date(this.datePipe.transform(this.task.createDate, 'yyyy-MM-dd'));
    this.clotureForm = this.createFormGroup();
    this.onFormGroupChange.emit(this.clotureForm);
    this.onSubmittedChange.emit(false);
    this.onCanceledChange.emit(false);
    this.defaultHour = new Date().getHours();
    this.defaultMinute = new Date().getMinutes();
    //this.getNextTask();
    if (this.task && this.task !== null && this.thetisTaskId !== null) {
      this.getNextQuestion();
    } 
  }

  dateFormatter(dateIn) :string{
    {
      if (dateIn === 'null' || dateIn == null) {
        return '-';
      }
      const createHourAndMin = this.datePipe.transform(dateIn , FORMAT_HEURE_H_MIN);
      const date = this.dateFormatPipeFrench.transform(dateIn,'dd MMM yyyy');
      return `${date} - ${createHourAndMin}`;
    }
  }


  createFormGroup(): FormGroup {
    return this.fb.group({
      dateFin: this.fb.control(''),
      commentaire: this.fb.control(''),
      resolution: this.fb.control(''),
      resolutionStatut: this.fb.control('')
    });
  }


  getNextQuestion(): void {
    this.workflowService.getNextQuestions(this.thetisTaskId, false, this.processInstanceId).subscribe(taskList => {
      if (taskList !== null && taskList.length > 0) {
        this.questions = taskList;
        this.questions.forEach(task => {
          const factory: ComponentFactory<DynamicFormQuestionComponent> =
          this._componentFactoryResolver.resolveComponentFactory(DynamicFormQuestionComponent);
          const componentRef: ComponentRef<DynamicFormQuestionComponent> = this.container.createComponent(factory);
          componentRef.instance.questions = task.formFields;
          componentRef.instance.taskId = task.id;
          componentRef.instance.requestInstanceId = this.processInstanceId;
          componentRef.instance.idAthenaTask = this.task.id;
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
                taskAnswerVO.label =  formFieldVo.label;
                if(taskAnswerVO.type === 'boolean'){
                  taskAnswerVO.value =  !isNullOrUndefined(taskAnswerVO.value) &&
                   taskAnswerVO.value === 'true' ? formFieldVo.label + ' : Oui' :
                    formFieldVo.label + ' : Non' ;
                }
                this.taskAnswers.push(taskAnswerVO);
              });
            }
          });
        });
      } else {
        this.isValide = true;
        // this.taskService.saveAnswers(this.task.id, this.taskAnswers).subscribe(saveResult => {
        //   this.getNextTask();
        //   this.isValide = true;
        // });
      }
    });
  }

  getNextTask(): Array<ProcessInstanceVO> {
    this.workflowService.getWorkflowTasks(this.processInstanceId).subscribe(listTasks => {
      this.tasksToAffect = listTasks ? listTasks : [];
      return listTasks ? listTasks : [];
    });
    return [];
  }

  dateChanged(): void {
    const dateSelect = new Date(this.dateFin.getFullYear(), this.dateFin.getMonth(),
    this.dateFin.getDate()); 
    if ( dateSelect.getTime() === this.minDateFin.getTime() ) {
      this.minHour = new Date(this.task.createDate).getHours();
      this.minMinute = new Date(this.task.createDate).getMinutes();
      this.defaultHour = this.minHour;
      this.defaultMinute = this.minMinute;
    } else {
      this.minHour = 0;
      this.minMinute = 0;
    }
  }

  onChangeTimeDateFin( time: string): void {
    this.endHourreal = Number(time.substring(0, 2));
    this.endMinutereal = Number(time.substring(4, 7));
  }
  onChangeTimeResolution( time: string): void {
    this.hourResoultion = Number(time.substring(0, 2));
    this.minuteRsolution = Number(time.substring(4, 7));
  }


  onChangeResolutionValue(event : any): void {
    if( this.clotureForm.value.resolutionStatut !== '') {
      this.isValide = true;
    }
  }

  openConfirmationDialog(errorMessage: string , customer: CustomerForClotureVO): any {
    const title = 'Blocage Cloture';
    let comment = errorMessage;
    comment = this.addInformationMessgae(comment , customer);
    const btnOkText = 'OK';
    this.confirmationDialogService.confirm(title, comment, btnOkText, null)
    .then((confirmed) => { if(confirmed){this.goToTaskList();}}
    )
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  addInformationMessgae(comment: string , customer: CustomerForClotureVO): string {
    const date = new Date();
    const datePattern = 'dd/MM/yyyy HH:mm';
    const dataAsString = this.datePipe.transform(date,datePattern);
    return ` <span class="message-size"> Le ${dataAsString} - ${this.getName(customer)} (${customer.niche}) Demande n° ${this.idRequest}</span> <br> ${comment}`
  }
  getName(customer: CustomerForClotureVO) {
    const isEntreprise = this.route.snapshot.queryParamMap.get('typeCustomer') === 'company';
    if(!isEntreprise){
        return `${customer.lastName} ${customer.firstName}`;
    }
    return `${customer.companyName}`;
  }

  cloture(): void {
    this.isValide = false;
    this.loading = true;
    this.onLoadingChange.emit(this.loading);
    this.workflowService.confirmClosure(this.processInstanceId, this.task.thetisTaskId, this.task.id, sessionStorage.getItem('activeRole')).subscribe(listTasks => {
      //dans ce bloc, on est dans le cas ou on a unblockage de la tache en cours par 
      //une procedure de controle qui est KO, si une autre tache en parallele non blokee, alors 
      //elle n'est pas consideree
      if(listTasks != null && listTasks.length > 0){
        for(const task of listTasks){
          if(task.id === this.task.thetisTaskId && task.blocked && task.error !== null){
            //annuler la tache en cours
            this.workflowService.cancelClosure(this.processInstanceId, this.task.id, this.task.thetisTaskId).subscribe(
              data => {
                //afficher l'erreur qui est venue depuis thetis suite a lechec de proc de controle KO
                this.personService.getInfoCustomerForCloture(this.customerId).subscribe(
                  (customer)=> this.openConfirmationDialog(task.error , customer)
                );
                this.loading = false;
              }
            );
            return;
          }
        }
      }
      
      //Si la confirmation est positive et il n'a aucun blockage au niveau des proc de controles
      this.tasksToAffect = listTasks ? listTasks : [];
      this.preparedObjectForUpdate();
      console.log('task assignment ' , this.task);
      this.taskService.addTask(this.task).subscribe(savedTask => {
        this.taskService.saveAnswers(this.task.id, this.taskAnswers).subscribe(saveResult => {
          this.loading = false;
          this.onLoadingChange.emit(this.loading);
          if((this.tasksToAffect === null || this.tasksToAffect.length === 0 ) && this.nextIdTask !== 0 && this.thetisTaskId !== null ) {
            this.goToTaskList();
           } else if ((this.tasksToAffect === null || this.tasksToAffect.length === 0 ) && this.nextIdTask === 0) {
            this.toClotureRequest = true;
            this.toClotureTask = false;
            this.toAffect = false;
            this.onToclosurRequestChange.emit(this.toClotureRequest);
            this.onToAffectChange.emit(this.toAffect)
           } else if ((this.tasksToAffect === null || this.tasksToAffect.length === 0 ) && this.nextIdTask !== 0){
            this.goToTaskList();
           } else {
            this.toAffect = true;
            this.toClotureRequest = false;
            this.toClotureTask = false;
            this.onToAffectChange.emit(this.toAffect);
            this.onToclosurRequestChange.emit(this.toClotureRequest);
           }
        });
      });
    });

  }

  preparedObjectForUpdate(): void {
    const datePattern = 'dd/MM/yyyy HH:mm';
    const displayDatePettern = 'MM/dd/yyyy HH:mm:ss';
    this.task.endDateAsString = this.datePipe.transform(this.task.endDate , datePattern);
    this.task.dispalyEndDate = this.datePipe.transform(this.task.endDate , displayDatePettern);
    this.task.resolutionDuration = this.hourResoultion + this.minuteRsolution;
    this.task.statut = "DONE";
    this.task.resolutionComment = this.clotureForm.value.commentaire;
    this.task.realEndDate = this.datePipe.transform(new Date() , datePattern);
    this.task.closedById = this.tokenService.applicationUser.coachId;
    if( this.thetisTaskId === null) {
      //si la tache est manuelle,
       this.task.resolutionStatus = this.clotureForm.value.resolutionStatut.key;
      //on enregistre les reponses choisies par Resolutions
       let taskAnswerVO : TaskAnswerVO = {} as TaskAnswerVO ;
       taskAnswerVO.value = this.clotureForm.value.resolutionStatut.label;
       this.taskAnswers.push(taskAnswerVO);
    }
    this.isNextTask = true;
  }

  goToTaskList(): void {
    this.onSubmittedChange.emit(true);
    this.router.navigate(
        ['/customer-dashboard', this.customerId, 'detail', 'request', this.idRequest],
        { queryParamsHandling: 'merge' }
      );
  }

  cancelCreation(): void {
    this.onCanceledChange.emit(true);
  }

  valueBtnSubmit(): string {
    return 'Clôturer et passer à l\'étape suivante';
  }

  onCanceledChangef(canceled: boolean): void {
    this.onCanceledChange.emit(canceled);
  }

  onFormGroupChangef( form: FormGroup): void {
    this.onFormGroupChange.emit(form);
  }

  onTaskCreated(submitted: boolean): void {
    this.onSubmittedChange.emit(submitted);
  }
}
