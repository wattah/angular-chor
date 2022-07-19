import { BillDownloadService } from './../bill-download.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SelectedDebt } from '../../../../../_core/models/customer-totals-debt';
import { CompteFacturation } from '../../../../../_core/models/compte-facturation-vo';
import { DetailsBillingAccounts } from '../../../../../_core/models/details-billing-accounts';
import { UNIVERS_PENICHE } from '../../../../../_core/constants/constants';
import { DetailsDebtsBillingAccountService } from '../../../../../_core/services/details-debts-billing-account.service';

@Component({
  selector: 'app-finance-tab-list-detail-debt',
  templateUrl: './finance-tab-list-detail-debt.component.html',
  styleUrls: ['./finance-tab-list-detail-debt.component.scss']
})
export class FinanceTabListDetailDebtComponent {

  @Input() selectedDebt: SelectedDebt;
  @Input() debtsOfBillingAccount : DetailsBillingAccounts;
  @Input() loadingActifAccounts: boolean ; 

        
  totalBalance : number;

  detailsDebtsBillingAccountInactif : CompteFacturation[] = [];

  @Output() changeSelectedDebt: EventEmitter<SelectedDebt> = new EventEmitter<SelectedDebt>();

  loadingInactifAccounts: boolean;


  readonly UNIVERS_PENICHE = UNIVERS_PENICHE;


  constructor(private readonly billDownloadService: BillDownloadService, private readonly detailsDebtsBillingAccountService: DetailsDebtsBillingAccountService) {

  }

  
 
  changeUnivers( universSelected: string): void {
    const mobileSelected = ( universSelected === 'MOBILE');
    const serviceSelected = ( universSelected === 'SERVICE');
    const internetSelected = (universSelected === 'INTERNET');
    this.billDownloadService.files = [];
    this.selectedDebt = {
      ...this.selectedDebt,
      universSelected,
      mobileSelected,
      serviceSelected,
      internetSelected,
      showInactifAccounts: false
    };
    this.changeSelectedDebt.emit(this.selectedDebt);
  }

  toggleInactifAccounts(): void {
    this.selectedDebt.showInactifAccounts = !this.selectedDebt.showInactifAccounts;
    if (this.selectedDebt.showInactifAccounts) {
      const etat = 'Inactif' as const;
      const niche = this.selectedDebt.contractSelected.nicheIdentifier;
      this.loadingInactifAccounts = true;
      this.detailsDebtsBillingAccountService.getBillingAccountListByNicheIdentifierAndEtat(niche, this.selectedDebt.universSelected, etat)
      .subscribe(data => {
        this.detailsDebtsBillingAccountInactif = data;
        this.loadingInactifAccounts = false;
      },
      err => this.loadingInactifAccounts = false);
    }
  }

}
