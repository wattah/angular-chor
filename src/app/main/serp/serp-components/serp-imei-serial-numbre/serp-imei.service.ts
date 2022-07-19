import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANTS, CUSTOMER_TYPE_LABEL } from '../../../../_core/constants/constants';
import { firstNameFormatter } from '../../../../_core/utils/formatter-utils';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';

@Injectable({
  providedIn: 'root'
})
export class SerpImeiService {

constructor(private readonly router: Router, private readonly datePipe: DatePipe) { }

  goToCustomerDashbordPage(params){
    const customerDashboard = 'customer-dashboard';
      const customerId = params.data.customerId;
      const typeItem = params.data.categoryCustomer;
      const nicheIdentifier = params.data.nicheIdentifier;
      if(customerId !== null){
        if (CUSTOMER_TYPE_LABEL.ENTERPRISE === typeItem ) {
          this.router.navigate([customerDashboard, 'entreprise', customerId], {
            queryParams: {
              typeCustomer: CONSTANTS.TYPE_COMPANY,
              nicheValue: nicheIdentifier
            }  });
        } else {
          this.router.navigate([customerDashboard, 'particular', customerId], { 
            queryParams: { 
              typeCustomer: typeItem == CUSTOMER_TYPE_LABEL.PARTICULAR ? CONSTANTS.TYPE_PARTICULAR : CONSTANTS.TYPE_BENEFICIARY, 
              nicheValue: nicheIdentifier 
            } });
        }
      }
  }

   getFormattedDate(data: string): string {
    return data ? this.datePipe.transform(data, 'dd MMM yyyy') : '-';
   }

   buildName(firstName, lastName){
    let customerName = null;
    customerName = isNullOrUndefined(firstName) || firstName == '' ? '' : firstNameFormatter(firstName);
    customerName += isNullOrUndefined(lastName) || lastName == '' ? '' : ' ' + lastName;
    return isNullOrUndefined(customerName) ? '-' : customerName;
  }
}
