import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { EntityBase } from '../../_core/models/entity-base';
import { QueryOptions } from './query-options';

/**
 * Service pour gérer les requêtes http
 */
export class HttpBaseService<T extends EntityBase> {
  /**
   * 
   * @param httpClient 
   * @param endpoint 
   */
  constructor(
    public httpClient: HttpClient,
    public endpoint: string) {}

  /**
   * 
   * @param item 
   */
  create(item: T): Observable<T> {
    return this.httpClient
    .post<T>(`${environment.baseUrl}/${this.endpoint}`, item)
    .pipe(map(data => <T>data));
  }

  /**
   * 
   * @param item 
   */
  update(item: T): Observable<T> {
    return this.httpClient
    .put<T>(`${environment.baseUrl}/${this.endpoint}/${item.id}`, item)
    .pipe(map(data => <T>data));
  }

  /**
   * 
   * @param id 
   */
  getOne(id: number): Observable<T> {
    return this.httpClient
    // .get(`${this.url}/${this.endpoint}/${id}`)
      .get(`${environment.baseUrl}/${this.endpoint}`)
    .pipe(map((data: any) => <T>data));
  }

  /**
   * 
   * @param queryOptions 
   */
  list(queryOptions: QueryOptions): Observable<T[]> {
    return this.httpClient
    .get(`${environment.baseUrl}/${this.endpoint}?${queryOptions.toQueryString()}`)
    .pipe(map((data: any) => <T[]>data));
  }

  /**
   * 
   * @param id 
   */
  delete(id: number): void {
    this.httpClient.delete(`${environment.baseUrl}/${this.endpoint}/${id}`);
  }
}
