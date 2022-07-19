import { Pipe, PipeTransform } from '@angular/core';

import { titleFullFormatter } from '../../../_core/utils/formatter-utils';

@Pipe({
  name: 'civility'
})
export class CivilityPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return titleFullFormatter(value);
  }
}
