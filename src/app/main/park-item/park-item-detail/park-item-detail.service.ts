import { Injectable } from '@angular/core';
import { NestedOfferVO } from '../../../_core/models/nested-offer-vo';
import { PARK_OFFER_STATUS } from '../../../_core/constants/constants';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ParkItemService {

    selectedWebserviceIdentifier$ =  new  BehaviorSubject(null);

    /**
     * pour calculer le nombre de la liste des parents en cas de tree data (pagination)
     * @param values
     */
getLengthDetailInternet(values: NestedOfferVO[]): number {
  let size = 0;
     for (const value of values) {
       if(!value.name.includes('/')) {
         size ++;
       }
      }
        return size;
  }

   getArrowImage(param1: boolean , param2 : number): string {
        return (param1 === true || param2 === 0)
          ? 'status-green-teleco'
          : 'status-red-teleco';
     }

/**
 *
 * @param value pour afficher icon statut
 */
    getStatusChildren(value: number, children: []): string {
        if(children.length === 0) {
          return '';
        }
        if(value === PARK_OFFER_STATUS.ACTIVE.Ordinal) {
              return `<span class='icon status-green-teleco' ></span>`;
        } else {
            return `<span class='icon status-red-teleco' ></span>`;
        }
    }


    selectWebserviceIdentifier( webserviceIdentifier: string): void {
      this.selectedWebserviceIdentifier$.next(webserviceIdentifier);
    }

    getSelectedWebserviceIdentifier(): BehaviorSubject<string> {
      return this.selectedWebserviceIdentifier$;
    }
}
