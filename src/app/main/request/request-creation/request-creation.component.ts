import { ApplicationUserVO } from './../../../_core/models/application-user';
import { getDecryptedValue } from 'src/app/_core/utils/functions-utils';
import { Component, OnInit, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GassiMockLoginService } from './../../../_core/services/gassi-mock-login.service';
import { InteractionService } from './../../../_core/services/interaction.service';
import { ReferenceDataVO } from './../../../_core/models/reference-data-vo';
import { RequestTypeVO } from '../../../_core/models/request-type-vo';
import { UserVo } from './../../../_core/models/user-vo';
import { RequestVO } from './../../../_core/models/request/crud/request';
import { Person } from '../../../_core/models';
import { InteractionReasonVO } from '../../../_core/models/request/crud/interaction-reason';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';
import { NodeVO, RequestCreationContextVO, CustomerInteractionVO } from '../../../_core/models/models';
import { ProcessInstanceVO } from '../../../_core/models/ProcessInstanceVO';
import { DynamicFormQuestionComponent } from '../../../main/_shared/dynamic-form-question/dynamic-form-question.component';
import { WorkflowTaskVO } from '../../../_core/models/WorkflowTaskVo';
import { WorkflowService } from '../../../_core/services/workflow.service';
import { ComponentCanDeactivate } from '../../../_core/guards/component-can-deactivate';
import { 
  CheckingRequestCurrentlyOpenedPopUpComponent 
} from './checking-request-currently-opened-pop-up/checking-request-currently-opened-pop-up.component';
import { AuthTokenService } from 'src/app/_core/services/auth_token';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { CONSTANTS, LIST_UPDATED_OF_WORKFLOW_WITH_CART, MANUAL_TASK} from '../../../_core/constants/constants';
import { RequestAnswersVO } from '../../../_core/models/request-answers-vo';
import { BeneficiaryVO } from 'src/app/_core/models/beneficiaryVO';


@Component({
  selector: 'app-request-creation',
  templateUrl: './request-creation.component.html',
  styleUrls: ['./request-creation.component.scss']
})
export class RequestCreationComponent extends ComponentCanDeactivate implements OnInit {

  @ViewChild("alertContainer", { read: ViewContainerRef, static: true }) 
  container;
  loading = false;
  customerId: string;
  customerIdNumber: number;
  parcoursId : string;
  currentDate: Date = new Date();
  isCreatingRequest = true;
  isQuestionsAsked = false;
  isOnDynamicQuestions = false;
  request: RequestVO = {} as RequestVO;
  requestDescription: RequestCustomerVO = {} as RequestCustomerVO;
  customerInteraction: CustomerInteractionVO = {} as CustomerInteractionVO;
  requestType: RequestTypeVO;
  mediaData: ReferenceDataVO[];
  hasNotInteraction = false;
  isClosedImmediately = false;
  alertVisibility = 'hidden';
  currentHour = this.currentDate.getHours();
  currentMinutes = this.currentDate.getMinutes();
  attachedTo: UserVo;
  listUsers: UserVo[];
  interlocutors: Person[];
  recipients: BeneficiaryVO[];
  universes: ReferenceDataVO[];
  interactionReasonList: InteractionReasonVO[] = [];
  questions: NodeVO[];
  interactionReasonSelected: InteractionReasonVO = null;
  referenceDataList: ReferenceDataVO[];
  requestCreationContextVO: RequestCreationContextVO = {} as RequestCreationContextVO;
  showNextButton: boolean = false;
  nodes: Array<WorkflowTaskVO> = [];
  tasksToAffect: Array<ProcessInstanceVO> = [];
  instanceId: string;
  typeCustomer: string;
  questionsSelected = [];
  form: FormGroup;
  submitted: boolean;
  isClosure: boolean = false;
  noTasks: boolean=true;
  hasPrecision: boolean=false;
  requestAnswers: Array<RequestAnswersVO> = [];
  showReinitialise : boolean = false;
  creatingManulaTask = false;
  affectationManualTask = false;
  commercialAndBusinessAccountsRequired = false;

  openRequests = [];

	  user : ApplicationUserVO;

