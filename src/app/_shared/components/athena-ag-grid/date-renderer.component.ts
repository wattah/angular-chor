import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-date-editor-cell',
  template: `
   
    <div class="d-flex" *ngIf ="dataId">
        <span class="d-inline" style="width:70%" > {{ selectedDate | dateFormatPipeFrench }} </span>
        <span  class="text-right icon icon-marged calendar-grey clickable " style="margin-top:1px" (click)="pickerDate.open()" ></span>
        <input  class="d-inline" style="width:0%"  hidden  matInput [ngModel]="selectedDate" 
           [matDatepicker]="pickerDate" (dateChange)="onDateSelect($event)" placeholder="" readonly >
        <mat-datepicker #pickerDate></mat-datepicker>
    </div>
  `
})
export class DatePickerComponent implements ICellRendererAngularComp {
   
  params: any;

  selectedDate: any;
  dataId: any;
  type;

  agInit(params: any): void {
    this.params = params;
    this.dataId = this.params.data.id;
    this.selectedDate = params.value;
  }

  getValue(): any {
    return this.selectedDate;
  }

  isPopup(): boolean {
    return true;
  }

  refresh(): boolean {
    return true;
  }

  onDateSelect(event: any): void {
    this.selectedDate = event.value;
    this.params.setValue(this.selectedDate);
    this.params.context.componentParent.clickLinkBtn( this.params );
  }
 
}
