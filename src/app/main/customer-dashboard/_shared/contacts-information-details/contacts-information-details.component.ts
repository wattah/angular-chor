import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InterlocutorVO } from 'src/app/_core/models/interlocutor-vo';
import { TelephoneVO } from 'src/app/_core/models/telephoneVO';
import { EmailVO } from 'src/app/_core/models/emailVO';
import { PostalAdresseVO } from 'src/app/_core/models/postalAdresseVO';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { CONSTANTS } from '../../../../_core/constants/constants';

@Component({
  selector: 'app-contacts-information-details',
  templateUrl: './contacts-information-details.component.html',
  styleUrls: ['./contacts-information-details.component.scss']
})
export class ContactsInformationDetailsComponent implements OnInit {
  temp = Array;
  math = Math;

  isEntreprise: boolean;
  isBeneficiary:boolean;
  isParticular:boolean;
  customerId: number;

  coordonnees: InterlocutorVO;
  listMobAndFix: TelephoneVO[];   
  listMail: EmailVO[]; 
  listAdresses: PostalAdresseVO[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe( params => {
      this.customerId = Number.parseInt(params.get('customerId'), 10);
    });
    const typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer');
    this.isEntreprise = ( typeCustomer === CONSTANTS.TYPE_COMPANY );
    this.isBeneficiary = ( typeCustomer === CONSTANTS.TYPE_BENEFICIARY );
    this.isParticular = ( typeCustomer === CONSTANTS.TYPE_PARTICULAR );
    this.route.data.subscribe(resolversData =>{
      this.coordonnees = resolversData['coordonnees'];
    });
  }
}
