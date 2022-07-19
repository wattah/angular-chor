import { RedirectionService } from './../../_core/services/redirection.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { startWith, map, debounceTime, switchMap, catchError } from 'rxjs/operators';

import { RequestService } from './../../_core/services/request.service';
import { DateFormatPipeFrench } from './../../_shared/pipes/dateformat/date-format.pipe';
import { PaginatedList } from './../../_core/models/paginated-list';
import { RoleVO } from './../../_core/models/role-vo';
import { UserVo } from './../../_core/models/user-vo';
import { RequestTypeVO } from './../../_core/models/request-type-vo';
import { RequestVO as RequestMonitoring } from './../../_core/models/models.d';
import { isNullOrUndefined, getDefaultStringEmptyValue, capitalize, capitalizeFirstLetter } from '../../_core/utils/string-utils';
import { toUpperCase } from './../../_core/utils/formatter-utils';
import { Roles } from './../../_core/enum/roles.enum';
import { RequestStatut } from './../../_core/enum/request-statut.enum';
import { RequestSearchCriteria } from '../../_core/models/request-search-criteria';
import { CONSTANTS, REQUEST_TASK_STATUS, PANIER_PARCOURS, DEBLOQUER_PANIER} from './../../_core/constants/constants';
import { PendingStatus } from './../../_core/enum/task.enum';
import { dateComparator } from './../..//_core/utils/date-utils';
import { ConfirmationDialogService } from './../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { RequestMonitoringDetailCellRendererComponent } from './request-monitoring-detail-cell-renderer/request-monitoring-detail-cell-renderer.component';
import { getCartIconRenderer,getEncryptedValue } from './../../_core/utils/functions-utils';
import { CustomerService } from './../../_core/services';
import { CustomerAutocomplete } from './../../_core/models/customer-autocomplete';
import { GridUnblockActionComponent } from './grid-unblock-action.component';
import { CatalogeService } from './../../_core/services/http-catalog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RequestMonitoringService } from './request-monitoring.service';

@Component({
  selector: 'app-request-monitoring',
  templateUrl: './request-monitoring.component.html',
  styleUrls: ['./request-monitoring.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RequestMonitoringComponent implements OnInit {
  renderPen(status: any) {
    return status === RequestStatut.PENDING && this.redirectionService.hasPermission('modification_demandes') ? `<span class='icon pen athena' ></span>` : ''
  }

  requests: PaginatedList<RequestMonitoring>;

  show = true;
  cellWrap = 'cell-wrap-text';
  searchForm: FormGroup;
  rangeOfEndDate: Date;
  unfoldTable=false;
  expandedAllRows:boolean;
  collapseAllRows:boolean;
  compteurForExpanding  = 0;
  filteredAccountManager: Observable<UserVo[]>;
  filteredMember: Observable<string[]>;
  filteredParcours: Observable<RequestTypeVO[]>;
  filteredRequestTaskStatus: Observable<string[]>;
  filteredRoleAttachedTo: Observable<RoleVO[]>;
  filteredAttachedTo: Observable<UserVo[]>;
  filteredCreatedBy: Observable<UserVo[]>;
  filteredReferent: Observable<UserVo[]>;

  accountManagerControl = new FormControl();
  memberControl = new FormControl();
  parcoursControl = new FormControl();
  requestTaskStatusControl = new FormControl();
  roleAttachedToControl = new FormControl();
  attachedToControl = new FormControl();
  createdByControl = new FormControl();
  referentControl = new FormControl();
  membreControl = new FormControl();
  filteredMembre$: Observable<CustomerAutocomplete[]> = null;
  compteurForCollapsing  = 0;
  showLines = true;
  urlToOpen: string;

  readonly VIVIANE = 'Viviane Owusuaa';
  membersList: string[] = ['Anaïs Benoiit', this.VIVIANE, this.VIVIANE, this.VIVIANE, this.VIVIANE, 
    this.VIVIANE, this.VIVIANE, this.VIVIANE, this.VIVIANE, this.VIVIANE, this.VIVIANE, this.VIVIANE, 
    this.VIVIANE, this.VIVIANE, this.VIVIANE, this.VIVIANE, this.VIVIANE, this.VIVIANE];
  requestTaskStatusList: any[] = [REQUEST_TASK_STATUS.TOUS, REQUEST_TASK_STATUS.PENDING, REQUEST_TASK_STATUS.PENDING_NO_TASK,
    REQUEST_TASK_STATUS.PENDING_WITH_TASK, REQUEST_TASK_STATUS.PENDING_WITH_LATE_TASK, REQUEST_TASK_STATUS.CLOSED];
  defaultStatus: any[] = [];

  selectedCreatedByList: UserVo[] = []; // string[] = ['Anaïs Benoit'];

  @ViewChild('JInput', { static: false }) JInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipJList', { static: false }) chipJList;
  @ViewChild('autoJ', { static: false }) matAutoCCcomplete: MatAutocomplete;

  defaultSortModel = [ { colId: 'requestDate', sort: 'desc' } ];
  columnDefs = [
    {
      headerName: '',
      headerTooltip: '',  
      cellRenderer: 'agGroupCellRenderer',
      width: 40,
      field: 'arrow',
      resizable: false
    },
    {
      headerName: 'N°',
      headerTooltip: 'N°',
      width: 80,
      field: 'id',
      cellRenderer: 'linkRendererComponent',
      cellClass: params => (params.data) ? this.fillCellClass(params.data.status) : '',
      cellStyle: { 'text-decoration': 'underline' },
      sortable: false
    },
    {
      headerName: 'membre',
      headerTooltip: 'membre',
      colId: 'requestCustomer',
      valueGetter: params => (params.data) ? getDefaultStringEmptyValue(params.data.customerLastNameFirstName) : '',
      cellClass: params => (params.data) ? this.fillCellClass(params.data.status) : '',
      cellStyle: params => (params.data && params.data.customerLastNameFirstName) ? {'text-decoration': 'underline'} : '',
      cellRenderer: 'linkRendererComponent',
      width: 90
    },
    {
      headerName: 'parcours',
      headerTooltip: 'parcours',
      colId: 'requestType',
      width: 100,
      valueGetter: params =>(params.data) ? getDefaultStringEmptyValue(params.data.requestType.label) : '',
      autoHeight: true,
      cellClass: params => (params.data) ? this.fillCellClass(params.data.status) : ''
    },
    {
      headerName: 'Objet',
      headerTooltip: 'Objet',
      colId: 'requestObject',
      width: 90,
      valueGetter: params => (params.data) ? getDefaultStringEmptyValue(params.data.title) : '',
      autoHeight: true,
      cellClass: params => (params.data) ? this.fillCellClass(params.data.status) : '',
      sortable: false
    },
    {
      headerName: 'créée par',
      headerTooltip: 'créée par',
      colId: 'createdBy',
      valueGetter: params => {
        if ( !isNullOrUndefined(params.data) && !isNullOrUndefined(params.data.createdByFirstName) && !isNullOrUndefined(params.data.createdByLastName)) {
          return `${toUpperCase(params.data.createdByLastName)} ${capitalizeFirstLetter(params.data.createdByFirstName)}`;
        } 
        return '-'; 
      },
      width: 80,
      cellClass: params => (params.data) ? this.fillCellClass(params.data.status) : ''
    },
    {
      headerName: 'créée le',
      headerTooltip: 'créée le',
      colId: 'requestDate',
      valueGetter: params => {
        return (params.data) ? this.dateFormatPipeFrench.transform(params.data.createdAt, 'dd MMM yyyy') : '';
      },
      comparator: dateComparator,
      cellClass: params => (params.data) ? this.fillCellClass(params.data.status) : '',
      width: 90
    },
    {
      headerName: 'Responsable d\'affaire',
      headerTooltip: 'Responsable d\'affaire',
      colId: 'accountManagerName',
      width: 120,
      minWidth: 120,
      valueGetter: params => (params.data) ? getDefaultStringEmptyValue(capitalize(params.data.accountManagerName)) : '',
      autoHeight: true,
      cellClass: params => (params.data) ? this.fillCellClass(params.data.status) : '',
    },
    {
      hide: !this.redirectionService.hasPermission(DEBLOQUER_PANIER),
      headerName: '',
      field: 'debloque',
      headerClass: 'justify-content-center',
      width:80,
      headerTooltip: '',
      headerComponentFramework: GridUnblockActionComponent,
      cellStyle: {'justify-content': 'center','display':'flex'},
      cellClass: 'margin-custum',
      checkboxSelection: (params) => {
       if(params.data.isBlocked && this.redirectionService.hasPermission(DEBLOQUER_PANIER)) {
         return true
       }
       return false
      }
    },
    {
      headerName: '',
      headerTooltip: '',
      field: '',
      width: 50,
      cellRenderer: params => this.setIconeExclamation(params.data),
      sortable: false
    },
    {
      headerName: '',
      headerTooltip: '',
      field: 'panier',
      width: 50,
      cellRenderer: params => this.checkIfCartIconHasToBeRendered(params.data),
      sortable: false
    },
    {
      headerName: '',
      headerTooltip: '',
      field: 'update',
      width: 50,
      cellRenderer: (params) => !isNullOrUndefined(params.data.instanceId) ? this.renderPen(params.data.status) : (params.data.isConnectedOnWf ? '' : (!isNullOrUndefined(params.data.workflow) ? '' : this.renderPen(params.data.status))),
      sortable: false
    }
  ];
  detailCellRenderer: any;
  frameworkComponents: any;
  defaultColDef: any;
  rowData: any;
  totalPages: number;
  currentPage = 1; 
  paginationPageSize = 20;
  manualOnly = true;
  allRequestType: RequestTypeVO[];
  parcoursList: RequestTypeVO[] = [];
  defaultParcours: RequestTypeVO = {} as RequestTypeVO;
  allUsers: UserVo[]  = [];
  listCreateur: UserVo[] = [];

  defaultUser : UserVo = {} as UserVo;
  attachedToList: UserVo[] = [];
  rolesAttachedToList: RoleVO[] = [];
  defaultRole : RoleVO = {} as RoleVO;

  requestSearchCriteria: RequestSearchCriteria;

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA]; 

  /**************************************************
   *  ARGUMENTS POUR AG GRID SERVER SIDE (START)     *
   *  app-athena-ag-grid2                            *                                            
   **************************************************/
  datasource: any;
  totalItems = 0;
  rowModelType;
  gridApi;
  gridColumnApi;
  gridParams;
  rowStyle = { cursor: 'pointer' };
  params: { force: boolean; suppressFlash: boolean; };
  loadingData = false;
  listSelectedRows: RequestMonitoring[] = [];
  isSelectRowsToUnblock = false;
  static readonly MESSAGE_FOR_UNBLOCKING = 'Le déblocage des articles a bien été effectué';
  isVisibleBtnBlocking = false;
  readonly CUSTOMER_DASHBOARD = '/customer-dashboard';

  /***************************************************
   *  ARGUMENTS POUR AG GRID SERVER SIDE (END)       *
   *  app-athena-ag-grid2                            *                                            
   **************************************************/
  
  constructor(readonly route: ActivatedRoute, readonly router: Router, readonly requestService: RequestService,
    readonly confirmationDialogService: ConfirmationDialogService,
    readonly dateFormatPipeFrench: DateFormatPipeFrench, readonly fb: FormBuilder,
    private readonly customerService: CustomerService,
    private readonly redirectionService: RedirectionService,
    private readonly catalogManagementService: CatalogeService,
    private readonly _snackBar: MatSnackBar,
    private readonly requestMonitoringService:RequestMonitoringService) {
    this.detailCellRenderer = 'detailCellRenderer';
    this.frameworkComponents = {
      detailCellRenderer: RequestMonitoringDetailCellRendererComponent,
      GridUnblockActionComponent: GridUnblockActionComponent,
    };
  }

  ngOnInit() {

    this.filteredMembre$ = this.membreControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      // use switch map so as to cancel previous subscribed events, before creating new once
      switchMap(value => {
        if (value !== '' && value.length > 2) {
          // lookup from github
          return this.lookup(value);
        } else {
          // if no value is present, return null
          return of(null);
        }
      })
    );

    this.initDefaultValues();
    this.allUsers = this.allUsers.concat(this.defaultUser);
    this.attachedToList = this.attachedToList.concat(this.defaultUser);
    this.rolesAttachedToList = this.rolesAttachedToList.concat(this.defaultRole);
    this.parcoursList = this.parcoursList.concat(this.defaultParcours);

    this.searchForm = this.createFormGroup();
    this.route.data.subscribe(resolversData => {
      this.allRequestType = resolversData['allRequestType'];
      this.allUsers = this.allUsers.concat(resolversData['allUsers']);
      this.allUsers = this.allUsers.filter(user => {
        return !user.roleNamesAsString.toLowerCase().includes(Roles.EXPLOITANT.toLowerCase());
      });
      this.attachedToList = this.allUsers;
      this.rolesAttachedToList = this.rolesAttachedToList.concat(resolversData['allRoles']);
      this.listCreateur = resolversData['allUsers'];
      this.orderParcoursList();
    });

    this.searchForm.get('accountManager').setValue(this.defaultUser);
    this.searchForm.get('roleAttachedTo').setValue(this.defaultRole);
    this.searchForm.get('parcours').setValue(this.defaultParcours.label);
    this.searchForm.get('attachedTo').setValue(this.defaultUser);
    this.searchForm.get('referent').setValue(this.defaultUser);
    this.searchForm.get('requestTaskStatus').setValue(REQUEST_TASK_STATUS.TOUS);
    this.initFilters();
    this.rangeOfEndDate = new Date(this.searchForm.value.fromDate);

    const currentDate = new Date();
    this.searchForm.value.fromDate = new FormControl(new Date(currentDate.setMonth(currentDate.getMonth()-3)));
    this.rangeOfEndDate = new Date(this.searchForm.value.fromDate.value);
    this.searchForm.value.fromDate = new FormControl(new Date());
    this.rowModelType = 'serverSide';
    
    this.redirectionService.getAgGridLoader().subscribe((load) => {
      if (load) {
        this.params = {
          force: true,
          suppressFlash: true,
        };
      }
    });
    this.onObserveRequestId();
    this.isVisibleBtnBlocking =  this.redirectionService.hasPermission(DEBLOQUER_PANIER);
  }

  onObserveRequestId() {
    this.searchForm.get('requestId').valueChanges.subscribe(
      (requestId)=>{
        if(requestId){
          this.searchForm.get('fromDate').setValue(null);
          this.searchForm.get('toDate').setValue(null);
        }else{
          const currentDate = new Date();
          this.searchForm.get('fromDate').setValue(new Date(currentDate.setMonth(currentDate.getMonth()-3)));
          this.searchForm.get('toDate').setValue(new Date());
        }
      }
    );
  }
  lookup(value: string): Observable<CustomerAutocomplete[]> {
    const status = [];
    return this.customerService.autoCompleteClient(value, 1, status,"", false).pipe(
      map(results => results),
      catchError(_ => {
        return of(null);
      })
    );
}

  initDefaultValues(){
    this.defaultUser.firstName ='Tous';
    this.defaultUser.lastName ='';
    this.defaultUser.id = null;
    this.defaultUser.roleNamesAsString = '';

    this.defaultParcours.label = 'Tous';
    this.defaultParcours.id = null;

    this.defaultRole.id = null;
    this.defaultRole.displayName = 'Tous';
    this.defaultRole.name = '';

    this.defaultStatus.unshift(REQUEST_TASK_STATUS.TOUS);

  }

  createFormGroup(): FormGroup {
    const date3MonthsAgo = new Date();
    date3MonthsAgo.setMonth(date3MonthsAgo.getMonth() - 3);
    return this.fb.group({
      accountManager: this.accountManagerControl,
      member: this.memberControl,
      parcours: this.parcoursControl,
      requestTaskStatus: this.requestTaskStatusControl,
      roleAttachedTo: this.roleAttachedToControl,
      attachedTo: this.attachedToControl,
      referent: this.referentControl,
      fromDate: this.fb.control(date3MonthsAgo),
      toDate: this.fb.control(new Date()),
      requestId: this.fb.control(null),
      campaignName: this.fb.control(null),
      campaignDate: this.fb.control(null),
      membre: this.membreControl
    });
  }

  onSelectStartDate(event: any): void {
    const currenteDate = new Date();
    const currentHour = currenteDate.getHours();
    const currentMinute = currenteDate.getMinutes();
    const currentSecond = currenteDate.getSeconds();

    if(this.searchForm.value.toDate.getTime() < this.searchForm.value.fromDate.getTime() ){
      const dateDebut = new Date(this.searchForm.value.fromDate.setHours(currentHour,currentMinute,currentSecond));
      this.searchForm.get('fromDate').setValue(dateDebut);
      this.rangeOfEndDate = new Date(dateDebut);
      const dateFin = new Date(new Date(dateDebut).setDate(dateDebut.getDate()+1));
      this.searchForm.get('toDate').setValue(dateFin);
    } else {
      const dateDebut = new Date(this.searchForm.value.fromDate.setHours(currentHour,currentMinute,currentSecond));
      this.searchForm.get('fromDate').setValue(dateDebut);
      this.rangeOfEndDate = new Date(dateDebut);
    }
  }


  search(page?: number): void {
    this.requestMonitoringService.isCheckedBlockingCheckBox$.next(false);
    this.initGrid();
  }

  checkAll(value: any): string {
    return (value !== 'Tous' ) ? value : null;
  }

  checkMemberNull(value: any) {
     return value ? value.id : null
  }

  openConfirmationDialog(text: string): any {
    const title = 'Bloc Request Monitoring';
    const btnOkText = 'OK';
    this.confirmationDialogService.confirm(title, text, btnOkText, null, 'lg', false)
    .then((confirmed) => console.log('User confirmed:', confirmed))
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  setRequestStatus(): RequestStatut {
    let status = null;
    if (this.searchForm.value.requestTaskStatus && this.searchForm.value.requestTaskStatus.label !== 'Tous') {
      if (this.searchForm.value.requestTaskStatus.isPending) {
        status = RequestStatut.PENDING;
      } else {
        status = RequestStatut[this.searchForm.value.requestTaskStatus.key];
      }
    }
    return status;
  }

  setIdsCreatedBy(): number[] {
    return this.selectedCreatedByList.map(({ id }) => id);
  }

  toClientOrRequest(info: any): void {
    const customer = getEncryptedValue(info.data.customerId);
    if (info.colDef && info.colDef.headerName === 'N°') {
      this.urlToOpen = this.router.serializeUrl(this.router.createUrlTree(
        [this.CUSTOMER_DASHBOARD, customer, 'detail', 'request', info.data.id],
        {
          queryParams: { typeCustomer: info.data.isHolder ? CONSTANTS.TYPE_COMPANY : CONSTANTS.TYPE_PARTICULAR },
          queryParamsHandling: 'merge' 
        }
      ));
    }
    if (info.colDef && info.colDef.headerName === 'membre') {
      this.urlToOpen = this.router.serializeUrl(this.router.createUrlTree(
        [this.CUSTOMER_DASHBOARD, info.data.isHolder ? 'entreprise' : 'particular', info.data.customerId],
        {
          queryParams: { typeCustomer: info.data.isHolder ? CONSTANTS.TYPE_COMPANY : CONSTANTS.TYPE_PARTICULAR },
          queryParamsHandling: 'merge' 
        }
      ));
    }
    if (info.column && info.column.colId === 'update' && this.checkIfCanUpdateRequest( info.data) ) {      
      this.urlToOpen = this.router.serializeUrl(this.router.createUrlTree(
        [this.CUSTOMER_DASHBOARD, customer, 'detail', 'request', info.data.id, 'update-request'],
        {
          queryParams: { typeCustomer: info.data.isHolder ? CONSTANTS.TYPE_COMPANY : CONSTANTS.TYPE_PARTICULAR, fromMonitoring: true },
          queryParamsHandling: 'merge' 
        }
      ));

    }
      this.panierLink(info);
      if(this.urlToOpen !== null){
        window.open(`#${this.urlToOpen}`, '_blank');
        this.urlToOpen = null;
      }
  }



    panierLink(info: any): void{
      if (info.column.colId === 'panier' &&  this.checkIfCanGetToCart( info.data) ) {
        if(!isNullOrUndefined(info.data.cartItems) && info.data.cartItems.length>0){
          this.urlToOpen = this.router.serializeUrl(this.router.createUrlTree(
            [this.CUSTOMER_DASHBOARD, getEncryptedValue(info.data.customerId),'cart', 'creation', info.data.id],
            {
              queryParams: {
                typeCustomer: info.data.isHolder ? CONSTANTS.TYPE_COMPANY : CONSTANTS.TYPE_PARTICULAR,
                parcours: info.data.requestType.label,
                onglet : 0
              },
              queryParamsHandling: 'merge'
            }
          ));
        } else {
          this.urlToOpen = this.router.serializeUrl(this.router.createUrlTree(
            [this.CUSTOMER_DASHBOARD, getEncryptedValue(info.data.customerId),'cart', 'catalog', info.data.id],
            {
              queryParams: {
                typeCustomer: info.data.isHolder ? CONSTANTS.TYPE_COMPANY : CONSTANTS.TYPE_PARTICULAR,
                parcours: info.data.requestType.label
              },
              queryParamsHandling: 'merge'
            }
          ));
        }
        
    }
  }

  checkIfCanGetToCart(data){
    if(!isNullOrUndefined(data.cartId)){
      if(this.isInParcours(data.requestType.label)){
        if(!isNullOrUndefined(data.instanceId)){
          return true;
        }else{
          if(!data.isConnectedOnWf){
            if(isNullOrUndefined(data.workflow)){
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  checkIfCanUpdateRequest(data){
    if(data.status === RequestStatut.PENDING && this.redirectionService.hasPermission('modification_demandes')){
      if(!isNullOrUndefined(data.instanceId)){
        return true;
      }else{
        if(!data.isConnectedOnWf){
          if(isNullOrUndefined(data.workflow)){
            return true;
          } 
        }
      }
    }
    return false;
  }

  validate(event: any): void {
    let key: any;
    // Handle paste
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text');
    } else {
    // Handle key press
      key = event.keyCode || event.which;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]/;
    if ( !regex.test(key) ) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
  }
  
  initFilters(): void {
    this.initDefaultSearchFilter();
    this.initAdvancedSearchFilter();
  }

  initDefaultSearchFilter(): void {
    /*------------------Filtre Responsable---------------------------*/
    this.filteredAccountManager = this.accountManagerControl.valueChanges
      .pipe(
        startWith(''),
        map(option => option ? this._filterUsers(option) : this.allUsers.slice())
      );

    /*------------------Filtre Membre---------------------------*/
    this.filteredMember = this.memberControl.valueChanges
      .pipe(
        startWith(''),
        map(option => option ? this._filterMember(option) : this.membersList.slice())
      );

    /*----------------------------------------------------------*/
    this.filteredParcours = this.parcoursControl.valueChanges
      .pipe(
        startWith(''),
        map(option => option ? this._filterParcours(option) : this.parcoursList.slice())
      );

    /*----------------------------------------------------------*/
    this.filteredRequestTaskStatus = this.requestTaskStatusControl.valueChanges
      .pipe(
        startWith(''),
        map(option => option ? this._filterRequestTaskStatus(option) : this.requestTaskStatusList.slice())
      );
  }

  initAdvancedSearchFilter(): void {
    /*------------------Filtre Créateur---------------------------*/
    this.filteredRoleAttachedTo = this.roleAttachedToControl.valueChanges
      .pipe(
        startWith(''),
        map(option => option ? this._filterRoleAttachedTo(option) : this.rolesAttachedToList.slice())
      );

    /*----------------------------------------------------------*/
    this.filteredCreatedBy = this.createdByControl.valueChanges
      .pipe(
        startWith(''),
        map(option => option ? this._filterUsers(option) : this.listCreateur.slice())
      );

    /*----------------------------------------------------------*/
    this.filteredReferent = this.referentControl.valueChanges
      .pipe(
        startWith(''),
        map(option => option ? this._filterUsers(option) : this.allUsers.slice())
      );

    /*----------------------------------------------------------*/
    this.filteredAttachedTo = this.attachedToControl.valueChanges
      .pipe(
        startWith(''),
        map(option => option ? this._filterUsers(option) : this.attachedToList.slice())
      );
  }

  orderParcoursList(): void {
    if(this.parcoursList.length !== 1){
      this.parcoursList = [this.defaultParcours];
    }
    if (this.manualOnly) {
      this.parcoursList = this.parcoursList.concat(this.allRequestType.filter(item => !item.automatic));
    } else {
      this.parcoursList = this.parcoursList.concat(this.allRequestType);
    }
    this.parcoursList.sort((a, b) => (a.label === 'Tous' || b.label === 'Tous') ? 0 :  a.label.localeCompare(b.label));  
    this.filteredParcours = this.parcoursControl.valueChanges
      .pipe(
        startWith(''),
        map(option => option ? this._filterParcours(option) : this.parcoursList.slice())
      );
  }

  fillCellClass(status: string): string[] {
    const classes = [this.cellWrap];
    if ( status === RequestStatut.CLOSED || status === RequestStatut.REFUSED ) {
      classes.push('unselectable');
    }
    return classes;
  }

  checkIfCartIconHasToBeRendered(data){
     if(!isNullOrUndefined(data.cartId)){
      if(this.isInParcours(data.requestType.label)){
        if(!isNullOrUndefined(data.instanceId)){
          return getCartIconRenderer(data.cartColor, data.stockToUseCode);
        }else{
          if(!data.isConnectedOnWf){
            if(isNullOrUndefined(data.workflow)){
              return getCartIconRenderer(data.cartColor, data.stockToUseCode);
            } 
          }
        }
      }
    }
    return '';
    
  }

  includeAutomatic(event: any): void {
    this.manualOnly = !event.checked;
    this.orderParcoursList();
  }

  displayUserName(user: UserVo): string {
    const lastName = (user.lastName) ? toUpperCase(user.lastName) : '';
    return user ? `${capitalize(user.firstName)} ${lastName}` : '';
  }

  displayRoleName(role: RoleVO): string {
    return role ? role.displayName : '';
  }

  displayStatusLabel(status: any): string {
    return status ? status.label : '';
  }

  displayClient(value: any): string {
    return value ? value.name : '';
  }

  goToPageClick(page: number): void {
    page = page - 1;
    if (this.requests && this.requests.page !== page) {
      this.search(page);
    }  
  }
  
  onShow(): void {
    this.show = false;
  }
  onHide(): void {
    this.show = true;
  }

  onChangeRole(): void {
    if (this.searchForm.value.roleAttachedTo) {
      this.selectedCreatedByList.splice(0,this.selectedCreatedByList.length )
      this.attachedToControl.setValue(null);
      this.attachedToList = this.allUsers.filter(user => {
        return user.roleNamesAsString.toLowerCase().includes(this.searchForm.value.roleAttachedTo.name.toLowerCase());
      });
      if (!this.attachedToList || (this.attachedToList && this.attachedToList.length <= 0)) {
        this.attachedToList = this.allUsers;
      }

    } else {
      this.attachedToList = this.allUsers;
    }
    this.filteredAttachedTo = this.attachedToControl.valueChanges
    .pipe(
      startWith(''),
      map(option => option ? this._filterAttachedToUsers(option) : this.attachedToList.slice())
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    
    if (!isNullOrUndefined(this.selectedCreatedByList)) {
      const isExist = this.selectedCreatedByList.find(option => option === event.option.value);
      if (isNullOrUndefined(isExist)) {
        this.selectedCreatedByList.push(event.option.value);
      }
    }
    this.JInput.nativeElement.value = '';
    this.createdByControl.setValue(null);
    this.chipJList.errorState = false;
  }

  remove(userSelected: UserVo): void {
    const index = this.selectedCreatedByList.indexOf(userSelected);
    if (index >= 0) {
      this.selectedCreatedByList.splice(index, 1);
    }
  }

  setIconeExclamation(data): any {
    if (data.countTasksAssigned > 0 && data.hasLateTasks && data.status !== RequestStatut.CLOSED) {
      return `<span class='icon picto-exclamation-rouge' ></span>`;
    } else if (!data.countTasksAssigned && data.status !== RequestStatut.CLOSED) {
      return `<span class='icon picto-exclamation-orange' ></span>`;
    }
    return '';
 }

  private _filterUsers(value: any): UserVo[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';

    return this.allUsers.filter(option => option.lastName.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterAttachedToUsers(value: any): UserVo[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';

    return this.attachedToList.filter(option => option.lastName.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterParcours(value: string): RequestTypeVO[] {
    const filterValue = value.toLowerCase();

    return this.parcoursList.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0 && option.label !== 'Tous');
  }

  private _filterMember(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.membersList.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterRoleAttachedTo(value: string): RoleVO[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';

    return this.rolesAttachedToList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterRequestTaskStatus(value: string): any[] {
      const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
      return this.requestTaskStatusList.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0 && option.label !== 'Tous');
  }

  afficherNumContrat(value: string): string {
    if(!isNullOrUndefined(value)) {
     return `N° contrat ${value}`;
    }
    return '';
  }

  reloadGridAfterSortChanged(ev: any) {
    this.initGrid();
  }

  /**************************************************
   *  FUNCTIONS POUR AG GRID SERVER SIDE (START)    *
   *  app-athena-ag-grid2                           *                                            
   *************************************************/

  onGridReady(params) {
    this.gridParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }


  initGrid(): void {
    this.createServerSideDatasource(null);
  }
  createServerSideDatasource(_event: any): void {
    this.totalItems = 0;
    this.loadingData = true;
    this.datasource = {
      getRows: (params) => {
        this.requestMonitoringService.isRowDataReady$.next(false);
        const rc = this.buildRequestCriteria(params.request);
        this.requestService.requestsMonitoring(rc).subscribe(
          data => {
            this.totalItems = data.total;
            this.loadingData = false;
            this.addArrowsToItems(data);
            setTimeout(() => {
              params.success({ rowData: data.items, rowCount: data.total });
              if(this.unfoldTable===true){
                this.onGridReady(params);
                this.gridApi.forEachNode(node => {
                  node.setExpanded(true); } );
              }
              this.params = { force: true, suppressFlash: true};
              document.getElementById("requestTabId").scrollIntoView();
              this.requestMonitoringService.isRowDataReady$.next(true);
            }, 100);
          
          },
          _error => {
            this.loadingData = false;
            params.fail();
          }
        )
      }
    };    
  }
  private addArrowsToItems(data: PaginatedList<RequestMonitoring>) {
    if (data && data.items) {
      data.items.forEach((item) => item.arrow = '');
    }
  }
  /**************************************************
   *  FUNCTIONS POUR AG GRID SERVER SIDE (END)      *
   *  app-athena-ag-grid2                           *                                            
   *************************************************/

   /**************************************************
   *  FUNCTIONS POUR AG GRID SERVER SIDE (END)      *
   *  app-athena-ag-grid2                           *                                            
   *************************************************/

  buildRequestCriteria(params): RequestSearchCriteria {
    const currenteDate = new Date();
    const currentHour = currenteDate.getHours();
    const currentMinute = currenteDate.getMinutes();
    const currentSecond = currenteDate.getSeconds();
    let fromDateToReturn;
    let toDateToReturn;
    if(this.searchForm.value.requestId){
      fromDateToReturn = null;
      toDateToReturn = null;
    }else{
      fromDateToReturn = this.searchForm.value.fromDate.setHours(currentHour, currentMinute, currentSecond);
      toDateToReturn = this.searchForm.value.toDate.setHours(currentHour, currentMinute, currentSecond);
    }
    return {
      roleId : this.searchForm.value.roleAttachedTo ? this.searchForm.value.roleAttachedTo.id : null,
      userId : this.searchForm.value.attachedTo ? this.searchForm.value.attachedTo.id : null,
      customerId : this.searchForm.value.membre ? this.searchForm.value.membre.id : null,
      fromDate :fromDateToReturn,
      toDate : toDateToReturn,
      requestTypeLabel : this.checkAll(this.searchForm.value.parcours),
      status : this.setRequestStatus(),
      pendingStatus : this.searchForm.value.requestTaskStatus && this.searchForm.value.requestTaskStatus.isPending ? 
      PendingStatus[`${this.searchForm.value.requestTaskStatus.key}`] : null,
      taskHandlerRoleId : null,
      page : params && params.startRow > 0 ? params.startRow / this.paginationPageSize : 0,
      pageSize : this.paginationPageSize,
      sortField : params && params.sortModel && params.sortModel.length > 0 ? params.sortModel[0].colId : 'CREATEDAT',
      sortOrder : params && params.sortModel && params.sortModel.length > 0 ? params.sortModel[0].sort : 'DESC',
      accountManagerUserId : this.searchForm.value.accountManager ? this.searchForm.value.accountManager.id : null,
      idCreatedByListVO : this.setIdsCreatedBy(),
      referentId : this.searchForm.value.referent ? this.searchForm.value.referent.id : null,
      customerOfferId : null,
      isAutomaticRequestType : !this.manualOnly,
      requestId : this.searchForm.value.requestId,
      campaignName : this.searchForm.value.campaignName,
      campaignDate : this.searchForm.value.campaignDate
    };
    
  }
  isInParcours(parcour: any): boolean {
    return PANIER_PARCOURS.includes(parcour);
  }

  clearResponsableAffaireList() {
    this.accountManagerControl.setValue('');
  }

  clearMemberList() {
    this.membreControl.setValue('');
  }

  clearParcoursList() {
    this.parcoursControl.setValue('');
  }

  clearStatutPanierList() {
    this.requestTaskStatusControl.setValue('');
  }

  clearRoleDuPorteurList(){
    this.roleAttachedToControl.setValue('');
  }

  clearPorteurList(){
    this.attachedToControl.setValue('');
  }

  clearCreeeParList(){
    
    this.JInput.nativeElement.focus();
    this.createdByControl.setValue('');
    
  }

  clearPortefeuilleList(){
    this.referentControl.setValue('');
  }
 

   // function to unfold table
   expandedAll() {
     this.unfoldTable= true
    this.showLines = false;
    if (this.compteurForExpanding % 2 === 0) {
      this.expandedAllRows = true;
    } else {
      this.expandedAllRows = false;
    }
    this.compteurForExpanding++;
  }

  // function to fold table
  collapseAll() {
    this.unfoldTable=false;
    this.showLines = true;
    if (this.compteurForCollapsing  % 2 === 0) {
      this.collapseAllRows = false;
    } else {
      this.collapseAllRows = true;
    }
    this.compteurForCollapsing ++;
  }

  selectedRows(event): void {
      this.listSelectedRows = event;
      if(!isNullOrUndefined(this.listSelectedRows) && this.listSelectedRows.length !== 0) {
          for (const requestMonitoringVO of this.listSelectedRows) {
            if(!isNullOrUndefined(requestMonitoringVO.cartId) && requestMonitoringVO.isBlocked === true) {
              this.isSelectRowsToUnblock = true;
              break;
             } else {
              this.isSelectRowsToUnblock = false; 
          }
       }
    } else {
      this.isSelectRowsToUnblock = false;
    }
  }

  unblock(): void {
    const cartIds = [];
    if(!isNullOrUndefined(this.listSelectedRows) && this.listSelectedRows.length !== 0) {
      for (const requestMonitoringVO of this.listSelectedRows) {
        if(!isNullOrUndefined(requestMonitoringVO.cartId) && requestMonitoringVO.isBlocked === true) {
          cartIds.push(requestMonitoringVO.cartId)
        }
      }
      if(!isNullOrUndefined(cartIds) && cartIds.length !== 0) {
        this.catalogManagementService.unblockOrdersByListCartIds(cartIds).subscribe(data => {
          if(!isNullOrUndefined(data) && data.length !== 0) {
              for(const error of data) {
                const msgError = `${error} <br/>`;
                this.openConfirmationDialog(msgError)
            }
          } 
           if(isNullOrUndefined(data) || cartIds.length > data.length) {
            this.search();
            this.openSnackBar(RequestMonitoringComponent.MESSAGE_FOR_UNBLOCKING);
          }
        },
        (error) => {
          console.error(error);
         },
         () => {
          console.info("complete");
         }
        );
      }
    }
  }
  /** SNACK BAR */
  openSnackBar(text: string): void {
    this._snackBar.open(
      text, undefined, 
      { duration: 3000, panelClass: ['center-snackbar', 'snack-bar-container'] });
  }
  

}
