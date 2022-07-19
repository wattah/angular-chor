import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { getHighLightText } from '../../../../_core/utils/formatter-utils';

import { getDefaultStringEmptyValue } from '../../../../_core/utils/string-utils';

@Component({
  selector: 'app-serp-products',
  templateUrl: './serp-products.component.html',
  styleUrls: ['./serp-products.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SerpProductsComponent implements OnInit {
  
  products = [];
  searchPattern = '';
  columnDefs;
  paginationPageSize = 5;
  defaultSortModel: any[];
  constructor( private route: ActivatedRoute ) {
  }

  ngOnInit(): void {
    this.defaultSortModel = [
      { colId: 'designation', sort: 'asc' }
    ];
    this.setColumnRef();
    this.getSearchPatternParam();
    this.getDataFromBackEndToDsiplay();
  }

  getSearchPatternParam(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      this.searchPattern = queryParams.get('search_pattern');
    });
  }

  getDataFromBackEndToDsiplay(): void {
    this.route.data.subscribe(resolversData => {
      this.products = resolversData['products'];
      this.setColumnRef();
    });
  }

  setColumnRef(): void {
    this.columnDefs = [
      {
        headerName: 'REFERENCE',
        width: 200,
        field: 'refrenceProduct',
        cellRenderer: params =>  getHighLightText(params.value.toString(), this.searchPattern),
      },
      {
        headerName: 'DESIGNATION',
        width: 340,
        field: 'designation',
        sort: 'asc',
        valueGetter: params => getDefaultStringEmptyValue(params.data.designation).trim(),
        cellRenderer: params =>  getHighLightText(params.value, this.searchPattern),
        cellClass: 'cell-wrap-text',
        autoHeight: true
      },
      {
        headerName: 'FAMILLE',
        field: 'famille',
        width: 140,
        valueGetter: params => getDefaultStringEmptyValue(params.data.famille).trim(),
        cellRenderer: params =>  getHighLightText(params.value, this.searchPattern),
        cellClass: 'cell-wrap-text',
        autoHeight: true
      },
      {
        headerName: 'CATEGORIE',
        field: 'categorie',
        width: 160,
        valueGetter: params => getDefaultStringEmptyValue(params.data.categorie).trim(),
        cellRenderer: params =>  getHighLightText(params.value, this.searchPattern),
        cellClass: 'cell-wrap-text',
        autoHeight: true
      },
      {
        headerName: 'STOCK',
        field: 'stock',
        valueGetter: params => getDefaultStringEmptyValue(params.data.stock),
        cellRenderer: params =>  getHighLightText(params.value.toString(), this.searchPattern),
        cellClass: 'text-right',
        width: 140
      },
      {
        headerName: '€ TTC',
        field: 'prixTtc',
        valueGetter: params => getDefaultStringEmptyValue(params.data.prixTtc),
        cellClass: 'text-right',
        cellRenderer: params =>  getHighLightText(params.value.toString(), this.searchPattern),
        width: 140
      },
      { headerName: '', width: 80 }
    ];
  }

  rowAction(_row: any): void {
    // axpleTO DO
  }

}
