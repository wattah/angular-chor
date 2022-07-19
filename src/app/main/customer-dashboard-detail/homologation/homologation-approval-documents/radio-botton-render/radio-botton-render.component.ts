import { generateRandomString, isNullOrUndefined } from '../../../../../_core/utils/string-utils';
import { Component } from '@angular/core';

@Component({
  selector: 'app-radio-botton-render',
  template: `
  <span *ngIf="showButton"
  [ngClass]="{'radio-checked': checkButton, 'radio-unchecked': !checkButton}" 
    (click)="onCick($event)">
  </span>
  `,
  styleUrls: ['./radio-botton-render.component.scss']
})
export class RadioBottonRenderComponent{
  name: string;
  params: any;
  showButton: boolean;
  prefixId: any;
  checkButton = false;
  constructor() { }

  agInit(params: any): void {
    this.params = params;
    this.showButton = params.data.docHierarchy.length !==1;
    this.prefixId = this.params.prefixId
    this.checkButton = this.getConditonByRangButton();
    this.name = generateRandomString(5);
  }
  getConditonByRangButton(): any {
    switch(this.prefixId){
      case 'pre-homo-a-preciser':
        return isNullOrUndefined(this.params.data.isValidatedPreHomologation);
      case 'pre-homo-valid':
        return this.params.data.isValidatedPreHomologation
      case 'pre-homo-invalid':
        return !isNullOrUndefined(this.params.data.isValidatedPreHomologation) && !this.params.data.isValidatedPreHomologation;
      case 'homo-a-preciser':
        return isNullOrUndefined(this.params.data.isValidatedHomologation);
      case 'homo-valid':
        return this.params.data.isValidatedHomologation
      case 'homo-invalid':
        return !isNullOrUndefined(this.params.data.isValidatedHomologation) && !this.params.data.isValidatedHomologation;
      default:
      return false;
    }
  }

  refresh(_params: any): boolean {
    return false;
  }

  onCick(): void {
    this.params.context.componentParent.clickLinkBtn( this.params );
  }

}
