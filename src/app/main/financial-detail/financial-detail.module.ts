import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainSharedModule } from '../_shared/main-shared.module';
import { SharedModule } from '../../_shared/shared.module';
import { FinancialDetailRoutingModule } from './financial-detail-routing.module';
import { AccountingStateComponent } from './accounting-state/accounting-state.component';
import { AccountingStateListComponent } from './accounting-state/accounting-state-list/accounting-state-list.component';
import { ContractListComponent } from './accounting-state/contract-list/contract-list.component';
import { FinanceFullHistoryComponent } from './finance-full-history/finance-full-history.component';
import { FinanceDetailInternetAccountComponent } from './finance-full-history/components/finance-detail-internet-account/finance-detail-internet-account.component';
import { BillingAccountComponent } from './finance-full-history/components/billing-account/billing-account.component';


import { 
  DebtMobileServiceComponent, 
  FinanceTabListDetailDebtComponent,
  FinanceDetailDebtBillingAccountComponent,
  } from './finance-full-history/components';
import { PaymentBillComponent } from './payment-bill/payment-bill.component';

import { CreationModificationBillComponent } from './creation-modification-bill/creation-modification-bill.component';
import { BillingDetailsComponent } from './creation-modification-bill/billing-details/billing-details.component';
import { RequiredInformationComponent } from './creation-modification-bill/required-information/required-information.component';
import { CheckboxRendrerComponent } from './finance-full-history/components/checkbox-rendrer/checkbox-rendrer.component';
import { ManageCustomerPenicheComponent } from './manage-customer-peniche/manage-customer-peniche.component';
import { ConsultCustomerPenicheComponent } from './manage-customer-peniche/consult-customer-peniche/consult-customer-peniche.component';
import { CreateUpdateCustomerPenicheComponent } from './manage-customer-peniche/create-update-customer-peniche/create-update-customer-peniche.component';

const COMPONENTS = [
  AccountingStateListComponent,
  AccountingStateComponent, 
  ContractListComponent,  
  FinanceFullHistoryComponent,
  DebtMobileServiceComponent,
  FinanceTabListDetailDebtComponent,
  FinanceDetailDebtBillingAccountComponent,
  PaymentBillComponent,
  CreationModificationBillComponent,
  BillingDetailsComponent,
  RequiredInformationComponent,
  FinanceDetailInternetAccountComponent,
  BillingAccountComponent,
  CheckboxRendrerComponent,
  ManageCustomerPenicheComponent,
  ConsultCustomerPenicheComponent,
  CreateUpdateCustomerPenicheComponent
];

@NgModule({
  
  imports: [
    CommonModule,
    FinancialDetailRoutingModule,
    MainSharedModule,
    SharedModule,
    
  ],
  declarations: COMPONENTS,
})
export class FinancialDetailModule { }
