import { Component } from '@angular/core';
import {IHeaderAngularComp} from '@ag-grid-community/angular';
import {IHeaderParams} from '@ag-grid-community/core';
import { isNullOrUndefined } from '../../_core/utils/string-utils';
import { RequestMonitoringService } from './request-monitoring.service';

//------------------------------------------------------------------------------
@Component({
  template: `
  <p class="underline m-0 text-center">Debloquer </p>
  <span class="text-min no-transform">Tout sélectionner</span>
  <div class="d-flex justify-content-center customcheckbox">
      <input  [(ngModel)]="isChecked" (change)="clickCheckbox()" type="checkbox"  [ngClass]="{'checked': checked, 'unchecked': !checked}">
  </div>
  `,
})
export class GridUnblockActionComponent implements IHeaderAngularComp {
  cell: any;
  params: any;
  checked;
  isChecked = false;
  
  refresh;
  constructor(private readonly requestMonitoringService:RequestMonitoringService) {
  }


  agInit(params: IHeaderParams): void {
    this.params=params;
    this.requestMonitoringService.isCheckedBlockingCheckBox$.subscribe(data => {
      this.isChecked = data;
    })
    this.params.api.addEventListener('paginationChanged', (e) =>{
      this.requestMonitoringService.isRowDataReady$.subscribe(data => {
        if(data === true && !isNullOrUndefined(e) && e.newPage === true) {
         this.resetPaginationSelection();
       }
      });
    });
}  

resetPaginationSelection = () => {
  this.deSelectNodes();
  if(this.isChecked === true ) {
    this.selectNodes();
  }
};

deSelectNodes(): void {
  this.params.api.getSelectedNodes().forEach(node => {
    node.setSelected(false);
  });
}

clickCheckbox(): void {
    if(this.isChecked === true) {
        this.deSelectNodes();
        this.selectNodes();
    } else {
      this.deSelectNodes();
    }
}

  selectNodes(): void {
    //Initialize pagination data
    let paginationSize = this.params.api.paginationGetPageSize();
    let currentPageNum = this.params.api.paginationGetCurrentPage() + 1;

    
   let currentPageRowStartIndex = ((currentPageNum - 1) * paginationSize);
   let currentPageRowLastIndex =  (currentPageNum * paginationSize);

      for(let i = currentPageRowStartIndex; i < currentPageRowLastIndex; i++)
        {
          if(!isNullOrUndefined(this.params.api.getDisplayedRowAtIndex(i))) {
            this.params.api.getDisplayedRowAtIndex(i).setSelected(true);
          }
       }
    }
}
