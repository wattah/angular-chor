import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceur'
})
export class ReplaceurPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.replace('#', '');
  }

}
