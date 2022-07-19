import { Pipe, PipeTransform, Injectable } from '@angular/core';

import { isNullOrUndefined, isNumber } from '../../../_core/utils/string-utils';

@Injectable({
  providedIn: 'root'
})

@Pipe({
  name: 'ligne'
})
export class LignePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if(!isNumber(value)) {
      return '-';
    }
    if (!isNullOrUndefined(value) && value.length !== 0) {
      return value.replace(/(\d{2})/g, '$1 ').replace(/(^\s+|\s+$)/, '');
    }
    return '-';
  }
}
