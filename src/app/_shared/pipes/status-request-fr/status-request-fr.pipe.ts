import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'statusRequestFr'
})
export class StatusRequestFrPipe implements PipeTransform {

  transform(value: any ): any {
    let statut = '-';
    switch ( value ) {
      case 'PENDING': 
        statut = 'En cours'; break;
      case 'CLOSED': 
        statut = 'Terminé'; break;
      case 'REFUSED': 
        statut = 'Annulé'; break;
      default : statut = '-';
    }
    return statut;
  }

}
