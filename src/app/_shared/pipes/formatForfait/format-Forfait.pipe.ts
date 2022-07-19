import { Pipe, PipeTransform } from '@angular/core';

import { formatForfait } from '../../../_core/utils/formatter-utils';

@Pipe({
  name: 'forfait'
})
export class FormatForfaitPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return formatForfait(value);
  }
}