  constructor(private readonly route: ActivatedRoute, private readonly modalService: NgbModal,
    private readonly gassiMockLoginService: GassiMockLoginService, private readonly fb: FormBuilder,
    private readonly interactionService: InteractionService, private readonly workflowService: WorkflowService,
    private readonly _componentFactoryResolver: ComponentFactoryResolver,
    private readonly router: Router,private readonly authTokenService: AuthTokenService) { 
    super();
  }

  ngOnInit() {

    this.route.queryParamMap.subscribe( params => {
      this.typeCustomer = params.get('typeCustomer')
    });

    this.customerId = this.route.parent.snapshot.paramMap.get('customerId');
    this.customerIdNumber = getDecryptedValue(this.customerId);
    this.parcoursId = this.route.parent.snapshot.queryParamMap.get('idParcours');
    this.route.data.subscribe(resolversData => {
      this.mediaData = resolversData['mediaData'];
      this.listUsers = resolversData['listUsers'];
      this.interlocutors = resolversData['interlocutorsRequest'];
      this.addAutre();
      this.recipients = resolversData['recipientsRequest'];
      this.recipients.sort( (a, b ) => a.status.localeCompare( b.status ) );
      this.requestType = resolversData['requestTypeResolver'];
      this.openRequests = resolversData['openRequests'];
      this.checkTheExistenceOfTheRequestsCurrentlyOpened();
    });
    this.interactionService.listUniversesForInteractionReasons(this.requestType.id, 'CREATION', false)
    .subscribe(univ => {
      this.universes = univ;
      this.initRequest();
    });
    this.initInteraction();
  }

  initAttachedTo(): void {
    const currentUserCuid = this.gassiMockLoginService.getCurrentCUID().getValue();
    if (this.listUsers) {
      const userConnected = this.listUsers.find(user => user.ftUniversalId === currentUserCuid)
      this.request.attachedUserId = userConnected ? userConnected.id : null;

    }
  }

  showQuestions(showAffectationTask: NgForm): void {
    this.loading = true;
    this.creatingManulaTask = false;
    if (showAffectationTask.valid) {
      this.buildRequestDescription();
      this.isCreatingRequest = false;
      if (this.request.isConnectedOnWf) {
        this.buildRequestContext();
        this.user = this.authTokenService.applicationUser;
        this.workflowService.instantiateParcours(this.requestCreationContextVO, this.user.activeRole.roleName).subscribe(data => {
          this.loading = false;
          this.instanceId = data.id;
          this.request.instanceId = this.instanceId;
          this.workflowService.getNextQuestions(data.id, true, data.id).subscribe(taskList => {
            if ( taskList.length == 0) {
              this.loading=false;
              this.hasPrecision=true;
            this.showAffectationTaskFn();
            }else{
              //Cas d'affectation dune tache manuelle
              const isExistManualTask = taskList.find(task => task.name  === MANUAL_TASK);
              if(!isNullOrUndefined(isExistManualTask)){
                this.hasPrecision=true;
                this.showAffectationManualTask(); 
              } else {
                //Cas ou aucune tache manuelle n'est affectée, mais affichage de questions
                this.loading=false;
                this.noTasks=false;
                this.getNextQuestion(data);
                this.isOnDynamicQuestions = true;
              }
            }
            });
            
        });
      }else {
        this.loading = false;
      }
    } else {
     this.loading = false;
    }
  }

  showAffectationManualTask(): void {
    this.workflowService.killInstanceOfRequest(this.instanceId).subscribe(data => {
        this.affectationManualTask = true;
        this.loading=false;
      },
      (error) => {
        console.error('killInstanceOfRequest failed: ', error);
        this.loading=false;
        },
      ()=>{
        console.log('onComplete');
        this.loading=false;
      }
    );
  }

  showAffectationTaskFn(): void {
    if(this.creatingManulaTask){
      this.loading=true;
      this.workflowService.killInstanceOfRequest(this.instanceId).subscribe(data => {
        this.affectationManualTask = true;
        this.loading=false;
        this.isQuestionsAsked = true ;
        this.isOnDynamicQuestions = false;
      },
      (error) => {
        console.error('killInstanceOfRequest failed: ', error);
        this.loading=false;
        },
      ()=>{
        console.log('onComplete');
        this.loading=false;
      }
    );
    } else {
      if(this.nodes.length>0){
        this.loading=true;
      }
      this.isQuestionsAsked = true ;
      this.isOnDynamicQuestions = false;
      this.workflowService.getWorkflowTasks(this.instanceId).subscribe(taskList => {
        this.loading=false
        this.tasksToAffect = taskList;
      });
    }
  }

