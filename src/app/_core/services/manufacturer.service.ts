import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ManufacturerVO } from '../models/manufacturer-vo';
import { HttpBaseService } from './http-base.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService extends HttpBaseService<ManufacturerVO> {

  constructor(httpClient: HttpClient) { 
    super(httpClient, 'manufacturer');
  }

  getAllManufacturers(): Observable<ManufacturerVO[]> {
    console.log('here service man');
    return this.httpClient.get<ManufacturerVO[]>(`${environment.baseUrl}/manufacturer/all`);
  }
}
