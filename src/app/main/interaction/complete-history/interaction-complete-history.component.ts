import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import * as Moment from 'moment';

import { getDefaultStringEmptyValue, isNullOrUndefined } from '../../../_core/utils/string-utils';
import { dateComparator } from '../../../_core/utils/date-utils';
import { DateFormatPipeFrench } from '../../../_shared/pipes';
import { InteractionService } from '../../../_core/services/interaction.service';
import { firstNameFormatter, fullNameFormatter, toUpperCase } from '../../../_core/utils/formatter-utils';
import { UserVo } from '../../../_core/models';
import { ReferenceDataVO } from '../../../_core/models/models';
import { InteractionsSearchCriteria } from './../../../_core/models/interactions-search-criteria';
import { CONSTANTS, CSS_CLASS_NAME } from '../../../_core/constants/constants';
import { getDecryptedValue } from './../../../_core/utils/functions-utils';
import { BaseForm } from '../../../_shared/components';
import { InteractionsService } from '../interactions.service';

const FORMAT_HEURE_H_MIN = "HH'h'mm";

@Component({
  selector: 'app-interaction-complete-history',
  templateUrl: './interaction-complete-history.component.html',
  styleUrls: ['./interaction-complete-history.component.scss']
})
export class InteractionCompleteHistoryComponent extends BaseForm implements OnInit {

  defaultSortModel: any[];
  columnDefs: any[];
  mediaData: ReferenceDataVO[];
  filterdMedia = [];
  customerId: string; 
  listUsers: Partial<UserVo>[];
  typeCustomer: string;
  seeLastInteractionInCurrentYear = false;
  selectedAutomatic = false;
  selectedMediaList: ReferenceDataVO[] = [];
  selectedUserList: number[] = [];
  selectedStartDate: Date;
  selectedEndDate: Date;
  filteredUsers: Observable<Partial<UserVo>[]>;
  myControl = new FormControl();
  detailCellRendererParams: Object;
  getRowHeight: any;

  /* Server Side data */
  paginationPageSize = 20;
  datasource: any;
  totalItems;
  rowModelType = 'serverSide';
  gridApi;
  gridColumnApi;
  gridParams;
  rowStyle = { cursor: 'pointer' };
  params: { force: boolean; suppressFlash: boolean; };

  constructor(private readonly router: Router, private readonly route: ActivatedRoute, 
    private readonly dateFormatPipeFrench: DateFormatPipeFrench, private readonly interactionsService: InteractionsService,
    private readonly datePipe: DatePipe, private readonly interactionService: InteractionService) {
      super();
  }

