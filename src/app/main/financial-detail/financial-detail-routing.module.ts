import { EncondingGuard } from 'src/app/_core/guards/encoding.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckBrowserVersionGuard } from '../../_core/guards/check-browser-version-guard';

import { AccountingStateComponent } from './accounting-state/accounting-state.component';
import { ContractOffersResolver } from '../../_core/resolvers/customer-dashboard/contacts-offers.resolver';
import { InfoProfilResolver } from '../../_core/resolvers/customer-dashboard/info-profil.resolver';
import { DateRecouvrementResolver } from '../../_core/resolvers/customer-dashboard/date-recouvrement.resolver';
import { TotalsDebtResolver, DetailsDebtsBillingAccountResolver, GoodToKnowResolver, SeveralCustomersTitulaireResolver } from '../../_core/resolvers';
import { FinanceFullHistoryComponent } from './finance-full-history/finance-full-history.component';
import { PaymentBillComponent } from './payment-bill/payment-bill.component';
import { ReferencesDataResolver } from '../../_core/resolvers/customer-dashboard/references-data.resolver';
import { CanDeactivateGuard } from '../../_core/guards/can-deactivate-guard';
import { CreationModificationBillComponent } from './creation-modification-bill/creation-modification-bill.component';
import { ManageCustomerPenicheComponent } from './manage-customer-peniche/manage-customer-peniche.component';
import { ConsultCustomerPenicheComponent } from './manage-customer-peniche/consult-customer-peniche/consult-customer-peniche.component';
import { CreateUpdateCustomerPenicheComponent } from './manage-customer-peniche/create-update-customer-peniche/create-update-customer-peniche.component';
 
const routes: Routes = [
  {
    path: 'accounting-state',
    canActivate: [CheckBrowserVersionGuard,EncondingGuard],
    component: AccountingStateComponent,
    resolve: {
      contractsOffers: ContractOffersResolver,
      infoCustomer: InfoProfilResolver,
      dateRecouvrement: DateRecouvrementResolver,
      totalDebt: TotalsDebtResolver
    }
  },
  {
    path: 'history',
    canActivate: [CheckBrowserVersionGuard,EncondingGuard],
    component: FinanceFullHistoryComponent,
    runGuardsAndResolvers: 'always',
    resolve: {
      totalDebt: TotalsDebtResolver,
      infoCustomer: InfoProfilResolver,
      dateRecouvrement: DateRecouvrementResolver,
      detailsDebtsBillingAccount : DetailsDebtsBillingAccountResolver,
      severalCustomerTit: SeveralCustomersTitulaireResolver
    }  
  },
  {
    path: 'payment/:refBillAcount',
    canActivate: [CheckBrowserVersionGuard,EncondingGuard],
    component: PaymentBillComponent,
    resolve: {
      totalDebt: TotalsDebtResolver,
      infoCustomer: InfoProfilResolver,
      recoveryDate: DateRecouvrementResolver,
      mediaData: ReferencesDataResolver,
      infoProfil: InfoProfilResolver,
      goodToKnow: GoodToKnowResolver
    },
    data: {
      typeData: 'CUSTOMER_INTERACTION_MEDIA'
    },
    canDeactivate: [ CanDeactivateGuard ]
  },
  {
    path: 'bill-account/creation',
    canActivate: [CheckBrowserVersionGuard, EncondingGuard],
    component: CreationModificationBillComponent,
    resolve: {
      infoCustomer: InfoProfilResolver,
      infoProfil: InfoProfilResolver,
      goodToKnow: GoodToKnowResolver,
      recoveryDate: DateRecouvrementResolver,
      totalDebt: TotalsDebtResolver
    },
    data: {
      isEditMode: false
    }
  },
  {
    path: 'bill-account/:id/modification',
    canActivate: [CheckBrowserVersionGuard, EncondingGuard],
    component: CreationModificationBillComponent,
    resolve: {
      infoCustomer: InfoProfilResolver,
      infoProfil: InfoProfilResolver,
      goodToKnow: GoodToKnowResolver,
      recoveryDate: DateRecouvrementResolver,
      totalDebt: TotalsDebtResolver
    },
    data: {
      isEditMode: true
    }
  },
  {
    path: 'manage-customer-peniche',
    canActivate: [CheckBrowserVersionGuard,EncondingGuard],
    component: ManageCustomerPenicheComponent,
    resolve: {
      infoCustomer: InfoProfilResolver,
      infoProfil: InfoProfilResolver,
      goodToKnow: GoodToKnowResolver,
      recoveryDate: DateRecouvrementResolver,
      totalDebt: TotalsDebtResolver
    }
  },
  {
    path: 'consult',
    canActivate: [CheckBrowserVersionGuard,EncondingGuard],
    component: ConsultCustomerPenicheComponent
  },
  {
    path: 'create-update',
    canActivate: [CheckBrowserVersionGuard,EncondingGuard],
    component: CreateUpdateCustomerPenicheComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuard]
})
export class FinancialDetailRoutingModule { }
