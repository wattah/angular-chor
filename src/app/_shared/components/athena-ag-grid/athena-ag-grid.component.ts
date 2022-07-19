import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, 
  OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';

import { LinkRendererAgGridComponent } from './link-renderer-ag-grid.component';
import { SearchBtnRendererAgGridComponent } from './search-btn-renderer-ag-grid.component';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { InfoBullRendererAgGridComponent } from './info-bull-renderer-ag-grid.component';
import { CheckboxCellRendererAgGridComponent } from './checkbox-cell-renderer-ag-grid.component';

@Component({
  selector: 'app-athena-ag-grid',
  templateUrl: './athena-ag-grid.component.html',
  styleUrls: ['./athena-ag-grid.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AthenaAgGridComponent implements OnInit, OnChanges , AfterViewChecked {
 
  @Input() columnDefs: any[];
  @Input() rowData: any = [];
  @Input() rowStyle = { cursor: 'pointer' };
  @Input() headerHeight = 40;
  @Input() paginationPageSize = 20;
  @Input() currentPage: number;
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
  @Input() rowDragManaged: boolean;
  @Input() newRowData: any;
  @Input() loadAgGridParams: any;
  @Input() redrawDetailsRows: any;
  @Input() enableCellChangeFlash;
  @Input() groupDefaultExpanded = 0;
  @Input() expandedAllRows: any;
  @Input() collapseAllRows: any;
  @Input() suppressMoveWhenRowDragging: any;
  @Input() resize: any;
  @Input() pagination = true;
  @Input() isRowMaster = () => { return true};
  @Output() selectRow = new EventEmitter<Object>(null);
  @Output() selectRows = new EventEmitter<Object[]>(null);
  @Output() clickCell = new EventEmitter<Object>(null);
  @Output() clickLink = new EventEmitter<Object>(null);
  @Output() changedCellValue = new EventEmitter<Object>(null);
  @Output() onDragEndOnRow = new EventEmitter<Object>(null);
  multiSortKey = 'ctrl';
  gridApi;
  gridColumnApi;
  @Input() rowSelection = 'single';
  context;
  domLayout;
  rowHover = -1;
  icons: Object;
  defaultColDef: any;
  
  constructor() {
    this.context = { componentParent: this };
    this.domLayout = 'autoHeight';
    this.icons = this.getIcons();
    this.frameworkComponents = {
      searchBtnRendererComponent: SearchBtnRendererAgGridComponent, 
      linkRendererComponent: LinkRendererAgGridComponent,
      infoBullRendererComponent: InfoBullRendererAgGridComponent,
      checkboxCellRendererComponent: CheckboxCellRendererAgGridComponent
    };
    this.defaultColDef = {
      flex: 1,
      cellClass: 'cell-wrap-text',
      autoHeight: true,
      enableSorting: true,
      enableColResize: true,
      comparator: (a , b): number => {
        if (typeof a === 'string') {
          return a.trim().localeCompare(b.trim());
        } 
        return (a > b ? 1 : (a < b ? -1 : 0));  
      },
      sortable: true
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentPage'] && !isNullOrUndefined(this.currentPage) && !isNullOrUndefined(this.gridApi)) {
      this.gridApi.paginationGoToPage(this.currentPage - 1);
    } 

    if ( changes['paginationPageSize'] && !isNullOrUndefined(this.gridApi) && isNullOrUndefined(this.paginationPageSize)) {
      this.gridApi.paginationSetPageSize(this.paginationPageSize);
    }

    if ( changes['loadAgGridParams'] && !isNullOrUndefined(this.gridApi)) {
      this.gridApi.refreshCells(this.loadAgGridParams);
    }

    if ( changes['redrawDetailsRows'] && !isNullOrUndefined(this.gridApi)) {
      this.gridApi.redrawRows();
    }

    this.resizeColumns(changes);

    if ( changes['newRowData'] && !isNullOrUndefined(this.gridApi)) {
         this.gridApi.setRowData(this.newRowData) ;
    }

    if ( changes['expandedAllRows'] && !isNullOrUndefined(this.gridApi)) {
      this.expandAllNodes(true);
    }

    if ( changes['collapseAllRows'] && !isNullOrUndefined(this.gridApi)) {
      this.expandAllNodes(false);
    }

    if (changes['defaultSortModel'] && !isNullOrUndefined(this.gridColumnApi)) {
    this.gridColumnApi.applyColumnState({ state: this.defaultSortModel });
    }
    
  }

  ngOnInit(): void { 
    this.rowData = !isNullOrUndefined(this.rowData) ? this.getData() : []; 
  }

  ngAfterViewChecked(): void {
    if (!isNullOrUndefined(this.gridApi)) {
      this.gridApi.paginationGoToPage(this.currentPage - 1);
    }
  }

  getData(): any {
    return this.rowData;
  }
  
  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi; 
    params.api.setRowData(this.getData());
    params.api.sizeColumnsToFit();
    window.addEventListener('resize', () => {
      setTimeout(() => {
        params.api.setRowData(this.getData());
        params.api.sizeColumnsToFit();
      });
    });
    params.columnApi.applyColumnState({ state: this.defaultSortModel });
  }

  onColumnResized(params: any): void {
    params.api.resetRowHeights();
  }

  onSelectionChanged(_params: any): void {
    if(this.gridApi){
    const selectedRow = this.gridApi.getSelectedRows()[0];
    this.selectRow.emit(selectedRow);
    const selectedRows  = this.gridApi.getSelectedRows();
    this.selectRows.emit(selectedRows);
    }
  }

  onCellClicked( params: any): void {
    this.clickCell.emit(params);
  }

  clickLinkBtn( cell: any): void {
    this.clickLink.emit( cell );
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

  onCellValueChanged( params: any ): void {
    this.changedCellValue.emit(params);
  }
  
  expandAllNodes(state: boolean): void {
    this.gridApi.forEachNode((node) => {       
        node.setExpanded(state);
    });
  }

  resizeColumns(changes: SimpleChanges): void {
    if ( changes['resize'] && !isNullOrUndefined(this.gridApi)) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  onRowDragEnd(event){
    this.onDragEndOnRow.emit(event);
  }

}