  buildRequestContext(): RequestCreationContextVO {

    this.requestCreationContextVO.customerId = this.customerIdNumber;
    this.requestCreationContextVO.parcoursId = this.parcoursId;
    this.requestCreationContextVO.mediaId = this.customerInteraction.refMediaId;
    this.requestCreationContextVO.universeId = this.request.universId ;
    this.requestCreationContextVO.title = this.requestDescription.title;
    //TODO add canal to origin of context (is hided now)
    this.requestCreationContextVO.businessAccountManagerId = this.request.accountManagerUserId;
    return this.requestCreationContextVO;
  }

  
  getNextQuestion(data: ProcessInstanceVO): void {
    this.creatingManulaTask = false;
    this.workflowService.getNextQuestions(data.id, true, data.id).subscribe(taskList => { 
      if (taskList !== null && taskList.length > 0) {
         const isExistManualTask = taskList.find(task => task.name  === MANUAL_TASK);
         if(!isNullOrUndefined(isExistManualTask)){
           this.creatingManulaTask = true;
         }
         if(!this.creatingManulaTask){
          this.nodes = taskList;
          this.nodes.forEach(task => {
            const factory: ComponentFactory<DynamicFormQuestionComponent> = 
            this._componentFactoryResolver.resolveComponentFactory(DynamicFormQuestionComponent);
            const componentRef: ComponentRef<DynamicFormQuestionComponent> = this.container.createComponent(factory);
            componentRef.instance.questions = task.formFields;
            componentRef.instance.taskId = task.id;
            componentRef.instance.requestInstanceId = null;
            componentRef.instance.idAthenaTask = 0;
            componentRef.instance.getNextTasks.subscribe(getNextQuestion => {
              this.showReinitialise = true;
              if (getNextQuestion === true) {
                this.getNextQuestion(data);
              }
            });
            
            componentRef.instance.questions.forEach(question => this.questionsSelected.push(question.label));
            
            componentRef.instance.outputResponses.subscribe(responses => {
              if (responses !== null && responses.length > 0 && !isNullOrUndefined(task.formFields)) {
                  task.formFields.forEach((formFieldVo , index)=> {
                    const requestAnswerVO : RequestAnswersVO = {} as RequestAnswersVO ;
                    requestAnswerVO.answer = responses[index].toString();
                    requestAnswerVO.type = !isNullOrUndefined(formFieldVo.type) ? formFieldVo.type.name : null;
                    requestAnswerVO.label =  formFieldVo.label;
                    requestAnswerVO.idFormField = formFieldVo.id;
                    if(requestAnswerVO.type === 'boolean'){
                      requestAnswerVO.answer =  !isNullOrUndefined(requestAnswerVO.answer) &&
                      requestAnswerVO.answer === 'true' ? formFieldVo.label + ' : Oui' :
                        formFieldVo.label + ' : Non' ;
                    }
                    // puisque l'utilisateur peut répondre plusieurs fois pour une question boolean (cocher/décocher)
                    // on doit toujours avoir la dernière version de la réponse avant de persister
                    // donc on se base sur idFormField qui est unique pour une question dans une tâche (userTask == camunda)  
                    // pour mettre à jour la réponse
                   let oldBooleanAnswer = this.requestAnswers.find(reqAnswer => reqAnswer.idFormField === requestAnswerVO.idFormField);
                   if(!isNullOrUndefined(oldBooleanAnswer)){
                    let indexOldBooleanAnswer = this.requestAnswers.indexOf(oldBooleanAnswer);
                    this.requestAnswers[indexOldBooleanAnswer] = requestAnswerVO;
                   }
                   else{
                    this.requestAnswers.push(requestAnswerVO);
                   }
               
                  });
             
              }
            });

         
          });
        
        } else {
          this.showNextButton=true;
        }
      } else {
        this.showNextButton=true;
    }

    });
  }

