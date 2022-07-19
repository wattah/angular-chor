import { Component, Input } from '@angular/core';

import { CSS_CLASS_NAME, DEFAULT_STRING_EMPTY_VALUE, PRELEVEMENT_PENICHE_TYPES } from '../../../../_core/constants/constants';
import { HomologationLineVO } from '../../../../_core/models';
import { toUpperCase } from '../../../../_core/utils/formatter-utils';
import { capitalize, getDefaultStringEmptyValue, isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { HomologationItemMobileDetailComponent } from './homologation-item-mobile-detail.component';

@Component({
  selector: 'app-homologation-item-mobile',
  templateUrl: './homologation-item-mobile.component.html',
  styleUrls: ['./homologation-item-mobile.component.scss']
})
export class HomologationItemMobileComponent {

  @Input() lines: Partial<HomologationLineVO>[] = [];

  defaultSortModel = [
    { colId: 'lineNumber', sort: 'desc' }
  ];

  columnDefs = [
    {
      headerName: '',
      headerTooltip: '',  
      cellRenderer: 'agGroupCellRenderer',
      width: 40,
      field: 'id',
      resizable: false,
      sortable: false
    },
    {
      headerName: 'LIGNE', headerTooltip: 'LIGNE', colId: 'lineNumber',
      field: 'lineNumber',
      valueGetter: params => getDefaultStringEmptyValue(params.data.lineNumber),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, width: 110, autoHeight: true
    },
    {
      headerName: 'FORFAIT', headerTooltip: 'FORFAIT', field: 'forfait',
      valueGetter: params => getDefaultStringEmptyValue(params.data.forfait),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, width: 180, autoHeight: true
    },
    {
      headerName: 'Cession', headerTooltip: 'Cession', field: 'isLineTransfer',
      valueGetter: params => (params.data.isLineTransfer) ? 'oui' : 'non',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, width: 100, autoHeight: true
    },
    {
      headerName: 'Origine de la ligne', headerTooltip: 'Origine de la ligne', field: 'lineOrigin',
      valueGetter: params => getDefaultStringEmptyValue(params.data.lineOrigin),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, width: 130, autoHeight: true
    },
    {
      headerName: 'Tiers payeur', headerTooltip: 'Tiers payeur', field: 'thirdPayerName',
      valueGetter: params => (params.data.hasThirdPayer) ? 'oui' : 'non',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, width: 130, autoHeight: true
    },
    {
      headerName: 'Mode de règlement', headerTooltip: 'Mode de règlement', field: 'paymentMethod',
      valueGetter: params => this.prelevementFormatter(params.data.paymentMethod),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, width: 140, autoHeight: true
    },
    {
      headerName: 'Titulaire', headerTooltip: 'Titulaire', field: 'refLineHolder',
      valueGetter: params => getDefaultStringEmptyValue(params.data.refLineHolder),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, width: 130, autoHeight: true
    },
    {
      headerName: 'utilisateur', headerTooltip: 'utilisateur', field: 'lineUser',
      valueGetter: params => getDefaultStringEmptyValue(params.data.lineUser),
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, width: 170, autoHeight: true
    }
  ];

  detailCellRenderer: any;

  frameworkComponents: any;
  
  constructor() { 
    this.detailCellRenderer = 'detailCellRenderer';
    this.frameworkComponents = { detailCellRenderer: HomologationItemMobileDetailComponent };
  }

  nameUserFormatter (lineUser: string): string {
    if (!isNullOrUndefined(lineUser)) {
      const names = lineUser.split(' ');
      const firstName = (!isNullOrUndefined(name[1])) ? capitalize(names[1]) : '';
      const lastName = (!isNullOrUndefined(name[0])) ? toUpperCase(names[0]) : '';
      return `${firstName}  ${lastName}` ;
    } 
    return '-';
  }
   
  prelevementFormatter(prelevement: string): string {
    if (isNullOrUndefined(prelevement) ) {
      return DEFAULT_STRING_EMPTY_VALUE;
    } 
    return ( PRELEVEMENT_PENICHE_TYPES[prelevement] ) ? PRELEVEMENT_PENICHE_TYPES[prelevement] : DEFAULT_STRING_EMPTY_VALUE;
  }
}
