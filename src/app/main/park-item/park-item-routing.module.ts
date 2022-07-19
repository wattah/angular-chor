import { TotalsDebtResolver } from './../../_core/resolvers/customer-dashboard/totals-debt.resolver';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParkItemComponent } from './park-item/park-item.component';
import { CheckBrowserVersionGuard } from '../../_core/guards/check-browser-version-guard';
import { DateRecouvrementResolver, GoodToKnowResolver, InfoProfilResolver, ParcLignesDetailResolver, UserConnectedResolver } from '../../_core/resolvers';
import { ParkItemDetailComponent } from './park-item-detail/park-item-detail.component';
import { ParkItemListParticularComponent } from './park-item-list-particular/park-item-list-particular.component';
import { ParkItemListEnterpriseComponent } from './park-item-list-enterprise/park-item-list-enterprise.component';
import { EncondingGuard } from '../../_core/guards/encoding.guard';
import { CustomerParkItemResolver } from '../../_core/resolvers/customer-park-item.resolver';


const routes: Routes = [ 
  {
    path: '',
    canActivate : [EncondingGuard],
    component: ParkItemComponent,
    resolve: {
      infoProfil: InfoProfilResolver,
      goodToKnow: GoodToKnowResolver,
      recoveryDate: DateRecouvrementResolver,
      totalDebt: TotalsDebtResolver
    },
    children: [
      {
        path: 'list-particular',
        canActivate: [CheckBrowserVersionGuard],
        component: ParkItemListParticularComponent,
        resolve: {
          userConnecte: UserConnectedResolver
        }
      },
       {
        path: 'list-enterprise',
        canActivate: [CheckBrowserVersionGuard],
        component: ParkItemListEnterpriseComponent,
        resolve: {
          userConnecte: UserConnectedResolver,
          fullCustomerParkItem: CustomerParkItemResolver
        }
      },
      {
        path: ':id',
        canActivate: [CheckBrowserVersionGuard],
        component: ParkItemDetailComponent,
        resolve: {
          parcItemLigneDetail: ParcLignesDetailResolver
        }
      }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParkItemRoutingModule { }
