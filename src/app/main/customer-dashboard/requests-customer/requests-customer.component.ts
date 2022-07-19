import { fullNameFormatter } from '../../../_core/utils/formatter-utils';
import { CONSTANTS, PANIER_PARCOURS } from '../../../_core/constants/constants';
import { RequestService } from 'src/app/_core/services/request.service';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

import {
  isNullOrUndefined,
  getDefaultStringEmptyValue
} from '../../../_core/utils/string-utils';
import { dateComparator } from '../../../_core/utils/date-utils';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';
import { DateFormatPipeFrench } from '../../../_shared/pipes';
import { getCustomerTypeFromURL, getCustomerTypeStringFromURL } from '../customer-dashboard-utils';
import { getCartIconClass } from '../../../_core/utils/functions-utils';



@Component({
  selector: 'app-requests-customer',
  templateUrl: './requests-customer.component.html',
  styleUrls: ['./requests-customer.component.scss']
})
export class RequestsCustomerComponent implements OnInit {
  customerId: string;

  requestsCustomer: RequestCustomerVO[];

  @Input()
  isParticular: boolean;

  @Input()
  isEntreprise: boolean;

  idsRequests: number[];

  rowData: any = [];
  columnDefs: any[];

  defaultSortModel: any;
  isEmptyRequests: boolean = true;
  isNotFinishedCall = true;
  inCompleteCall: boolean = true;
  customerDashboard =  '/customer-dashboard';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dateFormatPipeFrench: DateFormatPipeFrench,
    private requestService: RequestService
  ) {
    this.defaultSortModel = [{ colId: 'createdAt', sort: 'desc' }];
    this.setColumnRef();
  }

  ngOnInit(): void {
    this.getOpenedRequests();
    
  }
  getOpenedRequests() {
    let isEntreprise;
    this.route.params.subscribe(params => {
      this.customerId = params['customerId'];
      this.inCompleteCall = true;
      isEntreprise = getCustomerTypeFromURL(this.route, CONSTANTS.TYPE_COMPANY);
      this.requestService
      .getRequestCustomer(this.customerId, isEntreprise)
      .subscribe(
        requests => {
          this.requestsCustomer = requests;
          this.idsRequests = this.getAllIdsOfRequests(this.requestsCustomer);
        },
        error => {},
        () => {
          this.isEmptyRequests = this.requestsCustomer.length === 0;
          this.inCompleteCall = false;
        }
      );
    });    
  }
  getAllIdsOfRequests(requests: RequestCustomerVO[]) {
    let idsList = [];
    if (requests != null && requests.length > 0) {
      for (var i = 0; i < requests.length; i++) {
        idsList.push(requests[i].idRequest);
      }
    }
    return idsList;
  }

  


  setColumnRef(): void {
    let libelle = '';
    this.columnDefs = [
      {
        headerName: 'DÛ',
        headerTooltip: 'DÛ',
        field: 'createdAt',
        comparator: dateComparator,
        valueGetter: params =>
          this.dateFormatPipeFrench.transform(params.data.createdAt),
        width: 120,
        sort: 'desc'
      },
      {
        headerName: 'PARCOURS',
        headerTooltip: 'PARCOURS',
        field: 'requestTypeLabel',
        width: 180
      },
      {
        headerName: 'OBJET DEMANDE',
        headerTooltip: 'OBJET DEMANDE',
        field: 'title',
        cellClass: 'cell-wrap-text',
        valueGetter: params => getDefaultStringEmptyValue(params.data.title),
        width: 220,
        autoHeight: true
      },
      {
        headerName: 'TÂCHE EN COURS',
        headerTooltip: 'STATUT',
        field: 'task.taskPending',
        valueGetter: params => {
          if (isNullOrUndefined(params.data.task)) {
            return '-';
          }
          return getDefaultStringEmptyValue(params.data.task.taskPending);
        },
        cellClass: 'cell-wrap-text',
        width: 260
      },
      {
        headerName: 'À TRAITER PAR',
        headerTooltip: 'À TRAITER PAR',
        field: 'task.name',
        cellClass: 'cell-wrap-text',
        valueGetter: params => {
          if (isNullOrUndefined(params.data.task)) {
            return '-';
          }
          const firstName: string = params.data.task.firstName;
          const lastName: string = params.data.task.lastName;
          libelle = fullNameFormatter(null , firstName , lastName , ' ');
          return getDefaultStringEmptyValue(libelle);
        },
        width: 160,
        autoHeight: true
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
        cellRenderer: 'searchBtnRendererComponent',
        cellClass: 'text-center',
        sortable: false,
        width: 80
      }
    ];
  }

  checkIfCartIconHasToBeRendered(data){
    if(!isNullOrUndefined(data.cartId)){
      if(this.isInParcours(data.requestTypeLabel)){
        if(!isNullOrUndefined(data.instanceId)){
          return this.getCartIconRenderer(data.cartColor, data.cartStatus);
        }else{
          if(!data.isConnectedOnWf){
            return this.getCartIconRenderer(data.cartColor, data.cartStatus);
          }
        }
      }
    }
    return '';
 }

 getCartIconRenderer(cartColor: string, cartStatus: string): string {
   return `<span class='icon ${getCartIconClass(cartColor, cartStatus)}' ></span>`;
 }

 isInParcours(parcour: any): boolean {
  return PANIER_PARCOURS.includes(parcour);
}

clickCell(cell: any): void {
  if (cell.column.colId === 'panier' && !isNullOrUndefined(cell.data.cartId)) {
    if(cell.data.cartItemLentgh > 0){
      this.router.navigate(
        [this.customerDashboard, this.customerId,'cart', 'creation', cell.data.idRequest],
        {
          queryParams: {
            typeCustomer: getCustomerTypeStringFromURL(this.route), 
            parcours: cell.data.requestTypeLabel,
            onglet : 0
          },
          queryParamsHandling: 'merge'
        }
      );
    } else {
      this.router.navigate(
        [this.customerDashboard, this.customerId,'cart', 'catalog', cell.data.idRequest],
        {
          queryParams: {
            typeCustomer: getCustomerTypeStringFromURL(this.route),
            parcours: cell.data.requestTypeLabel
          },
          queryParamsHandling: 'merge'
        }
      );
    }
    
}
else{
  this.router.navigate(
    [
      this.customerDashboard,
      this.customerId,
      'detail',
      'request',
      cell.data.idRequest
    ],
    {
      queryParams: { requestList: this.idsRequests, isDetailRecovery: false },
      queryParamsHandling: 'merge'
    }
  );
}
}


}
