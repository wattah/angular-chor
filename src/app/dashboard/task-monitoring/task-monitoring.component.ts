import { saveAs } from 'file-saver';
import { ProcedureName } from './../../_core/enum/procedure-name.enum';
import { TaskNameVerificationService } from './../../_core/services/task-name-verification.service';
import { DocumentService } from './../../_core/services/documents-service';
import { ConfirmationDialogService } from './../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { ProcedureService } from './../../_core/services/procedure.service';
import { CART_STATUS_MONITORING, PANIER_PARCOURS, ENTREE_CERCLE_PARNASSE, 
  FACTURE_VERIFIER, SAV, WELCOME_MAIL, RECOUVREMENT, CONSTANTS } from './../../_core/constants/constants';
import { RedirectionService } from './../../_core/services/redirection.service';
import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import { startWith, map, catchError, switchMap } from 'rxjs/operators';

import { capitalizeFirstLetter, isNullOrUndefined, stringToBoolean } from '../../_core/utils/string-utils';
import { UserVo } from '../../_core/models';
import { TASK_STATUS_WITH_ALL_SUB_CATEGORIES, CART_STATUS, TASK_STATUS} from '../../_core/constants/constants';
import { RequestTypeVO, RoleVO, MessageTemplateLightVO } from '../../_core/models/models';
import { toUpperCase, firstNameFormatter} from '../../_core/utils/formatter-utils';
import { GassiMockLoginService, UserService, CustomerService } from '../../_core/services';
import * as Moment from 'moment-business-days';
import { TaskFilterVo } from '../../_core/models/task-filter';
import { TaskService } from '../../_core/services/task-service';
import { DatePipe } from '@angular/common';
import { ApplicationUserVO } from '../../_core/models/application-user';
import { AuthTokenService } from '../../_core/services/auth_token';
import { transformDate } from '../../_core/utils/date-utils';
import { CustomerAutocomplete } from '../../_core/models/customer-autocomplete';
import { getCartIconRenderer, getEncryptedValue, getCartLabel } from './../../_core/utils/functions-utils';
import { NotificationService } from './../../_core/services/notification.service';
import { RequestDetailsService } from './../../_core/services/request-details.service';
import { HomologationAccessService } from './../../_core/services/homologation-access.service';
import { HomologationService } from './../../_core/services/homologation.service';

