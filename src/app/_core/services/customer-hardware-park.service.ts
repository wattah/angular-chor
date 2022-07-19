import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CustomerHardwareParkItemVO } from '../models/models';
import { CustomerParcServiceVO } from '../models/customer-parc-service-vo';
import { HttpBaseService } from './http-base.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerHardwareParkService extends HttpBaseService<CustomerHardwareParkItemVO> {

  constructor(httpClient: HttpClient) { 
    super(httpClient, 'costumer-hardware-park-item');
  }

  //doesn't work exceeds numbers of joints
  getHardwareParkByCustomerId(idCustomer: string): Observable<CustomerHardwareParkItemVO[]> {
    return this.httpClient.
    get<CustomerHardwareParkItemVO[]>
    (`${environment.baseUrl}/costumer-hardware-park-item/getallcustomerhardwarepark?idCustomer=${idCustomer}`);
  }

  getFullCustomerHardwarePark(idCustomer: string): Observable<CustomerParcServiceVO[]> {
    console.log('getFullCustomerHardwarePark');
    return this.httpClient.
    get<CustomerParcServiceVO[]>
    (`${environment.baseUrl}/costumer-hardware-park-item/getfullcustomerhardwarepark?idCustomer=${idCustomer}`);
  }

  //this is the final 
  getAllHardwareParkItems(customerId: string): Observable<CustomerHardwareParkItemVO[]> {
    return this.httpClient.
    get<CustomerHardwareParkItemVO[]>(`${environment.baseUrl}/costumer-hardware-park-item/getAllCHPI?customerId=${customerId}`);
  }

  getCustomerHardwareByHradwareId(hardwareId: number): Observable<CustomerHardwareParkItemVO> {
    return this.httpClient.
    get<CustomerHardwareParkItemVO>(`${environment.baseUrl}/costumer-hardware-park-item/${hardwareId}`);
  }
}
