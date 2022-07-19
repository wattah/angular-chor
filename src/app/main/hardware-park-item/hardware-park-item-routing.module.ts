import { TotalsDebtResolver } from './../../_core/resolvers/customer-dashboard/totals-debt.resolver';
import { CustomerHardwardResolver } from './../../_core/resolvers/customer-hardwar.resolver';
import { FullCustomerResilver } from './../../_core/resolvers/full-cutomer.resolver';
import { CustomerParkItemResolver } from './../../_core/resolvers/customer-park-item.resolver';
import { SeveralCustomersTitulaireResolver } from './../../_core/resolvers/customer-dashboard/several-customers-titulaire.resolvers';
import { FamilyResolver } from './../../_core/resolvers/family.resolver';
import { BeneficiairesResolver } from './../../_core/resolvers/entreprise-customer-dashboard/beneficiaires.resolver';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckBrowserVersionGuard } from '../../_core/guards/check-browser-version-guard';
import { HardwareParkItemCreationComponent } from './hardware-park-item-creation/hardware-park-item-creation.component';
import { HardwareParkItemComponent } from './hardware-park-item/hardware-park-item.component';
import { InfoProfilResolver, GoodToKnowResolver, DateRecouvrementResolver } from '../../_core/resolvers';
import { HardwareParkItemUpdateComponent } from './hardware-park-item-update/hardware-park-item-update.component';
import { EncondingGuard } from 'src/app/_core/guards/encoding.guard';
import { CanDeactivateGuard } from '../../_core/guards/can-deactivate-guard';

const routes: Routes = [ 
  {
    path: '',
    canActivate : [EncondingGuard],
    component: HardwareParkItemComponent,
    resolve: {
      infoProfil: InfoProfilResolver,
      goodToKnow: GoodToKnowResolver,
      recoveryDate: DateRecouvrementResolver,
      totalDebt: TotalsDebtResolver
    },
    children: [
      {
        path: 'add',
        canActivate: [CheckBrowserVersionGuard],
        component: HardwareParkItemCreationComponent,
        canDeactivate: [ CanDeactivateGuard ],
        resolve:{
          beneficiaries:BeneficiairesResolver,
          categories: FamilyResolver,
          severalCustomerTit: SeveralCustomersTitulaireResolver,
          parkItems:CustomerParkItemResolver,
          fullCustomer: FullCustomerResilver
        },
        data:{
          permissions: {
            only: 'ajout_service_materiel',
            redirectTo: '/'
          }  
        }
      },
      {
        path: 'update',
        canActivate: [CheckBrowserVersionGuard],
        component: HardwareParkItemUpdateComponent,
        canDeactivate: [ CanDeactivateGuard ],
        resolve:{
          customerHardward:CustomerHardwardResolver,
          parkItems:CustomerParkItemResolver
        },
        data:{
          permissions: {
            only: 'modifier_service_materiel',
            redirectTo: '/'
          }  
        }
      }

    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuard]
})
export class HardwareParkItemRoutingModule { }
