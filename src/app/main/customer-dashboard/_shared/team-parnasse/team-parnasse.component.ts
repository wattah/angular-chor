import { UserService } from './../../../../_core/services/user-service';
import { AbsenceLight } from './../../../../_core/models/absence-light';
import { Observable } from 'rxjs';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { isNullOrUndefined, getDefaultStringEmptyValue } from '../../../../_core/utils/string-utils';
import { fullNameFormatter, firstNameFormatter } from './../../../../_core/utils/formatter-utils';
import { CONSTANTS } from 'src/app/_core/constants/constants';

@Component({
  selector: 'app-team-parnasse',
  templateUrl: './team-parnasse.component.html',
  styleUrls: ['./team-parnasse.component.scss']
})
export class TeamParnasseComponent implements OnChanges {
  coach: string = '';

  desk: string = '';

  adesion: string = '';

  emailDesk: string = '';

  emailCoach: string = '';

  emailAdhesion: string = '';

  skypeUrl: string;

  backUpCoach$: Observable<AbsenceLight>; 

  backUpDesk$: Observable<AbsenceLight>;

  @Input()
  referents: any[] = [];

  constructor(private sanitizer: DomSanitizer , private readonly userService: UserService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['referents'] && !isNullOrUndefined(this.referents)) {
      this.initReferent();
      this.getDeskAndCoach();
    }
  }
  /**
	 *  une methode qui recupère le nom et l'email des referetns
	 */
  getDeskAndCoach(): void {
    this.referents.forEach(element => {
      if (element.roleId === CONSTANTS.ROLE_DESK) {
        this.desk = this.buildName(element.firstName, element.lastName);
        this.backUpDesk$ = this.getBackUpOfUser(element.userId);
        if (!isNullOrUndefined(element.email)) {
          this.emailDesk = element.email;
        }
      } else if (element.roleId === CONSTANTS.ROLE_COACH) {
        this.coach = this.buildName(element.firstName, element.lastName);
        this.backUpCoach$ = this.getBackUpOfUser(element.userId);
        if (!isNullOrUndefined(element.email)) {
          this.emailCoach = element.email;
        }
      } else if (element.roleId === CONSTANTS.ROLE_ADHESION) {
        this.adesion = this.buildName(element.firstName, element.lastName);
        if (!isNullOrUndefined(element.email)) {
          this.emailAdhesion = element.email;
        }
      }
    });
  }

  backupFullName(backup: AbsenceLight): string {
    return `${getDefaultStringEmptyValue(firstNameFormatter(backup.backupFirstName))} ${getDefaultStringEmptyValue(backup.backupLastName).toUpperCase()}`
  }

  buildName(word1:string,word2:string) : string{
   return getDefaultStringEmptyValue (fullNameFormatter(null,word1,word2));
  }
  /**
	 *  une méthode qui permet d'ouvrir outlook
	 */
  openOutlook(value: string): string {
    return 'mailto:' + value;
  }
  /**
	 *  une méthode qui permet d'ouvrir skype
	 */
  openSkype(value: string): SafeUrl {
    this.skypeUrl = 'sip:<' + value + '>';
    return this.sanitizer.bypassSecurityTrustUrl(this.skypeUrl);
  }

  initReferent() {
    this.desk = '';
    this.emailDesk = '';
    this.coach = '';
    this.emailCoach = '';
    this.adesion = '';
    this.emailAdhesion = '';
  }

  getBackUpOfUser(idUser: number): Observable<AbsenceLight> {
    return this.userService.getUserBackup(idUser);
  }
}
