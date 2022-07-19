import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { startWith, map } from 'rxjs/operators';

import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { ServerSideRowModelModule } from '@ag-grid-enterprise/server-side-row-model';
import { MenuModule } from '@ag-grid-enterprise/menu';

import { RequestService } from './../../_core/services/request.service';
import { DateFormatPipeFrench } from './../../_shared/pipes/dateformat/date-format.pipe';
import { PaginatedList } from './../../_core/models/paginated-list';
import { RoleVO } from './../../_core/models/role-vo';
import { UserVo } from './../../_core/models/user-vo';
import { RequestTypeVO } from './../../_core/models/request-type-vo';
import { RequestVO as RequestMonitoring } from './../../_core/models/models.d';
import { isNullOrUndefined, getDefaultStringEmptyValue, capitalize } from '../../_core/utils/string-utils';
import { toUpperCase } from './../../_core/utils/formatter-utils';
import { Roles } from './../../_core/enum/roles.enum';
import { RequestStatut } from './../../_core/enum/request-statut.enum';
import { RequestSearchCriteria } from '../../_core/models/request-search-criteria';
import { CONSTANTS, REQUEST_TASK_STATUS } from './../../_core/constants/constants';
import { PendingStatus } from './../../_core/enum/task.enum';
import { dateComparator } from './../..//_core/utils/date-utils';
import { ConfirmationDialogService } from './../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { RequestMonitoringDetailCellRendererComponent } from './../request-monitoring/request-monitoring-detail-cell-renderer/request-monitoring-detail-cell-renderer.component';
import { getCartIconClass } from './../../_core/utils/functions-utils';

