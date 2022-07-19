import { Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { AbsenceLight } from '../../../../_core/models/absence-light';
import { UserService } from '../../../../_core/services';

@Component({
  selector: 'app-data-parnasse-back-up-info',
  templateUrl: './data-parnasse-back-up-info.component.html',
  styleUrls: ['./data-parnasse-back-up-info.component.scss']
})
export class DataParnasseBackUpInfoComponent implements OnChanges {

  @Input() userId: number;

  backUp$: Observable<AbsenceLight>; 

  constructor(private readonly userService: UserService) { }

  ngOnChanges(): void {
    if ( !isNullOrUndefined(this.userId)) {
      this.backUp$ = this.getBackUpOfUser(this.userId);
    }
  }

  getBackUpOfUser(idUser: number): Observable<AbsenceLight> {
    return this.userService.getUserBackup(idUser);
  }

}
