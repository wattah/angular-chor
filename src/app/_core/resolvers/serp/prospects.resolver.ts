import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PersonService } from '../../services';
import { Person } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class ProspectsResolver implements Resolve<Observable<Person[]>> {

  constructor(private personService: PersonService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Person[]> {
    const searchPattern = route.queryParams['search_pattern'];
    return this.personService.getProspects(searchPattern);
  }
}
