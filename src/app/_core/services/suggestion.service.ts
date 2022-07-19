import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { HttpBaseService } from './http-base.service';
import { SuggestionVO } from '../../_core/models/suggestion-vo';
import { Customer } from '../../_core/models/customer';
import { CustomerSearchVO } from '../models/search/customer-search-vo';
import { ProductSearchVO } from '../models/search/product-search-vo';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService extends HttpBaseService<SuggestionVO> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'suggestions');
  }

  updateSuggestion(id: string, userId: string): Observable<Customer> {
    return this.httpClient
  .get(`${environment.baseUrl}/${this.endpoint}/update?id=${id}&userId=${userId}`)
      .pipe(map((data: any) => <Customer>data));
  }

  autoCompleteSearchByBillNumber(keyWord: string , isSERPSearch: boolean): Observable<CustomerSearchVO[]> {
    return this.httpClient
      .get<CustomerSearchVO[]>(`${environment.baseUrl}/${this.endpoint}/autoCompleteSearchByBillNumber/${keyWord}/${isSERPSearch}`)
  }

  globalCustomersSearch(searchKey: string , isSERPSearch : boolean): Observable<CustomerSearchVO[]>{
    return this.httpClient.get<CustomerSearchVO[]>(`${environment.baseUrl}/${this.endpoint}/globalCustomersSearch/${searchKey}/${isSERPSearch}`);
  }

  emailCustomersSearch(searchKey: string , isSERPSearch : boolean): Observable<CustomerSearchVO[]>{
    return this.httpClient.get<CustomerSearchVO[]>(`${environment.baseUrl}/${this.endpoint}/emailCustomersSearch/${searchKey}/${isSERPSearch}`);
  }

  imeiNumberSerialSearch(searchKey: string): Observable<ProductSearchVO[]>{
    return this.httpClient.get<ProductSearchVO[]>(`${environment.baseUrl}/${this.endpoint}/imeiNumberSerialSearch/${searchKey}`);
  }

  
}
