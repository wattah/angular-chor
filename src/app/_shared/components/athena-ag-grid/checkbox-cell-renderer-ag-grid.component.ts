import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  template: `
    <span [ngClass]="{'checked': checked, 'unchecked': !checked}" (click)="changeSelection()" *ngIf="isVisible" ></span>
    `
})
export class CheckboxCellRendererAgGridComponent implements ICellRendererAngularComp {
  cell: any;
  params: any;
  checked;
  isVisible;
  agInit(params: any): void {
    this.params = params;
    this.cell = { rowIndex: params.rowIndex, row: params.data, colName: params.colDef.headerName };
    this.checked = this.params.data.isAccessibleFromPortal;
    this.isVisible = this.params.data.isAnAuthorizedType;
  }

  changeSelection(): void {
    this.params.context.componentParent.clickLinkBtn( this.params.data );
    this.checked = !this.checked;
  }

  refresh(): boolean {
    return true;
  }
}
