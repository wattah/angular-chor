import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { RelookingBillLotService } from '../bills/relooking-bill-lot.service';
import { LivrableVO } from '../../../_core/models/livrable-vo';

@Component({
  template: `
    <span [ngClass]="{'checked': checked, 'unchecked': !checked}" (click)="changeSelection()"  ></span>
    `
})
export class CheckboxRendrerComponent implements ICellRendererAngularComp {
  cell: any;
  params: any;
  checked;

  constructor(private readonly relookingBillLotService: RelookingBillLotService) {
  }

  agInit(params: any): void {
    this.params = params;
    this.cell = { rowIndex: params.rowIndex, row: params.data, colName: params.colDef.headerName };
    this.checked = this.params.data.isAccessibleFromPortal;
  }

  changeSelection(): void {
    this.params.context.componentParent.clickLinkBtn( this.params.data );
    this.checked = !this.checked;
    const selectedLivrable: LivrableVO = this.params.data;
    if(this.checked && !this.relookingBillLotService.livrablesToRelooking.includes(selectedLivrable)) {
    this.relookingBillLotService.livrablesToRelooking.push({ ...selectedLivrable});
    } else if(!this.checked){
      this.relookingBillLotService.livrablesToRelooking = this.relookingBillLotService.livrablesToRelooking.filter(livrable => livrable.label !== selectedLivrable.label);
    }
  }

  refresh(): boolean {
    return true;
  }
}
