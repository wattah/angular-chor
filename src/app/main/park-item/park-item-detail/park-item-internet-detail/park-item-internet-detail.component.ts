import { Component, ViewEncapsulation, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NestedOfferVO } from '../../../../_core/models/nested-offer-vo';
import { DateFormatPipeFrench } from '../../../../_shared/pipes';
import { ParkItemService } from '../park-item-detail.service';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { dateComparator } from '../../../../_core/utils/date-utils';

const TEXT_CENTER_CLASS = 'text-center';

@Component({
  selector: 'app-park-item-internet-detail',
  templateUrl: './park-item-internet-detail.component.html',
  styleUrls: ['./park-item-internet-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ParkItemInternetDetailComponent implements OnChanges {

  @Input() offers: NestedOfferVO[];
  isExistOffers = false;
  lengthOffersDetail = 0;
  columnDefsDetailInternet: any;
  rowDataDetailInternet: any;
  autoGroupColumnDef: any;


  // detail internet
  defaultSortModelDetailInternet = [ { colId: 'startDate', sort: 'desc' } ];
  agGridDetailInternet(): void {
   this.columnDefsDetailInternet = [
    {
      headerName: '',
      headerTooltip: '',
      field: 'value',
      cellRenderer: (params) => {
        let value = '';
        if (!isNullOrUndefined(params.data) && !isNullOrUndefined(params.data.value)) {
          value = `${params.data.value}`
        }
        return value;
      },
      cellStyle: { 'padding-top': '19px' },
      cellClass: 'cell-wrap-text',
      width: 250
    }, 
    {
      headerName: 'statut',
      headerTooltip: 'statut',
      colId: 'status',
      field: 'status',
      cellRenderer: params => { 
        return this.cellRendererStatut(params)
      },
      cellClass: TEXT_CENTER_CLASS
    },
    {
      headerName: 'début',
      headerTooltip: 'début',
      field: 'startDate',
      comparator: dateComparator,
      valueGetter: params => { 
        return this.valueGetterDebut(params)
      },
    },
    {
      headerName: 'fin',
      headerTooltip: 'fin',
      field: 'endDate',
      comparator: dateComparator,
      valueGetter: params => { 
        return this.valuGetterFin(params) ;
      } 
    }
  ];

 this.rowDataDetailInternet = this.offers;
  this.autoGroupColumnDef = {
    headerName: 'options & services',
    minWidth: 300,
    cellRendererParams: { suppressCount: true }
  };
}

  valueGetterDebut(params: any) {
    let formattedDate = '-';
    if (!isNullOrUndefined(params.data) && isNullOrUndefined(params.data.value)) {
      formattedDate = this.dateFormatPipeFrench.transform(params.data.startDate, 'dd MMM yyyy')
    } else if (!isNullOrUndefined(params.data) && !isNullOrUndefined(params.data.value)) {
      formattedDate = '';
    }
    return formattedDate;
  }


  valuGetterFin(params: any) {
    let formattedDate = '-';
    if (!isNullOrUndefined(params.data) && isNullOrUndefined(params.data.value)) {
      formattedDate = this.dateFormatPipeFrench.transform(params.data.endDate, 'dd MMM yyyy')
    }else if(!isNullOrUndefined(params.data) && !isNullOrUndefined(params.data.value)) {
      formattedDate = '';
    }
    return formattedDate;
  }


  cellRendererStatut(params) : any{
    let value : any ;
    if(!isNullOrUndefined(params.data)){
      if(isNullOrUndefined(params.data.value) && !isNullOrUndefined(params.data.status)) {
        value = this.parkItemService.getStatusChildren(params.data.status, params.data.children)
      } else if(!isNullOrUndefined(params.data.value)) {
        value = '';
      } else {
        value = '-';
      }
      }
      return value;
  }
 
  constructor(private readonly route: ActivatedRoute, 
    private readonly parkItemService: ParkItemService,
    private readonly dateFormatPipeFrench: DateFormatPipeFrench) {
      
  }
  

  ngOnChanges(changes: SimpleChanges): void {
      if (!isNullOrUndefined(this.offers) && this.offers.length > 0) {
        this.isExistOffers = true;
        this.lengthOffersDetail = this.parkItemService.getLengthDetailInternet(this.offers);
        this.agGridDetailInternet();
      } else {
        this.isExistOffers = false;
      }
  }

  getDataPathDetail = (data) => {
    return data.name.split('/');
  }
}
