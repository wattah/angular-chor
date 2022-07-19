import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProcedureName } from './../../../_core/enum/procedure-name.enum';
import { TaskNameVerificationService } from './../../../_core/services/task-name-verification.service';
import { PANIER_PARCOURS, SAV, FACTURE_VERIFIER, ENTREE_CERCLE_PARNASSE, WELCOME_MAIL,
  RECOUVREMENT, CART_PERMISSIONS, DEBLOQUER_PANIER } from './../../../_core/constants/constants';
import { RedirectionService } from './../../../_core/services/redirection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { GassiMockLoginService } from '../../../_core/services/gassi-mock-login.service';
import { TaskService } from '../../../_core/services/task-service';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { toUpperCase, firstNameFormatter } from '../../../_core/utils/formatter-utils';
import { DatePipe } from '@angular/common';
import { transformDate } from '../../../_core/utils/date-utils';
import { MonitoringTaskVO } from "../../../_core/models/monitoring-task-vo";
import { CONSTANTS } from '../../../_core/constants/constants';
import { UserService } from './../../../_core/services/user-service';

import { getCartIconRenderer, getEncryptedValue } from './../../../_core/utils/functions-utils';
import { ProcedureService } from '../../../_core/services';
import { DocumentService } from './../../../_core/services/documents-service';
import { ConfirmationDialogService } from './../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { MessageTemplateLightVO } from './../../../_core/models/models';
import { NotificationService } from './../../../_core/services/notification.service';
import { RequestDetailsService } from './../../../_core/services/request-details.service';
import { CatalogeService } from './../../../_core/services/http-catalog.service';
import { QUITTE_POPUP, USER_DISMISSED } from './../../../_core/constants/shared-popup-constant';
import { HomologationAccessService } from './../../../_core/services/homologation-access.service';
import { HomologationService } from './../../../_core/services/homologation.service';

@Component({
  selector: 'app-task-to-process',
  templateUrl: './task-to-process.component.html',
  styleUrls: ['./task-to-process.component.scss']
})
export class TaskToProcessComponent implements OnInit {
  @Output() numberOfTasks = new EventEmitter();
  connectedUserId: number;
  tasks: MonitoringTaskVO[];
  incompleteCall = true;
  customerDashboard = '/customer-dashboard';
  cellWrapText = 'cell-wrap-text';
  isExistTasks = true;
  usersList: any[] = [];
  defaultSortModelTasks = [ { colId: 'echeance', sort: 'desc' } ];
  rowDataTasks: any;
  columnDefsTasks: any;
  params: any;
  loading = false;
  activeRole: any;
  listRowsSelected: MonitoringTaskVO[] = [];
  isSelectedRows = false;
  agGridApi;
  static readonly MESSAGE_FOR_UNBLOCKING = 'Le déblocage des articles a bien été effectué';

  isVisibleBtnBlocking = false;
  redrawDetailsRows = false;

  constructor(private readonly route: ActivatedRoute, private readonly mockLoginService: GassiMockLoginService,
    private readonly taskService: TaskService, private readonly datePipe: DatePipe, private readonly router: Router, 
    private readonly userService: UserService, private readonly procedureService: ProcedureService,
    private readonly redirectionService:RedirectionService,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly documentService: DocumentService,
    private readonly taskNameVerificationService: TaskNameVerificationService,
    private readonly notificationService : NotificationService, private readonly requestService: RequestDetailsService,
    private readonly catalogManagement: CatalogeService, private readonly _snackBar: MatSnackBar,
    readonly homologationAccessService: HomologationAccessService, readonly homologationService: HomologationService) {
    this.agGridTasks();
  }

