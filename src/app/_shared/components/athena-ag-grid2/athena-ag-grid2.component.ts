import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, 
  OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';
import { ServerSideRowModelModule } from '@ag-grid-enterprise/server-side-row-model';

import { isNullOrUndefined } from '../../../_core/utils/string-utils';

@Component({
  selector: 'app-athena-ag-grid2',
  templateUrl: './athena-ag-grid2.component.html',
  styleUrls: ['../athena-ag-grid/athena-ag-grid.component.scss', './athena-ag-grid2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AthenaAgGrid2Component implements OnInit, OnChanges , AfterViewChecked {
 
  @Input() title: string;
  @Input() showTotalRows = true;
  @Input() showTopPagination;

  @Input() columnDefs: any[];
  @Input() rowData: any = [];
  @Input() rowStyle = { cursor: 'pointer' };
  @Input() headerHeight = 40;
  @Input() paginationPageSize = 20;
  
  @Input() defaultSortModel: any[];
  @Input() suppressRowClickSelection: boolean;
  @Input() frameworkComponents: any;
  @Input() treeData: boolean;
  @Input() getDataPath: any;
  @Input() autoGroupColumnDef: any;
  @Input() masterDetail: boolean;
  @Input() detailCellRendererParams: any;
  @Input() detailCellRenderer;
  @Input() detailRowHeight;
  @Input() getRowHeight: any;
  @Input() loadAgGridParams: any;
  @Input() groupDefaultExpanded = 0;
  @Input() expandedAllRows:any
  @Input() collapseAllRows:any;
  @Output() selectRow = new EventEmitter<Object>(null);
  @Output() selectedRows = new EventEmitter<Object[]>(null);
  @Output() clickCell = new EventEmitter<Object>(null);
  @Output() clickLink = new EventEmitter<Object>(null);
  @Output() createServerSideDatasource = new EventEmitter();
  @Input() rowSelection = 'single';
  multiSortKey = 'ctrl';
  gridApi;
  gridColumnApi;
  context;
  domLayout;
  rowHover = -1;
  icons: Object;
  defaultColDef: any;

  rowModelType = 'serverSide';
  @Input() datasource;
  gridParams;
  
  modules = [ ServerSideRowModelModule ];

  @Input() currentPage = 1;
  totalPages: number;
  @Input() totalItems: number;

  constructor() {
    this.rowModelType = 'serverSide';
    this.rowSelection = 'single';
    this.defaultColDef = {
      flex: 1,
      sortable: true,
      resizable: true,
      comparator: (a1 , b1): number => {
        if (typeof a1 === 'string') {
          return a1.trim().localeCompare(b1.trim());
        } 
        return (a1 > b1 ? 1 : (a1 < b1 ? -1 : 0));  
      },
      cellClass: 'cell-wrap-text',
      autoHeight: true 
    };
    this.domLayout = 'autoHeight';
    this.context = { componentParent: this };
    this.icons = this.getIcons();
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ( changes['paginationPageSize'] && !isNullOrUndefined(this.gridApi) && isNullOrUndefined(this.paginationPageSize)) {
      this.gridApi.paginationSetPageSize(this.paginationPageSize);
    }

    if ( changes['loadAgGridParams'] && !isNullOrUndefined(this.gridApi)) {
      this.gridApi.sizeColumnsToFit();
      this.gridApi.refreshCells(this.loadAgGridParams);
    }

    if (changes['datasource']) {
      console.log('*****************************DATASOURCE CHANGE*********************************');
      this.initGrid();
    }
    if (!isNullOrUndefined(this.totalItems) && this.totalItems !== 0) {
      this.totalPages = Math.ceil(this.totalItems / this.paginationPageSize);
    } else {
      this.totalPages = 0;
    }

    if (changes['currentPage'] && !isNullOrUndefined(this.currentPage) && !isNullOrUndefined(this.gridApi)) {
      this.gridApi.paginationGoToPage(this.currentPage - 1);
    } 

    if ( changes['expandedAllRows'] && !isNullOrUndefined(this.gridApi)) {
      this.expandAllNodes(true);
    }

    if ( changes['collapseAllRows'] && !isNullOrUndefined(this.gridApi)) {
      this.expandAllNodes(false);
    }
  }

  expandAllNodes(state: boolean): void {
    this.gridApi.forEachNode((node) => {       
        node.setExpanded(state);
    });
  }

  ngOnInit(): void { 
    this.rowData = !isNullOrUndefined(this.rowData) ? this.rowData : [];
    this.initGrid(); 
  }

  ngAfterViewChecked(): void {
    if (!isNullOrUndefined(this.gridApi)) {
      this.gridApi.paginationGoToPage(this.currentPage - 1);
    }
  }
  
  onGridReady(params: any): void {
    this.gridParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi; 
    params.api.setRowData(this.rowData);
    
    window.addEventListener('resize', () => {
      setTimeout(() => {
        params.api.setRowData(this.rowData);
        params.api.sizeColumnsToFit();
      });
    });
    params.api.setSortModel(this.defaultSortModel);
    console.log('*****************************GRID READY*********************************');
    
    this.onCreateServerSideDatasource();
    this.initGrid();
    params.api.sizeColumnsToFit();
  }
 
  onSelectionChanged(_params2: any): void {
    this.selectRow.emit(this.gridApi.getSelectedRows()[0]);
    this.selectedRows.emit(this.gridApi.getSelectedRows());
  }


  onColumnResized(params: any): void {
    params.api.resetRowHeights();
  }

  clickLinkBtn( cell: any): void {
    this.clickLink.emit( cell );
  }

  onCellClicked( params: any): void {
    this.clickCell.emit(params);
  }

  getIcons(): Object {
    return {
      sortAscending: '<i class="icon clickable sort-desc"/>',
      sortDescending: '<i class="icon clickable sort-asc "/>'
    };
  }

  onPaginationChanged(_params: any): void {
    if (this.gridApi) {
      this.currentPage = this.gridApi.paginationGetCurrentPage() + 1;    
    }
  }

  initGrid(): void {
    if ( !isNullOrUndefined(this.gridApi)) {
      this.gridApi.setServerSideDatasource(this.datasource);
      this.gridApi.sizeColumnsToFit();
      this.gridApi.refreshCells(this.gridParams);
    }
  }

  onCreateServerSideDatasource(): void {
    console.log('*****************************CATCH*********************************');
    this.createServerSideDatasource.emit();
  }

  reloadGridAfterSortChanged(_event: any): void {
    this.initGrid();
    this.currentPage = 1;
  }

  goToPage( page: number ): void {
    this.currentPage = page;
  }

}
