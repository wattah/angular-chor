import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { SuggestionService } from './../../services/suggestion.service';
import { NEW_SEARCH_BAR } from './../../constants/search-constant';
import { CustomerSearchVO } from '../../models/search/customer-search-vo';

@Injectable({
  providedIn: 'root'
})
export class AllResolver implements Resolve<Observable<CustomerSearchVO[]>> {

  constructor(private readonly suggestionService: SuggestionService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CustomerSearchVO[]> {
    const searchPattern = route.queryParams['search_pattern'];
    const searchType = route.queryParams['searchType'];
    switch(searchType){
      case NEW_SEARCH_BAR.SEARCH_TYPE_ADRESSE_EMAIL:
        return this.suggestionService.emailCustomersSearch(btoa(searchPattern) , true).pipe(
          catchError((e) => of([]))
        );
      case NEW_SEARCH_BAR.SEARCH_TYPE_NUM_COMPTE_FACTURATION:
        return this.suggestionService.autoCompleteSearchByBillNumber(searchPattern , true).pipe(
          catchError((e) => of([]))
        );
      default:
        return this.suggestionService.globalCustomersSearch(searchPattern , true).pipe(
          catchError((e) => of([]))
        );
    }
  }

}