@Component({
  selector: 'app-task-monitoring',
  templateUrl: './task-monitoring.component.html',
  styleUrls: ['./task-monitoring.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskMonitoringComponent implements OnInit {

  show = true;
  title: string;
  rangeOfEndDate: Date;
  taskFilter : TaskFilterVo = {} as TaskFilterVo;
  rowData: any;
  noTasksExisting = true;
  customerDashboard = '/customer-dashboard';
  cellWrap = 'cell-wrap-text';
  loading = false;
  currentUser: ApplicationUserVO;
  defaultUser : UserVo = {} as UserVo;
  defaultParcours : RequestTypeVO = {} as RequestTypeVO;
  defaultRole : RoleVO = {} as RoleVO;

  filteredResponsableAffaire: Observable<UserVo[]>;
  filteredMember: Observable<string[]>;
  filteredParcours: Observable<RequestTypeVO[]>;
  filteredTraitePar: Observable<UserVo[]>;
  filteredSuiviPar: Observable<UserVo[]>;
  filteredStatutTache: Observable<any[]>;
  filteredStatutPanier: Observable<any[]>;
  filteredRoleCreateur: Observable<RoleVO[]>;
  filteredPortefeuille: Observable<UserVo[]>;
  filteredCreateur: Observable<UserVo[]>;
  filteredPiloterPar: Observable<UserVo[]>;
  filteredBackUp: Observable<UserVo[]>;

  responsableAffaireControl = new FormControl();
  memberControl = new FormControl();
  parcoursControl = new FormControl();
  suiviParControl = new FormControl();
  traiteParControl = new FormControl();
  statutTacheControl = new FormControl();
  statutPanierControl = new FormControl();
  roleCreateurControl = new FormControl();
  portefeuilleControl = new FormControl();
  createurControl = new FormControl();
  piloterParControl = new FormControl();
  backUpControl = new FormControl();
  dateDebutControl = new FormControl();
  dateFinControl = new FormControl();
  numeroTache = new FormControl();
  priorityControl = new FormControl();

  listResponsablesAffaires: UserVo[] = [];
  listSuiviPar: UserVo[] = [];
  listTraitePar: UserVo[] = [];
  listParcours: RequestTypeVO[] = [];
  listPortefeuille: UserVo[] = [];
  listBackup: UserVo[] = [];
  listRolesCreateur: RoleVO[] = [];
  members: CustomerAutocomplete[] = [];
  valueMember: string;
  listCreateur: UserVo[];
  listCurrentCreateur: UserVo[] = [];
  listPilotee: UserVo[] = [];
  allUsers: UserVo[] = [];
  membersList: string[] = [];
  membreControl = new FormControl();
  filteredMembre$: Observable<CustomerAutocomplete[]> = null;
  paginationPageSize = 20;
  url: string;
  
/*------------------combo chips membre---------------------------*/
  @ViewChild('JInput', { static: false }) JInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipJList', { static: false }) chipJList;
  @ViewChild('autoJ', { static: false }) matAutoCCcomplete: MatAutocomplete;
/*------------------combo chips createur---------------------------*/
  selectable = true;
  removable = true;
  @ViewChild('JInputCreateur', { static: false }) JInputCreateur: ElementRef<HTMLInputElement>;
  @ViewChild('chipCreateurList', { static: false }) chipCreateurList;
  @ViewChild('autoJCreateur', { static: false }) matAutoCreateurcomplete: MatAutocomplete;


  defaultSortModel = [ { colId: 'creele', sort: 'desc' } ];
  columnDefs = [
    {
      headerName: '',
      headerTooltip: '',  
      cellRenderer: 'agGroupCellRenderer',
      width: 40,
      field: 'arrow',
      resizable: false,
      sortable: false
    },
    {
      headerName: '',
      headerTooltip: '',  
      cellRenderer: (params) => (params.data) ? this.getStatusTask(params) : '',
      width: 40,
      field: '',
      cellClass: params => (params.data) ? this.getColorTask(params) : '',
      sortable: false
    },
    {
      headerName: 'N°',
      headerTooltip: 'N°',
      width: 70,
      field: 'numero',
      cellRenderer: (params) => params.data.id,
      cellClass: params => (params.data) ? this.getColorTask(params) : '',
      cellStyle: { 'text-decoration': 'underline' } ,
      sortable: false
    },
    {
      headerName: 'membre',
      headerTooltip: 'membre',
      valueGetter: params => {
        if ( !isNullOrUndefined(params.data) && !isNullOrUndefined(params.data.firstNameMember) && !isNullOrUndefined(params.data.lastNamMember)) {
          return `${toUpperCase(params.data.firstNameMember.charAt(0))}. ${toUpperCase(params.data.lastNamMember)}`;
        } 
        return '-'; 
      },
      colId: 'taskCustomer',
      cellClass: params => (params.data) ? this.getColorTask(params) : '',
      cellStyle: { 'text-decoration': 'underline' } ,
      width: 100
    },
    {
      headerName: 'parcours',
      headerTooltip: 'parcours',
      width: 110,
      field: 'parcours',
      colId: 'requestLabel',      
      autoHeight: true,
      //comparator: this.filterString,
      cellClass: params => (params.data) ? this.getColorTask(params) : '',
    },
    {
      headerName: 'tâche',
      headerTooltip: 'tâche',
      width: 100,
      //TODO
     // cellRenderer: () => `<span class='icon back-up'></span> Faire un appel de la prise en charge de réclamation`,
      autoHeight: true,
      field: 'tache', 
      cellClass: params => (params.data) ? this.getColorTask(params) : '',
    },
    {
      headerName: 'créée par',
      headerTooltip: 'créée par',
      valueGetter: params => {
        if ( !isNullOrUndefined(params.data) && !isNullOrUndefined(params.data.createdByFirstName) && !isNullOrUndefined(params.data.createdByLastName)) {
          return `${toUpperCase(params.data.createdByLastName)} ${capitalizeFirstLetter(params.data.createdByFirstName)}`;
        } 
        return '-'; 
      },
      field: 'creepar',
      colId: 'created',
      width: 80,
      autoHeight: true,
      cellClass: params => (params.data) ? this.getColorTask(params) : '',
    },
    {
      headerName: 'créée le',
      headerTooltip: 'créée le',
      valueGetter: params => {
        if ( !isNullOrUndefined(params.data) && !isNullOrUndefined(params.data.createdAt)) {
          return `${this.datePipe.transform(params.data.createdAt, 'dd MMM yyyy')}`;
        } 
        return '-'; 
      },
      field: 'creele',
      colId: 'creationDate',
      cellClass: params => (params.data) ? this.getColorTask(params) : '',
      width: 90
    },
    {
      headerName: 'echéance',
      headerTooltip: 'echeance',
      valueGetter: params => (params.data) ? this.getDateEcheance(params.data.endDateStr, params.data.endHours) : '',
      cellClass: params => (params.data) ? this.getColorTask(params) : '',
      field: 'echeance',
      colId: 'endDate',
      width: 90
    },
    {
      headerName: 'traitée par',
      headerTooltip: 'traitée par',
      valueGetter: params => {
        if (!isNullOrUndefined(params.data) && !isNullOrUndefined(params.data.traiterByFirstName) && !isNullOrUndefined(params.data.traiterByLastName)) {
          return `${toUpperCase(params.data.traiterByLastName)} ${capitalizeFirstLetter(params.data.traiterByFirstName)}`;
        } 
        return '-'; 
      },
      field: 'traitepar',
      colId: 'assignedTo',      
      autoHeight: true,
      cellClass: params => (params.data) ? this.getColorTask(params) : '',
      width: 100
    },
    {
      headerName: 'suivie par',
      headerTooltip: 'suivie par',
      valueGetter: params => {
        if ( !isNullOrUndefined(params.data) && !isNullOrUndefined(params.data.suiviByFirstName) && !isNullOrUndefined(params.data.suiviByLastName)) {
          return `${toUpperCase(params.data.suiviByLastName)} ${capitalizeFirstLetter(params.data.suiviByFirstName)}`;
        } 
        return '-'; 
      },
      field: 'suivipar',
      colId: 'inChargeOf',
      autoHeight: true,
      cellClass: params => (params.data) ? this.getColorTask(params) : '',
      width: 100
    },
    {
      headerName: '',
      headerTooltip: '',
      field: 'panier',
      width: 40,
      cellRenderer: (params) => (params.data && this.isInParcours(params.data.parcours) && this.checkIfPictoHasToBeRenderedOrClicked(params.data) ) ? this.getStatusPanierTask(params) : '',
      cellClass: params => (params.data) ? this.getColorTask(params) : '',
      sortable: false
    },
    {
      headerName: '',
      headerTooltip: '',
      width: 35,
      field: 'update',
      cellRenderer: (params) => (params.data && this.checkIfPictoHasToBeRenderedOrClicked(params.data)) ? this.getActionsOnTask(params) : '',
      cellClass: params => (params.data) ? this.getColorTask(params) : '',
      sortable: false
    },
    {
      headerName: '',
      headerTooltip: '',
      width: 35,
      field: 'parameters',
      colId: 'parameters',
      cellRenderer: (params) => (params.data && this.checkIfPictoHasToBeRenderedOrClicked(params.data) &&
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
          (params.data.parcours.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
          params.data.tache.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.TASK_NAME.toLocaleUpperCase().trim())
          ||
          (params.data.parcours.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
          params.data.tache.toLocaleUpperCase().trim() === ENTREE_CERCLE_PARNASSE.TASK_NAME_VALIDATION.toLocaleUpperCase().trim())
          ||
          (params.data.parcours.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
          params.data.tache.toLocaleUpperCase().trim() === SAV.TASK_NAME_ONE.toLocaleUpperCase().trim() )
          ||
          (params.data.parcours.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
          params.data.tache.toLocaleUpperCase().trim() === SAV.TASK_NAME_TWO.toLocaleUpperCase().trim())
          ||
          (params.data.parcours.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
          params.data.tache.toLocaleUpperCase().trim() === SAV.TASK_NAME_THREE.toLocaleUpperCase().trim())
          ||
          (params.data.parcours.toLocaleUpperCase().trim() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
          params.data.tache.toLocaleUpperCase().trim() === SAV.TASK_NAME_FOUR.toLocaleUpperCase().trim())
          ||
          (params.data.parcours.toLocaleUpperCase().trim() === RECOUVREMENT.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
          params.data.tache.toLocaleUpperCase().trim() === RECOUVREMENT.TASK_NAME_ENVOI_SMS.toLocaleUpperCase().trim())
          ||
          (params.data.parcours.toLocaleUpperCase().trim() === RECOUVREMENT.REQUEST_TYPE_LABEL.toLocaleUpperCase().trim() &&
          params.data.tache.toLocaleUpperCase().trim() === RECOUVREMENT.TASK_NAME_SUSPENSION_LIGNES.toLocaleUpperCase().trim())
          ||
          (params.data.parcours.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase()
          && params.data.tache.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.TASK_CR_ENTRY.toLocaleUpperCase())
        )
      ) ? this.getActionsOnTask(params) : '',

      cellClass: params => (params.data) ? this.getColorTask(params) : '',
      sortable: false
    },
    {
      headerName: '',
      headerTooltip: '',
      width: 40,
      field: 'close',
      cellRenderer: (params) => {
        if(params.data.blocked && params.data.isOpened){
          return `<span class='icon cadenas-rouge' ></span>`;
        }
        return (params.data && this.checkIfPictoHasToBeRenderedOrClicked(params.data)) ? this.getActionsOnTask(params) : ''
      },
      cellClass: params => (params.data) ? this.getColorTask(params) : '',
      sortable: false
    }
  ];

  detailCellRendererParams = {
    detailGridOptions: {
      columnDefs: [],
      defaultColDef: { flex: 1 }
    },
    getDetailRowData: (params) => {
      // simulate delayed supply of data to the detail pane
      setTimeout( () => {
        params.successCallback([]);
        params.success({ rowData: [], rowCount: 0 });
      }, 1000);
    },
    template: (_params: any) => {
      return this.generateTemplate(_params);
    }
  };

    /**************************************************
   *  ARGUMENTS POUR AG GRID SERVER SIDE (START)     *
   *  app-athena-ag-grid2                            *                                            
   **************************************************/
  loadingRows = false;
  datasource: any;
  totalItems = 0;
  rowModelType;
  gridApi;
  gridColumnApi;
  gridParams;
  rowStyle = { cursor: 'pointer' };
  params: { force: boolean; suppressFlash: boolean; };
  activeRole: string;
  /***************************************************
   *  ARGUMENTS POUR AG GRID SERVER SIDE (END)       *
   *  app-athena-ag-grid2                            *                                            
   **************************************************/

  constructor(private readonly route: ActivatedRoute, private readonly mockLoginService: GassiMockLoginService,
    private readonly userService: UserService, private readonly taskService: TaskService,
    private readonly datePipe: DatePipe, private readonly router: Router, 
    private readonly authTokenService: AuthTokenService, private readonly customerService: CustomerService,
    private readonly redirectionService:RedirectionService,
    private readonly procedureService: ProcedureService,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly documentService: DocumentService,
    private readonly taskNameVerificationService: TaskNameVerificationService,
    private readonly notificationService : NotificationService, private readonly requestService: RequestDetailsService, 
    readonly homologationAccessService: HomologationAccessService, readonly homologationService: HomologationService) {
    }
  ngOnInit() {

    this.constructTitlePage();
    this.initDefaultValues();
    this.taskFilter.idCreateurs = []

    this.listResponsablesAffaires = this.listResponsablesAffaires.concat(this.defaultUser);
    this.listSuiviPar = this.listSuiviPar.concat(this.defaultUser);
    this.listTraitePar = this.listTraitePar.concat(this.defaultUser);
    this.listPortefeuille = this.listPortefeuille.concat(this.defaultUser);
    this.listRolesCreateur = this.listRolesCreateur.concat(this.defaultRole);
    this.listParcours = this.listParcours.concat(this.defaultParcours);
/*------------------set priority---------------------------*/
    this.priorityControl = new FormControl(false);
/*------------------set dates ---------------------------*/
    const currentDate = new Date();
    this.dateDebutControl = new FormControl(new Date(currentDate.setMonth(currentDate.getMonth()-3)));
    this.rangeOfEndDate = new Date(this.dateDebutControl.value);
    this.dateFinControl = new FormControl(new Date());

/*------------------get current User---------------------------*/
    this.currentUser = this.authTokenService.applicationUser;

/*------------------get resolvers ---------------------------*/
    this.route.data.subscribe(resolversData => {
      /*------------------get list Responsables Affaires---------------------------*/
      this.listResponsablesAffaires = this.listResponsablesAffaires.concat(resolversData['listUsers']);
      /*------------------get list Responsables Affaires---------------------------*/
      this.listSuiviPar = this.listSuiviPar.concat(resolversData['listUsers']);
      /*------------------get list Responsables Affaires---------------------------*/
      this.listTraitePar = this.listTraitePar.concat(resolversData['listUsers']);
      /*------------------get list Parcours----------------------------------------*/
      this.listParcours = this.listParcours.concat(resolversData['typesRequest'].sort((a, b) => a.label.localeCompare(b.label)));
      /*------------------get list Portefeuille------------------------------------*/
      this.listPortefeuille = this.listPortefeuille.concat(resolversData['listUsers']);
      /*------------------get list Role Createur-----------------------------------*/
      this.listRolesCreateur = this.listRolesCreateur.concat(resolversData['listRoles']);
      /*------------------get list Createur----------------------------------------*/
      this.listCreateur = resolversData['listUsers'];
      /*------------------get list pilotée par-------------------------------------*/
      this.allUsers = resolversData['listUsers'];
      const patternPoolZZZ = new RegExp('^Z{3}');
      const poolZZZ = this.allUsers.filter((user) => (`${user.lastName} ${user.firstName}`).match(patternPoolZZZ));
      this.listPilotee = this.listPilotee.concat(this.defaultUser).concat(poolZZZ);
    });

    /*------------------construire les listes avec leurs filtres----------*/
    this.constructSimpleLists();
    this.constructAdvancedLists();
    this.responsableAffaireControl.setValue(this.defaultUser);
    this.suiviParControl.setValue(this.defaultUser);
    this.traiteParControl.setValue(this.defaultUser);
    this.portefeuilleControl.setValue(this.defaultUser);
    this.parcoursControl.setValue(this.defaultParcours);
    this.piloterParControl.setValue(this.defaultUser);
    this.roleCreateurControl.setValue(this.defaultRole);
    this.statutTacheControl.setValue(TASK_STATUS_WITH_ALL_SUB_CATEGORIES[0]);
    this.statutPanierControl.setValue(CART_STATUS[0]);

    /*-----------le cas de retour apres modification d'une tache, on repositionne les filtres et on lance la recherche--*/
    this.constructFiltersWhenBackToPage();

    /*------------------ initialiser memnre + grid ----------*/
    this.initMembre();
    this.initGrid();
    this.rowModelType = 'serverSide';

    this.redirectionService.getAgGridLoader().subscribe((load) => {
      if (load) {
        this.params = {
          force: true,
          suppressFlash: true,
        };
      }
    });
    this.mockLoginService.getCurrentConnectedUser().subscribe(
      (user)=>{
        this.activeRole = user.activeRole.roleName;
      }
    );
    this.onObserveTaskId();
  }
/**
 * traitement membre 
 */
  initMembre(): void {
    this.filteredMembre$ = this.membreControl.valueChanges.pipe(
      startWith(''),
      // use switch map so as to cancel previous subscribed events, before creating new once
      switchMap(value => {
        if (value !== '' && value.length > 2) {
          // lookup 
          return this.lookup(value);
        } else {
          // if no value is present, return null
          return of(null);
        }
      })
    );
  }

  lookup(value: string): Observable<CustomerAutocomplete[]> {
    const status = [];
    this.valueMember = value;
    return this.customerService.autoCompleteClient(value, 1, status,"", false).pipe(
      map(results =>  results),
      catchError(_ => {
        return of(null);
      })
      );
   }

   displayClient(value: any): string {
    return value ? value.name : '';
  }

   afficherNumContrat(value: string): string {
    if(!isNullOrUndefined(value)) {
     return `N° contrat ${value}`;
    }
    return '';
  }

  /**
   * end traitement
   */

  checkIfPictoHasToBeRenderedOrClicked(data){
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

  constructTitlePage(){
    if (this.route.snapshot.queryParams['name'] === 'all') {
      this.title = 'Tâches';
    } else if (this.route.snapshot.queryParams['name'] === 'tasks') {
      this.title = 'Tâches à traiter';
    }
  }

  initDefaultValues(){
    this.defaultUser.firstName ='Tous';
    this.defaultUser.lastName ='';
    this.defaultUser.id = 0;

    this.defaultParcours.label = 'Tous';
    this.defaultParcours.id = 0;

    this.defaultRole.id = 0;
    this.defaultRole.displayName = 'Tous';
  }

  constructFiltersWhenBackToPage(){
        /*-----------le cas de retour apres modification d'une tache, on repositionne les filtres et on lance la recherche--*/
        if(this.route.snapshot.queryParamMap.get('backAgain') === "true"){
          this.show = stringToBoolean(this.route.snapshot.queryParamMap.get('show'));
          this.constructSimpleFilters();
          this.constructAdvancedFilters();
          this.constructStatusFilters();
      }
  }

  constructSimpleFilters(){
    this.taskFilter.idResponsableAffaire  = Number(this.route.snapshot.queryParamMap.get('idResponsableAffaire'));
    this.responsableAffaireControl.setValue(this.listResponsablesAffaires.filter(responsable => 
      (this.taskFilter.idResponsableAffaire != null && this.taskFilter.idResponsableAffaire === responsable.id))[0]);
   
    this.taskFilter.requestType  = this.route.snapshot.queryParamMap.get('requestType');
    this.parcoursControl.setValue(this.listParcours.filter(parcours => 
      (this.taskFilter.requestType != null && this.taskFilter.requestType === parcours.label))[0]);

    this.taskFilter.idSuiviPar  = Number(this.route.snapshot.queryParamMap.get('idSuiviPar'));
    this.suiviParControl.setValue(this.listSuiviPar.filter(suiviPar => 
      (this.taskFilter.idSuiviPar != null && this.taskFilter.idSuiviPar === suiviPar.id))[0]);

    this.taskFilter.idTraiterPar  = Number(this.route.snapshot.queryParamMap.get('idTraiterPar'));
    this.traiteParControl.setValue(this.listTraitePar.filter(traiterPar => 
      (this.taskFilter.idTraiterPar != null && this.taskFilter.idTraiterPar === traiterPar.id))[0]);

    this.taskFilter.cartStatut  = this.route.snapshot.queryParamMap.get('cartStatut');
    this.statutPanierControl.setValue(CART_STATUS.filter(statutPanier => 
      (this.taskFilter.cartStatut != null && this.taskFilter.cartStatut === statutPanier.data))[0]);
      
    this.taskFilter.fromDate  = new Date(this.route.snapshot.queryParamMap.get('fromDate'));
    this.dateDebutControl.setValue(this.taskFilter.fromDate);

    this.taskFilter.toDate  = new Date(this.route.snapshot.queryParamMap.get('toDate'));
    this.dateFinControl.setValue(this.taskFilter.toDate);

    this.taskFilter.idTask  = Number(this.route.snapshot.queryParamMap.get('idTask'));
    if(this.taskFilter.idTask > 0){
      this.numeroTache.setValue(this.taskFilter.idTask);
    }

    this.taskFilter.taskPriority  = stringToBoolean(this.route.snapshot.queryParamMap.get('taskPriority'));
    this.priorityControl.setValue(this.taskFilter.taskPriority);
  }

  constructAdvancedFilters(){
    this.taskFilter.idRoleCreateur  = Number(this.route.snapshot.queryParamMap.get('idRoleCreateur'));
    this.roleCreateurControl.setValue(this.listRolesCreateur.filter(roleCreateur => 
      (this.taskFilter.idRoleCreateur != null && this.taskFilter.idRoleCreateur === roleCreateur.id))[0]);
    
    this.route.queryParams.subscribe((params) => {
      params['idCreateurs'].filter(idCreateur => 
        this.taskFilter.idCreateurs.push(Number(idCreateur)));
    });
    if (!isNullOrUndefined(this.listCreateur)) {
      for(const idCreateur of this.taskFilter.idCreateurs){
        this.listCurrentCreateur.push(this.listCreateur.find(createur => createur.id === idCreateur));
      }
    }

    
    this.valueMember = (this.route.snapshot.queryParamMap.get('valueMember'));
    this.customerService.autoCompleteClient(this.valueMember, 1, [],"", true).subscribe( data => {
     this.taskFilter.idMember  = Number(this.route.snapshot.queryParamMap.get('idMember'));
     this.membreControl.setValue(data.filter(member => 
      (this.taskFilter.idMember != null && this.taskFilter.idMember === member.id))[0]); 
    });

    this.taskFilter.idBackup  = Number(this.route.snapshot.queryParamMap.get('idBackup'));
    this.backUpControl.setValue(this.listBackup.filter(backup => 
      (this.taskFilter.idBackup != null && this.taskFilter.idBackup === backup.id))[0]);

    this.taskFilter.idPortfeuille  = Number(this.route.snapshot.queryParamMap.get('idPortfeuille'));
    this.portefeuilleControl.setValue(this.listPortefeuille.filter(idPortfeuille => 
      (this.taskFilter.idPortfeuille != null && this.taskFilter.idPortfeuille === idPortfeuille.id))[0]);

    this.taskFilter.idPilotePar  = Number(this.route.snapshot.queryParamMap.get('idPilotePar'));
    this.piloterParControl.setValue(this.listPilotee.filter(idPilotePar => 
      (this.taskFilter.idPilotePar != null && this.taskFilter.idPilotePar === idPilotePar.id))[0]);
  }

  constructStatusFilters(){
    this.taskFilter.taskAssignedStatut  = this.route.snapshot.queryParamMap.get('taskAssignedStatut');
    this.taskFilter.statut  = this.route.snapshot.queryParamMap.get('statut');
    if(this.taskFilter.statut != null && this.taskFilter.taskAssignedStatut != null ){
      for(const statutTask of TASK_STATUS_WITH_ALL_SUB_CATEGORIES){
        if(this.taskFilter.statut === statutTask.data){
          if(this.taskFilter.taskAssignedStatut === TASK_STATUS.ASSIGNED.key && statutTask.isAssigned){
            this.statutTacheControl.setValue(statutTask);
          } else if(this.taskFilter.taskAssignedStatut === TASK_STATUS.DONE.key && !statutTask.isAssigned){
            this.statutTacheControl.setValue(statutTask);
          }
        }
      }
    }
  }

  constructSimpleLists(){
        /*------------------Filtre Responsable---------------------------*/
        this.filteredResponsableAffaire = this.responsableAffaireControl.valueChanges
        .pipe(
          startWith(''), 
          map((responsableAffaire: UserVo | null)  => responsableAffaire ? this._filterResponsableAffaire(responsableAffaire) : this.listResponsablesAffaires.slice())
  
        );
  
      /*------------------Filtre Membre---------------------------*/
      this.filteredMember = this.memberControl.valueChanges
        .pipe(
          startWith(''),
          map(option => option ? this._filterMember(option) : this.membersList.slice())
        );
  
        /*------------------Filtre Traité par---------------------------*/
      this.filteredTraitePar = this.traiteParControl.valueChanges
        .pipe(
          startWith(''),
          map(traitePar => traitePar ? this._filterTraitePar(traitePar) : this.listTraitePar.slice())
        );
  
        
  
      /*------------------Filtre Suivi par---------------------------*/
      this.filteredSuiviPar = this.suiviParControl.valueChanges
        .pipe(
          startWith(''),
          map(suiviPar => suiviPar ? this._filterSuiviPar(suiviPar) : this.listSuiviPar.slice())
        );
  
      /*------------------Filtre Parcours---------------------------*/
      this.filteredParcours = this.parcoursControl.valueChanges
        .pipe(
          startWith(''),
          map(parcours => parcours ? this._filterParcours(parcours) : this.listParcours.slice())
        );
  
      /*------------------Filtre Staut panier---------------------------*/
      this.filteredStatutPanier = this.statutPanierControl.valueChanges
        .pipe(
          startWith(''),
          map(statutPanier => statutPanier ? this._filterStatutPanier(statutPanier) : CART_STATUS_MONITORING.slice())
        );
  
      /*------------------Filtre Statut tâche---------------------------*/
      this.filteredStatutTache = this.statutTacheControl.valueChanges
        .pipe(
          startWith(''),
          map(statutTache => statutTache ? this._filterStatutTache(statutTache) : TASK_STATUS_WITH_ALL_SUB_CATEGORIES .slice())
        );
  }
  constructAdvancedLists(){
        /*------------------Filtre Role Créateur---------------------------*/
        this.filteredRoleCreateur = this.roleCreateurControl.valueChanges
        .pipe(
          startWith(''),
          map(roleCreateur => roleCreateur ? this._filterRoleCreateur(roleCreateur) : this.listRolesCreateur.slice())
        );
  
      /*------------------Filtre Créée par---------------------------*/
      this.filteredCreateur = this.createurControl.valueChanges
        .pipe(
          startWith(''),
          map(createur => createur ? this._filterCreateur(createur) : this.listCreateur.slice())
        );
  
      /*------------------Filtre Piloté par---------------------------*/
      this.filteredPiloterPar = this.piloterParControl.valueChanges
        .pipe(
          startWith(''),
          map(option => option ? this._filterPiloter(option) : this.listPilotee.slice())
        );
      
      /*------------------Filtre Portefeuille---------------------------*/
      this.filteredPortefeuille = this.portefeuilleControl.valueChanges
        .pipe(
          startWith(''),
          map(portefeuille => portefeuille ? this._filterPortefeuille(portefeuille) : this.listPortefeuille.slice())
        );
  
      /*------------------Filtre Backup---------------------------*/
      this.filteredBackUp = this.backUpControl.valueChanges
        .pipe(
          startWith(''),
          map(backup => backup ? this._filterBackUp(backup) : this.listBackup.slice())
        );
  }

  genCompositionPanierTemplate(_params:any): string {
    let compositionsPanier;
    let ulTemplate = ` <strong class="athena">Composition : </strong>`;
    if(_params.data.panierComposition != null && _params.data.panierComposition.length>0){
      compositionsPanier = _params.data.panierComposition;
      ulTemplate += ` <ul class="simple">`;
      for(const comp of compositionsPanier){
        ulTemplate +=  `<li> ${comp} </li>`;
      }
      ulTemplate += ` </ul>`;
    } else {
      ulTemplate += '-';
    }
    return ulTemplate;
  }

  getOrderStatusTemplate(cartColor:string): string {
    let cartlabel ;
    cartlabel = getCartLabel(cartColor, null);
    let orderStatusTemplate = ` <strong class="athena">Statut de l'ordre de commande : </strong>`;
    if(!isNullOrUndefined(cartlabel)){
      orderStatusTemplate += ` ${cartlabel} `;
    } else {
      orderStatusTemplate += '-';
    }
    return orderStatusTemplate;
  }

  generateTemplate(_params:any): string {
    const ulTemplate = this.genCompositionPanierTemplate(_params);
    const orderStatus =this.getOrderStatusTemplate(_params.data.panierIconeTask);
    const panierPrice = (_params.data.panierPrice != null ? _params.data.panierPrice : '-');
    const requestId = _params.data.requestId;  

    const requestDescription = (_params.data.requestDescription != null && !!_params.data.requestDescription ? _params.data.requestDescription : '-');
    const pliTemplatePar1 = ` <div style="height: 100%; margin-left: 40px; padding: 5px; box-sizing: border-box;overflow-y: scroll;">
    <div class="row" > 
    <div class=" col-12 enableNewLine" >
      <span class="athena uppercase underline grey mb-2 "> TÂCHE : </span>
      <p class="enableNewLine"> 
        <strong class="athena" >  Backup d’origine : </strong> -
      </p>
      <span class="athena uppercase underline grey mb-2 "> DEMANDE </span>
      <p class="enableNewLine"> `;
    const pliTemplatePar2 = 
     ` <strong class="athena" > Numéro de la demande : </strong> ${requestId}
        </p>
        <strong class="athena">Description de la demande : </strong> ${requestDescription} 
      </div>
      <div class=" col-12" >
        <span class="athena uppercase underline grey mb-2 "> PANIER </span>
        <p class="enableNewLine"> 
          <strong class="athena" > Prix : </strong> ${panierPrice}  
        </p> ${ulTemplate} 
        <p class="enableNewLine"> 
        ${orderStatus}
      </p>
        </div>
    </div>
    `;
    return pliTemplatePar1 + pliTemplatePar2;
  }

   /*------------------Actions de combo de créateurs ---------------------------*/
  removeCreateur(i: UserVo): void {
    this.taskFilter.idCreateurs = [];
    const index = this.listCurrentCreateur.indexOf(i);
    if (index >= 0) {
      this.listCurrentCreateur.splice(index, 1);
    }
  }

  selectedCreateur(event: MatAutocompleteSelectedEvent): void {
    this.taskFilter.idCreateurs = []; 
    if (!isNullOrUndefined(this.listCurrentCreateur)) {
      const isExist = this.listCurrentCreateur.find(option => option.id === event.option.value.id);
      if (isNullOrUndefined(isExist)) {
        this.listCurrentCreateur.push(event.option.value);
      }
    }
    this.JInputCreateur.nativeElement.value = ''; 
    this.createurControl.setValue(null);
    this.chipCreateurList.errorState = false;
  }

  /*------------------Actions de combo de membre ---------------------------*/
  removeCreePar(i: string): void {
    const index = this.membersList.indexOf(i);
    if (index >= 0) {
      this.membersList.splice(index, 1);
    }
  }

  selectedCreePar(event: MatAutocompleteSelectedEvent): void {
    if (!isNullOrUndefined(this.membersList)) {
      const isExist = this.membersList.find(option => option === event.option.value);
      if (isNullOrUndefined(isExist)) {
        this.membersList.push(event.option.value);
      }
    }
    this.JInput.nativeElement.value = '';
  }

  onShow(): void {
    this.show = false;
  }
  onHide(): void {
    this.show = true;
  }

  onSelectRole(role: RoleVO): void {
    if(!isNullOrUndefined(role) && role !== this.defaultRole){
      this.userService.getUsersByIdRole(role.id).subscribe(
        (result) => {
          this.listCreateur = result;
          this.listCurrentCreateur = [];
          this.filteredCreateur = this.createurControl.valueChanges
          .pipe(
            startWith(''),
            map(createur => createur ? this._filterCreateur(createur) : this.listCreateur.slice())
          );
        }
      );
    }
  }

  valueRolechange(role: RoleVO){
    if(isNullOrUndefined(role) || role.toString() === "" || role === this.defaultRole){
      this.listCurrentCreateur = [];
      this.listCreateur = this.allUsers;
          this.filteredCreateur = this.createurControl.valueChanges
          .pipe(
            startWith(''),
            map(createur => createur ? this._filterCreateur(createur) : this.listCreateur.slice())
          );
    }
  }

  onSelectStartDate(event: any): void {
    const currenteDate = new Date();
    const currentHour = currenteDate.getHours();
    const currentMinute = currenteDate.getMinutes();
    const currentSecond = currenteDate.getSeconds();

    if(this.dateFinControl.value.getTime() < this.dateDebutControl.value.getTime() ){
      const dateDebut = new Date(this.dateDebutControl.value.setHours(currentHour,currentMinute,currentSecond));
      this.dateDebutControl.setValue(dateDebut);
      this.rangeOfEndDate = new Date(dateDebut);
      const dateFin = new Date(new Date(dateDebut).setDate(dateDebut.getDate()+1));
      this.dateFinControl.setValue(dateFin);
    } else {
      const dateDebut = new Date(this.dateDebutControl.value.setHours(currentHour,currentMinute,currentSecond));
      this.dateDebutControl.setValue(dateDebut);
      this.rangeOfEndDate = new Date(dateDebut);
    }
  }

  onSelectFinDate(event: any): void {
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const currentSecond = new Date().getSeconds();
    this.dateFinControl.setValue(new Date(Moment(this.dateFinControl.value).toDate().setHours(currentHour,currentMinute,currentSecond)));
  }
  

  filterInput(event:any): boolean{
    const input = event.target;
    const length = input.value.length;
    const maxLength = 20;
    //Les cas : suppresskey + fleches + ctrl c 
    if( event.which === 8 || event.which === 0 || event.which === 99){
      return true;
    } else {
      if(!(event.which >= 48 && event.which <= 57) || length >= maxLength || isNaN(this.numeroTache.value) === true){
       return false ;
     }
    }
    
    return true;
  }

  /******** fonctions de rendere de aggrid ************************ */
  getStatusTask(params: any) : string {
    let image: string;
    if (params.data.statusTask === "ASSIGNED_IN_TIME") {
      image = `<span class='icon picto-tache-assign-dans-d-lais' ></span>`
    } else if (params.data.statusTask === "ASSIGNED_OUT_OF_TIME") {
      image = `<span class='icon picto-tache-assign-hors-d-lais' ></span>`
    }else if (params.data.statusTask === "DONE_IN_TIME") {
      image = `<span class='icon picto-tache-close-dans-d-lais' ></span>`
    } else if (params.data.statusTask === "DONE_OUT_OF_TIME") {
      image = `<span class='icon picto-tache-close-hors-d-lais' ></span>`
    } else if (params.data.statusTask === "DONE_CANCELLED") {
      image = `<span class='icon picto-tache-annul' ></span>`
    } else {
      image = null;
    }
    return image;
  }

  getDateEcheance(value: string, nbrHour: number): string {  
    if(nbrHour >= -48 && nbrHour <= -1) {
     return `${nbrHour.toString().replace('-','')}h`;
    }
    return this.datePipe.transform(value, 'dd MMM yyyy');
   } 

   getStatusPanierTask(params: any) : string {
    if(!isNullOrUndefined(params.data) && !isNullOrUndefined(params.data.panierId)){
      return getCartIconRenderer(params.data.panierIconeTask, params.data.stockToUseCode);
    }
   return null;    
  }

  clearStatutPanierList() {
    this.statutPanierControl.setValue('');
  }

  clearStatutTacheList() {
    this.statutTacheControl.setValue('');
  }

  clearSuiviParList() {
    this.suiviParControl.setValue('');
  }

  clearParcoursList() {
    this.parcoursControl.setValue('');
  }

  clearTraiteParList() {
    this.traiteParControl.setValue('');
  }

  clearMemberList() {
    this.membreControl.setValue('');
  }

  clearResponsableAffaireList() {
    this.responsableAffaireControl.setValue('');
  }

  clearRoleCreateurList(){
    this.roleCreateurControl.setValue('');
  }

  clearPortefeuilleList(){
    this.portefeuilleControl.setValue('');
  }

  clearCreeeParList(){
    this.JInputCreateur.nativeElement.focus();
    this.createurControl.setValue('');
  }

  clearPiloteeParList(){
    this.piloterParControl.setValue('');
  }

  isUserEligibleToModifyTask(params: any): boolean{
    if(this.redirectionService.hasPermission('modification_taches')){
      return true;
    }
    if(this.currentUser.identifiantFT === params.data.createdByFT){
      return true;
    }
    return false;
  }
  getActionsOnTask(params: any) : string {
    let iconeActionTask ;
    if (params.data.statusTask !== "DONE_OUT_OF_TIME" && params.data.statusTask !== "DONE_CANCELLED"
    && params.data.statusTask !== "DONE_IN_TIME") {
      if (params.column.colId === 'parameters'){
        iconeActionTask = `<span class='icon parameters' ></span>`;
      } else if (params.column.colId === 'update' && this.isUserEligibleToModifyTask(params) && this.redirectionService.hasPermission('modification_taches')){
        iconeActionTask = `<span class='icon pen athena' ></span>`;
      } else if (params.column.colId === 'close' && this.redirectionService.hasPermission('cloture_taches')){
        iconeActionTask = `<span class='icon key athena' ></span>`;
      } 
    } else {
      iconeActionTask = null;
    }
    return iconeActionTask;
  }

  clickCell(params: any): void {
    if (params.column.colId === 'update' && params.data.statusTask !== "DONE_OUT_OF_TIME" && params.data.statusTask !== "DONE_CANCELLED"
        && params.data.statusTask !== "DONE_IN_TIME" && this.checkIfPictoHasToBeRenderedOrClicked(params.data)) {
      this.url = this.router.serializeUrl(this.router.createUrlTree(
        [this.customerDashboard, getEncryptedValue(params.data.customerId), 'request', params.data.requestId, 'modifyTask', params.data.id],
        {
          queryParams: { 
            'idResponsableAffaire' : this.taskFilter.idResponsableAffaire,
            'requestType' : this.taskFilter.requestType,
            'idSuiviPar' : this.taskFilter.idSuiviPar,
            'idTraiterPar' : this.taskFilter.idTraiterPar,
            'cartStatut' : this.taskFilter.cartStatut,
            'fromDate' : this.taskFilter.fromDate,
            'toDate' : this.taskFilter.toDate,
            'idTask' : this.taskFilter.idTask,
            'taskPriority' : this.taskFilter.taskPriority,
            'idRoleCreateur' : this.taskFilter.idRoleCreateur,
            'idCreateurs' : this.taskFilter.idCreateurs,
            'idBackup' : this.taskFilter.idBackup,
            'idPortfeuille' : this.taskFilter.idPortfeuille,
            'idPilotePar' : this.taskFilter.idPilotePar,
            'taskAssignedStatut' : this.taskFilter.taskAssignedStatut,
            'statut' : this.taskFilter.statut,
            'idMember' : this.taskFilter.idMember,
            'valueMember': this.valueMember,
            'show' : this.show,
            'name' : this.route.snapshot.queryParamMap.get('name'),
            isDetail: false, typeCustomer: params.data.categorie,

          }
        }
        )
      );
    } else if (params.column.colId === 'close' && params.data.statusTask !== "DONE_OUT_OF_TIME" && params.data.statusTask !== "DONE_CANCELLED"
                && params.data.statusTask !== "DONE_IN_TIME" && this.checkIfPictoHasToBeRenderedOrClicked(params.data) && !params.data.blocked) {
      let next = 0;
      if(params.data.existTaskToAssigned) {
        next = 1;
      }
      this.url = this.router.serializeUrl(this.router.createUrlTree(
          [this.customerDashboard, getEncryptedValue(params.data.customerId), 'request', params.data.requestId, 'taskassignment', params.data.id], {
          queryParams: {
            idRequest: params.data.requestId,
            processInstanceId: params.data.processInstanceId,
            thetisTaskId: params.data.thetisTaskId,
            nextIdTask: next,
            typeCustomer: params.data.categorie
          }
        }
       )
      );
    } else if (params.column.colId === 'numero') {
      this.url = this.router.serializeUrl(this.router.createUrlTree(
          [this.customerDashboard, getEncryptedValue(params.data.customerId), 'request', params.data.requestId, 'task-details', params.data.id],
          {
            queryParams: { typeCustomer: params.data.categorie },
            queryParamsHandling: 'merge'
          }
         )
        );
    } else if (params.column.colId === 'taskCustomer') {
        let mainCategory = params.data.categorie;
        if(params.data.categorie === "beneficiary" || params.data.categorie === "particular"){
          mainCategory = "particular";
        } else if(params.data.categorie === "company"){
          mainCategory = "entreprise";
        }
        this.url = this.router.serializeUrl(this.router.createUrlTree(
          [this.customerDashboard, mainCategory, params.data.customerId],
          {
            queryParams: { typeCustomer: params.data.categorie }
          }
         )
        );

      } else if (params.column.colId === 'panier' && this.isInParcours(params.data.parcours) && this.checkIfPictoHasToBeRenderedOrClicked(params.data)) {
        if(!isNullOrUndefined(params.data.panierComposition) && params.data.panierComposition.length>0 ){
          this.goToPanier(params, 'creation');
        } else {
          this.goToPanier(params, 'catalog');
        }
    }
    if (params.column.colId === 'parameters' && this.checkIfPictoHasToBeRenderedOrClicked(params.data)) {
      this.goToWelcomeMail(params.data);
      this.toSav(params.data);
      this.goToHomologation(params.data);
      this.goToSMSView(params.data);
      this.onDownloadBill(params.data.parcours, params.data.tache, params.data.id, this.currentUser.coachId);
      this.showEntryReportMail(params.data);
    }
      this.redirectToNewTab();
  }

  redirectToNewTab(): void {
    if(!isNullOrUndefined(this.url)){
      window.open(`#${this.url}`, '_blank');
      this.url = null;
    }
  }

  goToPanier(params: any, specUrl: string){
    this.url = this.router.serializeUrl(this.router.createUrlTree(
      [this.customerDashboard, getEncryptedValue( params.data.customerId),'cart', specUrl, params.data.requestId],
      {
        queryParams: { 
          typeCustomer: params.data.categorie,
          parcours: params.data.parcours
        },
        queryParamsHandling: 'merge'
      }
     )
    );
  }

  getColorTask(params: any): string[] {
    const classes = [this.cellWrap];
    if (params.data.statusTask === "DONE_OUT_OF_TIME" || params.data.statusTask === "DONE_CANCELLED"
    || params.data.statusTask === "DONE_IN_TIME") {
      classes.push('font-italic  grey');
    } else {
      if (params.data.isPriority) {
        classes.push('orange');
      } 
    } 
    return classes;
  }

  isPrioritaireEtOuverte(nodeA : any): boolean{
    let isPrioAndOpen = false;
    if(nodeA.data.isPriority && (nodeA.data.statusTask === "ASSIGNED_OUT_OF_TIME" || nodeA.data.statusTask === "ASSIGNED_IN_TIME")){
      isPrioAndOpen = true;
    }
    return isPrioAndOpen;
  }

  filterDate(a, b, nodeA, nodeB): number { 
    if ( !nodeA.data.isPriority && !nodeA.data.isOpened && !nodeB.data.isPriority && !nodeB.data.isOpened &&  a === null && b === null) { 
      return 0; 
    }
    if ( !nodeA.data.isPriority && !nodeA.data.isOpened && !nodeB.data.isPriority && !nodeB.data.isOpened && a === null ) { 
      return 1; 
    }
    if ( !nodeA.data.isPriority && !nodeA.data.isOpened && !nodeB.data.isPriority && !nodeB.data.isOpened && b === null) { 
      return -1; 
    }
    if ( !nodeA.data.isPriority && !nodeA.data.isOpened && !nodeB.data.isPriority && !nodeB.data.isOpened && a === '-' && b === '-') { 
      return 0; 
    }
    if ( !nodeA.data.isPriority && !nodeA.data.isOpened && !nodeB.data.isPriority && !nodeB.data.isOpened && a === '-' ) { 
      return 1; 
    }
    if ( !nodeA.data.isPriority && !nodeA.data.isOpened && !nodeB.data.isPriority && !nodeB.data.isOpened && b === '-') { 
      return -1; 
    }
    if ( !nodeA.data.isPriority && !nodeA.data.isOpened && !nodeB.data.isPriority && !nodeB.data.isOpened) { 
      return transformDate(a) - transformDate(b);
    }
   
    if ( nodeA.data.isPriority && !nodeA.data.isOpened && nodeB.data.isPriority && !nodeB.data.isOpened &&  a === null && b === null) { 
      return 0; 
    }
    if ( nodeA.data.isPriority && !nodeA.data.isOpened && nodeB.data.isPriority && !nodeB.data.isOpened && a === null ) { 
      return 1; 
    }
    if ( nodeA.data.isPriority && !nodeA.data.isOpened && nodeB.data.isPriority && !nodeB.data.isOpened && b === null) { 
      return -1; 
    }
    if ( nodeA.data.isPriority && !nodeA.data.isOpened && nodeB.data.isPriority && !nodeB.data.isOpened && a === '-' && b === '-') { 
      return 0; 
    }
    if ( nodeA.data.isPriority && !nodeA.data.isOpened && nodeB.data.isPriority && !nodeB.data.isOpened && a === '-' ) { 
      return 1; 
    }
    if ( nodeA.data.isPriority && !nodeA.data.isOpened && nodeB.data.isPriority && !nodeB.data.isOpened && b === '-') { 
      return -1; 
    }
    if( nodeA.data.isPriority && !nodeA.data.isOpened && nodeB.data.isPriority && !nodeB.data.isOpened) { 
      return transformDate(a) - transformDate(b);
    }
   
    if ( nodeA.data.isPriority && nodeB.data.isPriority &&  a === null && b === null) { 
      return 0; 
    }
    if ( nodeA.data.isPriority && nodeB.data.isPriority && a === null ) { 
      return 1; 
    }
    if ( nodeA.data.isPriority && nodeB.data.isPriority && b === null) { 
      return -1; 
    }
    if ( nodeA.data.isPriority && nodeB.data.isPriority && a === '-' && b === '-') { 
      return 0; 
    }
    if ( nodeA.data.isPriority && nodeB.data.isPriority && a === '-' ) { 
      return 1; 
    }
    if ( nodeA.data.isPriority && nodeB.data.isPriority && b === '-') { 
      return -1; 
    }
    if ( nodeA.data.isPriority && nodeB.data.isPriority ) { 
      return transformDate(a) - transformDate(b);
    }

    if ( !nodeA.data.isPriority && nodeA.data.isOpened && !nodeB.data.isPriority && nodeB.data.isOpened &&  a === null && b === null) { 
      return 0; 
    }
    if ( !nodeA.data.isPriority && nodeA.data.isOpened && !nodeB.data.isPriority && nodeB.data.isOpened && a === null ) { 
      return 1; 
    }
    if ( !nodeA.data.isPriority && nodeA.data.isOpened && !nodeB.data.isPriority && nodeB.data.isOpened && b === null) { 
      return -1; 
    }
    if ( !nodeA.data.isPriority && nodeA.data.isOpened && !nodeB.data.isPriority && nodeB.data.isOpened && a === '-' && b === '-') { 
      return 0; 
    }
    if ( !nodeA.data.isPriority && nodeA.data.isOpened && !nodeB.data.isPriority && nodeB.data.isOpened && a === '-' ) { 
      return 1; 
    }
    if ( !nodeA.data.isPriority && nodeA.data.isOpened && !nodeB.data.isPriority && nodeB.data.isOpened && b === '-') { 
      return -1; 
    }
    if ( !nodeA.data.isPriority && nodeA.data.isOpened && !nodeB.data.isPriority && nodeB.data.isOpened) { 
      return transformDate(a) - transformDate(b);
    }
    return 0;
 }
 
 filterString(a, b, nodeA, nodeB): number { 
  if ( !nodeA.data.isPriority && !nodeA.data.isOpened && !nodeB.data.isPriority && !nodeB.data.isOpened &&  a === null && b === null) { return 0; }
  if ( !nodeA.data.isPriority && !nodeA.data.isOpened && !nodeB.data.isPriority && !nodeB.data.isOpened && a === null ) { return 1; }
  if ( !nodeA.data.isPriority && !nodeA.data.isOpened && !nodeB.data.isPriority && !nodeB.data.isOpened && b === null) { return -1; }
  if ( !nodeA.data.isPriority && !nodeA.data.isOpened && !nodeB.data.isPriority && !nodeB.data.isOpened && a === '-' && b === '-') { return 0; }
  if ( !nodeA.data.isPriority && !nodeA.data.isOpened && !nodeB.data.isPriority && !nodeB.data.isOpened && a === '-' ) { return 1; }
  if ( !nodeA.data.isPriority && !nodeA.data.isOpened && !nodeB.data.isPriority && !nodeB.data.isOpened && b === '-') { return -1; }
  if ( !nodeA.data.isPriority && !nodeA.data.isOpened && !nodeB.data.isPriority && !nodeB.data.isOpened) { return a.localeCompare(b);}
 
  if ( nodeA.data.isPriority && !nodeA.data.isOpened && nodeB.data.isPriority && !nodeB.data.isOpened &&  a === null && b === null) { return 0; }
  if ( nodeA.data.isPriority && !nodeA.data.isOpened && nodeB.data.isPriority && !nodeB.data.isOpened && a === null ) { return 1; }
  if ( nodeA.data.isPriority && !nodeA.data.isOpened && nodeB.data.isPriority && !nodeB.data.isOpened && b === null) { return -1; }
  if ( nodeA.data.isPriority && !nodeA.data.isOpened && nodeB.data.isPriority && !nodeB.data.isOpened && a === '-' && b === '-') { return 0; }
  if ( nodeA.data.isPriority && !nodeA.data.isOpened && nodeB.data.isPriority && !nodeB.data.isOpened && a === '-' ) { return 1; }
  if ( nodeA.data.isPriority && !nodeA.data.isOpened && nodeB.data.isPriority && !nodeB.data.isOpened && b === '-') { return -1; }
  if( nodeA.data.isPriority && !nodeA.data.isOpened && nodeB.data.isPriority && !nodeB.data.isOpened) { return a.localeCompare(b);}
 
  if ( nodeA.data.isPriority && nodeB.data.isPriority &&  a === null && b === null) { return 0; }
  if ( nodeA.data.isPriority && nodeB.data.isPriority && a === null ) { return 1; }
  if ( nodeA.data.isPriority && nodeB.data.isPriority && b === null) { return -1; }
  if ( nodeA.data.isPriority && nodeB.data.isPriority && a === '-' && b === '-') { return 0; }
  if ( nodeA.data.isPriority && nodeB.data.isPriority && a === '-' ) { return 1; }
  if ( nodeA.data.isPriority && nodeB.data.isPriority && b === '-') { return -1; }
  if ( nodeA.data.isPriority && nodeB.data.isPriority ) { return a.localeCompare(b);}

  if ( !nodeA.data.isPriority && nodeA.data.isOpened && !nodeB.data.isPriority && nodeB.data.isOpened &&  a === null && b === null) { return 0; }
  if ( !nodeA.data.isPriority && nodeA.data.isOpened && !nodeB.data.isPriority && nodeB.data.isOpened && a === null ) { return 1; }
  if ( !nodeA.data.isPriority && nodeA.data.isOpened && !nodeB.data.isPriority && nodeB.data.isOpened && b === null) { return -1; }
  if ( !nodeA.data.isPriority && nodeA.data.isOpened && !nodeB.data.isPriority && nodeB.data.isOpened && a === '-' && b === '-') { return 0; }
  if ( !nodeA.data.isPriority && nodeA.data.isOpened && !nodeB.data.isPriority && nodeB.data.isOpened && a === '-' ) { return 1; }
  if ( !nodeA.data.isPriority && nodeA.data.isOpened && !nodeB.data.isPriority && nodeB.data.isOpened && b === '-') { return -1; }
  if ( !nodeA.data.isPriority && nodeA.data.isOpened && !nodeB.data.isPriority && nodeB.data.isOpened) { return a.localeCompare(b);}
  return 0;
}

/******** construction de taskFilter ************************ */
  chargeStatusTaskFilter(){
    if(this.statutTacheControl.value != null && !!this.statutTacheControl.value 
      && this.statutTacheControl.value.toString().trim().length >0 ){
      if(!isNullOrUndefined(this.statutTacheControl.value.isAssigned) && this.statutTacheControl.value.isAssigned){
        this.taskFilter.taskAssignedStatut = TASK_STATUS.ASSIGNED.key;
      } else if(!isNullOrUndefined(this.statutTacheControl.value.isAssigned) && !this.statutTacheControl.value.isAssigned) {
        this.taskFilter.taskAssignedStatut = TASK_STATUS.DONE.key;
      } else {
        this.taskFilter.taskAssignedStatut = null;
      }
      this.taskFilter.statut = this.statutTacheControl.value.data;
    } else {
      this.statutTacheControl.setValue(null);
      this.taskFilter.statut = null;
      this.taskFilter.taskAssignedStatut = null;
    }

  }
  chargeTaskFilter(){ 
    if(this.responsableAffaireControl.value != null){
      this.taskFilter.idResponsableAffaire = this.responsableAffaireControl.value.id;
    }
    if(this.parcoursControl.value != null && this.parcoursControl.value !== this.defaultParcours){ 
      this.taskFilter.requestType = this.parcoursControl.value.label;
    } else if(this.parcoursControl.value === this.defaultParcours){
      this.taskFilter.requestType = null;
    }
    if(this.suiviParControl.value != null){
      this.taskFilter.idSuiviPar = this.suiviParControl.value.id;
    }
    if(this.traiteParControl.value != null){
      this.taskFilter.idTraiterPar = this.traiteParControl.value.id;
    }
    if(this.statutPanierControl.value != null){
      this.taskFilter.cartStatut = this.statutPanierControl.value.data;
    }
    if(this.dateDebutControl.value != null){
      this.taskFilter.fromDate = this.dateDebutControl.value;
    }
    if(this.dateFinControl.value != null){
      this.taskFilter.toDate = this.dateFinControl.value;
    }
    if(this.numeroTache.value != null){
      this.taskFilter.idTask = this.numeroTache.value;
    }
    this.taskFilter.taskPriority = this.priorityControl.value;
    if(this.roleCreateurControl.value != null){
      this.taskFilter.idRoleCreateur = this.roleCreateurControl.value.id;
    }

    if(!isNullOrUndefined(this.membreControl.value)){
      this.taskFilter.idMember = this.membreControl.value.id;
    }

    this.chargeAdvancedTaskFilter();
    this.chargeStatusTaskFilter();
  }

  chargeAdvancedTaskFilter(){
    const listCreateurs = this.listCurrentCreateur;
    if (listCreateurs && this.taskFilter.idCreateurs.length<=0) {
      listCreateurs.forEach((createur: UserVo) => {
        this.taskFilter.idCreateurs.push(createur.id);
      });
    }
    if(this.backUpControl.value != null){
      this.taskFilter.idBackup = this.backUpControl.value.id;
    }
    if(this.portefeuilleControl.value != null){
      this.taskFilter.idPortfeuille = this.portefeuilleControl.value.id;
    }
    if(this.piloterParControl.value != null){
      this.taskFilter.idPilotePar = this.piloterParControl.value.id;
    }

  }

  /******** action sur les combo de la page ************************ */
  displayResponsableAffaire(responsableAffaire: UserVo): string {   
    return responsableAffaire? (`${firstNameFormatter(responsableAffaire.firstName.toString())} ${responsableAffaire.lastName.toUpperCase()}`) : '';
  }
  private _filterResponsableAffaire(value: UserVo): UserVo[] {
    return this.listResponsablesAffaires.filter(responsableAffaire => responsableAffaire.lastName.toLowerCase().indexOf(value.toString().toLowerCase()) === 0);
  }

  displayPilotee(pilotee: UserVo): string { 
    return pilotee? (`${firstNameFormatter(pilotee.firstName.toString())} ${pilotee.lastName.toUpperCase()}`) : '';
  }
  private _filterPiloter(value: UserVo): UserVo[] {
    return this.listPilotee.filter(pilotee => pilotee.lastName.toLowerCase().indexOf(value.toString().toLowerCase()) === 0);
  }
  displayParcours(parcours: RequestTypeVO): string {
    return parcours && parcours.label ? parcours.label : '';
  }
  private _filterParcours(value: RequestTypeVO): RequestTypeVO[] {
    console.log(value)
    return this.listParcours.filter(parcours => parcours.label.toLowerCase().indexOf(value.toString().toLowerCase()) === 0 && parcours.label !== 'Tous');
  }
  private _filterMember(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.membersList.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  displayStatutPanier(statutPanier: any): string {
    return statutPanier? statutPanier.label : '';
  }
  private _filterStatutPanier(value: any): any[] {
    return CART_STATUS_MONITORING.filter(statutPanier => statutPanier.label.toLowerCase().indexOf(value.toString().toLowerCase()) === 0 && statutPanier.label !== 'Tous');
  }

  displayStatutTache(statutTache: any): string {
    return statutTache? statutTache.label : '';
  }
  private _filterStatutTache(value: any): any[] {
    return TASK_STATUS_WITH_ALL_SUB_CATEGORIES.filter(statutTache => statutTache.label.toLowerCase().indexOf(value.toString().toLowerCase()) === 0 && statutTache.label !== 'Tous');
  }

  displaySuiviPar(suiviPar: UserVo): string { 
    return suiviPar? (`${firstNameFormatter(suiviPar.firstName.toString())} ${suiviPar.lastName.toUpperCase()}`) : '';
  }
  private _filterSuiviPar(value: UserVo): UserVo[] {
    return this.listSuiviPar.filter(suiviPar => suiviPar.lastName.toLowerCase().indexOf(value.toString().toLowerCase()) === 0);
  }

  displayTraitePar(traitePar: UserVo): string { 
    return traitePar? (`${firstNameFormatter(traitePar.firstName.toString())} ${traitePar.lastName.toUpperCase()}`) : '';
  }
  private _filterTraitePar(value: UserVo): UserVo[] {
    return this.listTraitePar.filter(traitePar => traitePar.lastName.toLowerCase().indexOf(value.toString().toLowerCase()) === 0);
  }

  displayPortefeuille(portefeuille: UserVo): string { 
    return portefeuille? (`${firstNameFormatter(portefeuille.firstName.toString())} ${portefeuille.lastName.toUpperCase()}`) : '';
  }
  private _filterPortefeuille(value: UserVo): UserVo[] {
    return this.listPortefeuille.filter(portefeuille => portefeuille.lastName.toLowerCase().indexOf(value.toString().toLowerCase()) === 0);
  }

  displayRoleCreateur(roleCreateur: RoleVO): string {
    return roleCreateur? roleCreateur.displayName : '';
  }
  private _filterRoleCreateur(value: RoleVO): RoleVO[] {
    return this.listRolesCreateur.filter(roleCreateur => roleCreateur.displayName.toLowerCase().indexOf(value.toString().toLowerCase()) === 0 &&
    roleCreateur.displayName !== 'Tous');
  }

  displayCreateur(createur: UserVo): string { 
    return createur? (`${firstNameFormatter(createur.firstName.toString())} ${createur.lastName.toUpperCase()}`) : '';
  }
  private _filterCreateur(value: UserVo): UserVo[] {
    return this.listCreateur.filter(createur => createur.lastName.toLowerCase().indexOf(value.toString().toLowerCase()) === 0);
  }

  displayBackup(backup: UserVo): string {
    return '';
  }
  private _filterBackUp(value: UserVo): UserVo[] {
    return this.listBackup.filter(backup => backup.lastName.toLowerCase().indexOf(value.toString().toLowerCase()) === 0);
  }

  
  reloadGridAfterSortChanged(ev: any) {
    this.initGrid();
  }

  /**************************************************
   *  FUNCTIONS POUR AG GRID SERVER SIDE (START)    *
   *  app-athena-ag-grid2                           *                                            
   *************************************************/


  initGrid(): void {
    if (this.route.snapshot.queryParams['name'] === 'tasks' 
    && (!this.route.snapshot.queryParamMap.get('backAgain')||
      this.route.snapshot.queryParamMap.get('backAgain') === "false")) {
      const userSelected = this.listTraitePar.filter((x) => x.ftUniversalId === this.currentUser.identifiantFT)[0];
      this.traiteParControl.setValue(userSelected);
      this.createServerSideDatasource(null);
    } else if(this.route.snapshot.queryParamMap.get('backAgain') === "true"){
      this.taskFilter.idMember  = Number(this.route.snapshot.queryParamMap.get('idMember'));
      this.createServerSideDatasource(null);
    }
  }
  createServerSideDatasource(_event?: any): void {
    this.totalItems = 0;
    this.loadingRows = true;
    this.datasource = {
        getRows: (params) => {
          const rc = this.buildRequestCriteria(params.request);
          this.taskService.getTasksMonotoring(rc)
          .pipe(
            map(page => {
              return { ...page, items : page.items.map(task => {
                return { ...task, arrow : ''}
              })}
          }))
          .subscribe(
            data => {
              this.totalItems = data.total;
              this.loadingRows = false;
              setTimeout( () => {
                params.success({ rowData: data.items, rowCount: data.total });
                this.params = { force: true, suppressFlash: true};
                document.getElementById('taskTabId').scrollIntoView();
              }, 100);
            },
            _error => {
              params.fail();
              this.loadingRows = false;
              this.totalItems = 0;
      })}};
    }
  /**************************************************
   *  FUNCTIONS POUR AG GRID SERVER SIDE (END)      *
   *  app-athena-ag-grid2                           *                                            
   *************************************************/

   /**************************************************
   *  FUNCTIONS POUR AG GRID SERVER SIDE (END)      *
   *  app-athena-ag-grid2                           *                                            
   *************************************************/

  buildRequestCriteria(params) {
    this.chargeTaskFilter();
    this.taskFilter.page = params && params.startRow > 0 ? params.startRow / this.paginationPageSize : 0;
    this.taskFilter.pageSize = 20;
    this.taskFilter.sortField = params && params.sortModel && params.sortModel.length > 0 ? params.sortModel[0].colId : 'CREATEDAT';
    this.taskFilter.sortOrder = params && params.sortModel && params.sortModel.length > 0 ? params.sortModel[0].sort : 'DESC';
      return this.taskFilter;
    }

    isInParcours(parcour: any): boolean {
      return PANIER_PARCOURS.includes(parcour);
    }

    /**
    * This to open the send mail screen and call the process
    */
    showEntryReportMail(data: any): void {
      if (data.parcours.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase()
      && data.tache.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.TASK_CR_ENTRY.toLocaleUpperCase()) {
          this.loading = true;
          this.procedureService.runTaskProcedure(ProcedureName.SHOW_ENTRY_REPORT_MAIL, data.id, this.currentUser.coachId).subscribe(_data => {
            this.loading = false;
            this.notificationService.setMessageTemplate(_data as MessageTemplateLightVO[]);
            if(!isNullOrUndefined(data.universId)) {
              this.url = this.router.serializeUrl(this.router.createUrlTree(
              [this.customerDashboard, getEncryptedValue(data.customerId), 'interaction','mail-sending', data.requestId,
               data.requestTypeId , data.universId],
              { queryParams: {typeCustomer: data.categorie}, queryParamsHandling: 'merge' }));
          }});
      }
    }

    goToWelcomeMail(data: any): void {
      if (data.parcours.toLocaleUpperCase() === WELCOME_MAIL.REQUEST_TYPE_LABEL.toLocaleUpperCase() 
      && data.tache.toLocaleUpperCase() === WELCOME_MAIL.TASK_NAME.toLocaleUpperCase()) {
        this.loading = true;
        this.procedureService.runTaskProcedure(ProcedureName.OPEN_WELCOME_MAIL_POPUP, data.id, this.currentUser.coachId).subscribe(_data => {
          this.loading = false;
          this.url = this.router.serializeUrl(this.router.createUrlTree(
            ['/customer-dashboard', getEncryptedValue(data.customerId), 'request', data.requestId, data.id, 'welcome-mail'],
            { queryParams: { typeCustomer: data.categorie }, queryParamsHandling: 'merge' }));
        });
      }
    }

    goToHomologation(data: any): void {
      if (data.parcours.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.REQUEST_TYPE_LABEL.toLocaleUpperCase() 
      && data.tache.toLocaleUpperCase() === ENTREE_CERCLE_PARNASSE.TASK_NAME_VALIDATION.toLocaleUpperCase()) {
        this.homologationService.getHomologationListByCustomerId(getEncryptedValue(data.customerId)).subscribe(homologationsIds => {
          if (homologationsIds && homologationsIds.length > 0) {
            if (homologationsIds.length === 1) {
              this.url = this.router.serializeUrl(this.router.createUrlTree(
                [this.customerDashboard, getEncryptedValue(data.customerId), 'detail', 'homologation', homologationsIds[0]],
                { queryParams: { typeCustomer: data.categorie, isAmendment: false }, queryParamsHandling: 'merge' }
              ));
              this.redirectToNewTab();
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
      this.homologationAccessService.openHomologationPopup(homologationsIds, customerId, typeCustomer, true, taskId, true);
    }

    goToSMSView(data: any): void {
      if (data.parcours.toLocaleUpperCase() === RECOUVREMENT.REQUEST_TYPE_LABEL.toLocaleUpperCase() 
      && ( data.tache.toLocaleUpperCase() === RECOUVREMENT.TASK_NAME_ENVOI_SMS.toLocaleUpperCase()
      ||  data.tache.toLocaleUpperCase() === RECOUVREMENT.TASK_NAME_SUSPENSION_LIGNES.toLocaleUpperCase())) {
        this.loading = true;
        this.procedureService.runTaskProcedure(ProcedureName.SHOW_SUSPENSION_SMS, data.id, this.currentUser.coachId).subscribe(_data => {
        this.loading = false;
        this.notificationService.setTemplates(_data as MessageTemplateLightVO[]);
        this.url = this.router.serializeUrl(this.router.createUrlTree(
          ['/customer-dashboard', getEncryptedValue(data.customerId), 'interaction', data.requestId, 'sending-sms'], 
          { 
            queryParams: {typeCustomer: data.categorie, showSuspension: "O"}, 
            queryParamsHandling: 'merge' }
          ));
        });
      }
    }
  
    toSav(data) {
      if(data.parcours.toLocaleUpperCase() === SAV.REQUEST_TYPE_LABEL.toLocaleUpperCase() &&
      this.taskNameVerificationService.verifyTaskByNameAndCurrentRoleName(data.tache , this.activeRole)){
        this.url = this.router.serializeUrl(this.router.createUrlTree(
            [this.customerDashboard, getEncryptedValue(data.customerId), 'cart' ,data.requestId, 'sav-mobile'],
              {
               queryParams: { typeCustomer: data.categorie },
               queryParamsHandling: 'merge'
            }        
          ));
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

    onObserveTaskId() {
      this.numeroTache.valueChanges.subscribe(
        (numeroTache)=>{
          if(numeroTache){
            this.dateDebutControl.setValue(null);
            this.dateFinControl.setValue(null);
          }else{
            const currentDate = new Date();
            this.dateDebutControl.setValue(new Date(currentDate.setMonth(currentDate.getMonth()-3)));
            this.dateFinControl.setValue(new Date());
          }
        }
      );
    }
  
}
