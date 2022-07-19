import { catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { PersonNoteService } from 'src/app/_core/services/person-note.service';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit
} from '@angular/core';

import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { PersonNoteVo } from '../../../_core/models/person-note';
import { getCustomerIdFromURL } from '../customer-dashboard-utils';
import { of } from 'rxjs';
import { GassiMockLoginService } from '../../../_core/services';

@Component({
  selector: 'app-good-to-know',
  templateUrl: './good-to-know.component.html',
  styleUrls: ['./good-to-know.component.scss']
})
export class GoodToKnowComponent implements OnInit {
  @Input()
  goodToKnow: PersonNoteVo;
  personIdNote
  inCompleteCall = true;
  
  isNotElligible = false;
  customerId: string;
  constructor(
    private readonly personNoteService: PersonNoteService,
    private readonly route: ActivatedRoute,
    private readonly mockLoginService: GassiMockLoginService,
  ) {}

  goodToKnowFetch(): void {
    if (!isNullOrUndefined(this.goodToKnow)) {
      this.goodToKnow = {
        ...this.goodToKnow,
        value: this.goodToKnow.value,
        lastNameAuthor: this.goodToKnow.lastNameAuthor,
        firstNameAuthor: this.goodToKnow.firstNameAuthor,
        dateNote: this.goodToKnow.dateNote
      };
    }
  }

  ngOnInit() {
    this.isNotElligible= false;
    this.mockLoginService.getCurrentConnectedUser().subscribe((user) => {
      const NAME_OF_ROLE = "ADMINISTRATEUR";
      this.isNotElligible = false;
      if (user !==null && user.activeRole !== null && user.activeRole.roleName !== null && user.activeRole.roleName === NAME_OF_ROLE) {
        this.isNotElligible = true;
      }
    });
    this.inCompleteCall = true;
    this.route.paramMap.subscribe(params => {
      this.customerId = params.get('customerId');
      return this.personNoteService
      .getGoodToKnow(this.customerId)
      .pipe(catchError(() => of(null)))
      .subscribe(
        goodToKnow => {this.goodToKnow = goodToKnow},
        (error)=>{this.inCompleteCall = false;},
        () => {
          if (!isNullOrUndefined(this.goodToKnow)) {
          this.personIdNote = this.goodToKnow.personId
          }
          this.goodToKnowFetch();
          this.inCompleteCall = false;
        }
        );
    });
      }
  
  capitalizeWord(word: string): string {
    return isNullOrUndefined(word) || word === ''
      ? ''
      : word[0].toUpperCase() + word.substr(1);
  }
}
