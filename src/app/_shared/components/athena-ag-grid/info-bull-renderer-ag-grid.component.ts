import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-info-bull-renderer-ag-grid',
  template: `
        <div class="info">
        <div class="row ">       
            <span class="icon help-grey clickable col-2" (click)="onClick()"></span>
            <span class="title col-20"> description </span>
            <span  class="icon close col-2 clickable" (click)="onClick()"> </span>
        </div>
        <div class="row">
            <div class="col-24">
                {{ ( params.value) ? params.value : '-' }}
            </div>
        </div>
    </div>
    `,
  styles: [`
    .info {
      font-size: 10px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 2.2;
        letter-spacing: normal;
        color: #000;
        padding: 5px;
        margin: 0px;
        overflow-wrap: break-word;
        word-wrap: break-word;
        background-color: #fff;
        text-align: left;
        width: 252px;
        height: auto !important;
    }
    .title {
        text-align: center;
    }
    .description {
        text-align: left;
        padding-top: 2%;
    }

    `]
})
export class InfoBullRendererAgGridComponent implements ICellEditorAngularComp, AfterViewInit {
  
  params: any;

  @ViewChild('container', { read: ViewContainerRef, static: false }) container;
  
  ngAfterViewInit(): void {
  }

  agInit(params: any): void {
    this.params = params;
  }

  getValue(): any {
    return this.params.value;
  }

  isPopup(): boolean {
    return true;
  }

  onClick(): void {
    this.params.api.stopEditing();
  }
}