  showHideMedia(event: any): void {
    this.hasNotInteraction = event.target['checked'];
  }
 
  onImmediateClose(event: any): void {
    this.isClosedImmediately = event.target['checked'];
  }

  showHideAlert(event: any): void {
    this.alertVisibility = event.target['checked'] ? 'alert-m-m visible' : 'alert-m-m hidden';
    this.request.isConnectedOnWf = !event.target['checked'];
    this.hasPrecision = true;

  }

  initRequest(): void {
    this.request.customerId = this.customerIdNumber;
    this.request.requestType = this.requestType;
    this.request.step = 2;
    if ( this.universes !== null && this.universes.length === 1) {
      this.request.universId = this.universes[0].id;
      this.initInteractionReasonList();
    }
    if ( this.interlocutors !== null && this.interlocutors.length > 0) {
      this.request.interlocuteurId = this.interlocutors[0].idPerson;
    }
    if ( this.typeCustomer === CONSTANTS.TYPE_COMPANY && this.recipients.length> 0) {
      this.request.recepientId = this.recipients[0].idCustomer;
    } else {
      this.request.recepientId = getDecryptedValue(this.customerId);
    }
    this.dateChanged();
    this.initAttachedTo();
    this.request.salesReprentatifId = null;
    this.request.accountManagerUserId = null;
    this.request.isConnectedOnWf = true;
    this.request.description="";
    this.checkIfCommercialAndBusinessAccountsMustBeMondatory();
  }

  checkIfCommercialAndBusinessAccountsMustBeMondatory(){
    if(LIST_UPDATED_OF_WORKFLOW_WITH_CART.includes(this.request.requestType.label)){
      this.commercialAndBusinessAccountsRequired = true;
    }
  }

