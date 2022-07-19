import { fullNameFormatter } from '../../_core/utils/formatter-utils';
import { isNullOrUndefined } from '../../_core/utils/string-utils';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullNameFormatter'
})
export class FullNameFormatterPipe implements PipeTransform {

  transform(object: {lastName: string , firstName: string}, sep: string = ' '): any {
    return !isNullOrUndefined(object) ? fullNameFormatter(null , object.firstName , object.lastName , sep ):'';
  }

}
