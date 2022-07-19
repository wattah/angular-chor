import { fullNameFormatter } from './../../../_core/utils/formatter-utils';
import { ProcedureName } from './../../../_core/enum/procedure-name.enum';
import { saveAs } from 'file-saver';
import { TaskNameVerificationService } from './../../../_core/services/task-name-verification.service';
import { DocumentService } from './../../../_core/services/documents-service';
import { ConfirmationDialogService } from './../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { ProcedureService } from './../../../_core/services/procedure.service';
import { CartService } from './../../../_core/services/cart.service';
import { InterventionReportService } from './../../../_core/services/intervention-report.service';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { RequestCustomerVO } from 'src/app/_core/models/request-customer-vo';
import { RequestAnswersVO } from '../../../_core/models/request-answers-vo';

import { TaskLight } from '../../../_core/models/task-customer-vo';
import { HistoryItemVO, MessageTemplateLightVO } from '../../../_core/models/models';
import {
  TASK_STATUS,
  HISTORY_ACTION,
  CURRENT_STATUS,
  CURRENT_STATUS_WITH_SPECIEL_CHAR,
  PARCOURS_SIMPLES,
  CRI_PERMISSIONS,
  FACTURE_VERIFIER,
  ENTREE_CERCLE_PARNASSE,
  SAV,
  WELCOME_MAIL,
  RECOUVREMENT
} from './../../../_core/constants/constants';
import { TaskAnswerVO } from '../../../_core/models';
import { GassiMockLoginService, TaskAnswersService } from '../../../_core/services';
import { WorkflowService } from 'src/app/_core/services/workflow.service';
import { ApplicationUserVO } from 'src/app/_core/models/application-user';
import { getEncryptedValue } from '../../../_core/utils/functions-utils';
import { NotificationService } from '../../../_core/services/notification.service';
import { HomologationAccessService } from './../../../_core/services/homologation-access.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  detailRequest: RequestCustomerVO;
  requestAnswers: RequestAnswersVO[];
  taskDetail: TaskLight;
  taskHistory: HistoryItemVO;
  taskAnswers: TaskAnswerVO[];
  isExistTaskAnswer = false;
  OpenIsTaskRequest = false;
  customerId: string;
  taskId: number;
  notOnWfCreation: boolean;
  readonly taskStatus = TASK_STATUS;
  readonly historyAction = HISTORY_ACTION;
  isDetailOpen = false;
  langDescription = false;
  descriptionParagraphes: string[] = [];
  paragraphes: string;
  description;
  fromChorniche;
  allowedToCRI;
  allowedToModifyTechnicalInformationTab;
  workflowAllowedToCRI;
  CRIAlreadyCreated = false;
  connectedUser : ApplicationUserVO = {} as ApplicationUserVO;
  customerDashboard = '/customer-dashboard';
  currentUserId: number;
  loading: boolean;
  activeRole: string;
  cartHasBlockedItem : boolean;
  typeCustomer: string;

  homologationsIds: number[];

  /* To show 'Traitement' button based on wether 
  the task has a process instance or no 
  */
  traitementButton = false;

  /* To check if the task has a CRI
   */
  hasCRI : boolean;
  assignedFullName: string;
  inChargeOfFullName: string;
  userToNotifyFullName: string;
  isInit = false;
  route: ActivatedRoute;
  location: Location;
  taskAnswerService: TaskAnswersService;
  router: Router;
  workflowService: WorkflowService;
  mockLoginService: GassiMockLoginService;
  procedureService: ProcedureService;
  interventionReportService: InterventionReportService;
  confirmationDialogService: ConfirmationDialogService;
  documentService: DocumentService;
  taskNameVerificationService: TaskNameVerificationService;
  cartService : CartService;
  notificationService : NotificationService;
  homologationAccessService: HomologationAccessService;
  constructor(private readonly injector : Injector) {
    this.injectServices();
  }
  injectServices() {
    this.route = this.injector.get<ActivatedRoute>(ActivatedRoute);
    this.location = this.injector.get<Location>(Location);
    this.taskAnswerService = this.injector.get<TaskAnswersService>(TaskAnswersService);
    this.router = this.injector.get<Router>(Router);
    this.workflowService = this.injector.get<WorkflowService>(WorkflowService);
    this.mockLoginService = this.injector.get<GassiMockLoginService>(GassiMockLoginService);
    this.procedureService = this.injector.get<ProcedureService>(ProcedureService);
    this.interventionReportService = this.injector.get<InterventionReportService>(InterventionReportService);
    this.confirmationDialogService = this.injector.get<ConfirmationDialogService>(ConfirmationDialogService);
    this.documentService = this.injector.get<DocumentService>(DocumentService);
    this.taskNameVerificationService = this.injector.get<TaskNameVerificationService>(TaskNameVerificationService);
    this.cartService  = this.injector.get<CartService>(CartService);
    this.notificationService  = this.injector.get<NotificationService>(NotificationService);
    this.homologationAccessService = this.injector.get<HomologationAccessService>(HomologationAccessService);
  }

  ngOnInit() {
    console.log('timezone' , new Date().getTimezoneOffset());
    this.notOnWfCreation = Boolean(this.route.snapshot.data['notOnWfCreation']);
    this.route.data.subscribe(resolversData => {
      this.detailRequest = resolversData['detailRequest'];
      this.requestAnswers = resolversData['requestAnswers'];
      this.taskDetail = resolversData['taskDetail'];
      this.verifytaskDescription();
      this.taskHistory = resolversData['taskHistory'];
      this.homologationsIds = resolversData['homologationsIds'];
      this.isInit = true;
    
    });

    this.fillListOfCreatedCRI();

    this.route.parent.paramMap.subscribe(params => {
      this.customerId = params.get('customerId');
    });
    this.route.paramMap.subscribe(params => {
      this.taskId = Number(params.get('taskId'));
    });

    this.showTraitementButton();

    this.getCurrentUser();
    this.checkPermissionToCRI();
    this.cartService.getIfCartHasBlockedItemByRequestId(this.detailRequest.idRequest).subscribe(data => {
      this.cartHasBlockedItem = data;
    });
    
    this.initNames()
  }
  initNames() {
    this.assignedFullName = this.formatName(this.taskDetail.assignedToFirstName , this.taskDetail.assignedToLastName);
    this.inChargeOfFullName = this.formatName( this.taskDetail.inChargeOfFirstName , this.taskDetail.inChargeOfLastName);
    this.userToNotifyFullName = this.formatName(this.taskDetail.userToNotifyFirstName , this.taskDetail.userToNotifyLastName);
  }
  formatName(firstName: string , lastName: string){
    return fullNameFormatter(null , firstName , lastName , ' ');
  }

  verifytaskDescription() {
    this.description = !isNullOrUndefined(this.taskDetail.description) ? this.taskDetail.description:'-';
    this.taskAnswerService.getTaskAnswers(this.taskDetail.id).subscribe(taskAnswer => {
      if(taskAnswer !== null && taskAnswer.length !== 0) {
        this.isExistTaskAnswer = true;
        this.taskAnswers = taskAnswer;
      } else {
        this.isExistTaskAnswer = false;
        this.taskAnswers = [];
      }
    });
    this.fromChorniche = isNullOrUndefined(this.detailRequest.instanceId) ? (this.detailRequest.isConnectedOnWf ? true : this.detailRequest.workflowId ? true : false) : false;
    this.typeCustomer = this.route.snapshot.queryParamMap.get("typeCustomer");
  }
  
  disableCRIBtn(){
    return !this.fromChorniche && ((this.workflowAllowedToCRI && this.allowedToCRI) || this.allowedToModifyTechnicalInformationTab );
  }

  checkPermissionToCRI(){
    this.interventionReportService.getInterventionReportByTaskId(this.taskId).subscribe(interventionReport => {
      if(interventionReport.id !== null){
        this.CRIAlreadyCreated = true;
      }
    });
    this.mockLoginService.getCurrentConnectedUser().subscribe((user) => {
      if (user) {
        this.connectedUser = user;
         this.allowedToCRI = user.activeRole.permissions.includes(CRI_PERMISSIONS.ACCESS_TO_CRI);
         this.allowedToModifyTechnicalInformationTab = user.activeRole.permissions.includes(CRI_PERMISSIONS.MODIFY_CRI);
         this.checkWorkflowPermissionToCRIForCoachs();
      }
    });
  }

  
  checkWorkflowPermissionToCRIForCoachs(){
    if(this.connectedUser.activeRole.roleName === 'RESP COACH' || this.connectedUser.activeRole.roleName === 'COACH'){
      this.workflowService.checkIfWorkflowOfRequestAllowedToCRI(this.detailRequest.requestTypeId).subscribe(returnedData => {
        this.workflowAllowedToCRI = returnedData;
      });
    }else{
      this.workflowAllowedToCRI = true;
    }
  }

  getTaskStatus(status: string): string {
    if (this.taskStatus.ASSIGNED.key === status) {
      return this.taskStatus.ASSIGNED.value;
    } else if (this.taskStatus.DONE.key === status) {
      return this.taskStatus.DONE.value;
    }
    return '-';
  }

  getHistoryAction(taskHisto: HistoryItemVO): string {
    if (this.historyAction.CREATION.key === taskHisto.action) {
      return this.historyAction.CREATION.value;
    } else if (this.historyAction.UPDATE.key === taskHisto.action) {
      if (CURRENT_STATUS_WITH_SPECIEL_CHAR.DONE.value === taskHisto.actualStatus ||
        CURRENT_STATUS.DONE.value === taskHisto.actualStatus) {
        return this.historyAction.CLOTURE.value;
      }
      return this.historyAction.UPDATE.value;
    }
    return '';
  }

  openClosDetail(id: number, flag: boolean): void {
    this.taskHistory[id].isDetailOpen = flag;
  }

  openClosTaskAnswer(id: number ,isOpen: boolean): void {
    this.isInit = false;
    this.taskHistory[id].isDetailOpen = isOpen;
  }

  checkModificationSize(sysComment: string): number {
    if (sysComment) {
      return sysComment.match(/<strong>/gi)
        ? sysComment.match(/<strong>/gi).length
        : 0;
    }
    return 0;
  }
  customSystemComment(sysComment: string): string {
    const re = /\<strong>/gi;
    return sysComment
      ? sysComment.replace(re, '<br /><strong>').replace('<br />', '')
      : sysComment;
  }

  isComplexRequest(techKey: any): boolean {
    return !Object.values(PARCOURS_SIMPLES).includes(techKey);
  }

  /**
   * retour à la page précédente
   */
  navigateBack(): void {
    this.location.back();
  }
  onRedirectForTaskCloture(){
    const thetisTaskIdToReturn = this.detailRequest.tasks.filter(task => task.id === this.taskDetail.id)[0].thetisTaskId;
    const typeCustomerToResturn = this.route.snapshot.queryParamMap.get('typeCustomer');
    this.router.navigate(
      [this.customerDashboard, this.customerId, 'request', this.detailRequest.idRequest, 'taskassignment', this.taskDetail.id], { 
        queryParams: { idRequest: this.detailRequest.idRequest, 
          processInstanceId : this.detailRequest.instanceId, 
          thetisTaskId : thetisTaskIdToReturn,
          nextIdTask:  this.getNextIdTask(this.taskDetail.id),
          typeCustomer: typeCustomerToResturn
        }
      }
    );
  }

  getNextIdTask(id: number): number {
    if(this.detailRequest && this.detailRequest.tasks){
      const task =  this.detailRequest.tasks.filter(task=> task.id !== id && task.status === 'ASSIGNED')[0];
      if(task){
        return task.id
      }
    }
    return 0;
  }

  onRedirectForCriCreation(): void {
    this.router.navigate(
      [this.customerDashboard, this.customerId, 'cri' , 'creation' , this.detailRequest.idRequest, this.taskDetail.id],
      { 
        queryParams: { isFromDetailReq: false},
        queryParamsHandling: 'merge' 
      }
     ); 
  }

  getCurrentUser(): void {
    this.mockLoginService.getCurrentUserId().subscribe((userId) => {
      this.currentUserId = userId;
    });
    this.mockLoginService.getCurrentConnectedUser().subscribe(
      (user)=>{
        this.activeRole = user.activeRole.roleName;
      }
    );
  }

  onRedirect(): void {
    if (this.detailRequest.requestTypeLabel.toLocaleUpperCase() === WELCOME_MAIL.REQUEST_TYPE_LABEL.toLocaleUpperCase() 
    && this.taskDetail.name.toLocaleUpperCase() === WELCOME_MAIL.TASK_NAME.toLocaleUpperCase()) {
      this.goToWelcomeMail();
    }
    if (this.detailRequest.requestTypeLabel.toLocaleUpperCase() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase() &&
    this.taskNameVerificationService.verifyTaskByNameAndCurrentRoleName(this.taskDetail.name , this.activeRole)){
      this.toSav();
    }
    if (this.detailRequest.requestTypeLabel.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase() 
    && this.taskDetail.name.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.TASK_NAME_VALIDATION.toLocaleUpperCase()) {
      this.goToHomologation();
    }
    if (this.detailRequest.requestTypeLabel.toLocaleUpperCase() === RECOUVREMENT.REQUEST_TYPE_LABEL.toLocaleUpperCase() 
    && (this.taskDetail.name.toLocaleUpperCase() === RECOUVREMENT.TASK_NAME_ENVOI_SMS.toLocaleUpperCase()
    || this.taskDetail.name.toLocaleUpperCase() === RECOUVREMENT.TASK_NAME_SUSPENSION_LIGNES.toLocaleUpperCase() )) {
      this.goToSMSView();
    }
    if (this.detailRequest.requestTypeLabel.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase() 
    && this.taskDetail.name.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.TASK_CR_ENTRY.toLocaleUpperCase()) {
      this.showEntryReportMail();
    }
    this.onDownloadBill(this.detailRequest.requestTypeLabel, this.taskDetail.name, this.taskDetail.id, this.currentUserId);
  }

  goToWelcomeMail(): void {
    this.loading = true;
    this.procedureService.runTaskProcedure(ProcedureName.OPEN_WELCOME_MAIL_POPUP, this.taskDetail.id, this.currentUserId).subscribe(_data => {
      this.loading = false;
      this.router.navigate(
        [this.customerDashboard, this.customerId, 'request', this.detailRequest.idRequest, this.taskDetail.id, 'welcome-mail'],
        { queryParamsHandling: 'merge' });
    });
  }

  /**
   * This to open the send mail screen and call the process
   */
  showEntryReportMail(): void {
    this.loading = true;
    this.procedureService.runTaskProcedure(ProcedureName.SHOW_ENTRY_REPORT_MAIL, this.taskDetail.id, this.currentUserId).subscribe(_data => {
      this.loading = false; 
      this.notificationService.setMessageTemplate(_data as MessageTemplateLightVO[]);
      this.router.navigate(
        [this.customerDashboard, this.customerId, 'interaction','mail-sending', this.detailRequest.idRequest, this.detailRequest.requestTypeId , this.detailRequest.universId],
        { queryParamsHandling: 'merge' });
    });
  }

  toSav() {
    this.router.navigate(
      [this.customerDashboard, this.customerId, 'cart' ,this.detailRequest.idRequest, 'sav-mobile'],
        {queryParamsHandling: 'merge'}        
    );
  }

  goToHomologation(): void {
    if (this.homologationsIds && this.homologationsIds.length > 0) {
      if (this.homologationsIds.length === 1) {
        this.router.navigate(
          [this.customerDashboard, this.customerId, 'detail', 'homologation', this.homologationsIds[0]],
          { queryParams: { typeCustomer: this.typeCustomer, isAmendment: false }, queryParamsHandling: 'merge' }
        );
      } else {
        this.openHomologationPopup(this.homologationsIds, this.customerId, this.typeCustomer, this.taskDetail.id);
      }
    } else {
      const title = 'Information';
      const btnOkText = 'OK';
      const comment = 'Pas d\'homologation pour ce client';
      this.confirmationDialogService.confirm(title, comment, btnOkText, null, 'lg', false)
      .then((confirmed) => console.info('It\'s OK'))
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }
  }
  
  openHomologationPopup(homologationsIds: number[], customerId: string, typeCustomer, taskId: number): void {
    this.homologationAccessService.openHomologationPopup(homologationsIds, customerId, typeCustomer, true, taskId);
  }

  goToSMSView(): void {
    this.loading = true;
    this.procedureService.runTaskProcedure(ProcedureName.SHOW_SUSPENSION_SMS, this.taskDetail.id, this.currentUserId).subscribe(data => {
      this.loading = false;
      this.notificationService.setTemplates(data as MessageTemplateLightVO[]);
      this.router.navigate(
        ['/customer-dashboard', this.customerId, 'interaction', this.detailRequest.idRequest, 'sending-sms'], 
        { 
          queryParams: {showSuspension: "O"}, 
          queryParamsHandling: 'merge' }
      );
    });
  } 

  onDownloadBill(requestTypeLabel: string, taskName: string, taskId: number, currentUserId: number): void {
    if (requestTypeLabel.toLocaleUpperCase().trim() === FACTURE_VERIFIER.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
     taskName.toLocaleUpperCase().trim() === FACTURE_VERIFIER.TASK_NAME.toLocaleUpperCase().trim()) {
      this.loading = true;
      this.procedureService.runTaskProcedure(ProcedureName.DOWNLOAD_BILL, taskId, currentUserId)
        .subscribe( (_data: any) => {
          this.loading = false;
          if (isNullOrUndefined(_data)) {
            this.openPopup('La facture n\'a pas été relookée. <br/> Facture indisponible.');
          } else {
            this.downloadBill(_data.fichier);  
          }
        },
        _error => {
          this.loading = false;
          this.openPopup('Erreur Serveur : Une erreur technique inattendue est survenue.');
        });
    }
  }

  downloadBill(filename: string): void {
    this.loading = true;
    this.documentService.getCustomerBillsByFileName(filename).subscribe(
        (data) => {
          this.loading = false;
          const type = data.headers.get('Content-Type');
          const file = saveAs( new Blob([data.body], { type }), filename );
          if ( type !== 'application/octet-stream') {
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
          } else {
            const element = document.createElement('a');
            element.target = '_blank';
            element.href = URL.createObjectURL(file);
            element.download = filename;
            
            document.body.appendChild(element);
            element.click();
          }
        }, 
        (_error) => {
          this.loading = false;
          this.confirmationDialogService.
          confirm('', 'Erreur Technique : La facture que vous souhaitez télécharger est introuvable.', 'Ok', null, 'lg', false);
        }
      );   
  }

  openPopup(text: string): void {
    this.confirmationDialogService.confirm('', text, 'Ok', null, 'lg', false);
  }


  /**
   * To check on the specified task name and process that allow the gear icon
   * for appearance
   */
  showTraitementButton(): void {
    console.log('Traitement button : ', this.detailRequest.requestTypeLabel);
    if (this.detailRequest.requestTypeLabel.toLocaleUpperCase().trim() === FACTURE_VERIFIER.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
    this.taskDetail.name.toLocaleUpperCase().trim() === FACTURE_VERIFIER.TASK_NAME.toLocaleUpperCase().trim() 
    ||
    (this.detailRequest.requestTypeLabel.toLocaleUpperCase().trim() === FACTURE_VERIFIER.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
    this.taskDetail.name.toLocaleUpperCase().trim() === FACTURE_VERIFIER.TASK_NAME_TWO.toLocaleUpperCase().trim())
    ||
    (this.detailRequest.requestTypeLabel.toLocaleUpperCase().trim() === FACTURE_VERIFIER.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
    this.taskDetail.name.toLocaleUpperCase().trim() === FACTURE_VERIFIER.TASK_NAME_THREE.toLocaleUpperCase().trim())
    ||
    (this.detailRequest.requestTypeLabel.toLocaleUpperCase().trim() === FACTURE_VERIFIER.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
    this.taskDetail.name.toLocaleUpperCase().trim() === FACTURE_VERIFIER.TASK_NAME_FOUR.toLocaleUpperCase().trim())
    ||
    (this.detailRequest.requestTypeLabel.toLocaleUpperCase().trim() === FACTURE_VERIFIER.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
    this.taskDetail.name.toLocaleUpperCase().trim() === FACTURE_VERIFIER.TASK_NAME_FIVE.toLocaleUpperCase().trim())
    ||
    this.detailRequest.requestTypeLabel.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
    this.taskDetail.name.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.TASK_NAME.toLocaleUpperCase().trim()
    ||
    this.detailRequest.requestTypeLabel.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
    this.taskDetail.name.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.TASK_NAME_VALIDATION.toLocaleUpperCase().trim()
    ||
    this.detailRequest.requestTypeLabel.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
    this.taskDetail.name.toLocaleUpperCase().trim() === SAV.TASK_NAME_ONE.toLocaleUpperCase().trim() 
    || 
    this.detailRequest.requestTypeLabel.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
    this.taskDetail.name.toLocaleUpperCase().trim() === SAV.TASK_NAME_TWO.toLocaleUpperCase().trim()
    ||
    this.detailRequest.requestTypeLabel.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
    this.taskDetail.name.toLocaleUpperCase().trim() === SAV.TASK_NAME_TWO.toLocaleUpperCase().trim()
    || 
    this.detailRequest.requestTypeLabel.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() && 
    this.taskDetail.name.toLocaleUpperCase().trim() === SAV.TASK_NAME_FOUR.toLocaleUpperCase().trim() 
    ||
    this.detailRequest.requestTypeLabel.toLocaleUpperCase().trim() === RECOUVREMENT.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
    this.taskDetail.name.toLocaleUpperCase().trim() === RECOUVREMENT.TASK_NAME_ENVOI_SMS.toLocaleUpperCase().trim()
    ||
    this.detailRequest.requestTypeLabel.toLocaleUpperCase().trim() === RECOUVREMENT.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
    this.taskDetail.name.toLocaleUpperCase().trim() === RECOUVREMENT.TASK_NAME_SUSPENSION_LIGNES.toLocaleUpperCase().trim()
    ||
    this.detailRequest.requestTypeLabel.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase() 
    && this.taskDetail.name.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.TASK_CR_ENTRY.toLocaleUpperCase()
    ) {
      this.traitementButton = true;
    }
  }

  /**
   * this function calls the service to check the task has
   * already a CRI
   */
  fillListOfCreatedCRI(){
      this.interventionReportService.getInterventionReportByTaskId(this.taskDetail.id).subscribe(interventionReport => {
        if(interventionReport.id !== null){
          this.hasCRI = true;
        } else {
          this.hasCRI = false;
        }
      });   
  }

}
