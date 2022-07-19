import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs' ;
@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  readonly data = new BehaviorSubject(false);
  readonly isRefresh = new BehaviorSubject(false);
  data$ = this.data.asObservable();
  isRefresh$ = this.isRefresh.asObservable(); 

  changeValueShowLink360(data: boolean) {
    this.data.next(data)
  }

  changeRefresh(data: boolean) {
    this.isRefresh.next(data);
  }
}
