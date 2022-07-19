
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { isNullOrUndefined, getDefaultStringEmptyValue } from '../../../../_core/utils/string-utils';

import { ParcLigneService } from '../../../../_core/services';

import { CustomerParkItemServicesOptionsVO, CustomerParkItemVO, 
  CustomerParkItemTerminalMobileVO, RenewalMobileVO } from '../../../../_core/models/models';
import { PARK_RENEWAL_CLASSIFICATION } from '../../../../_core/constants/constants';

import { CustomerParcLigneDetailVO } from '../../../../_core/models/customer-parc-ligne-detail-vo';
import { dateComparator } from '../../../../_core/utils/date-utils';
import { DateFormatPipeFrench } from '../../../../_shared/pipes';



const TEXT_CENTER_CLASS = 'text-center';
const PARC_OPERATION_RENEWEL_IN_PROGRESS = ' Du' + ' ';
const PARC_OPERATION_RENEWEL_IN_PROGRESS_SINCE = ' Depuis le' + ' ';
const PARC_OPERATION_RENEWEL = ' ' + 'au' + ' ' ;

@Component({
  selector: 'app-park-item-detail-mobile',
  templateUrl: './park-item-detail-mobile.component.html',
  styleUrls: ['./park-item-detail-mobile.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ParkItemDetailMobileComponent implements OnInit {
  paginationPageSize = 4;
  emptyListoffers = true ;
  emptyListterminal = true ;
  emptyListRenewal = true ;
  cpiId: any;
  parcItemLigneDetail: CustomerParcLigneDetailVO;
  customerParkItems: CustomerParkItemVO;
  customerParcItemServiceOption: CustomerParkItemServicesOptionsVO[];
  customerParkItemTerminalMobile: CustomerParkItemTerminalMobileVO[];
  renewalMobileList: RenewalMobileVO[];
  show = false;
  countForExpanded = 0;
  countForCollapse = 0;
  expandedAllRows: boolean ;
  collapseAllRows: boolean ;
  // Table offre
  defaultSortModel = [ { colId: 'dateActivation', sort: 'desc' } ];
  columnDefs = [
    {
      headerName: 'article',
      headerTooltip: 'article',
      width: 180,
      valueGetter : params => {
        if (params.data.libelle === null) {
          return '-' ;
        }
        return params.data.libelle;
      }
    },
    {
      headerName: 'code',
      headerTooltip: 'code',
      width: 100,
      // field: 'code',
      valueGetter : params => {
        if (params.data.code === null) {
          return '-';
        }
        return params.data.code;
      }
    },
    {
      headerName: 'début',
      headerTooltip: 'debut',
      field: 'dateActivation',
      comparator: dateComparator,
      width: 120,
      valueGetter: params => this.dateFormatPipeFrench.transform(params.data.dateActivation)
    },
    {
      headerName: 'fin',
      headerTooltip: 'fin',
      field: 'dateDesactivation',
      comparator: dateComparator,
      valueGetter: params => this.dateFormatPipeFrench.transform(params.data.dateDesactivation),
      width: 120
    },
    {
      headerName: 'type',
      headerTooltip: 'type',
      colId: 'type1',
      width: 160,
      valueGetter : params => {
        if (params.data.libelleType === null || params.data.libelleType === '') {
          return '-';
        }
        return params.data.libelleType;
      }
    },
    {
      headerName: 'inclus offre',
      headerTooltip: 'inclus offre',
      width: 120,
      colId: 'inclus',
      field: 'isIncludeInOffer',
      comparator: this.typeComparators,
      cellRenderer: params => {
        if (params.data.isIncludeInOffer === null) {
          return '-';
        }
        return `<span class='icon ${this.getArrowImage(
          params.data.isIncludeInOffer, null
        )}' ></span>`;
      },
      cellClass: TEXT_CENTER_CLASS
    },
    {
      headerName: 'statut',
      headerTooltip: 'status',
      field: 'state',
      comparator: this.typeComparator,
      width: 90,
      cellRenderer: params => {
        if (params.data.state === null) {
          return '-';
        }
        return `<span class='icon ${this.getArrowImage(null,
          params.data.state
        )}' ></span>`;
      },
      cellClass: TEXT_CENTER_CLASS
    }
  ];

  // Table terminaux 
  defaultSortModelTerminaux = [ { colId: 'dateFirstUse', sort: 'desc' } ];
  columnDefsTerminaux = [
    {
      headerName: 'nom',
      headerTooltip: 'nom',
      width: 180,
      field: 'description',
      valueGetter: params => {
        return getDefaultStringEmptyValue(params.data.description);
      },
    },
    {
      headerName: 'achat oran.',
      headerTooltip: 'achat orange',
      width: 120,
      field: 'isBought',
      comparator: this.typeComparators,
      cellRenderer: params => {
        if (params.data.isBought === null) {
          return '-' ;
        }
        return `<span class='icon ${this.getArrowImage(
          params.data.isBought, null
        )}' ></span>`;
      },
      cellClass: TEXT_CENTER_CLASS
    },
    {
      headerName: 'origine achat',
      headerTooltip: 'origina achat',
      width: 160,
      field: 'origin',
      valueGetter: params => {
        return getDefaultStringEmptyValue(params.data.origin);
      },
    },
    {
      headerName: 'date d\'achat',
      headerTooltip: 'date d\'achat',
      field: 'dateBuy',
      comparator: dateComparator,
      valueGetter: params => getDefaultStringEmptyValue(this.dateFormatPipeFrench.transform(params.data.dateBuy)),
      width: 120
    },
    {
      headerName: 'Aquisition',
      headerTooltip: 'Aquisition',
      field: 'dateFirstUse',
      comparator: dateComparator,
      valueGetter: params => getDefaultStringEmptyValue(this.dateFormatPipeFrench.transform(params.data.dateFirstUse)),
      width: 160,
    },
    {
      headerName: 'IMEI',
      headerTooltip: 'imei',
      field: 'numImei',
      width: 160,
      valueGetter: params => {
        return getDefaultStringEmptyValue(params.data.numImei);
      },
    }
  
  ];

  // Table Renewal  
  defaultSortModelRenewal = [ { colId: 'operationDate', sort: 'desc' } ];
  columnDefsRenewal = [
      {
      headerName: 'periodes de renouvellement',
      headerTooltip: 'periodes de renouvellement',
      width: 200,
      field: 'operation',
      comparator: dateComparator,
      valueGetter: params => this.getDateOperation(params.data.beginDate, params.data.endDate ),
      cellRenderer: 'agGroupCellRenderer'
    },
    {
      headerName: 'Date de renouvellement',
      headerTooltip: 'Date de renouvellement',
      width: 140,
      field: 'renewalDate',
      comparator: dateComparator,
      valueGetter: params => this.dateFormatPipeFrench.transform(params.data.renewalDate)
    },
    {
      headerName: 'date de l’opération',
      headerTooltip: 'date de l’opération',
      width: 140,
      field: 'operationDate',
      comparator: dateComparator,
      valueGetter: params => this.dateFormatPipeFrench.transform(params.data.operationDate)

    },
    {
      headerName: 'type',
      headerTooltip: 'type',
      colId: 'type1',
      field: 'classification',
      width: 120,
      valueGetter: params => this.getRenewalMobileClassification(params.data.classification)
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
      }, 1000);
    },
    template: (_params: any) => {
      let comment = _params.data.comment;
      comment = (isNullOrUndefined(comment) || comment.trim().length === 0) ? 'Pas de renouvellement mobile' : comment ;
      console.log(comment);
      return '<div style="height: 100%; padding:15px 20px 5px 20px; box-sizing: border-box;">'
          + '  <div>' 
          + ' <p class="enableNewLine">'
          + ` <strong class="athena ml-5" > Informations : </strong> ${comment}`
          + ' </p> </div>'
          + '</div>';
    }
  };

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dateFormatPipeFrench: DateFormatPipeFrench,
    private readonly parcLigneService: ParcLigneService 
  ) {}
  ngOnInit(): void {
 
    this.route.paramMap.subscribe(params => {
      this.cpiId = Number.parseInt(params.get('id'), 10);      
    });
    this.getParcLignes();
    this.getListRenewalMobileById();
    this.route.data.subscribe(resolversData => {
      this.parcItemLigneDetail = resolversData['parcItemLigneDetail'];
    });  
   
  }

  getDateOperation(param1: string, param2: string): any {  
    const param3 = new Date(param2);
    const now = new Date();
    if (param1 !== null && param2 !== null && now > param3 ) {
      return PARC_OPERATION_RENEWEL_IN_PROGRESS + (this.dateFormatPipeFrench.transform(param1)) + PARC_OPERATION_RENEWEL + 
     (this.dateFormatPipeFrench.transform(param2));

    }
    if (param1 !== null && now < param3 ) {
      return PARC_OPERATION_RENEWEL_IN_PROGRESS_SINCE + (this.dateFormatPipeFrench.transform(param1)) ;
    }

    return ' ';
  } 
 
  getRenewalMobileClassification( value: number): string {

    if (PARK_RENEWAL_CLASSIFICATION.RENEWAL_CLASSIFICATION_TYPE_MIN <= value ) {
      return PARK_RENEWAL_CLASSIFICATION.RENEWAL_CLASSIFICATION_TYPE_2;
    } 
    if ( PARK_RENEWAL_CLASSIFICATION.RENEWAL_CLASSIFICATION_TYPE_MAX <= value ) {
      return PARK_RENEWAL_CLASSIFICATION.RENEWAL_CLASSIFICATION_TYPE_3 ;
    }
    return '-';
  }

  getArrowImage(param1: boolean , param2: number): string {
    return (param1 === true || param2 === 0)
      ? 'status-green-teleco'
      : 'status-red-teleco';
  }

  getParcLignes(): void {
    this.parcLigneService
      .getCustomerParkItemById(Number(this.cpiId))
      .pipe(catchError(() => of(null)))
      .subscribe(customerParkItem => {
        this.customerParkItems = customerParkItem;
        if (this.customerParkItems.customerParkItemTerminalMobile === [] 
          || this.customerParkItems.customerParkItemTerminalMobile.length === 0 ) {
          this.emptyListterminal = false;

        }
        if (this.customerParkItems.customerParkItemServicesOptions === [] 
          || this.customerParkItems.customerParkItemServicesOptions.length === 0 ) {
          this.emptyListoffers = false;
        }
        if (this.customerParkItems !== null && this.customerParkItems.customerParkItemServicesOptions !== null) {
          this.customerParcItemServiceOption = this.customerParkItems.customerParkItemServicesOptions;
         
        }
        if (this.customerParkItems !== null && this.customerParkItems.customerParkItemTerminalMobile !== null) {
          this.customerParkItemTerminalMobile = this.customerParkItems.customerParkItemTerminalMobile;
         
        }
      }
     );
  
  }

  getListRenewalMobileById(): void {
    this.parcLigneService.getListRenewalMobileById(Number(this.cpiId))
    .pipe(catchError(() => of(null)))
    .subscribe(
      data => {
      this.renewalMobileList = [];
      let previousItem = null;
      data.forEach(rm => {
        this.renewalMobileList.push(rm);
        if (previousItem && (previousItem.beginDate === rm.beginDate) && (previousItem.endDate === rm.endDate)) {
          if (previousItem.renewalDate === null) {
            this.renewalMobileList.splice(this.renewalMobileList.indexOf(previousItem), 1);
          } else if (rm.renewalDate === null){
            this.renewalMobileList.splice(this.renewalMobileList.indexOf(rm), 1);
          }
        }
        previousItem = rm;
      });
      if (this.renewalMobileList === [] || this.renewalMobileList.length === 0 ) {
        this.emptyListRenewal = false ;
      }
    });
  }

   typeComparator(type1: number, type2: number): number {

        if (isNullOrUndefined(type1)) {
         type1 = 2;
    }
        if (isNullOrUndefined(type2) ) {
         type2 = 2;
    }
            
            return type1.toLocaleString().localeCompare(type2.toLocaleString()) * -1;
      } 

     typeComparators(type1: any, type2:any): number {
      let param1 :  number;
      let param2 : number;
         if (isNullOrUndefined(type1)) {
        param1 = 2;
      } else if(type1 ) {
          param1 = 0;
        } else {
        param1 = 1;
        }
        if(isNullOrUndefined(type2)) {
          param2= 2;
        }else if(type2){
      param2 = 0;
        }else{
          param2 = 1;
        }
         return param1.toLocaleString().localeCompare(param2.toLocaleString()) * -1;
    }

    expandedAll() {
      this.show = true;
      if (this.countForExpanded % 2 === 0) {
        this.expandedAllRows = true;
      } else {
        this.expandedAllRows = false;
      }
      this.countForExpanded++;
    }
  
    collapseAll() {
      this.show = false;
      if (this.countForCollapse % 2 === 0) {
        this.collapseAllRows = true;
      } else {
        this.collapseAllRows = false;
      }
      this.countForCollapse++;
    }
  }
  
  