  agGridTasks(): void {
    if(this.redirectionService.hasPermission(DEBLOQUER_PANIER)) {
      this.columnDefsTasks = [
        {
          headerName: 'membre', headerTooltip: 'membre',
          valueGetter: params => this.getNameMembre(params),
          width: 180, field: 'membre',
          cellClass: params => this.getPriority(params.data.isPriority),
          comparator: this.filterString
        },
        {
          headerName: 'échéance', headerTooltip: '', field: 'endDateStr',
          valueGetter: params => this.getDateEcheance(params.data.endDateStr, params.data.endHours),
          width: 120,
          cellClass:  params => this.getPriority(params.data.isPriority),
          comparator: this.filterDate
        },
        {
          headerName: 'Créée par', headerTooltip: '',
          valueGetter: params => {
            if ( !isNullOrUndefined(params.data.createdByFirstName) && !isNullOrUndefined(params.data.createdByLastName)) {
              return `${toUpperCase(params.data.createdByFirstName.charAt(0))}. ${toUpperCase(params.data.createdByLastName)}`;
            } 
            return '-'; 
          },
          width: 160,
          cellClass: params  => this.getPriority(params.data.isPriority),
          comparator: this.filterString
        },
        {
          headerName: 'Parcours', headerTooltip: '', field: 'parcours', width: 200,
          cellClass: params => this.getPriority(params.data.isPriority),
          comparator: this.filterString
        },
        {
          headerName: 'Tâche', headerTooltip: '', width: 220,
          cellRenderer: params => {
            if(!isNullOrUndefined(params.data.tache)) {
              return (params.data.assignedToId !== this.connectedUserId) ? `<span class="icon back-up"></span> ${params.data.tache}` : params.data.tache ;
            }
              return '-';
          }, 
          field: 'tache' , autoHeight: true,
          cellClass: params => this.getPriority(params.data.isPriority),
          comparator: this.filterString
        },
        {
          headerComponentParams: {
            template: `
             <span ref="eText" class="ag-header-cell-text no-margin">
             <p class="underline m-0 text-center">Debloquer </p>  
             <span class="text-min no-transform"> Tout sélectionner </span>
             </span>`
        },
          hide: !this.redirectionService.hasPermission(DEBLOQUER_PANIER),
          field: 'debloquer',
          headerClass: "checkbox-custom justify-content-center",
          cellStyle: {'justify-content':'center','display': 'flex'},
          cellClass: 'margin-custum',
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: (params) => {
            return params.data.blocked !== null && params.data.blocked === true && this.redirectionService.hasPermission(DEBLOQUER_PANIER);
          },
          checkboxSelection: (params) => {
            return params.data.blocked !== null && params.data.blocked === true && this.redirectionService.hasPermission(DEBLOQUER_PANIER);
          },
        },
        {
          headerName: '', headerTooltip: '', maxWidth: 60,  field: 'carticone',
          cellRenderer: (params) => (this.isInParcours(params.data.parcours) && this.checkIfPictoToBeRenderedOrClicked(params.data)) 
                            ? ((params.data.panierId != null && params.data.carttItemsGroup != null) 
                                ? this.getStatusPanierTask(params) 
                                :  ( ( this.redirectionService.hasPermission(CART_PERMISSIONS.ACCESS_TO_CATALOGUE) ) ?`<span class='icon cart-grey-normal' ></span>` : `` ))
                            :``,
          sortable: false,
          cellClass: params => this.getPriority(params.data.isPriority)
        },
        {
          headerName: '',  headerTooltip: '',  maxWidth: 60, field: 'update',
          cellRenderer: (params) => {
              return this.isValidPermission('modification_taches') && this.checkIfPictoToBeRenderedOrClicked(params.data) ? `<span class='icon pen' ></span>`:``;
          },
          autoHeight: true,  sortable: false,
          cellClass: params => this.getPriority(params.data.isPriority),
          
        },
        {
          headerName: '',  headerTooltip: '',  maxWidth: 60, field: 'process',
          cellRenderer: (params) => {
            return  this.checkIfPictoToBeRenderedOrClicked(params.data) &&
            (
              (params.data.parcours.toLocaleUpperCase().trim() === FACTURE_VERIFIER.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
              params.data.tache.toLocaleUpperCase().trim() === FACTURE_VERIFIER.TASK_NAME.toLocaleUpperCase().trim())
              ||
              (params.data.parcours.toLocaleUpperCase().trim() === FACTURE_VERIFIER.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
              params.data.tache.toLocaleUpperCase().trim() === FACTURE_VERIFIER.TASK_NAME_TWO.toLocaleUpperCase().trim())
              ||
              (params.data.parcours.toLocaleUpperCase().trim() === FACTURE_VERIFIER.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
              params.data.tache.toLocaleUpperCase().trim() === FACTURE_VERIFIER.TASK_NAME_THREE.toLocaleUpperCase().trim())
              ||
              (params.data.parcours.toLocaleUpperCase().trim() === FACTURE_VERIFIER.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
              params.data.tache.toLocaleUpperCase().trim() === FACTURE_VERIFIER.TASK_NAME_FOUR.toLocaleUpperCase().trim())
              ||
              (params.data.parcours.toLocaleUpperCase().trim() === FACTURE_VERIFIER.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
              params.data.tache.toLocaleUpperCase().trim() === FACTURE_VERIFIER.TASK_NAME_FIVE.toLocaleUpperCase().trim())
              ||
              (params.data.parcours.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim()
              &&
              params.data.tache.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.TASK_NAME.toLocaleUpperCase().trim())
              ||
              (params.data.parcours.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() 
              && params.data.tache.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.TASK_NAME_VALIDATION.toLocaleUpperCase().trim()) 
              ||
              (params.data.parcours.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
              params.data.tache.toLocaleUpperCase().trim() === SAV.TASK_NAME_ONE.toLocaleUpperCase().trim())
              ||
              (params.data.parcours.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
              params.data.tache.toLocaleUpperCase().trim() === SAV.TASK_NAME_TWO.toLocaleUpperCase().trim())
              ||
              (params.data.parcours.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
              params.data.tache.toLocaleUpperCase().trim() === SAV.TASK_NAME_THREE.toLocaleUpperCase().trim())
              ||
              (params.data.parcours.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
              params.data.tache.toLocaleUpperCase().trim() === SAV.TASK_NAME_FOUR.toLocaleUpperCase().trim()
              ||
              (params.data.parcours.toLocaleUpperCase().trim() === RECOUVREMENT.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() 
              && params.data.tache.toLocaleUpperCase().trim() === RECOUVREMENT.TASK_NAME_ENVOI_SMS.toLocaleUpperCase().trim()) 
              ||
              (params.data.parcours.toLocaleUpperCase().trim() === RECOUVREMENT.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() 
              && params.data.tache.toLocaleUpperCase().trim() === RECOUVREMENT.TASK_NAME_SUSPENSION_LIGNES.toLocaleUpperCase().trim()) 
              ||
              (params.data.parcours.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase()
              && params.data.tache.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.TASK_CR_ENTRY.toLocaleUpperCase())
              ) 
            ) ? `<span class='icon parameters' ></span>`:``
          },
            autoHeight: true,  sortable: false,
          cellClass: params => this.getPriority(params.data.isPriority),
        },
        {
          headerName: '', headerTooltip: '', maxWidth: 60,  field: 'close',
          cellRenderer: (params) => {
            if(params.data.blocked){
              return `<span class='icon cadenas-rouge' ></span>`;
            }
            return this.isValidPermission('cloture_taches') && this.checkIfPictoToBeRenderedOrClicked(params.data) ? `<span class='icon key' ></span>`:``;
          },
          autoHeight: true, sortable: false,
          cellClass: params => this.getPriority(params.data.isPriority)
        }
      ];
    } else {
    this.columnDefsTasks = [
      {
        headerName: 'membre', headerTooltip: 'membre',
        valueGetter: params => this.getNameMembre(params),
        width: 180, field: 'membre',
        cellClass: params => this.getPriority(params.data.isPriority),
        comparator: this.filterString
      },
      {
        headerName: 'échéance', headerTooltip: '', field: 'endDateStr',
        valueGetter: params => this.getDateEcheance(params.data.endDateStr, params.data.endHours),
        width: 120,
        cellClass:  params => this.getPriority(params.data.isPriority),
        comparator: this.filterDate
      },
      {
        headerName: 'Créée par', headerTooltip: '',
        valueGetter: params => {
          if ( !isNullOrUndefined(params.data.createdByFirstName) && !isNullOrUndefined(params.data.createdByLastName)) {
            return `${toUpperCase(params.data.createdByFirstName.charAt(0))}. ${toUpperCase(params.data.createdByLastName)}`;
          } 
          return '-'; 
        },
        width: 160,
        cellClass: params  => this.getPriority(params.data.isPriority),
        comparator: this.filterString
      },
      {
        headerName: 'Parcours', headerTooltip: '', field: 'parcours', width: 200,
        cellClass: params => this.getPriority(params.data.isPriority),
        comparator: this.filterString
      },
      {
        headerName: 'Tâche', headerTooltip: '', width: 220,
        cellRenderer: params => {
          if(!isNullOrUndefined(params.data.tache)) {
            return (params.data.assignedToId !== this.connectedUserId) ? `<span class="icon back-up"></span> ${params.data.tache}` : params.data.tache ;
          }
            return '-';
        }, 
        field: 'tache' , autoHeight: true,
        cellClass: params => this.getPriority(params.data.isPriority),
        comparator: this.filterString
      },
      {
        headerName: '', headerTooltip: '', maxWidth: 60,  field: 'carticone',
        cellRenderer: (params) => (this.isInParcours(params.data.parcours) && this.checkIfPictoToBeRenderedOrClicked(params.data)) 
                          ? ((params.data.panierId != null && params.data.carttItemsGroup != null) 
                              ? this.getStatusPanierTask(params) 
                              :  ( ( this.redirectionService.hasPermission(CART_PERMISSIONS.ACCESS_TO_CATALOGUE) ) ?`<span class='icon cart-grey-normal' ></span>` : `` ))
                          :``,
        sortable: false,
        cellClass: params => this.getPriority(params.data.isPriority)
      },
      {
        headerName: '',  headerTooltip: '',  maxWidth: 60, field: 'update',
        cellRenderer: (params) => {
            return this.isValidPermission('modification_taches') && this.checkIfPictoToBeRenderedOrClicked(params.data) ? `<span class='icon pen' ></span>`:``;
        },
        autoHeight: true,  sortable: false,
        cellClass: params => this.getPriority(params.data.isPriority)
      },
      {
        headerName: '',  headerTooltip: '',  maxWidth: 60, field: 'process',
        cellRenderer: (params) => {
          return  this.checkIfPictoToBeRenderedOrClicked(params.data) &&
          (
            (params.data.parcours.toLocaleUpperCase().trim() === FACTURE_VERIFIER.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
            params.data.tache.toLocaleUpperCase().trim() === FACTURE_VERIFIER.TASK_NAME.toLocaleUpperCase().trim())
            ||
            (params.data.parcours.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim()
            &&
            params.data.tache.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.TASK_NAME.toLocaleUpperCase().trim())
            ||
            (params.data.parcours.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() 
            && params.data.tache.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.TASK_NAME_VALIDATION.toLocaleUpperCase().trim()) 
            ||
            (params.data.parcours.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
            params.data.tache.toLocaleUpperCase().trim() === SAV.TASK_NAME_ONE.toLocaleUpperCase().trim())
            ||
            (params.data.parcours.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
            params.data.tache.toLocaleUpperCase().trim() === SAV.TASK_NAME_TWO.toLocaleUpperCase().trim())
            ||
            (params.data.parcours.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
            params.data.tache.toLocaleUpperCase().trim() === SAV.TASK_NAME_THREE.toLocaleUpperCase().trim())
            ||
            (params.data.parcours.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
            params.data.tache.toLocaleUpperCase().trim() === SAV.TASK_NAME_FOUR.toLocaleUpperCase().trim()
            ||
            (params.data.parcours.toLocaleUpperCase().trim() === RECOUVREMENT.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() 
            && params.data.tache.toLocaleUpperCase().trim() === RECOUVREMENT.TASK_NAME_ENVOI_SMS.toLocaleUpperCase().trim()) 
            ||
            (params.data.parcours.toLocaleUpperCase().trim() === RECOUVREMENT.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() 
            && params.data.tache.toLocaleUpperCase().trim() === RECOUVREMENT.TASK_NAME_SUSPENSION_LIGNES.toLocaleUpperCase().trim()) 
            ||
            (params.data.parcours.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase()
            && params.data.tache.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.TASK_CR_ENTRY.toLocaleUpperCase())
            ) 
          ) ? `<span class='icon parameters' ></span>`:``
        },
          autoHeight: true,  sortable: false,
        cellClass: params => this.getPriority(params.data.isPriority),
      },
      {
        headerName: '', headerTooltip: '', maxWidth: 60,  field: 'close',
        cellRenderer: (params) => {
          if(params.data.blocked){
            return `<span class='icon cadenas-rouge' ></span>`;
          }
          return this.isValidPermission('cloture_taches') && this.checkIfPictoToBeRenderedOrClicked(params.data) ? `<span class='icon key' ></span>`:``;
        },
        autoHeight: true, sortable: false,
        cellClass: params => this.getPriority(params.data.isPriority)
      }];
    }
  }
  isInParcours(parcour: any): boolean {
    return PANIER_PARCOURS.includes(parcour);
  }

