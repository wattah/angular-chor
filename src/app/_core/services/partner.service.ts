import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import { environment } from '../../../environments/environment';
import { PartnerVo } from '../models/partner-vo';

@Injectable({
  providedIn: 'root'
})
export class PartnerService extends HttpBaseService<PartnerVo> {

  constructor(httpClient: HttpClient) { 
    super(httpClient, 'partner');
  }

  getListPartnerOrderByName(): Observable<PartnerVo[]> {
    return this.httpClient.get<PartnerVo[]>(`${environment.baseUrl}/partner/getListPartnerOrderByName`);
  }
}
