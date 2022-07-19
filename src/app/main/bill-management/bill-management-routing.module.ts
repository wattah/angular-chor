import { TotalsDebtResolver } from './../../_core/resolvers/customer-dashboard/totals-debt.resolver';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoProfilResolver, GoodToKnowResolver, DateRecouvrementResolver } from '../../_core/resolvers';
import { CanDeactivateGuard } from '../../_core/guards/can-deactivate-guard';
import { BillManagementComponent } from './bill-management.component';
import { BillManagementDetailComponent } from './bill-management-detail/bill-management-detail.component';
import { CheckBrowserVersionGuard } from '../../_core/guards/check-browser-version-guard';
import { EncondingGuard } from '../../_core/guards/encoding.guard';
import { AddCreditComponent } from './add-credit/add-credit.component';

const routes: Routes = [
  {
    path: '',
    component: BillManagementComponent,
    resolve: {
      infoProfil: InfoProfilResolver,
      goodToKnow: GoodToKnowResolver,
      recoveryDate: DateRecouvrementResolver,
      totalDebt: TotalsDebtResolver
    },
     children: [
      {
        path: 'detail',
        canActivate: [CheckBrowserVersionGuard, EncondingGuard],
        component: BillManagementDetailComponent
      },
      {
        path: 'add-credit',
        canActivate: [CheckBrowserVersionGuard, EncondingGuard],
        component: AddCreditComponent
      },
    ]
  }
];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ CanDeactivateGuard, NgbActiveModal ]
  })

export class BillManagementModuleRoutingModule { }
