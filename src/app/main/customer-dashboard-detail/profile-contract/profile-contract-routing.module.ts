
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ProfileContractComponent } from './profile-contract.component';

import { CanDeactivateGuard } from '../../../../app/_core/guards/can-deactivate-guard';
import { ProfileContractCreationComponent } from './profile-contract-creation/profile-contract-creation.component';
import { CustomerProfileResolver } from '../../../_core/resolvers';
import { CanalDataResolver } from '../../../../app/_core/resolvers/customer-dashboard/canal-data.resolver';
import { StoreDataResolver } from '../../../../app/_core/resolvers/customer-dashboard/store-data.resolver';
import { StoreCompanyDataResolver } from '../../../../app/_core/resolvers/customer-dashboard/store-company-data.resolver';
import { BusinessDataResolver } from '../../../../app/_core/resolvers/customer-dashboard/business-data.resolver';
import { MarketingCanalDataResolver } from '../../../../app/_core/resolvers/customer-dashboard/marketing-canal-data.resolver';
import { SponsorDataResolver } from '../../../../app/_core/resolvers/customer-dashboard/sponsor-data.resolver';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: ProfileContractComponent,
    children: [
      {
        path: 'creation/:index',
        component: ProfileContractCreationComponent,
        resolve: {
          customerProfile : CustomerProfileResolver,
          canaux : CanalDataResolver,
          stores : StoreDataResolver,
          storesCompany : StoreCompanyDataResolver,
          businessCanal : BusinessDataResolver,
          marketingCanal : MarketingCanalDataResolver,
          sponsorCanal : SponsorDataResolver,
        },
        canDeactivate: [ CanDeactivateGuard ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ CanDeactivateGuard, NgbActiveModal ]
})
export class ProfileContractRoutingModule { }
