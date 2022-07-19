import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { RequestCustomerVO } from './../../../../_core/models/request-customer-vo';
import { RequestService } from '../../../../_core/services/request.service';
import { CustomerDashboardService } from '../../customer-dashboard.service';
import { RequestTypeVO } from '../../../../_core/models/request-type-vo';
import { RequestStatut } from '../../../../_core/enum/request-statut.enum';
import { CONSTANTS } from '../../../../_core/constants/constants';
import { getDefaultStringEmptyValue, isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { toUpperCase, firstNameFormatter } from '../../../../_core/utils/formatter-utils';
import { dateComparator } from '../../../../_core/utils/date-utils';
import { DateFormatPipeFrench } from '../../../../_shared/pipes';
import { PaginatedList } from '../../../../_core/models/paginated-list';

@Component({
  selector: 'app-requests-monitoring',
  templateUrl: './requests-monitoring.component.html',
  styleUrls: ['./requests-monitoring.component.scss'], 
  encapsulation: ViewEncapsulation.None
})
export class RequestsMonitoringComponent implements OnInit {

  requestsCustomer: RequestCustomerVO[] = [];
  customerId: string;
  typesRequest: RequestTypeVO[];
  selectedStatusList = [ RequestStatut.PENDING, RequestStatut.CLOSED, RequestStatut.REFUSED];
  selectedTypesList = [];
  selectedTypesLabelList = [];
  selectedIndex = -1;
  isEntreprise: boolean;
  typeCustomer: string;
  requestchoose: String;
  noRequestExisting = true;

  defaultSortModel = [
    { colId: 'requestDate', sort: 'desc' }
  ];

  columnDefs = [
    {
      headerName: 'DEMANDE',
      children: [
        {
          headerName: 'CRÉÉ LE',
          headerTooltip: 'CRÉÉ LE',
          field: 'createdAt',
          colId: 'requestDate',
          valueGetter: params => (params.data) ? this.dateFormatPipeFrench.transform(params.data.createdAt) : '',
          width: 120,
          cellClass: 'cell-wrap-text',
          cellClassRules: {
            'unselectable': (params) => (params.data) ? (params.data.statuts === 'CLOSED' || params.data.statuts === 'REFUSED') : false
          },
          autoHeight: true 
        },
        {
          headerName: 'N°',
          headerTooltip: 'N°',
          field: 'idRequest',
          colId: 'requestId',
          cellClassRules: {
            'unselectable': (params) => (params.data) ? (params.data.statuts === 'CLOSED' || params.data.statuts === 'REFUSED') : false
          },
          width: 100
        },
        {
          headerName: 'PARCOURS',
          headerTooltip: 'PARCOURS',
          field: 'requestTypeLabel',
          colId: 'requestType',
          valueGetter: params => (params.data) ? getDefaultStringEmptyValue(params.data.requestTypeLabel) : '',
          width: 160,
          cellClass: 'cell-wrap-text',
          cellClassRules: {
            'unselectable': (params) => (params.data) ? (params.data.statuts === 'CLOSED' || params.data.statuts === 'REFUSED') : false
          },
          autoHeight: true 
        },
        {
          headerName: 'OBJET',
          headerTooltip: 'OBJET',
          field: 'title',
          colId: 'requestObject',
          valueGetter: params => (params.data) ? getDefaultStringEmptyValue(params.data.title) : '',
          width: 220,
          cellClassRules: {
            'unselectable': (params) => (params.data) ? (params.data.statuts === 'CLOSED' || params.data.statuts === 'REFUSED') : false
          },
          cellClass: 'cell-wrap-text',
          autoHeight: true 
        },
        {
          headerName: 'INFOS',
          headerTooltip: 'INFOS',
          field: 'description',
          valueFormatter: (params) => params.value,
          cellRenderer: () => `<span class='icon help-grey'></span>`,
          editable: true,
          cellEditor: 'infoBullRendererComponent',
          cellClass: 'border-right',
          sortable: false,
          suppressNavigable: true,
          cellClassRules: {
            'unselectable': (params) =>(params.data) ?  (params.data.statuts === 'CLOSED' || params.data.statuts === 'REFUSED') : false
          },
          width: 60
        }
      ]
    },
    {
      headerName: 'Tâches associées',
      children: [
        {
          headerComponentParams: { 
            template: ` 
            <div class="ag-cell-label-container row " style="flex-direction: row;" role="presentation" >
              <div ref="eLabel" class="ag-header-cell-label" role="presentation" style='width:45%; padding-left:5px'>
               Taches en cours 
              </div>
              <div ref="eLabel1" class="ag-header-cell-label" role="presentation" style='width:35%; padding-left:13px'>
              Traité par 
              </div>
              <div style='width:8%;'></div>
              <span class="icon  calendar-grey" style='width:12%;'></span> 
            </div>`
          },
          field: 'table',
          comparator: dateComparator,
          cellRenderer: (params) => {
            const tasks = params.data.tasks;
            let table = ``;
            if (this.isStatusClosedOrRefused(params)) {
              table = `<table height="100%" class='table table-not-bordered-3 bordered-tr unselectable' style='margin-bottom:0'> `;
            } else {
              table = `<table height="100%" class='table table-not-bordered-3 bordered-tr ' style='margin-bottom:0'> ` ;
            }
            
            let rows = ``;
            if ( tasks && tasks.length > 0 ) {
              tasks.forEach(t => {
                if ( t.isPriority) {
                  rows += `<tr class='orange bordered-bottom' height="100%" > `;
                } else {
                  rows += `<tr class='bordered-bottom' height="100%" > `;
                }
                rows += `<td class='' width='45%'> `;
                rows += getDefaultStringEmptyValue(t.taskPending);
                rows += `</td> <td class='' width='35%'>`;
                rows += toUpperCase(t.lastName) ; 
                rows += ' ' + firstNameFormatter(t.firstName);
                if ( t.remainingTime && t.remainingTime > 0) {
                  rows += `</td> <td class='bordered-bottom text-center' width='20%'> `;
                } else {
                  rows += `</td> <td class=' bordered-bottom negative-value text-center' width='20%'> `;
                }
                rows += getDefaultStringEmptyValue(t.remainingTime) ;
                rows += `</td> <tr> `;
              });
            } else {
              rows += `<tr class='bordered-tr'> `;
              rows += `<td class='bordered-bottom' width='45%'> - </td> <td class='' width='35%'> -</td>`; 
              rows += `<td class='bordered-bottom  negative-value text-center' width='20%'>  - </td> <tr> `;
            }
            table += rows;
            table += `</table>`;  
            return table;
          },
          cellClass: 'cell-wrap-text margin-table table clickable',
          autoHeight: true ,
          width: 500
        }
      ]
    }
  ];

  /**************************************************
  *  ARGUMENTS POUR AG GRID SERVER SIDE (START)     *
  *  app-athena-ag-grid2                            *              
  **************************************************/
  datasource: any;
  paginationPageSize = 20;
  rowData: any;
  totalItems = 0;
  rowModelType;
  gridApi;
  gridColumnApi;
  gridParams;
  rowStyle = { cursor: 'pointer' };
  params: { force: boolean; suppressFlash: boolean; };
  /***************************************************
   *  ARGUMENTS POUR AG GRID SERVER SIDE (END)       *
   *  app-athena-ag-grid2                            *          
   **************************************************/

  constructor(private readonly route: ActivatedRoute, private readonly requestService: RequestService, private readonly dateFormatPipeFrench: DateFormatPipeFrench,
    private readonly router: Router) {
      this.rowModelType = 'serverSide';
      this.initGrid();
    }

  ngOnInit(): void {
    this .route.parent.paramMap.subscribe(params => {
      this .customerId = params.get('customerId');
    });

    this.route.queryParamMap.subscribe(params =>
       this.typeCustomer = params.get('typeCustomer'));
    this.route.data.subscribe(resolversData => {
      this.typesRequest = resolversData['typesRequest'];;
      this.route.queryParamMap.subscribe( (params: ParamMap) => {
        this.requestchoose = params.get('typeRequest');
      });
      if ( this.requestchoose === 'recouvrement') {
        const ev = {
          'value' : [CONSTANTS.ID_REQUEST_RECOUVREMENT]
        };
        this.selectedTypesList.push(CONSTANTS.ID_REQUEST_RECOUVREMENT);
        this.onSelectRequestType(ev);
      } else if ( this.requestchoose === 'humeurMembre' ) {
        const evRec = {
          'value' : [CONSTANTS.ID_REQUEST_HUMEUR_MEMBRE]
        };
        this.selectedTypesList.push(CONSTANTS.ID_REQUEST_HUMEUR_MEMBRE);
        this.onSelectRequestType(evRec);
      } else if ( this.requestchoose === 'sav' ) {
        const evSav = {
          'value' : [CONSTANTS.ID_REQUEST_SAV]
        };
        this.selectedTypesList.push(CONSTANTS.ID_REQUEST_SAV);
        this.onSelectRequestType(evSav);
      }

      else if ( this.requestchoose === 'home' ) {
        const evHome = {
          'value' : [CONSTANTS.ID_REQUEST_HOME]
        };
        this.selectedTypesList.push(CONSTANTS.ID_REQUEST_HOME);
        this.onSelectRequestType(evHome);
      }
      else {
        this.typesRequest.forEach(tr => this.selectedTypesList.push(tr.id));
      }
    });
  }

  onCheckboxChagen(event: any): void {
    this.selectedStatusList = event.value;
    this.search();
  }

  onSelectRequestType(event: any): void {
    this.selectedTypesList = event.value;
    this.selectedTypesLabelList = [];
    if(!isNullOrUndefined(this.selectedTypesList) && this.selectedTypesList.length > 0 
        && !isNullOrUndefined(this.typesRequest) && this.typesRequest.length > 0){
      this.typesRequest.forEach(tr => {
          if(this.selectedTypesList.includes(tr.id)){
            this.selectedTypesLabelList.push(tr.label);
          }
      });
    }
    this.search();
  }

  selectAllRequestType(): void {
    this.selectedTypesList = [];
    if(!isNullOrUndefined(this.typesRequest) && this.typesRequest.length > 0){
        this.typesRequest.forEach(tr => this.selectedTypesList.push(tr.id));
    }
    this.search();
  }

  deselectAllRequestType(): void {
    this.selectedTypesList = [];
    this.search();
  }

  doSearchByFilter(): void {
    this.route.queryParamMap.subscribe(params => this.typeCustomer = params.get('typeCustomer'));
    this.isEntreprise = ( this.typeCustomer === CONSTANTS.TYPE_COMPANY );
    if ( this.selectedStatusList.length === 0 || this.selectedTypesList.length === 0 ) {
      this .requestsCustomer = [];
    } else {
      this .requestService.getRequestsByFilters(this.customerId, this.selectedStatusList, this.selectedTypesList, this.isEntreprise)
      .subscribe(data => {
        this .requestsCustomer = data;
      });
    }
  }

  clickedCell(params: any): void {
    console.log(params);
    if ( params.column.colId !== 'description') {
      this.router.navigate(
        ['/customer-dashboard', this.customerId, 'detail', 'request', params.data.idRequest],
        {
          queryParams: { 'selectedStatusList' : this.selectedStatusList, 'selectedTypesList' : this.selectedTypesList },
          queryParamsHandling: 'merge'
        }
      );
    }
  }

  isStatusClosedOrRefused(params): boolean {
     return params.data && (params.data.statuts === 'CLOSED' || params.data.statuts === 'REFUSED');
  }

  /**
   * data source pour AG-GRID Serve SID
   */

  search(): void {
    if (this.selectedStatusList.length === 0 || this.selectedTypesList.length === 0) {
       this.totalItems = 0;
       this.noRequestExisting = true;
    } else {
      this.initGrid();
    }
  }

  reloadGridAfterSortChanged(ev: any) {
    this.initGrid();
  }

  onGridReady(params) {
    console.log('onGridReady: ', params);
    this.gridParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.initGrid();
  }

  initGrid(): void {
    this.createServerSideDatasource(null);
  }

  createServerSideDatasource(_event: any): void {
    this.noRequestExisting = false;
    this.datasource = {
      getRows: (params) => {
        this.isEntreprise = (this.typeCustomer === CONSTANTS.TYPE_COMPANY);
        const page = params.request && params.request.startRow > 0 ? params.request.startRow / 20 : 0;
        const pageSize = 20;
        const sortField = params.request && params.request.sortModel && params.request.sortModel.length > 0 ? params.request.sortModel[0].colId : 'requestDate';
        const sortOrder = params.request && params.request.sortModel && params.request.sortModel.length > 0 ? params.request.sortModel[0].sort : 'DESC';
          this.requestService.getPaginatedListRequestsByFilters(this.customerId, this.selectedStatusList,
            this.selectedTypesList, this.isEntreprise, page, pageSize, sortField, sortOrder)
            .subscribe(data => {
              this.noRequestExisting = false;
              this.totalItems = data.total;
              params.success({ rowData: data.items, rowCount: data.total });
              this.rowData = data;
                if(isNullOrUndefined(data) || isNullOrUndefined(data.items)  ||  data.items.length === 0) {
                  this.noRequestExisting = true;
                }
            },
              (_error) => {
                params.fail();
              },
              () => {
                document.getElementById("requestListId").scrollIntoView();
              }
            );
        }
    };
  }

  private addArrowsToItems(data: PaginatedList<RequestCustomerVO>) {
    if (data && data.items) {
      data.items.forEach((item) => item.arrow = '');
    }
  }
}
