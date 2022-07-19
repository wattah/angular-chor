import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PenicheCustomerResponseVO } from '../../../../_core/models/peniche-customer-response-vo';
import { BillingService } from '../../../../_core/services/billing.service';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';

@Component({
  selector: 'app-customer-peniche-consultation',
  templateUrl: './customer-peniche-consultation.component.html',
  styleUrls: ['./customer-peniche-consultation.component.scss']
})
export class CustomerPenicheConsultationComponent implements OnInit {

  @Input()
  penicheCustomerResponseVO: PenicheCustomerResponseVO;

  @Input()
  isPenicheUp = false;
  @Input()
  isClientExist = false;
  @Input()
  jiraUrl: string;

  constructor(readonly billingService: BillingService) { }

  ngOnInit() {
  }
  
  @Output() updateCustomerPeniche = new EventEmitter<boolean>(null);

  onUpdateCustomerPeniche(): void {
    this.updateCustomerPeniche.emit(false);
  }

  getCivilte(val): string {
    if(isNullOrUndefined(val)) {
      return '-';
    }
    let label = '';
    switch (val.toUpperCase()) {
      case "MR": label = 'Monsieur';
      break;
      case "MME": label = 'Madame';
      break;
      case "PM": label = 'Société';
      break;
    }
    return label;
  }

  formatBalance(value : number) : string {
    if(isNaN(value)){
      return '-';
    } else {
      return this.formatPriceToString(value, false, true);
    }
  }

  formatPriceToString(price: number, isHt: boolean, noTax: boolean) : string {
    if (!isNaN(price)) {
      let priceStr = `${this.priceFormatter(price)} €`;
      if (isHt) {
        priceStr = `${priceStr} HT`;
      } else if(!noTax) {
        priceStr = `${priceStr} TTC`;
      }
      return priceStr ;
    }
    return "";
  }

  priceFormatter(price:number): string {
    if (!isNaN(price) && price !== null) {
    const result = price.toFixed(2);
    const str = String(result);
    return str.replace(".", ",");
    }
    return "";
  }

}
