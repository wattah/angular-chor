import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-radio-button-renderer',
  template: `
      <span *ngIf ="dataId"
        [ngClass]="{'radio-checked': params.valueFormatted, 'radio-unchecked': !params.valueFormatted}" 
        (click)="handleChange()"  >
      </span>
    `
})

export class RadioButtonRendererComponent implements ICellRendererAngularComp {
  
  params: any;
  dataId: any ;
  prefixId: string;

  prefixName: string;

  returnedValue: any;

  agInit(params: any): void {
    this.params = params;
    this.dataId = this.params.data.id ;
    this.prefixId = this.params.prefixId + this.params.data.id;
    this.prefixName = this.params.prefixName + this.params.data.id;
    this.returnedValue = this.params.returnedValue;
  }

  refresh(_params: any): boolean {
    return false;
  }
    
  handleChange(): void {
    this.params.context.componentParent.clickLinkBtn( this.params );
  }
}
