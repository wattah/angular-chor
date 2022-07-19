import { Component, Input, EventEmitter, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { isNullOrUndefined } from '../../../_core/utils/string-utils';

@Component({
  selector: 'app-athena-paginated-ag-grid',
  templateUrl: './athena-paginated-ag-grid.component.html',
  styleUrls: ['./athena-paginated-ag-grid.component.scss']
})
export class AthenaPaginatedAgGridComponent implements OnInit, OnChanges {

  currentPage = 1;
  totalPages: number;
  @Input() headerHeight = 40;
  @Input() rowDragManaged: boolean;
  @Input() animateRows: boolean;
  @Input() resize: any;
  @Input() title: string;
  @Input() defaultSortModel: any[];
  @Input() paginationPageSize = 20;
  @Input() columnDefs: Object;
  @Input() rowData: Object[];
  @Input() length: 0;
  @Input() showTopPagination;
  @Input() rowStyle = { cursor: 'pointer' };
  @Input() suppressRowClickSelection: boolean; 
  @Input() goToPageNumber: number; 
  @Input() frameworkComponents: any;
  @Input() getDataPath: any;
  @Input() treeData: boolean;
  @Input() autoGroupColumnDef: any;
  @Input() masterDetail: boolean;
  @Input() detailCellRendererParams: any;
  @Input() detailCellRenderer;
  @Input() detailRowHeight = 60;
  @Input() getRowHeight: any;
  @Input() loadAgGridParams: any;
  @Input() redrawDetailsRows: any;
  @Input() rowId: number;
  @Input() showTotalRows = true;
  @Input() groupDefaultExpanded = 0;
  @Input() enableCellChangeFlash;
  @Input() suppressMoveWhenRowDragging:any;
  @Input() newRowData: any;
  @Input() rowSelection = 'single';
  @Input() expandedAllRows:any

  @Input() collapseAllRows:any;
  @Input() pagination = true;
  @Input() isRowMaster = () => {return true};

  @Output() selectRow: EventEmitter<Object> = new EventEmitter();
  @Output() selectRows: EventEmitter<Object[]> = new EventEmitter();
  @Output() clickedCell: EventEmitter<Object> = new EventEmitter();
  @Output() changedCellValue = new EventEmitter<Object>(null);
  @Output() clickLink: EventEmitter<Object> = new EventEmitter();
  
  ngOnChanges(changes: SimpleChanges): void {
    if(!isNullOrUndefined(this.length) && this.length !== 0) {
      this.totalPages = Math.ceil(this.length / this.paginationPageSize);
    }else if  ( changes['rowData'] && ! isNullOrUndefined(this.rowData) ) {
      this.totalPages = Math.ceil(this.rowData.length / this.paginationPageSize);
    }
    if ( changes['goToPageNumber'] && ! isNullOrUndefined(this.goToPageNumber) ) {
      this.currentPage = this.goToPageNumber;
    }
  }

  ngOnInit(): void {
  }

  goToPage( page: number ): void {
    this.currentPage = page;
  }

  selectRowClick(row: Object): void {
    this.selectRow.emit(row);
  }

  selectRowsClick(event): void {
    this.selectRows.emit(event)
  }

  onClickCell(params: any): void {
    this.clickedCell.emit(params);
  }

  onCellValueChanged( params: any ): void {
    this.changedCellValue.emit(params);
  }
  
  onClickLink(params: any): void {
    this.clickLink.emit(params);
  }

}
