import { Pipe, PipeTransform } from '@angular/core';
import { RESOLUTION_REQUEST_STATUS } from '../../../_core/constants/constants';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';

@Pipe({
  name: 'resolutionRequest'
})
export class ResolutionRequestPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    const state = RESOLUTION_REQUEST_STATUS[value];
    if (! isNullOrUndefined(state)) {
      return state.label;
    }
    return '-';
  }

}
