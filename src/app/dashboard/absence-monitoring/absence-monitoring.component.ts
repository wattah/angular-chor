import { fullNameFormatter } from './../../_core/utils/formatter-utils';
import { TitleServices } from './../../_core/services/title-services.service';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { ServerSideRowModelModule } from '@ag-grid-enterprise/server-side-row-model';
import { NotificationService } from './../../_core/services/notification.service';
import { PaginatedList } from './../../_core/models/models';
import { dateComparator } from '../../_core/utils/date-utils';
import { GassiMockLoginService } from './../../_core/services/gassi-mock-login.service';
import { RedirectionService } from './../../_core/services/redirection.service';
import { ApplicationUserVO } from '../../_core/models/application-user';
import { AbsenceService } from './../../_core/services/absence.service';
import { DateFormatPipeFrench } from './../../_shared/pipes/dateformat/date-format.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map, first, take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location, DatePipe } from '@angular/common';
import { PopUpDeleteAbsenceComponent } from '../pop-up-delete-absence/pop-up-delete-absence.component';
import { AbsenceVO } from '../../_core/models/AbsenceVO';
import { UserVo } from '../../_core/models/user-vo';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { isNullOrUndefined } from '../../_core/utils/string-utils';
import { BaseForm } from '../../_shared/components';
import { FORMAT_DATE_MONTH } from '../../_core/constants/constants';

@Component({
  selector: 'app-absence-monitoring',
  templateUrl: './absence-monitoring.component.html',
  styleUrls: ['./absence-monitoring.component.scss'],
})
export class AbsenceMonitoringComponent extends BaseForm implements OnInit {
  cellWrap = 'cell-wrap-text';
  FORMAT_HEURE_H_MIN = "HH'h'mm";

  absences: PaginatedList<AbsenceVO>;
  criteriaVO: AbsenceVO;
  minDate;
  params: any;
  confirmationDatePattern = 'dd/MM/yyyy';
  paginationPageSize = 20;
  totalPages;
  currentPage = 1;
  showResult = false;
  /*--------Filtre des listes--------------*/
  filteredRoleAbsent: Observable<string[]>;
  filteredPersonneAbsente: Observable<string[]>;
  filteredRemplacant: Observable<string[]>;
  filteredStatut: Observable<string[]>;

  /*--------Form Control des listes--------------*/
  roleAbsentControl = new FormControl();
  personneAbsenteControl = new FormControl();
  remplacantControl = new FormControl();
  statutControl = new FormControl();
  startDate = new FormControl();
  endDate = new FormControl();

  /*--------Données des listes--------------*/
  roles: string[] = [];
  defaultUser: UserVo = {} as UserVo;
  defaultRole: string = {} as string;
  users = [];
  status: string[] = ['Tous', 'Passée', 'En cours', 'Annulée', 'A venir'];
  user: ApplicationUserVO;
  defaultSortModel = [{ colId: 'dateDebut', sort: 'desc' }];
  modules = [ServerSideRowModelModule, MenuModule, ColumnsToolPanelModule];
  columnDefs = [
    {
      headerName: 'personne absente',
      headerTooltip: 'personne absente',
      width: 100,
      field: 'userName',
      colId: 'personAbsente',
    },
    {
      headerName: 'date de début',
      headerTooltip: 'date de début',
      field: 'beginDate',
      colId: 'dateDebut',
      comparator: dateComparator,
      valueGetter: params => {
        if (params.data) {
          const createHourAndMin = this.datePipe.transform(params.data.beginDateFormatted , this.FORMAT_HEURE_H_MIN);
          return `${this.dateFormatPipeFrench.transform(params.data.beginDateFormatted, FORMAT_DATE_MONTH)}
            -
            ${createHourAndMin}`;
        } else {
          return '';
        }},
      width: 100,
    },
    {
      headerName: 'date de fin',
      headerTooltip: 'date de fin',
      width: 100,
      field: 'endDate',
      colId: 'dateFin',
      comparator: dateComparator,
      valueGetter: params => {
        if (params.data) {
        const createHourAndMin = this.datePipe.transform(params.data.endDateFormatted , this.FORMAT_HEURE_H_MIN);
      return `${this.dateFormatPipeFrench.transform(params.data.endDateFormatted, FORMAT_DATE_MONTH)}
        -
        ${createHourAndMin}`;
        } else {
          return '';
        }
      },
      cellClass: this.cellWrap,
    },
    {
      headerName: 'remplaçant',
      headerTooltip: 'remplaçant',
      width: 100,
      field: 'backupName',
      colId: 'backup',
      autoHeight: true,
      cellClass: this.cellWrap,
    },
    {
      headerName: 'statut',
      headerTooltip: 'statut',
      field: 'status',
      colId: 'absenceStatus',
      valueGetter: (params) => params.data ? this.getStatus(params.data.status):'',
      width: 80,
      cellClass: this.cellWrap,
    },
    {
      headerName: '',
      headerTooltip: '',
      field: 'edit',
      width: 40,
      cellRenderer: (params) =>  (params.data) ? this.renderUpdateIconeCell(params.data): '',
      sortable: false,
    },
    {
      headerName: '',
      headerTooltip: '',
      field: 'delete',
      width: 40,
      cellRenderer: (params) => (params.data) ? this.renderDeleteIconeCell(params.data): '',
      sortable: false,
    },
  ];

