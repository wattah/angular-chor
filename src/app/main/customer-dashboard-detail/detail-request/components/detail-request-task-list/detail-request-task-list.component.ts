import { fullNameFormatter } from 'src/app/_core/utils/formatter-utils';
import { ProcedureService } from './../../../../../_core/services/procedure.service';
import { TaskNameVerificationService } from './../../../../../_core/services/task-name-verification.service';
import { DocumentService } from './../../../../../_core/services/documents-service';
import { ConfirmationDialogService } from './../../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { saveAs } from 'file-saver';
import { ProcedureName } from './../../../../../_core/enum/procedure-name.enum';
import { FACTURE_VERIFIER, SAV, WELCOME_MAIL, CONSTANTS, TASK_STATUS } from './../../../../../_core/constants/constants';
import { AuthTokenService } from './../../../../../_core/services/auth_token';
import { RedirectionService } from './../../../../../_core/services/redirection.service';
import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { dateComparator } from '../../../../../_core/utils/date-utils';
import { TaskLight } from '../../../../../_core/models/task-customer-vo';
import { firstNameFormatter, toUpperCase } from '../../../../../_core/utils/formatter-utils';
import { getDefaultStringEmptyValue, isNullOrUndefined } from '../../../../../_core/utils/string-utils';
import { DateFormatPipeFrench } from '../../../../../_shared/pipes';
import { WorkflowService } from 'src/app/_core/services/workflow.service';
import { GassiMockLoginService } from 'src/app/_core/services/gassi-mock-login.service';
import { CRI_PERMISSIONS , ENTREE_CERCLE_PARNASSE, RECOUVREMENT } from '../../../../../_core/constants/constants';
import { InterventionReportService } from 'src/app/_core/services/intervention-report.service';
import { ApplicationUserVO } from 'src/app/_core/models/application-user';
import { MessageTemplateLightVO } from './../../../../../_core/models/models';
import { NotificationService } from './../../../../../_core/services/notification.service';
import { HomologationAccessService } from './../../../../../_core/services/homologation-access.service';


@Component({
  selector: 'app-detail-request-task-list',
  templateUrl: './detail-request-task-list.component.html',
  styleUrls: ['./detail-request-task-list.component.scss']
})
export class DetailRequestTaskListComponent implements OnChanges , OnInit {
  
  @Input()
  tasks: TaskLight[];

  @Input()
  customerId: string;

  @Input()
  idRequest: number;

  @Input()
  requestLabel: string;

  @Input()
  requestObject: string;

  @Input()
  processInstanceId: string;

  @Input() requestStatus: string;

  @Input() requestTypeId:number;

  @Input() isConnectedOnWF:boolean;

  @Input() cartHasBlockedItem : boolean;

  @Input() universId : string;

  @Input() workflowId:number;

  connectedUser : ApplicationUserVO = {} as ApplicationUserVO;

  defaultSortModel;

  columnDefs;

  typeCustomer: string;
  classStyleIconePen : any = 'text-right cell-wrap-text';

  isDetailRequestReady : boolean = false;

  //isClosed: verifie si la demande est cloture
  @Input() isClosedRequest : boolean ;

  //isClosed: verifie si tous les taches de la demande sont clotures
  @Input() isClosed : boolean ;

  @Input() homologationsIds: number[];

  params: any;

  isRequestClosed: boolean ;
  fromChorniche;
  workflowAllowedToCRI;
  allowedToCRI;
  allowedToModifyTechnicalInformationTab;
  createdCRIs : number[]= [];
  activeRole: string;
  currentUser: any;
  loading = false;
  customerDashboard = '/customer-dashboard';

  private readonly modificationTachesPermission = 'modification_taches';

  private readonly penIcon = 'pen';

  private readonly cadenasRougeClassName = 'cadenas-rouge';

  private readonly clotureTachesPermission = 'cloture_taches';

  private readonly criEditClassName = 'cri-edit';

  private readonly criCreateClassName = 'cri-create';

  private readonly addTaskClassName = 'add-task';

