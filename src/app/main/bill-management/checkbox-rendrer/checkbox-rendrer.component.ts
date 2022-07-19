import { LivrableVO } from './../../../_core/models/livrable-vo';
import { RelookingLivrablesHolder } from './../relooking-livrables-holder.service';
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

  constructor(private readonly relookingLivrablesHolder: RelookingLivrablesHolder){}

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

  private memorizeChose() {
    const toRelookatLivrable: LivrableVO = this.params.data;
    if (this.checked && !this.relookingLivrablesHolder.toRelookingLivrables.includes(toRelookatLivrable)) {
      this.relookingLivrablesHolder.toRelookingLivrables.push({ ...toRelookatLivrable });
    } else {
      if (!this.checked) {
        this.relookingLivrablesHolder.toRelookingLivrables = this.relookingLivrablesHolder.toRelookingLivrables.filter(livrable => livrable.label !== toRelookatLivrable.label);
      }
    }
  }

  refresh(): boolean {
    return true;
  }
}
