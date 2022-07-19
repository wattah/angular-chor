import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'absNumberFormatter'
})
export class AbsNumberFormatterPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return Math.abs(value).toFixed(2);
  }

}