  dateChanged(): void {
    this.request.createdAt = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 
    this.currentDate.getDate(), this.currentHour, this.currentMinutes)
  }

  onSelectTime(time: string) {
    [ this.currentHour, this.currentMinutes] = time.split(' : ').map( e => Number(e));
    this.dateChanged();
  }

  addAutre(): void {
    //As Chorniche
    const autre: Person = { idPerson: 43155, firstName: 'Autre' } as Person;
    this.interlocutors.push(autre);

  }

  initInteraction(): void {
    this.customerInteraction.refMediaId = null;
  }

  initInteractionReasonList(): void {
    this.interactionService.listInteractionReasons(this.request.universId, 
      this.requestType.id, 'CREATION', false, false).subscribe(irList => {
        this.interactionReasonList = irList;
        if (this.interactionReasonList && this.interactionReasonList.length === 1 
          && this.interactionReasonList[0].children.length === 1) {
          this.request.title = this.interactionReasonList[0].label + ' > ' + this.interactionReasonList[0].children[0].label;
          // tslint:disable-next-line: max-line-length
          this.customerInteraction.interactionReasonId = this.interactionReasonList[0].children.length === 1 ? this.interactionReasonList[0].children[0].id : 0;
          this.interactionReasonSelected = this.interactionReasonList[0];
        }
      });
  }

  initInteractionReasonId(): number {
    return this.interactionReasonList && this.interactionReasonList.length === 1 
    && this.interactionReasonList[0].children.length === 1 ? this.interactionReasonList[0].children[0].id : 0;
  }

  buildRequestDescription(): void {
    this.request.mediaId = this.customerInteraction.refMediaId;
    this.requestDescription.createdAt = this.request.createdAt;
    this.requestDescription.firstNameInterlocuteur = this.interlocutors
      .find(interlocutor => interlocutor.idPerson === this.request.interlocuteurId ).firstName;
    this.requestDescription.lastNameInterlocuteur = this.interlocutors
      .find(interlocutor => interlocutor.idPerson === this.request.interlocuteurId ).lastName;
    this.requestDescription.description = this.request.description;
    this.requestDescription.universLabel = this.universes
      .find(universe => universe.id === this.request.universId ).label;
    this.requestDescription.title = this.request.title;
    if (!this.hasNotInteraction) {
      this.requestDescription.mediaLabel = this.mediaData
      .find(media => media.id === Number(this.customerInteraction.refMediaId) ).label;
    }  
  }

  // onRequestCreationContextChange(): void {
  //   this.workflowService.firstQuestions(this.requestType.workflowId, 8514, this.request.customerId, this.customerInteraction.refMediaId,
  //   this.request.universId, this.request.title,
  //   this.request.accountManagerUserId, null).subscribe(questionsList => {
  //     this.questions = questionsList;
  //     console.info('this.questions: ', this.questions);
  //   });
  // }

  setCanonicalLabel(): void {
    this.customerInteraction.interactionReasonId = this.interactionReasonSelected.id;
    const parentLabel = this.interactionReasonList.find(ir => ir.id === this.interactionReasonSelected.parentId).label;
    this.request.title = parentLabel + ' > ' + this.interactionReasonSelected.label;
  }

  onSelectInteractionReason(interactionReason: any): void {
    this.interactionReasonSelected = interactionReason;
    this.setCanonicalLabel();
  }

  onFormGroupChange( form: FormGroup): void {
    this.form = form;
    if (this.form.valid) {
      this.submitted = true;
    }
  }

 onCanceledChange(canceled: boolean): void {
    this.canceled = canceled;
  }

  cancelQuestionsOfRequest(): void {
    this.loading = true;
    this.workflowService.cancelQuestionsOfRequest(this.requestCreationContextVO, this.instanceId, this.user.activeRole.roleName).subscribe(data => { 
      if(data){
        this.showReinitialise = false;
        this.showNextButton=false;
        this.loading = false;
        this.instanceId = data.id;
        this.request.instanceId = this.instanceId;
        //reinitialiser le bloc des questions et les reponses inseres precedemment
        this.container.clear();
        this.questionsSelected = [];
        this.requestAnswers = [];
        this.getNextQuestion(data);
        this.isOnDynamicQuestions = true;
      }
    });

  }
  
  /**
   * @ROLE : RENDRING 'RequestClosureComponent' USING THE CONDITION 'isClosure'
   * @author YOUNESS FATHI
   * @param requestForm: NgForm
   */
  onCloseImmediately(requestForm: NgForm): void {
    if (requestForm.valid) {
      this.buildRequestDescription();
      this.moveToNextStep();
      this.isClosure = true;
      this.onCanceledChange(true);
    }
  }
  /**
   * @ROLE : MODIFY THE PROGRESS BAR USING THE CONDITION 'isCreatingRequest'
   * @author YOUNESS FATHI
   */
  moveToNextStep(): void {
    this.isCreatingRequest = false;
  }

  onSubmittedChange(submitted: boolean): void {
    this.submitted = submitted;
  }

  checkTheExistenceOfTheRequestsCurrentlyOpened(): void {
    if ( this.openRequests.length > 0) { 
      const modal = this.modalService.open(CheckingRequestCurrentlyOpenedPopUpComponent,
        { centered: true, size: 'lg', backdrop : 'static', keyboard: false });
      modal.componentInstance.parcours = this.requestType.label;
      modal.componentInstance.openRequests = this.openRequests;
      modal.componentInstance.customerId = this.customerId;
      modal.result.then((decline: boolean) => {
        this.canceled = false;
        this.form = this.fb.group({});
        this.submitted = true;
        if ( decline ) {
          this.router.navigate(
            ['/customer-dashboard', this.customerId, 'request', 'parcours'],
            { queryParamsHandling: 'merge' }
          );
        }
      });
    }
  }

cancelRequestCreation(){ 
  if ( !isNullOrUndefined(this.instanceId) ) {
    this.loading = true;
    this.workflowService.killInstanceOfRequest(this.instanceId).subscribe(
      _data => {},
      (error) => {
        console.error('killInstanceOfRequest failed: ', error);
        this.loading=false;
      },
      () => this.loading=false,
    );
  }
}

doSomethingBeforeLeavePage(): void {
  this.cancelRequestCreation();
}


formatAnswerWhenTypeIsBooelan(requestAnswer : RequestAnswersVO):string{
  return requestAnswer.type === 'boolean'? (requestAnswer.answer ? requestAnswer.answer.split(":")[1]  : " "): requestAnswer.answer;
  

}
}
