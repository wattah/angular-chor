import { Component, Input} from '@angular/core';
import { isEmpty } from '../../../../../_core/utils/array-utils';
import { CompteFacturation } from '../../../../../_core/models/compte-facturation-vo';
import { SelectedDebt } from '../../../../../_core/models/customer-totals-debt';

@Component({
  selector: 'app-finance-detail-internet-account',
  templateUrl: './finance-detail-internet-account.component.html',
  styleUrls: ['./finance-detail-internet-account.component.scss']
})
export class FinanceDetailInternetAccountComponent{

  @Input()
  selectedDebt: SelectedDebt;
  
  @Input()
  totalBalance : number;

  public isEmpty = isEmpty;

  @Input()
  detailsDebtsBillingAccountAvecSolde: CompteFacturation[];

  @Input()
  detailsDebtsBillingAccountSansSolde: CompteFacturation[];

  @Input()
  univers: string;


}
