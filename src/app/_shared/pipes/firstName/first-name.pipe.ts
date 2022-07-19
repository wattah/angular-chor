import { Pipe, PipeTransform } from '@angular/core';

import { firstNameFormatter } from '../../../_core/utils/formatter-utils';


@Pipe({
  name: 'firstName'
})
export class FirstNamePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return firstNameFormatter(value);
  }
}
