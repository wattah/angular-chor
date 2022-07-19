
import { HttpBaseService } from './http-base.service';
import { OrasPostalAddress } from '../models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
  })
export class OrasAddressService extends HttpBaseService<OrasPostalAddress> {

    constructor(httpClient: HttpClient) {
        super(httpClient, 'oras');
      }


      getFullAdresse(pattern: string): Observable<OrasPostalAddress[]> {
        return this.httpClient
          // tslint:disable-next-line: max-line-length
          .get(`${environment.baseUrl}/${this.endpoint}/fulladdress/${pattern}`)
          .pipe(map((data: any) => data as OrasPostalAddress[]));
      }

}
