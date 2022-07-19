import { isNullOrUndefined } from 'src/app/_core/utils/string-utils';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonNoteVo } from 'src/app/_core/models/person-note';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-billing-info',
  templateUrl: './billing-info.component.html',
  styleUrls: ['./billing-info.component.scss']
})
export class BillingInfoComponent implements OnInit {
  @Input()
  infoFacturation: PersonNoteVo;

  isModifier: Boolean;

  @Input()
  dateRecouvrement: Date;

  @Input()
  personIdNote: number;

  skypeUrl: string;

  emailUser: string;

  @Input()
  isEntreprise: boolean;
 
  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (!isNullOrUndefined(this.infoFacturation) && this.infoFacturation.emailUser !== null) {
      this.emailUser = this.infoFacturation.emailUser;
    }
    if ( !isNullOrUndefined(this.infoFacturation) && (this.infoFacturation.value !== null || this.infoFacturation.value === '') ) {
      this.isModifier = true;
    } else {
      this.isModifier = false;
    }
  }

  /**
	 *  une méthode qui permet d'ouvrir skype
	 */
  openSkype(value: string): SafeUrl {
    this.skypeUrl = 'sip:<' + value + '>';
    return this.sanitizer.bypassSecurityTrustUrl(this.skypeUrl);
  }
}
