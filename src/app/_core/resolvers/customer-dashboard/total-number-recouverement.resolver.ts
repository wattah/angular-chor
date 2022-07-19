import { PersonService } from './../../services/person.service';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { isNullOrUndefined } from '../../utils/string-utils';

@Injectable({
    providedIn: 'root'
  })
export class TotalNumberRecouverementResolver implements Resolve<Observable<number>> {
    customerId: string;
    constructor(private readonly personService: PersonService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<number> {
        this.customerId = route.paramMap.get('customerId');
        if (isNullOrUndefined(this.customerId)) {
          this.customerId = route.parent.paramMap.get('customerId');
        }
        return this.personService.getTotalNumberOfRecouverement(this.customerId);
    }

}