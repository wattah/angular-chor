import { TotalsDebtResolver } from './../../_core/resolvers/customer-dashboard/totals-debt.resolver';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoProfilResolver, DateRecouvrementResolver, GoodToKnowResolver, InterlocutorListResolver } from '../../_core/resolvers';
import { InterlocutorUsageComponent } from './interlocutor-usage.component';
import { CanDeactivateGuard } from '../../_core/guards/can-deactivate-guard';
import { CreationFirstStepComponent } from './creation-first-step/creation-first-step.component';
import { CreationUsageComponent } from './creation-usage/creation-usage.component';
import { ModificationUsageComponent } from './modification-usage/modification-usage.component';
import { CreationInterlocutorComponent } from './creation-interlocutor/creation-interlocutor.component';
import { ModificationParticulierComponent } from './modification-particulier/modification-particulier.component';
import { ContactMethodUsageTypesResolver } from '../../_core/resolvers/customer-dashboard/contact-method-usage-types.resolver';
import { ContactMethodUsageResolver } from '../../_core/resolvers/customer-dashboard/contact-method-usage.resolver';
import { ModificationEntrepriseComponent } from './modification-entreprise/modification-entreprise.component';

const routes: Routes = [  
  {
    path: '',
    component: InterlocutorUsageComponent,
    resolve: {
      infoProfil: InfoProfilResolver,
      goodToKnow: GoodToKnowResolver,
      recoveryDate: DateRecouvrementResolver,
      totalDebt: TotalsDebtResolver
    },
    children: [
      {
        path: 'creation',
        component: CreationFirstStepComponent
      },
      {
        path: 'creation/usage',
        component: CreationUsageComponent,
        canDeactivate: [ CanDeactivateGuard ],
        resolve: {
          listUsages: ContactMethodUsageTypesResolver,
          interlocutors: InterlocutorListResolver
        } 
      },
      {
        path: 'modification/usage/:usageRefKey',
        component: ModificationUsageComponent,
        canDeactivate: [ CanDeactivateGuard ],
        resolve: {
          usages: ContactMethodUsageResolver,
          interlocutors: InterlocutorListResolver
        }
      },
      {
        path: 'creation/interlocutor',
        component: CreationInterlocutorComponent,
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path: 'modification/entreprise/:personId',
        component: ModificationEntrepriseComponent,
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path: 'modification/particular/:personId/:isInterlocutor',
        component: ModificationParticulierComponent,
        canDeactivate: [ CanDeactivateGuard ]
      }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuard]
})
export class InterlocutorRoutingModule { }