  private readonly cellWrapTextClassName = 'cell-wrap-text';

  private readonly orangeClassName = 'orange';

  private readonly statusDONE = 'DONE';

  private readonly fontItalicGreyClassName = 'font-italic grey';

  private readonly negativeValue = 'negative-value';

  private readonly blackClassName = 'black';

  private readonly parametresClassName = 'parameters';

  private readonly endDateColId = 'endDate';

  private readonly sortModeAsc = 'asc';

  router: Router;
  dateFormatPipeFrench: DateFormatPipeFrench;
  datePipe: DatePipe;
  route: ActivatedRoute;
  redirectionService: RedirectionService;
  workflowService: WorkflowService;
  mockLoginService: GassiMockLoginService;
  procedureService: ProcedureService;
  interventionReportService: InterventionReportService;
  authTokenService: AuthTokenService;
  confirmationDialogService: ConfirmationDialogService;
  documentService: DocumentService;
  taskNameVerificationService: TaskNameVerificationService;
  notificationService : NotificationService;
  homologationAccessService: HomologationAccessService

  constructor(private readonly injector : Injector) {
    this.injectServices();
  }
  injectServices() {
    this.router = this.injector.get<Router>(Router);
    this.dateFormatPipeFrench = this.injector.get<DateFormatPipeFrench>(DateFormatPipeFrench);
    this.datePipe = this.injector.get<DatePipe>(DatePipe);
    this.route = this.injector.get<ActivatedRoute>(ActivatedRoute);
    this.redirectionService = this.injector.get<RedirectionService>(RedirectionService);
    this.workflowService = this.injector.get<WorkflowService>(WorkflowService);
    this.mockLoginService = this.injector.get<GassiMockLoginService>(GassiMockLoginService);
    this.procedureService = this.injector.get<ProcedureService>(ProcedureService);
    this.interventionReportService = this.injector.get<InterventionReportService>(InterventionReportService);
    this.authTokenService = this.injector.get<AuthTokenService>(AuthTokenService);
    this.confirmationDialogService = this.injector.get<ConfirmationDialogService>(ConfirmationDialogService);
    this.documentService = this.injector.get<DocumentService>(DocumentService);
    this.taskNameVerificationService = this.injector.get<TaskNameVerificationService>(TaskNameVerificationService);
    this.notificationService  = this.injector.get<NotificationService>(NotificationService);
    this.homologationAccessService = this.injector.get<HomologationAccessService>(HomologationAccessService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['tasks'] && !isNullOrUndefined(this.tasks))) {
      this.typeCustomer = this.route.snapshot.queryParamMap.get("typeCustomer");
      this.tasks.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
      
      this.defaultSortModel = [
        { colId: this.endDateColId, sort: this.sortModeAsc }
      ];
    }
    if ((changes['customerId'] && !isNullOrUndefined(this.customerId)) && (changes['idRequest'] && !isNullOrUndefined(this.idRequest))) {
      this.isDetailRequestReady = true;
    }
    this.checkPermissionToCRI();    
  }

  fillListOfCreatedCRI(){
    this.tasks.forEach(task => {
      this.interventionReportService.getInterventionReportByTaskId(task.id).subscribe(interventionReport => {
        if(interventionReport.id !== null){
          this.createdCRIs.push(task.id);
          this.params =  {
            force: true,
            suppressFlash: true,
          };
        } 
      });
    });
    
  }
  
  ngOnInit(){
    this.redirectionService.getAgGridLoader().subscribe(
      (load)=>{
        if(load){
          this.params =  {
            force: true,
            suppressFlash: true,
          };
        }
      }
    );
    this.mockLoginService.getCurrentConnectedUser().subscribe(
      (user)=>{
        this.activeRole = user.activeRole.roleName;
      }
    );

    this.fromChorniche = isNullOrUndefined(this.processInstanceId) ? (this.isConnectedOnWF ? true : this.workflowId ? true : false) : false;
    
    this.checkPermissionToCRI();
    this.fillListOfCreatedCRI();
    /*------------------get current User---------------------------*/
    this.currentUser = this.authTokenService.applicationUser;
  }
  


  checkPermissionToCRI(){
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
      this.workflowService.checkIfWorkflowOfRequestAllowedToCRI(this.requestTypeId).subscribe(returnedData => {
        this.workflowAllowedToCRI = returnedData;
        this.params =  {
          force: true,
          suppressFlash: true,
        };
      });
    }else{
      this.workflowAllowedToCRI = true;
      this.params =  {
        force: true,
        suppressFlash: true,
      };
    }
  }
  eligbleToSeeCRIIcon(params: any) {
    if ( params &&  !this.fromChorniche && ((this.workflowAllowedToCRI && this.allowedToCRI) || this.allowedToModifyTechnicalInformationTab)) {
      if( this.checkIfCRIIsAlreadyCreated(params.data) ) {
        return this.createSpanElement(this.criEditClassName);
      } else {
        return this.createSpanElement(this.criCreateClassName);
      }
    }
    return '';
  }
  eligbleToSeePenIcon(params: any) {
    if (this.redirectionService.hasPermission(this.modificationTachesPermission) && !this.fromChorniche) {
      return this.createSpanElement(this.penIcon);
    }
    return '';
  }
  eligbleToSeeKeyIcon(params: any) {
    if(this.cartHasBlockedItem){
      return this.createSpanElement(this.cadenasRougeClassName);
    }
    if (this.redirectionService.hasPermission(this.clotureTachesPermission) && !this.fromChorniche) {
      return this.createSpanElement(this.getClassNameByConnectedUser(params));;
    }
    return '';
  }
  private eligbleToSeeProcessIcon(params: any) {
    return !this.fromChorniche && !(params.data.status === TASK_STATUS.DONE.key) &&
      (this.requestLabel.toLocaleUpperCase().trim() === FACTURE_VERIFIER.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
        params.data.taskPending.toLocaleUpperCase().trim() === FACTURE_VERIFIER.TASK_NAME.toLocaleUpperCase().trim()
        ||
        this.requestLabel.toLocaleUpperCase().toLocaleUpperCase().trim() === FACTURE_VERIFIER.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
        params.data.taskPending.toLocaleUpperCase().trim() === FACTURE_VERIFIER.TASK_NAME_TWO.toLocaleUpperCase().trim()
        ||
        this.requestLabel.toLocaleUpperCase().toLocaleUpperCase().trim() === FACTURE_VERIFIER.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
        params.data.taskPending.toLocaleUpperCase().trim() === FACTURE_VERIFIER.TASK_NAME_THREE.toLocaleUpperCase().trim()
        ||
        this.requestLabel.toLocaleUpperCase().toLocaleUpperCase().trim() === FACTURE_VERIFIER.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
        params.data.taskPending.toLocaleUpperCase().trim() === FACTURE_VERIFIER.TASK_NAME_FOUR.toLocaleUpperCase().trim()
        ||
        this.requestLabel.toLocaleUpperCase().toLocaleUpperCase().trim() === FACTURE_VERIFIER.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
        params.data.taskPending.toLocaleUpperCase().trim() === FACTURE_VERIFIER.TASK_NAME_FIVE.toLocaleUpperCase().trim()
        ||
        this.requestLabel.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
        params.data.taskPending.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.TASK_NAME.toLocaleUpperCase().trim()
        ||
        this.requestLabel.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
        params.data.taskPending.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.TASK_NAME_VALIDATION.toLocaleUpperCase().trim()
        ||
        this.requestLabel.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
        params.data.taskPending.toLocaleUpperCase().trim() === SAV.TASK_NAME_ONE.toLocaleUpperCase().trim()
        ||
        this.requestLabel.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
        params.data.taskPending.toLocaleUpperCase().trim() === SAV.TASK_NAME_TWO.toLocaleUpperCase().trim()
        ||
        this.requestLabel.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
        params.data.taskPending.toLocaleUpperCase().trim() === SAV.TASK_NAME_THREE.toLocaleUpperCase().trim()
        ||
        this.requestLabel.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
        params.data.taskPending.toLocaleUpperCase().trim() === SAV.TASK_NAME_FOUR.toLocaleUpperCase().trim()
        ||
        this.requestLabel.toLocaleUpperCase().trim() === RECOUVREMENT.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
        params.data.taskPending.toLocaleUpperCase().trim() === RECOUVREMENT.TASK_NAME_ENVOI_SMS.toLocaleUpperCase().trim()
        ||
        this.requestLabel.toLocaleUpperCase().trim() === RECOUVREMENT.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
        params.data.taskPending.toLocaleUpperCase().trim() === RECOUVREMENT.TASK_NAME_SUSPENSION_LIGNES.toLocaleUpperCase().trim()
        ||
        this.requestLabel.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase()
        && params.data.taskPending.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.TASK_CR_ENTRY.toLocaleUpperCase()
      ) ? this.createSpanElement(this.parametresClassName) : ``;
  }

  private addClassNameToField(params: any) {
    const classes = [this.cellWrapTextClassName];
    if (params.data.isPriority) {
      classes.push(this.orangeClassName);
    }
    if (params.data.status === this.statusDONE) {
      classes.push(this.fontItalicGreyClassName);
    }
    return classes;
  }

  private addClassToRemainingTimeField(params: any) {
    const classes = [this.cellWrapTextClassName];
    if (params.data.remainingTime && params.data.remainingTime > 0) {

      classes.push(this.blackClassName);
    } else if (params.data.status === this.statusDONE) {
      classes.push(this.fontItalicGreyClassName);
    } else {
      classes.push(this.negativeValue);
    }
    return classes;
  }


  formatDate(date: string) {
    if (date === 'null') {
      return '-';
    }
    return `${this.dateFormatPipeFrench.transform(date, 'dd MMM yyyy')}
      - 
      ${this.datePipe.transform(date , "HH'h'mm")}`;
  }

  checkIfCRIIsAlreadyCreated(task){    
    const exist = this.createdCRIs.findIndex(id => id === task.id);
    return exist !== -1;
  }

  clickCell(params: any): void {
    if (params.column.colId === 'update' && params.data.status === 'ASSIGNED' && this.redirectionService.hasPermission('modification_taches') && !this.fromChorniche) {
      this.router.navigate(
        [this.customerDashboard, this.customerId, 'request', this.idRequest, 'modifyTask', params.data.id],
        {
          queryParams: { isDetail: false, name : null },
          queryParamsHandling: 'merge'
        }
      );
    } else if (params.column.colId === 'close' && params.data.status === 'ASSIGNED' && this.redirectionService.hasPermission('cloture_taches') && !this.fromChorniche && !this.cartHasBlockedItem) {
      this.router.navigate(
        [this.customerDashboard, this.customerId, 'request', this.idRequest, 'taskassignment', params.data.id], {
        queryParams: {
          idRequest: this.idRequest,
          processInstanceId: this.processInstanceId,
          thetisTaskId: params.data.thetisTaskId,
          nextIdTask: this.getNextIdTask(params.data.id),
          typeCustomer: this.typeCustomer
        }
      }
      );
    }
    else if (params.column.colId === 'cri'  && !this.fromChorniche && (( this.workflowAllowedToCRI && this.allowedToCRI ) || this.allowedToModifyTechnicalInformationTab)) { 
      this.router.navigate(
       [this.customerDashboard, this.customerId,'cri','creation', this.idRequest, params.data.id],
       { 
        queryParams: { isFromDetailReq: true},
         queryParamsHandling: 'merge' }
      );
    } else if(params.column.colId === 'process' && !this.fromChorniche &&  !(params.data.status === TASK_STATUS.DONE.key)){
      this.toSav(params.data);
      this.goToWelcomeMail(params.data);
      this.onDownloadBill(this.requestLabel, params.data.taskPending, params.data.id, this.connectedUser.coachId);
      this.goToHomologation(params.data);
      this.goToSMSView(params.data);
      this.showEntryReportMail(params.data.id, this.connectedUser.coachId, params.data.taskPending);
      }else{
      
      this.router.navigate(
          [this.customerDashboard, this.customerId, 'request', this.idRequest, 'task-details', params.data.id],
          { queryParamsHandling: 'merge' }
        );
    }
  }

  getNextIdTask(id: number): number {
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id !== id && this.tasks[i].status === 'ASSIGNED') {
        return this.tasks[i].id;
      }
    }
    return 0;
  }

  toSav(data) {
    if(this.requestLabel.toLocaleUpperCase() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase() &&
    this.taskNameVerificationService.verifyTaskByNameAndCurrentRoleName(data.taskPending , this.activeRole)){
        this.router.navigate(
          [this.customerDashboard, this.customerId, 'cart' ,this.idRequest, 'sav-mobile'],
            {
             queryParams: { typeCustomer: this.typeCustomer },
             queryParamsHandling: 'merge'
          }        
        );
    }
  }

  goToWelcomeMail(data: any): void {
    if (this.requestLabel.toLocaleUpperCase() === WELCOME_MAIL.REQUEST_TYPE_LABEL.toLocaleUpperCase() 
    && data.taskPending.toLocaleUpperCase() === WELCOME_MAIL.TASK_NAME.toLocaleUpperCase()) {
      this.loading = true;
      this.procedureService.runTaskProcedure(ProcedureName.OPEN_WELCOME_MAIL_POPUP, data.id, this.currentUser.coachId).subscribe(_data => {
        this.loading = false;
        this.router.navigate(
          [this.customerDashboard, this.customerId, 'request', this.idRequest, data.id, 'welcome-mail'],
          { queryParams: { typeCustomer: this.typeCustomer }, queryParamsHandling: 'merge' });
      });
    }
  }

  goToHomologation(data: any): void {
    if (this.requestLabel.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase() 
    && data.taskPending.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.TASK_NAME_VALIDATION.toLocaleUpperCase()) {
      if (this.homologationsIds && this.homologationsIds.length > 0) {
        if (this.homologationsIds.length === 1) {
          this.router.navigate(
            ['/customer-dashboard', this.customerId, 'detail', 'homologation', this.homologationsIds[0]],
            { queryParams: { typeCustomer: this.typeCustomer, isAmendment: false }, queryParamsHandling: 'merge' }
          );
        } else {
          this.openHomologationPopup(this.homologationsIds, this.customerId, this.typeCustomer, data.id);
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
  }

  openHomologationPopup(homologationsIds: number[], customerId: string, typeCustomer, taskId: number): void {
    this.homologationAccessService.openHomologationPopup(homologationsIds, customerId, typeCustomer, true, taskId);
  }

  goToSMSView(data: any): void {
    if (this.requestLabel.toLocaleUpperCase() === RECOUVREMENT.REQUEST_TYPE_LABEL.toLocaleUpperCase() 
    && ( data.taskPending.toLocaleUpperCase() === RECOUVREMENT.TASK_NAME_ENVOI_SMS.toLocaleUpperCase()
    || data.taskPending.toLocaleUpperCase() === RECOUVREMENT.TASK_NAME_SUSPENSION_LIGNES.toLocaleUpperCase())) {
      this.loading = true;
      this.procedureService.runTaskProcedure(ProcedureName.SHOW_SUSPENSION_SMS, data.id, this.currentUser.coachId).subscribe(_data => {
      this.loading = false;
      this.notificationService.setTemplates(_data as MessageTemplateLightVO[]);
      this.router.navigate(
        ['/customer-dashboard', this.customerId, 'interaction', this.idRequest, 'sending-sms'], 
        { 
          queryParams: {showSuspension: "O"}, 
          queryParamsHandling: 'merge' }
        );
      });
    }
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
            this.documentService.downloadBill(_data.fichier);  
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
   * This to open the send mail screen and call the process
   */
  showEntryReportMail(taskId: number, currentUserId: number, taskName: string): void {
    if (this.requestLabel.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase()
    && taskName.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.TASK_CR_ENTRY.toLocaleUpperCase()) {
      this.loading = true;
      this.procedureService.runTaskProcedure(ProcedureName.SHOW_ENTRY_REPORT_MAIL, taskId, currentUserId).subscribe(_data => {
        this.loading = false;
        this.notificationService.setMessageTemplate(_data as MessageTemplateLightVO[]);
        this.router.navigate(
          [this.customerDashboard, this.customerId, 'interaction','mail-sending', this.idRequest, this.requestTypeId , this.universId],
          { queryParamsHandling: 'merge' });
      });
    }
  }

  columnDefsProvisoir = [
      {
        headerName: 'CRÉÉE LE',
        headerTooltip: 'CRÉÉE LE',
        valueGetter: params => this.formatDate(params.data.createdDate),
        field: 'createdDate',
        cellClass: params => this.addClassNameToField(params),
        autoHeight: true,
        width: 120
      },
      {
        headerName: 'TÂCHE',
        headerTooltip: 'TÂCHE',
        field: 'media',
        width: 180,
        autoHeight: true,
        sortable: false,
        cellRenderer: params => {
          if (params.data.taskPending === 'null') {
            return '-';
          }
          return this.addPlusIconBeforeManualleTaskName(params);
        },
        cellClass: params => this.addClassNameToField(params)
      },
      {
        headerName: 'TRAITÉE PAR',
        headerTooltip: 'TRAITÉE PAR',
        field: 'firstName',
        width: 160,
        valueGetter: params => fullNameFormatter(null ,  params.data.firstName, params.data.lastName),
        cellClass: params => this.addClassNameToField(params),
        autoHeight: true,
        sortable: false
      },
      {
        headerName: '',
        headerTooltip: '',
        headerComponentParams: { template: this.createSpanElement('calendar-grey') },
        field: 'remainingTime',
        valueGetter: params => getDefaultStringEmptyValue(params.data.remainingTime),
        cellClass: params => this.addClassToRemainingTimeField(params),
        width: 50,
        autoHeight: true,
        sortable: false
      },
      {
        headerName: 'ÉCHÉANCE',
        headerTooltip: 'ÉCHÉANCE',
        field: this.endDateColId,
        width: 160,
        valueGetter: params => this.formatDate(params.data.endDate),
        comparator: dateComparator,
        autoHeight: true,
        cellClass: params => this.addClassNameToField(params),
      },
      {
        headerName: '',
        headerTooltip: '',
        field: 'cri',
        cellRenderer: params => {
          return this.eligbleToSeeCRIIcon(params);
        },
        cellClass: this.classStyleIconePen,
        sortable: false,
        width: 60
      },

      {
        headerName: '',
        headerTooltip: '',
        field: 'update',
        cellRenderer: params => {
            return this.eligbleToSeePenIcon(params);
        },
        cellClass: this.classStyleIconePen,
        sortable: false,
        width: 60
      },
      {
        headerName: '',
        headerTooltip: '',
        width: 60,
        field: 'process',
        cellRenderer: (params) => {
          return  this.eligbleToSeeProcessIcon(params)
        },
        autoHeight: true,
        sortable: false,
      },
      {
        headerName: '',
        headerTooltip: '',
        field: 'close',
        cellRenderer: params => {
          return this.eligbleToSeeKeyIcon(params);
        },
        cellClass: this.classStyleIconePen,
        sortable: false,
        width: 60
      },
      {
        headerName: '',
        cellRenderer: 'searchBtnRendererComponent',
        cellClass: 'text-center',
        sortable: false,
        width: 60
      }
    ];

    createSpanElement(className: string) {
      return `<span class="icon ${className}"></span>`;
    }

    getClassNameByConnectedUser(params: any): string {
      const assignedToId = params.data.assignedToId;
      return assignedToId === this.connectedUser.coachId ? 'key-green':'key';
    }

    addPlusIconBeforeManualleTaskName(params: any) {
      const icon = params.data.thetisTaskId
      const taskName = getDefaultStringEmptyValue(params.data.taskPending);
      return !icon ? `${this.createSpanElement(this.addTaskClassName)} ${taskName}`:taskName;
    }
}
