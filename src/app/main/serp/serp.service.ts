import { Injectable } from '@angular/core';

import { Person } from '../../_core/models/person';

@Injectable({
  providedIn: 'root'
})
export class SerpService {
  getPersonImage(person: Person): string {
    let pictoName: string;
    if (person.idCustomer !== null) {
      if (person.category === 'ENTREPRISE') {
        pictoName = 'entreprise.svg';
      } else if (person.companyNameParentId !== null) {
        pictoName = 'beneficiaire.svg';
      } else {
        pictoName = 'particulier.svg';
      }
    }
    return pictoName;
  }
}
