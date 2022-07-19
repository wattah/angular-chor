import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';

import { CmUsageVO } from './../../../../_core/models/cm-usage-vo';
import { PostalAdresseVO } from './../../../../_core/models/postalAdresseVO';
import { fullNameFormatter } from './../../../../_core/utils/formatter-utils';
import { CM_USAGE, PERSON_CATEGORY } from './../../../../_core/constants/constants';
import { CM_MEDIA_REF } from '../../../../_core/constants/constants';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';

@Component({
  selector: 'app-tab-usage',
  templateUrl: './tab-usage.component.html',
  styleUrls: ['./tab-usage.component.scss']
})
export class TabUsageComponent implements OnInit {
  customerId;
  @Input()
  usageList: CmUsageVO[];
  @Input()
  showusage: boolean;
  @Output() onValidateMobileContact = new EventEmitter<number>();
  @Output() onValidateEmailContact = new EventEmitter<number>();
  @Output() onValidateAddressContact = new EventEmitter<number>();
  @Output() onValidatePhoneHomeContact = new EventEmitter<number>();
  pdUsageList: CmUsageVO[];
  eventUsageList: CmUsageVO[];
  mdUsageList: CmUsageVO[];
  factUsageList: CmUsageVO[];
  iclUsageList: CmUsageVO[];
  eventUsage: CmUsageVO;
  mdUsage: CmUsageVO;
  factUsage: CmUsageVO;
  iclUsage: CmUsageVO;
  isHiddenBloc = false;
  usagesRefList = [CM_USAGE.DEFAULT, CM_USAGE.EVENT, CM_USAGE.DIRECT_MARKETING,
    CM_USAGE.BILLING, CM_USAGE.CONTRACTUAL_INFO];
  CM_MEDIA_REF = CM_MEDIA_REF;
  separator = '\n';
  isValidContacts = {};
  isTitulaire = false;
  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.route.paramMap.subscribe( (params: ParamMap) => {
      this.customerId = params.get('customerId');
    });

  }

  getUsageListByRefKey(refKey: string): CmUsageVO[] {
    const usagesByKey = this.usageList.filter(usage => { 
      return (usage.usageRef.key === refKey);
    });
    if (CM_USAGE.DEFAULT.key !== refKey && (!usagesByKey || usagesByKey.length === 0)) {
      return null;
    }
    return usagesByKey;
  }

  getUsageByCmMedia(usages: CmUsageVO[], mediaRefKey: string): CmUsageVO {
    const usage = usages.find(
      usage => !isNullOrUndefined(usage.cmInterlocuteur) && usage.cmInterlocuteur.mediaRefKey === mediaRefKey
    );
    if(usage){
      this.isValidContacts[usage.id] = usage.cmInterlocuteur.isExpired;
    }
    return usage;
  }

  getClientName(usage: CmUsageVO): string {

    if(usage.interlocutor.categoryPersonKey === PERSON_CATEGORY.MORALE){
      if(usage.interlocutor.crmName !== null) {
    return usage.interlocutor.crmName ;
      } else {
    return "-" ;
      }
    } else {
    return fullNameFormatter(usage.interlocutor.title, usage.interlocutor.firstName, usage.interlocutor.lastName, this.separator);
    }
  }

  getAddress(postalAddress: PostalAdresseVO): string {
    let str = '';
    if (postalAddress.addrLine4 !== null && postalAddress.addrLine4 !== '') {
      str += postalAddress.addrLine4 + this.separator ;
    }
    if (postalAddress.addrLine5 !== null && postalAddress.addrLine5 !== '') {
      str += postalAddress.addrLine5 + this.separator ;
    }
    if (postalAddress.postalCode !== null && postalAddress.postalCode !== '') {
      str += `${postalAddress.postalCode} `;
    }
    if (postalAddress.city !== null) {
      str += postalAddress.city;
    }
    if (postalAddress.cedex !== null) {
      str += ` ${postalAddress.cedex}`;
    }
    if (postalAddress.country) {
      str += this.separator + postalAddress.country;
    }
    return str;
  }

  validMobileContact(cmInterlocuteur){
    if(cmInterlocuteur.isExpired){
      this.onValidateMobileContact.emit(cmInterlocuteur.id);
      this.showChekValidation(cmInterlocuteur.id);
    }
  }

  validEmailContact(cmInterlocuteur){
    if(cmInterlocuteur.isExpired){
      this.onValidateEmailContact.emit(cmInterlocuteur.id);
      this.showChekValidation(cmInterlocuteur.id);
    }
  }

  validAddressContact(cmInterlocuteur){
    if(cmInterlocuteur.isExpired){
      this.onValidateAddressContact.emit(cmInterlocuteur.id);
      this.showChekValidation(cmInterlocuteur.id);
    }
  }

  validPhoneHomeContact(cmInterlocuteur){
    if(cmInterlocuteur.isExpired){
      this.onValidatePhoneHomeContact.emit(cmInterlocuteur.id);
      this.showChekValidation(cmInterlocuteur.id);
    }
  }

  private showChekValidation(id) {
    this.isValidContacts[id] = true;
    setTimeout(
      () => { 
        this.isValidContacts[id] = false;
      }
      , 2000);
  }

}
