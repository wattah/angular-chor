import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestMonitoringService {

  isCheckedBlockingCheckBox$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isRowDataReady$: BehaviorSubject<boolean> = new BehaviorSubject(false);

constructor() { }

}
