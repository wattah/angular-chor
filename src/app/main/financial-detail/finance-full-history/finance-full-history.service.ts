import { Injectable } from '@angular/core';

import { CompteFacturation } from './../../../_core/models/compte-facturation-vo';
import { PenicheCivilite} from './../../../_core/enum/billing-account.enum';
import { capitalize} from './../../../_core/utils/string-utils';
import { toUpperCase } from './../../../_core/utils/formatter-utils';

@Injectable({
  providedIn: 'root'
})
  export class FinanceFullHistoryService {

    getTitularOrPayerName(billingAccount: CompteFacturation, isTitular: boolean): string {
    if (isTitular) {
      if (billingAccount.titularTitle === PenicheCivilite.PM) {
        return billingAccount.titularCompany ? billingAccount.titularCompany : '-';
      } else if (!billingAccount.titularFirstName && !billingAccount.titularLastName) {
        return '-';
      }else {
        return `${billingAccount.titularFirstName ? capitalize(billingAccount.titularFirstName ) : '-'} 
        ${billingAccount.titularLastName ? toUpperCase(billingAccount.titularLastName ) : '-'}` ;
      }
    } else {
      if (billingAccount.payerTitle === PenicheCivilite.PM) {
        return billingAccount.payerCompany ? billingAccount.payerCompany : '-';
      } else if (!billingAccount.payerFirstName && !billingAccount.payerLastName) {
        return '-';
      }else {
        return `${billingAccount.payerFirstName ? capitalize(billingAccount.payerFirstName ) : '-'} 
        ${billingAccount.payerLastName ? toUpperCase(billingAccount.payerLastName ) : '-'}` ;
      }
    }
  }
}
