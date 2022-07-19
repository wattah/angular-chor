import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-search-btn-renderer-ag-grid',
  template: `
   <span *ngIf="params.data.hover" class="icon see-more"></span>
  `
})
export class SearchBtnRendererAgGridComponent implements ICellRendererAngularComp {
  params: any;
  show = true;

  agInit(params: any): void {
    this.params = params;
    this.show = (this.params.rowIndex === params.rowHover);
  }

  invokeParentMethod(): void {
    this.params.context.componentParent.clickBtnSearch( { 'row' : this.params.node.rowIndex, 'person': this.params.data });
  }

  refresh(params: any): boolean {
    this.params = params;
    this.show = (this.params.rowIndex === params.rowHover);
    return true;
  }

}