  ngOnInit(): void {
    this.defaultSortModel = [
      { colId: 'createdAt', sort: 'desc' }
    ];
    this.setColumnRef();
    this.setMasterDetailInteraction();
    this.route.data.subscribe(resolversData => {
      this.mediaData = resolversData['mediaData'];
      this.listUsers = resolversData['listUsers'];
      this.listUsers.unshift({id:null, firstName:'Tous', lastName:''});
      this.myControl.setValue(this.nameFormatter(this.listUsers[0]));
      this.selectedMediaList = this.mediaData;
    });
    this.route.parent.paramMap.subscribe(params => this.customerId =params.get('customerId'));

    this.route.queryParams.subscribe(params => {
      this.typeCustomer = params['typeCustomer'];
      this.seeLastInteractionInCurrentYear = Boolean(params['isLastInteractions']);
    });
    
    if (this.seeLastInteractionInCurrentYear) {
      this.selectedEndDate = new Date();
      this.selectedStartDate = Moment(this.selectedEndDate).subtract(12, 'months').toDate();
      this.selectedAutomatic = true;
    }
    this.filteredUsers = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (isNullOrUndefined(value)) ? this.listUsers.slice() : this._filterUsers(value))
    );
    this.initGrid(false);
    this.calculateRowHeightOfMasterDetail();
  }

  _filterUsers(value: string): Partial<UserVo>[] {
    return this.listUsers.filter(option => {
      const optionValue = `${option.lastName.toLowerCase()}  ${option.firstName.toLowerCase()} `; 
      return optionValue.indexOf(value) === 0;
    });
  }

  setColumnRef(): void {	
    this.columnDefs = [
      {
        headerName: '',
        headerTooltip: '',  
        cellRenderer: 'agGroupCellRenderer',
        width: 35,
        field: 'interactionId',
        resizable: false,
        sortable: false
      },
      {
        headerName: 'CRÉÉE LE',
        headerTooltip: 'CRÉÉE LE',
        colId: 'createdAt',
        valueGetter: params => {
          if (!params.data || !params.data.creeLe) {
            return '-';
          }
          const createHourAndMin = this.datePipe.transform(params.data.creeLe , FORMAT_HEURE_H_MIN);
          return `${this.dateFormatPipeFrench.transform(params.data.creeLe, 'dd MMM yyyy')}
            -
            ${createHourAndMin}`;
        },
        comparator: dateComparator,
        cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
        autoHeight: true,
        width: 140
      },
      {
        headerName: 'CRÉÉE PAR',
        headerTooltip: 'CRÉÉE PAR',
        colId: 'createdBy',
        valueGetter: params => {
          if ( params.data && params.data.lastNameCreePar && params.data.firstNameCreePar) {
            return `${toUpperCase(params.data.lastNameCreePar)} ${firstNameFormatter(params.data.firstNameCreePar)}`;
          } 
          return '-'; 
        },
        width: 120,
        cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
        autoHeight: true
      },
      {
        headerName: 'N° DEMANDE',
        headerTooltip: 'N° DEMANDE',
        colId: 'requestId',
        valueGetter: params => params.data ? params.data.requestId : '-',
        width: 80,
        cellClass: 'cell-wrap-text ',
        cellStyle: { 'text-decoration': 'underline' } ,
        autoHeight: true
      },
      {
        headerName: 'MÉDIA',
        headerTooltip: 'MÉDIA',
        colId: 'mediaLabel',
        valueGetter: params => params.data ? getDefaultStringEmptyValue(params.data.media) : '-',
        width: 140,
        cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
        autoHeight: true
      },
      {
        headerName: 'MOTIF',
        headerTooltip: 'MOTIF',
        coldId: 'reasonLabel',
        valueGetter: params => params.data ? 
        `${getDefaultStringEmptyValue(params.data.interactionMotifParent)} > ${getDefaultStringEmptyValue(params.data.interactionMotif)}` : '-',
        width: 200,
        cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
        autoHeight: true,
        sortable: false
      },
      {
        headerName: '',
        field: 'update',
        cellRenderer: params => (params.data && !params.data.isAutomatic) ? `<span class='icon pen athena' ></span>` : '',
        cellClass: 'text-center',
        sortable: false,
        width: 60
      }
    ];
  }

  changeAutomaticOption(value: any): void {
    this.selectedAutomatic = (value === 'true');
    this.startSearching();
  }

  selectAllMedia(): void {
    this.selectedMediaList = this.mediaData;
    this.startSearching();
  }

  deselectAllMedia(): void {
    this.selectedMediaList = [];
    this.startSearching();
  }

  onSelectStartDate(date: Date): void {
    this.selectedStartDate = Moment(date).add(1 , 'hours').toDate();;
    this.startSearching();
    
  }

  onSelectEndDate(date: any): void {
    this.selectedEndDate = Moment(date).add(1 , 'hours').toDate();;
    this.startSearching();
  }

  onSelectMedia(medias: ReferenceDataVO[]): void {
    this.selectedMediaList = medias;
    this.startSearching(); 
  }

  onSelectUser(user: UserVo): void {
    this.myControl.setValue(this.nameFormatter(user) );
    this.selectedUserList = (user.id) ? [user.id]: [];
    this.startSearching(); 
  }

  onCloseTab(): void {
    if (isNullOrUndefined( this.myControl.value ) || this.myControl.value.replace(/\s/g, '').length === 0 ) {
      this.selectedUserList = [];
      this.startSearching(); 
    }   
  }

  buildInteractionsCriteria(params: any): InteractionsSearchCriteria {
    return {
      company: this.typeCustomer === CONSTANTS.TYPE_COMPANY,
      customerId: getDecryptedValue(this.customerId),
      automatic: this.selectedAutomatic,
      medias: this.filterdMedia,
      createdById: this.selectedUserList,
      startDate: this.selectedStartDate,
      endDate: this.selectedEndDate,
      page : params && params.startRow > 0 ? params.startRow / this.paginationPageSize : 0,
      pageSize : this.paginationPageSize,
      sortField : params && params.sortModel && params.sortModel.length > 0 ? params.sortModel[0].colId : 'createdAt',
      sortOrder : params && params.sortModel && params.sortModel.length > 0 ? params.sortModel[0].sort : 'DESC'
    };
  }

  startSearching(): void {
    // to not have large header request 
    this.filterdMedia = [];
    if (this.selectedMediaList.length !== this.mediaData.length) {
      this.filterdMedia = this.selectedMediaList.map( m => m.id);
    }
    if (this.selectedMediaList.length !== 0 ) {
      this.initGrid(false);
    } else {
      this.initGrid(true);
    }
  }

  onGridReady(params: any): void {
    this.gridParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.initGrid(false);
  }

  initGrid(isEmpty: boolean): void {
    this.createServerSideDatasource(isEmpty);
  }

  createServerSideDatasource(isEmpty: boolean): void {
    this.datasource = {
      getRows: (params) => {
        if (isEmpty) {
          this.totalItems = 0;
          params.success({ rowData: [], rowCount: 0 });
        } else {

          const ic = this.buildInteractionsCriteria(params.request);
          this.interactionService.interactionsHistoryByCustomerIdAndFilter(ic)
          .subscribe(data => {
            this.totalItems = data.total;
            params.success({ rowData: data.items, rowCount: data.total });

          },
          (_error) => {
            params.fail();
          }
          );
        } 
      }
    };    
  }

  reloadGridAfterSortChanged(ev: any): void {
    this.initGrid(false);
  }

  clickedCell(params: any): void {
    if (params.column.colId === 'requestId') {
      this.router.navigate(
        ['/customer-dashboard', this.customerId, 'detail', 'request', params.data.requestId],
        { queryParamsHandling: 'merge' }
      );
    } else if (params.column.colId === 'update') {
      this.interactionsService.navigateToInteractionModificationPage(this.router,this.customerId, params.data.requestId, params.data.interactionId, 'history');
    } else if ( params.column.colId !== 'description') {
      this.interactionsService.navigateToDetailInteractionPageByType(this.router,this.customerId, params.data.requestId, params.data.interactionId); 
    } 
  }

  nameFormatter(user: Partial<UserVo>): string {
    return fullNameFormatter(null , user.firstName , user.lastName).trim();
  }

  setMasterDetailInteraction(): void {
    this.detailCellRendererParams = {
      detailGridOptions: {
        columnDefs: [],
        defaultColDef: { flex: 1 }
      },
      getDetailRowData: (params) => {
        // simulate delayed supply of data to the detail pane
        setTimeout( () => {
          params.successCallback([]);
        }, 1000);
      },
      template: (_params: any) => {
        return '<div style="height: 100%; margin-left: 40px; padding: 20px; box-sizing: border-box; width:50%;">'
            + '  <div style=" width: 50 %"> ' 
            + '   <span class="athena uppercase underline grey mb-3 "> description de l\' interaction </span>'
            + '   <p class="enableNewLine mt-3">'
            + `    ${getDefaultStringEmptyValue(_params.data.description)}`
            + '   </p>'
            + ' </div>'
            + '</div>';
      }
    };
  }

  calculateRowHeightOfMasterDetail(): void {
    this.getRowHeight = (params) => {
      if (params.node && params.node.detail) {
        const offset = 70;
        const lignes = (!isNullOrUndefined(params.data.description)) ? params.data.description.split(/\r\n|\r|\n/) : [''];
        let allDetailRowHeight = lignes.length ;

        lignes.forEach( (ligne: string) => {
          const snb = ligne.length / 60;  
          if ( snb > 1) { 
            allDetailRowHeight += snb - 1; 
          } 
        });
        return allDetailRowHeight * 20 + offset;
      }
      return null;
    };
  }

}
