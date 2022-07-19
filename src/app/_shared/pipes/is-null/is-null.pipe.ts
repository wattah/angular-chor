import { Pipe, PipeTransform } from '@angular/core';

import { getDefaultStringEmptyValue } from '../../../_core/utils/string-utils';

@Pipe({
  name: 'isNull'
})
export class IsNullPipe implements PipeTransform {

  transform(value: any, ..._args: any[]): any {
    return getDefaultStringEmptyValue(value);
  }

}