  rowData = [];
  datasource = {};
  totalItems = 0;
  detailCellRenderer: string;
  domLayout: string;
  defaultColDef: { flex: number; autoHeight: boolean; sortable: boolean };
  rowModelType: string;
  gridApi;
  gridColumnApi;
  gridParams;
  STRING = 'string';
  page: number;
  loadingRows  = true;
  constructor(
    readonly modalService: NgbModal,
    readonly location: Location,
    readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dateFormatPipeFrench: DateFormatPipeFrench,
    private readonly datePipe: DatePipe,
    private readonly absenceService: AbsenceService,
    private readonly changeStatusNotificationService: NotificationService,
    private readonly redirectionService: RedirectionService,
    private readonly gassiService: GassiMockLoginService,
    private readonly titleServices : TitleServices
  ) {
    super();
    this.detailCellRenderer = 'detailCellRenderer';
    this.domLayout = 'autoHeight';
    this.defaultColDef = {
      flex: 1,
      autoHeight: true,
      sortable: true,
    };
    this.rowModelType = 'serverSide';
    this.initGrid();
  }

  deleteLigne(
    absenceId: number,
    userName: string,
    startDate: string,
    endDate: string,
    gridParams: any
  ): void {
    const model = this.modalService.open(PopUpDeleteAbsenceComponent, {
      centered: true,
    });
    this.changeStatusNotificationService
      .notify()
      .pipe(first())
      .subscribe((deleted) => {
        if (deleted) {
          gridParams.data.status = 'CANCELLED';
          this.params = {
            force: true,
            suppressFlash: true,
          };
        }
      });
    model.componentInstance.absenceId = absenceId;
    model.componentInstance.fullName = userName;
    model.componentInstance.startDate = startDate;
    model.componentInstance.endDate = endDate;
  }

  clickCell(params: any): void {
    if (params.column.colId === 'delete') {
      const startDate = this.datePipe.transform(
        params.data.beginDate,
        this.confirmationDatePattern
      );
      const endDate = this.datePipe.transform(
        params.data.endDate,
        this.confirmationDatePattern
      );
      this.deleteLigne(
        params.data.id,
        params.data.userName,
        startDate,
        endDate,
        params
      );
    }
    if (params.column.colId === 'edit') {
      this.absenceService.setAbsenceToEdit(params.data);
      this.router.navigate(['/add-absence'], { 
        queryParams: {
           name: 'edit'
          } 
      });
    }
  }

  goToPageClick(page: number): void {
    this.page = page - 1;
  }

  ngOnInit() {
    this.initDefaultValues();
    this.initDates();
    this.route.data.subscribe((resolvedData) => {
      this.roles = this.roles.concat(resolvedData['roles']);
      this.roles.sort((roleA, roleB) => this.sortRole(roleA, roleB));
      this.users = this.users.concat(resolvedData['actifUsers']);
      this.users.sort((userA, userB) => this.sortUser(userA, userB));
      this.users.unshift(this.defaultUser);
      this.roles.unshift(this.defaultRole);
    });
    this.roleAbsentControl.setValue(this.defaultRole);
    this.statutControl.setValue('Tous');
    this.personneAbsenteControl.setValue(this.defaultUser);
    this.remplacantControl.setValue(this.defaultUser);

    this.redirectionService.getAgGridLoader().subscribe((load) => {
      if (load) {
        this.params = {
          force: true,
          suppressFlash: true,
        };
      }
    });

    /*------------------Filtre sur liste des Rôles absent ---------------------------*/
    this.filteredRoleAbsent = this.roleAbsentControl.valueChanges.pipe(
      startWith(''),
      map((option) => (option ? this._filterRole(option) : this.roles.slice()))
    );

    /*------------------Filtre sur liste des personnes---------------------------*/
    this.filteredPersonneAbsente = this.personneAbsenteControl.valueChanges.pipe(
      startWith(''),
      map(option =>this._filterUsers( option))
    );

    /*------------------Filtre sur liste des remplaçants-------------------------*/
    this.filteredRemplacant = this.remplacantControl.valueChanges.pipe(
      startWith(''),
      map( option => this._filterUsers(option))
    );

    /*------------------Filtre sur liste des statuts--------------------------*/
    this.filteredStatut = this.statutControl.valueChanges.pipe(
      startWith(''),
      map((option) =>
        option ? this._filterStatut(option) : this.status.slice()
      )
    );

    this.titleServices.setTitle("Athena");

    this.initGrid();
  }