  checkIfPictoToBeRenderedOrClicked(data){
    if(!isNullOrUndefined(data.processInstanceId)){
      return true;
    }else{
      if(!data.connectedOnWf){
        if(isNullOrUndefined(data.workflowId)){
          return true;
        }
      }
   }
   return false;
   
 }

  ngOnInit(): void {
    this.mockLoginService.getCurrentUserId().subscribe((userId) => {
      if (userId) {
        this.initDeskList(userId);
        this.connectedUserId = userId;
        this.getTasksListByUser(this.connectedUserId);
      }
    });
    this.redirectionService.getAgGridLoader().subscribe( load =>{
        if(load){
          this.agGridTasks();
          this.isVisibleBtnBlocking =this.redirectionService.hasPermission(DEBLOQUER_PANIER);
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
    this.isVisibleBtnBlocking =this.redirectionService.hasPermission(DEBLOQUER_PANIER);
  }

  onGridReady(params): void {
     this.agGridApi= params.api;
    setTimeout(() => {
      this.agGridApi.sizeColumnsToFit();
    }, 5000);
     
  }
  getTasksListByUser(userId : number): void {
    this.loading = true;
    this.taskService.getTasksToProcess(userId).subscribe( data => {
      this.loading = false;
      this.rowDataTasks = data;
      if ((this.rowDataTasks !== null && this.rowDataTasks.length !== 0 ) || this.rowDataTasks.length === 0 ) {
        this.numberOfTasks.emit(this.rowDataTasks.length);
      }
      if (isNullOrUndefined(this.rowDataTasks) || this.rowDataTasks.length === 0 ) {
         this.isExistTasks = false;
      } else {
        this.isExistTasks = true;
      }
    },
   (error) => {
    
     console.log('error');
   },
   () => {
     this.incompleteCall = false;
     console.log('complete')
   }
  );
  }

  initDeskList(userId: number): void {
    this.userService.getUsersByNiche(true).subscribe((data) => {
      this.usersList = data;
      if (this.usersList) {
        this.connectedUserId = userId;
      }
    });
  }

  getPriority(value: boolean): string[] {
    const classes = [this.cellWrapText];
       if (value) {
          classes.push('orange');
        }
          return classes;
  }

  getNameMembre(params: any) : string {
    if(params.data.categorie === CONSTANTS.TYPE_COMPANY) {
      let crm = '';
       if(!isNullOrUndefined(params.data.crmName)) {
           crm = params.data.crmName;
       }else {
         crm = '-'
       }
      return `${crm}`;
    } else if ( !isNullOrUndefined(params.data.firstNameMember) && !isNullOrUndefined(params.data.lastNamMember)) {
      return `${toUpperCase(params.data.lastNamMember)}  ${firstNameFormatter(params.data.firstNameMember)}`;
    }
    return '-';
  }

  filterDate(a, b, nodeA, nodeB): number {
      if (!nodeA.data.isPriority && !nodeB.data.isPriority &&  a === null && b === null) {
        return 0;
      }
      if ( !nodeA.data.isPriority && !nodeB.data.isPriority && a === null ) {
         return 1;
        }
      if ( !nodeA.data.isPriority && !nodeB.data.isPriority && b === null) {
        return -1;
       }
      if ( !nodeA.data.isPriority && !nodeB.data.isPriority && a === '-' && b === '-') {
        return 0;
      }
      if ( !nodeA.data.isPriority && !nodeB.data.isPriority && a === '-' ) {
        return 1;
       }
      if ( !nodeA.data.isPriority && !nodeB.data.isPriority && b === '-') {
         return -1;
      }
      if(!nodeA.data.isPriority && !nodeB.data.isPriority) { 
        return transformDate(a) - transformDate(b);
      }
      return 0;
   }

   filterString(a, b, nodeA, nodeB): number {
      if ( !nodeA.data.isPriority && !nodeB.data.isPriority && a === null && b === null) {
         return 0;
        }
      if ( !nodeA.data.isPriority && !nodeB.data.isPriority && a === null ) {
        return 1;
      }
      if ( !nodeA.data.isPriority && !nodeB.data.isPriority && b === null) {
         return -1;
      }
      if ( !nodeA.data.isPriority && !nodeB.data.isPriority && a === '-' && b === '-') {
        return 0;
      }
      if ( !nodeA.data.isPriority && !nodeB.data.isPriority && a === '-' ) {
        return 1;
       }
      if ( !nodeA.data.isPriority && !nodeB.data.isPriority && b === '-') {
        return -1;
       }
      if(!nodeA.data.isPriority && !nodeB.data.isPriority) {
        return a.localeCompare(b);
      }
      return 0;
  }


  getDateEcheance(value: string, nbrHour: number): string {
   if(nbrHour >= -48 && nbrHour <= -1) {
    return `${nbrHour.toString().replace('-','')}h`;
   }
   return this.datePipe.transform(value, 'dd MMM yyyy');
  }

  clickCell(params: any): void {
    if (params.column.colId === 'update' && this.redirectionService.hasPermission('modification_taches') && !isNullOrUndefined(params.data.processInstanceId)) {
      this.router.navigate(
        [this.customerDashboard, getEncryptedValue(params.data.customerId), 'request', params.data.requestId, 'modifyTask', params.data.id],
        {
          queryParams: { isDetail: false, typeCustomer: params.data.categorie },
          queryParamsHandling: 'merge'
        }
      );
    } else if (params.column.colId === 'close' && this.redirectionService.hasPermission('cloture_taches') && !isNullOrUndefined(params.data.processInstanceId)
                && !params.data.blocked) {
      let next = 0;
      if(params.data.existTaskToAssigned) {
        next = 1;
      }
      this.router.navigate(
        [this.customerDashboard, getEncryptedValue(params.data.customerId), 'request', params.data.requestId, 'taskassignment', params.data.id], {
        queryParams: {
          idRequest: params.data.requestId,
          processInstanceId: params.data.processInstanceId,
          thetisTaskId: params.data.thetisTaskId,
          nextIdTask: next,
          typeCustomer: params.data.categorie
        }
      }
      );

    } else if (params.column.colId === 'carticone' && !isNullOrUndefined(params.data.processInstanceId)) {
      this.onClickCartIcon(params);
    } else if (params.column.colId === 'process') {
      this.goToWelcomeMail(params.data);
      this.toSav(params.data);
      this.goToHomologation(params.data);
      this.goToSMSView(params.data);
      this.onDownloadBill(params.data.parcours, params.data.tache, params.data.id, this.connectedUserId);
      this.showEntryReportMail(params.data);
      } 
      else if (params.column.colId === 'debloquer') {
        return null;
      }
      else {
        if(params.column.colId !== 'close'){
          this.router.navigate(
            [this.customerDashboard, getEncryptedValue(params.data.customerId), 'request', params.data.requestId, 'task-details', params.data.id],
            {
              queryParams: { typeCustomer: params.data.categorie },
              queryParamsHandling: 'merge'
            }        
          );
      }
    }
}
onClickCartIcon(params): void {
  if(this.isInParcours(params.data.parcours)){
    if(params.data.panierId != null && params.data.carttItemsGroup != null){
      this.router.navigate(
        [this.customerDashboard,getEncryptedValue(params.data.customerId),'cart', 'creation', params.data.requestId],
        {
          queryParams: { 
            typeCustomer: params.data.categorie ,
            parcours: params.data.parcours ,
            onglet : 0
          }, 
        }
      );
  } else {
    this.router.navigate(
      [this.customerDashboard, getEncryptedValue(params.data.customerId), 'cart', 'catalog', params.data.requestId],
      {
        queryParams: { 
          typeCustomer: params.data.categorie,
          parcours: params.data.parcours 
        },
        queryParamsHandling: 'merge'
      }
    );
  }
  }
}


  changeUser(): void {
    this.getTasksListByUser(this.connectedUserId);  
  }
  
  allTasksClick(): void {
    this.router.navigate(
      ['/task-monitoring'], { queryParams: { name: 'all' } });
  }

  myTasksClick(): void {
    this.router.navigate(
      ['/task-monitoring'], { queryParams: { name: 'tasks' } });
  }

  isValidPermission(permission: string){
    let isValidPermission = false;
    this.redirectionService.getCurrentPermissions().subscribe(
      (permissions)=>{
        isValidPermission = permissions.includes(permission);
      }
    )
    return isValidPermission;
  }

  toSav(data) {
    if(data.parcours.toLocaleUpperCase() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase() &&
    this.taskNameVerificationService.verifyTaskByNameAndCurrentRoleName(data.tache , this.activeRole)){
        this.router.navigate(
          [this.customerDashboard, getEncryptedValue(data.customerId), 'cart' ,data.requestId, 'sav-mobile'],
            {
             queryParams: { typeCustomer: data.categorie },
             queryParamsHandling: 'merge'
          }        
        );
    }
  }

    /**
    * This to open the send mail screen and call the process
    */
     showEntryReportMail(data: any): void {
      if (data.parcours.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase()
      && data.tache.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.TASK_CR_ENTRY.toLocaleUpperCase()) {
          this.loading = true;
          this.procedureService.runTaskProcedure(ProcedureName.SHOW_ENTRY_REPORT_MAIL, data.id, this.connectedUserId).subscribe(_data => {
            this.loading = false;
            this.notificationService.setMessageTemplate(_data as MessageTemplateLightVO[]);
            this.router.navigate(
              [this.customerDashboard, getEncryptedValue(data.customerId), 'interaction','mail-sending',
               data.requestId, data.requestTypeId , data.universId],
              { queryParams: { typeCustomer: data.categorie },queryParamsHandling: 'merge' });
          });
      }
    }

  goToWelcomeMail(data: any): void {
    if (data.parcours.toLocaleUpperCase() === WELCOME_MAIL.REQUEST_TYPE_LABEL.toLocaleUpperCase() 
    && data.tache.toLocaleUpperCase() === WELCOME_MAIL.TASK_NAME.toLocaleUpperCase()) {
      this.loading = true;
      this.procedureService.runTaskProcedure(ProcedureName.OPEN_WELCOME_MAIL_POPUP, data.id, this.connectedUserId).subscribe(_data => {
        this.loading = false;
        this.router.navigate(
          ['/customer-dashboard', getEncryptedValue(data.customerId), 'request', data.requestId, data.id, 'welcome-mail'],
          { queryParams: { typeCustomer: data.categorie }, queryParamsHandling: 'merge' });
      });
    }
  }

  goToHomologation(data: any): void {
    if (data.parcours.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase() 
    && data.tache.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.TASK_NAME_VALIDATION.toLocaleUpperCase()) {
      this.homologationService.getHomologationListByCustomerId(getEncryptedValue(data.customerId)).subscribe(homologationsIds => {
        if (homologationsIds && homologationsIds.length > 0) {
          if (homologationsIds.length === 1) {
            this.router.navigate(
              [this.customerDashboard, getEncryptedValue(data.customerId), 'detail', 'homologation', homologationsIds[0]],
              { queryParams: { typeCustomer: data.categorie, isAmendment: false }, queryParamsHandling: 'merge' }
            );
          } else {
            this.openHomologationPopup(homologationsIds, getEncryptedValue(data.customerId), data.categorie, data.id);
          }
        } else {
          const title = 'Information';
          const btnOkText = 'OK';
          const comment = 'Pas d\'homologation pour ce client';
          this.confirmationDialogService.confirm(title, comment, btnOkText, null, 'lg', false)
          .then((confirmed) => console.info('It\'s OK'))
          .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
        }
        
      });
    }
  }

  openHomologationPopup(homologationsIds: number[], customerId: string, typeCustomer, taskId: number): void {
    this.homologationAccessService.openHomologationPopup(homologationsIds, customerId, typeCustomer, true, taskId);
  }

  goToSMSView(data: any): void {
    if (data.parcours.toLocaleUpperCase() === RECOUVREMENT.REQUEST_TYPE_LABEL.toLocaleUpperCase() 
    && ( data.tache.toLocaleUpperCase() === RECOUVREMENT.TASK_NAME_ENVOI_SMS.toLocaleUpperCase()
    || data.tache.toLocaleUpperCase() === RECOUVREMENT.TASK_NAME_SUSPENSION_LIGNES.toLocaleUpperCase())) {
      this.loading = true;
      this.procedureService.runTaskProcedure(ProcedureName.SHOW_SUSPENSION_SMS, data.id, this.connectedUserId).subscribe(_data => {
        this.loading = false;
        this.notificationService.setTemplates(_data as MessageTemplateLightVO[]);
        this.router.navigate(
          ['/customer-dashboard', getEncryptedValue(data.customerId), 'interaction', data.requestId, 'sending-sms'], 
          { 
            queryParams: {typeCustomer: data.categorie, showSuspension: "O"}, 
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


  getStatusPanierTask(params: any) : string {
     if(!isNullOrUndefined(params.data) && !isNullOrUndefined(params.data.panierId)){
       return getCartIconRenderer(params.data.panierIconeTask, params.data.stockToUseCode);
     }
    return null;
    
  }
  getSelectedRowDataforUnblock(): void {
    let listCartId = [];
    if(!isNullOrUndefined(this.listRowsSelected) && this.listRowsSelected.length !== 0) {
      for (const monitoringTaskVO of this.listRowsSelected) {
        if(!isNullOrUndefined(monitoringTaskVO.panierId) && monitoringTaskVO.blocked === true) {
          listCartId.push(monitoringTaskVO.panierId)
        }
      }
      if(!isNullOrUndefined(listCartId) && listCartId.length !== 0) {
        this.loading = true;
        this.catalogManagement.unblockOrdersByListCartIds(listCartId).subscribe(data => {
          if(!isNullOrUndefined(data) && data.length !== 0) {
              for(const error of data) {
                const msg = `${error} <br/>`;
                this.openPopupError(msg)
            }
            this.loading = false;
          } 
          if (isNullOrUndefined(data) || listCartId.length > data.length){
            this.changeUser();
            this.loading = false;
            this.openSnackBar(TaskToProcessComponent.MESSAGE_FOR_UNBLOCKING);
          }
        },
        (error) => {
          this.loading = false;
         },
         () => {
          this.loading = false;
         }
        );
      }
    }
  }

  selectRows(event) {
    this.listRowsSelected = event;
    if(!isNullOrUndefined(this.listRowsSelected) && this.listRowsSelected.length !== 0) {
      for (const monitoringTaskVO of this.listRowsSelected) {
        if(!isNullOrUndefined(monitoringTaskVO.panierId) && monitoringTaskVO.blocked === true) {
          this.isSelectedRows = true;
          break;
        } else {
          this.isSelectedRows = false;
        }
      }
    } else {
      this.isSelectedRows = false;
    }
  }

  openPopupError(message: string): any {
    const ERROR = 'Erreur';
    const OK = 'OK';
    this.confirmationDialogService.confirm(ERROR, message, OK,null,'lg', false)
    .then((confirmed) => { if(confirmed) {
      console.log(QUITTE_POPUP)
    }})
    .catch(() => console.log(USER_DISMISSED));
  }
  /** SNACK BAR */
  openSnackBar(text: string): void {
    this._snackBar.open(
      text, undefined, 
      { duration: 3000, panelClass: ['center-snackbar', 'snack-bar-container'] });
  }
}
