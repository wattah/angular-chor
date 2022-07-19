import { Component } from '@angular/core';
import { ExcelError50dVo } from '../../../_core/models/erreur-excel-50-d-response-vo';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';

@Component({
  selector: 'app-loading-fifty-renderer',
  templateUrl: './loading-fifty-renderer.component.html',
  styleUrls: ['./loading-fifty-renderer.component.scss']
})
export class LoadingFiftyRendererComponent {

  errorList: ExcelError50dVo[] = [];


  agInit(params: any): void {
    if(!isNullOrUndefined(params) &&
      !isNullOrUndefined(params.data) &&
      !isNullOrUndefined(params.data.excelError50dList)) {
        this.errorList = params.data.excelError50dList;
      }
  }

}