@Component({
  selector: 'app-server-side',
  templateUrl: './server-side.component.html',
  styleUrls: ['./server-side.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ServerSideComponent implements OnInit {

  requests: PaginatedList<RequestMonitoring>;

  show = true;
  cellWrap = 'cell-wrap-text';
  searchForm: FormGroup;
  
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

  membersList: string[] = ['Anaïs Benoiit', 'Viviane Owusuaa', 'Edgar LOUE', 'Mamadou BAILA'];
  
  requestTaskStatusList: any[] = [REQUEST_TASK_STATUS.PENDING, REQUEST_TASK_STATUS.PENDING_NO_TASK,
    REQUEST_TASK_STATUS.PENDING_WITH_TASK, REQUEST_TASK_STATUS.PENDING_WITH_LATE_TASK, REQUEST_TASK_STATUS.CLOSED];

  selectedCreatedByList: UserVo[] = [];

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
      field: 'id',
      resizable: false
    },
    {
      headerName: 'N°',
      headerTooltip: 'N°',
      width: 80,
      field: 'id',
      colId: 'requestId',
      cellRenderer: 'linkRendererComponent',
      cellClass: params => this.fillCellClass(params.data.status),
      cellStyle: { 'text-decoration': 'underline' },
      sortable: false
    },
    {
      headerName: 'membre',
      headerTooltip: 'membre',
      colId: 'requestCustomer',
      valueGetter: params => getDefaultStringEmptyValue(toUpperCase(params.data.customerLastNameFirstName)),
      cellClass: params => this.fillCellClass(params.data.status),
      cellStyle: { 'text-decoration': 'underline' },
      cellRenderer: 'linkRendererComponent',
      width: 90
    },
    {
      headerName: 'parcours',
      headerTooltip: 'parcours',
      colId: 'requestType',
      width: 100,
      valueGetter: params => getDefaultStringEmptyValue(params.data.requestType.label),
      autoHeight: true,
      cellClass: params => this.fillCellClass(params.data.status)
    },
    {
      headerName: 'Objet',
      headerTooltip: 'Objet',
      colId: 'requestObject',
      width: 90,
      valueGetter: params => getDefaultStringEmptyValue(params.data.title),
      autoHeight: true,
      cellClass: params => this.fillCellClass(params.data.status),
      sortable: false
    },
    {
      headerName: 'créée par',
      headerTooltip: 'créée par',
      colId: 'createdBy',
      valueGetter: params => {
        if ( !isNullOrUndefined(params.data.createdByFirstName) && !isNullOrUndefined(params.data.createdByLastName)) {
          return `${capitalize(params.data.createdByFirstName.charAt(0))}. ${toUpperCase(params.data.createdByLastName)}`;
        } 
        return '-'; 
      },
      width: 80,
      cellClass: params => this.fillCellClass(params.data.status)
    },
    {
      headerName: 'créée le',
      headerTooltip: 'créée le',
      colId: 'requestDate',
      valueGetter: params => {
        return this.dateFormatPipeFrench.transform(params.data.createdAt, 'dd MMM yyyy');
      },
      comparator: dateComparator,
      cellClass: params => this.fillCellClass(params.data.status),
      width: 90
    },
    {
      headerName: 'Responsable d\'affaire',
      headerTooltip: 'Responsable d\'affaire',
      colId: 'accountManagerName',
      valueGetter: params => getDefaultStringEmptyValue(capitalize(params.data.accountManagerName)),
      autoHeight: true,
      cellClass: params => this.fillCellClass(params.data.status),
      width: 100
    },
    {
      headerName: '',
      headerTooltip: '',
      field: '',
      width: 50,
      cellRenderer: params => params.data.countTasksAssigned > 0 ? `<span class='icon picto-exclamation-rouge' ></span>` : '',
      sortable: false
    },
    {
      headerName: '',
      headerTooltip: '',
      field: '',
      width: 50,
      cellRenderer: params => params.data.cartId ? this.getCartIconRenderer(params.data.cartColor, params.data.cartStatus) : '',
      sortable: false
    },
    {
      headerName: '',
      headerTooltip: '',
      field: 'update',
      width: 50,
      cellRenderer: (params) => params.data.status === RequestStatut.PENDING ? `<span class='icon pen athena' ></span>` : '',
      sortable: false
    }
  ];
  detailCellRenderer: any;
  frameworkComponents: any;
  defaultColDef: any;
  rowData: [];
  totalPages: number;
  currentPage = 1; 
  paginationPageSize = 20;
  gridApi;
  gridColumnApi;
  gridParams;

  modules = [
    ServerSideRowModelModule,
    MenuModule,
    ColumnsToolPanelModule
  ];
  rowModelType;
  domLayout;
  rowStyle = { cursor: 'pointer' };

  manualOnly = true;
  allRequestType: RequestTypeVO[];
  parcoursList: RequestTypeVO[];
  allUsers: UserVo[];
  attachedToList: UserVo[];
  rolesAttachedToList: RoleVO[];

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
  /***************************************************
   *  ARGUMENTS POUR AG GRID SERVER SIDE (END)       *
   *  app-athena-ag-grid2                            *                                            
   **************************************************/
  
  constructor(readonly route: ActivatedRoute, readonly router: Router, readonly requestService: RequestService,
    readonly confirmationDialogService: ConfirmationDialogService,
    readonly dateFormatPipeFrench: DateFormatPipeFrench, readonly fb: FormBuilder) {
    this.detailCellRenderer = 'detailCellRenderer';
    this.frameworkComponents = {
      detailCellRenderer: RequestMonitoringDetailCellRendererComponent
    };
    this.domLayout = 'autoHeight';
    this.defaultColDef = { 
      flex: 1,
      autoHeight: true,
      sortable: true
    };
    this.rowModelType = 'serverSide';
    this.initGrid();
  }

  ngOnInit() {
    this.searchForm = this.createFormGroup();
    this.route.data.subscribe(resolversData => {
      this.allRequestType = resolversData['allRequestType'];
      this.allUsers = resolversData['allUsers'];
      this.allUsers = this.allUsers.filter(user => {
        return !user.roleNamesAsString.toLowerCase().includes(Roles.EXPLOITANT.toLowerCase());
      });
      this.attachedToList = this.allUsers;
      this.rolesAttachedToList = resolversData['allRoles'];
      this.orderParcoursList();
    });
    this.initFilters();
    this.initGrid();
  }

  onGridReady(params) {
    console.log('onGridReady: ', params);
    this.gridParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.initGrid();
  }

  /**************************************************
   *  FUNCTIONS POUR AG GRID SERVER SIDE (START)    *
   *  app-athena-ag-grid2                           *                                            
   *************************************************/
  initGrid(): void {
    this.createServerSideDatasource(null);
  }
  createServerSideDatasource(_event: any): void {
    this.datasource = {
      getRows: (params) => {
        const rc = this.buildRequestCriteria(params.request);
        this.requestService.requestsMonitoring(rc)
        .subscribe(data => {
          this.totalItems = data.total;
          params.successCallback(data.items, data.total);
        },
        (_error) => {
          params.failCallback();
        }
        );
      }
    };
  }
  /**************************************************
   *  FUNCTIONS POUR AG GRID SERVER SIDE (END)      *
   *  app-athena-ag-grid2                           *                                            
   *************************************************/

  buildRequestCriteria(params): RequestSearchCriteria {
    return {
      roleId : this.searchForm.value.roleAttachedTo ? this.searchForm.value.roleAttachedTo.id : null,
      userId : this.searchForm.value.attachedTo ? this.searchForm.value.attachedTo.id : null,
      customerId : null,
      fromDate : this.searchForm.value.fromDate,
      toDate : this.searchForm.value.toDate,
      requestTypeLabel : this.searchForm.value.parcours,
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
      campaignDate: this.fb.control(null)
    });
  }

  search(page?: number): void {
    this.initGrid();
  }

  openConfirmationDialog(): any {
    const title = 'Bloc Request Monitoring';
    const comment = 'Erreur Serveur : Une erreur technique inattendue est survenue.';
    const btnOkText = 'OK';
    this.confirmationDialogService.confirm(title, comment, btnOkText, null, 'lg', false)
    .then((confirmed) => console.log('User confirmed:', confirmed))
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  setRequestStatus(): RequestStatut {
    let status = null;
    if (this.searchForm.value.requestTaskStatus) {
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
    const CUSTOMER_DASHBOARD = '/customer-dashboard';
    if (info.colDef && info.colDef.headerName === 'N°') {
      this.router.navigate(
        [CUSTOMER_DASHBOARD, info.data.customerId, 'detail', 'request', info.data.id],
        {
          queryParams: { typeCustomer: info.data.isHolder ? CONSTANTS.TYPE_COMPANY : CONSTANTS.TYPE_PARTICULAR },
          queryParamsHandling: 'merge' 
        }
      );
    }
    if (info.colDef && info.colDef.headerName === 'membre') {
      this.router.navigate(
        [CUSTOMER_DASHBOARD, info.data.isHolder ? 'entreprise' : 'particular', info.data.customerId],
        {
          queryParams: { typeCustomer: info.data.isHolder ? CONSTANTS.TYPE_COMPANY : CONSTANTS.TYPE_PARTICULAR },
          queryParamsHandling: 'merge' 
        }
      );
    }
    if (info.column && info.column.colId === 'update') {      
      this.router.navigate(
        [CUSTOMER_DASHBOARD, info.data.customerId, 'detail', 'request', info.data.id, 'update-request'],
        {
          queryParams: { typeCustomer: info.data.isHolder ? CONSTANTS.TYPE_COMPANY : CONSTANTS.TYPE_PARTICULAR, fromMonitoring: true },
          queryParamsHandling: 'merge' 
        }
      );

    }
  }
  
  initFilters(): void {
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
        map(option => option ? this._filterUsers(option) : this.allUsers.slice())
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
    if (this.manualOnly) {
      this.parcoursList = this.allRequestType.filter(item => !item.automatic);
    } else {
      this.parcoursList = this.allRequestType;
    }
    this.parcoursList.sort((a, b) => a.label.localeCompare(b.label));  
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

  getCartIconRenderer(cartColor: string, cartStatus: string): string {
    return `<span class='icon ${getCartIconClass(cartColor, cartStatus)}' ></span>`;
  }

  includeAutomatic(event: any): void {
    this.manualOnly = !event.checked;
    this.orderParcoursList();
  }

  displayUserName(user: UserVo): string {
    return user ? `${capitalize(user.firstName)} ${toUpperCase(user.lastName)}` : '';
  }

  displayRoleName(role: RoleVO): string {
    return role ? role.displayName : '';
  }

  displayStatusLabel(status: any): string {
    return status ? status.label : '';
  }
  
  onShow(): void {
    this.show = false;
  }
  onHide(): void {
    this.show = true;
  }

  onChangeRole(): void {
    if (this.searchForm.value.roleAttachedTo) {
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

  reloadGridAfterSortChanged(ev: any) {
    this.initGrid();
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
    
    return this.parcoursList.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
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
    return this.requestTaskStatusList.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
  }

}
