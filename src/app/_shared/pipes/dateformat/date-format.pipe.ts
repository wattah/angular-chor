import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

import { isNullOrUndefined } from '../../../_core/utils/string-utils';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'dateFormatPipeFrench'
})
export class DateFormatPipeFrench implements PipeTransform {

  transform(value: string, args?: any): any {
    if(value === '-'){
      return '-';
    }
    if (!isNullOrUndefined(value)) {
      const datePipe = new DatePipe('fr-FR');
      const datePipeEn = new DatePipe('en-US');
      value = datePipe.transform(datePipeEn.transform(value, 'fullDate'), 'dd MMM yyyy');
      value = value.replace('juil', 'juill');
      return value;
    }
    return '-';
  }
}
