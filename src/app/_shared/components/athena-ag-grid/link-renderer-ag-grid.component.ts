import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  template: `
    <span (click)='click()' class='link' [ngClass]="params.classCSS"> {{ params.valueFormatted }} </span>
    `
})
export class LinkRendererAgGridComponent implements ICellRendererAngularComp {
  cell: any;
  params: any;

  agInit(params: any): void {
    this.params = params;
    console.log(params);
    this.cell = { rowIndex: params.rowIndex, row: params.data, colName: params.colDef.headerName };
  }

  click(): void {
    console.log(this.params);
    this.params.context.componentParent.clickLinkBtn( this.cell );
  }

  refresh(): boolean {
    return true;
  }
}
