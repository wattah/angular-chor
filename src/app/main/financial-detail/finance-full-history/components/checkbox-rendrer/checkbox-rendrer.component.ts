import { BillDownloadService } from './../bill-download.service';
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  template: `
    <span [ngClass]="{'checked': checked, 'unchecked': !checked}" (click)="changeSelection()"  ></span>
    `
})
export class CheckboxRendrerComponent implements ICellRendererAngularComp {
  cell: any;
  params: any;
  checked;

  constructor(private readonly billDownloadService: BillDownloadService){

  }

  agInit(params: any): void {
    this.params = params;
    this.cell = { rowIndex: params.rowIndex, row: params.data, colName: params.colDef.headerName };
    this.checked = this.params.data.isAccessibleFromPortal;

  }

  changeSelection(): void {
    this.params.context.componentParent.clickLinkBtn( this.params.data );
    this.checked = !this.checked;
    this.memorizeChose();
  }
  memorizeChose() {
    const filename = this.params.data.factureFileName
    if(this.checked && !this.billDownloadService.files.includes(filename)){
      this.billDownloadService.files.push(filename);
    }else{
      if(!this.checked){
        this.billDownloadService.files = this.billDownloadService.files.filter(file => file !== filename);
      }
    }
  }

  refresh(): boolean {
    return true;
  }




}