  onGridReady(params) {
    this.gridParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.initGrid();
  }

  initDefaultValues() {
    const TOUS = 'Tous';
    this.defaultUser.id = 0;
    this.defaultUser.name = TOUS;
    this.defaultUser.firstName = '';
    this.defaultUser.lastName = TOUS;
    this.defaultRole = TOUS;
  }
  sortUser(userA: UserVo, userB: UserVo) {
    const userNameA = fullNameFormatter(null , userA.firstName , userA.lastName);
    const userNameB = fullNameFormatter(null , userB.firstName , userB.lastName);
    if (userNameA > userNameB && userNameA !== 'TOUS') {
      return 1;
    }
    if (userNameA < userNameB && userNameB !== 'TOUS') {
      return -1;
    }
    return 0;
  }
  sortRole(roleA: string, roleB: string) {
    if (
      roleA.toUpperCase() > roleB.toUpperCase() &&
      roleA.toUpperCase() !== 'TOUS'
    ) {
      return 1;
    }
    if (
      roleA.toUpperCase() < roleB.toUpperCase() &&
      roleB.toUpperCase() !== 'TOUS'
    ) {
      return -1;
    }
    return 0;
  }

  initDates() {
    this.startDate = new FormControl(new Date());
    this.minDate = new Date(this.startDate.value);
    const currentDate = new Date();
    this.endDate = new FormControl(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate()));
  }

  onFilter(page?: number) {
    this.showResult = true;
    this.initGrid();
  }

  checkAll(value: any): string {
    return value !== 'Tous' ? value : '';
  }

  getBackUpIdBy(backupName: string): number {
    const usersClone = this.users.slice();
    const backup = usersClone.filter((user) => user.name === backupName)[0];
    return backup ? backup.id:0;
  }
  getUserIdBy(userName: any): number {
    const usersClone = this.users.slice();
    return usersClone.filter((user) => user.lastName === userName)[0].id;
  }

  private _filterRole(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.roles.filter(
      (option) =>
        option.toLowerCase().indexOf(filterValue) === 0 && option !== 'Tous'
    );
  }

  private _filterUsers(value: string): string[] {
    if (  isNullOrUndefined(value) ||   (typeof value !== 'string')  ) {
      return this.users.slice();
    } else {
      const filterValue = value.toLowerCase().trim();
      return this.users.filter(
        (option) =>{
          const lastName =  isNullOrUndefined( option.lastName) ? '' : option.lastName;
          return lastName.toLowerCase().indexOf(filterValue) === 0
        });
    }
  }
  
  private _filterStatut(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.status.filter(
      (option) =>
        option.toLowerCase().indexOf(filterValue) === 0 && option !== 'Tous'
    );
  }

  dateFormatter(beginDate) {
    {
      if (beginDate === 'null') {
        return '-';
      }
      const hour = beginDate.toString().substring(11, 13);
      const min = beginDate.toString().substring(14, 16);
      const date = this.dateFormatPipeFrench.transform(
        beginDate,
        'dd MMM yyyy'
      );
      return `${date} - ${hour}h${min}`;
    }
  }
  getStatus(status: string) {
    switch (status) {
      case 'PAST':
        return 'Passée';
      case 'CURRENT':
        return 'En cours';
      case 'CANCELLED':
        return 'Annulée';
      case 'TO_COME':
        return 'A venir';
      default:
        return '-';
    }
  }
  isMyAbsenceLine(ftUniversalId: string): boolean {
    let isMyLine = false;
    this.gassiService
      .getCurrentConnectedUser()
      .pipe(take(1))
      .subscribe((user) => {
        isMyLine = user.identifiantFT === ftUniversalId;
      });
    return isMyLine;
  }
  notCancelledAbsence(status: any): boolean {
    return status !== 'CANCELLED' && status !== 'PAST';
  }
  isToComOrCurrentAbsence(status: any): boolean {
    return status === 'TO_COME' || status === 'CURRENT';
  }

  onSelectStartDate(event: any): void {
    const currenteDate = new Date();
    const currentHour = currenteDate.getHours();
    const currentMinute = currenteDate.getMinutes();
    const currentSecond = currenteDate.getSeconds();

    if (this.endDate.value.getTime() < this.startDate.value.getTime()) {
      const dateDebut = new Date(
        this.startDate.value.setHours(currentHour, currentMinute, currentSecond)
      );
      this.startDate.setValue(dateDebut);
      this.minDate = new Date(dateDebut);
      const dateFin = new Date(
        new Date(dateDebut).setDate(dateDebut.getDate() + 1)
      );
      this.endDate.setValue(dateFin);
    } else {
      const dateDebut = new Date(
        this.startDate.value.setHours(currentHour, currentMinute, currentSecond)
      );
      this.startDate.setValue(dateDebut);
      this.minDate = new Date(dateDebut);
    }
  }

  initGrid(): void {
    this.createServerSideDatasource(null);
  }

  reloadGridAfterSortChanged(ev: any) {
    this.initGrid();
  }

  createServerSideDatasource(_event: any): void {
    this.loadingRows = true;
    this.datasource = {
      getRows: (params) => {
        const criteriaVO = this.buildRequestCriteria(params.request);
        this.absenceService.filterAbsences(criteriaVO).subscribe(
          (data) => {
            this.loadingRows = false;
            if (data) {
              this.totalItems = data.total;
              params.success({ rowData: data.items, rowCount: data.total });
            } else {
              this.totalItems = 0;
              params.success({ rowData: [], rowCount: 0 });
            }
          },
          (_error) => {
            this.loadingRows = false;
            params.fail();
          },
          () => {
            document.getElementById("absenceTabId").scrollIntoView();
          }
        );
      },
    };
  }
  buildRequestCriteria(params) {
    this.criteriaVO = {} as AbsenceVO;
    const datePattern = 'dd/MM/yyyy HH:mm';
    this.criteriaVO.role = this.checkAll(this.roleAbsentControl.value);
    if (!isNullOrUndefined( this.personneAbsenteControl.value) ) {
      this.criteriaVO.userName = this.checkAll(this.personneAbsenteControl.value.lastName);
    } else {
      this.criteriaVO.userName = '';
    }
    this.criteriaVO.page =
      params && params.startRow > 0
        ? params.startRow / this.paginationPageSize
        : 0;
    this.criteriaVO.pageSize = 20;
    this.criteriaVO.sortField = params && params.sortModel && params.sortModel.length > 0 ? params.sortModel[0].colId : 'dateDebut';
    this.criteriaVO.sortOrder = params && params.sortModel && params.sortModel.length > 0 ? params.sortModel[0].sort : 'DESC';
    if (this.criteriaVO.userName) {
      this.criteriaVO.userId = this.getUserIdBy(this.criteriaVO.userName);
    }
    if (!isNullOrUndefined( this.remplacantControl.value) ) {
      this.criteriaVO.backupName = this.checkAll(this.remplacantControl.value.name);
    } else {
      this.criteriaVO.backupName = '';
    }
    if (this.criteriaVO.backupName) {
      this.criteriaVO.backupId = this.getBackUpIdBy(this.criteriaVO.backupName);
    }
    this.criteriaVO.status =
      this.statutControl.value !== 'Tous' ? this.statutControl.value : '';
    this.criteriaVO.beginDate = this.startDate.value;
    if (this.criteriaVO.beginDate) {
      this.criteriaVO.beginDateStr = this.datePipe.transform(
        this.criteriaVO.beginDate,
        datePattern
      );
    }
    this.criteriaVO.endDate = this.endDate.value;
    if (this.criteriaVO.endDate) {
      this.criteriaVO.endDateStr = this.datePipe.transform(
        this.criteriaVO.endDate,
        datePattern
      );
    }
    return this.criteriaVO;
  }
  renderUpdateIconeCell(data: any) {
    if(data){
      if(this.notCancelledAbsence(data.status) &&
        this.isToComOrCurrentAbsence(data.status) &&
      (this.hasUpdateAbsencePermission() || this.isMyAbsenceLine(data.ftUniversalId))){
        return `<span class='icon pen athena' ></span>`;
      }
      return ``;
    }
    return ``;
  }
  hasUpdateAbsencePermission() {
    return this.redirectionService.hasPermission('modifier_absence');
  }
  renderDeleteIconeCell(data: any) {
    if(data){
      return this.notCancelledAbsence(data.status) &&
        (this.hasDeleteAbsencePermission() || this.isMyAbsenceLine(data.ftUniversalId))
        ? `<span class='icon del athena' ></span>`
        : ``;
    }
    return '';
  }
  hasDeleteAbsencePermission() {
    return this.redirectionService.hasPermission('supprimer_absence');
  }

   displayUser(user: UserVo): string {
    return user ? fullNameFormatter(null , user.firstName , user.lastName , ' ') : '';
  }

}
