import { TotalsDebtResolver } from './../../../_core/resolvers/customer-dashboard/totals-debt.resolver';
import { EncondingGuard } from 'src/app/_core/guards/encoding.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeeAllComponent } from './see-all.component';
import { InfoProfilResolver } from '../../../_core/resolvers/customer-dashboard/info-profil.resolver';
import { GoodToKnowResolver } from '../../../_core/resolvers/customer-dashboard/good-to-know.resolver';
import { ParcServicesHardwareFullResolver, ParcLigneResolver, DocumentFullResolver, 
  CordonnesResolver, ParcServicesDetailResolver, RequestTypeCustomerResolver, DocumentTitleResolver, TypeDocumentResolver  } from '../../../_core/resolvers';
import { ParcLignesComponent, ParcServicesComponent, ParcServicesDetailComponent, RequestsMonitoringComponent } from '../_shared';
import { DocumentFullListComponent } from '../_shared/document-full-list/document-full-list.component';
import { ContactsInformationDetailsComponent } from '../_shared/contacts-information-details/contacts-information-details.component';
import { DateRecouvrementResolver } from '../../../_core/resolvers/customer-dashboard/date-recouvrement.resolver';
import { CustomerMonitoringResolver } from '../../../_core/resolvers/customer-monitoring.resolver';

const routes: Routes = [
  {
    path: '',
    canActivate : [EncondingGuard],
    component: SeeAllComponent,
    resolve: {
      infoProfil: InfoProfilResolver,
      goodToKnow: GoodToKnowResolver,
      recoveryDate: DateRecouvrementResolver,
      totalDebt: TotalsDebtResolver
    },
    children: [
      {
        path: 'parc-lignes',
        canActivate : [EncondingGuard],
        component: ParcLignesComponent,
        resolve: {
          parcLignes: ParcLigneResolver
        },
        data: {
          showDetail: true
        }
      },
      {
        path: 'parc-services',
        component: ParcServicesComponent,
        resolve: {
          parcServices: ParcServicesHardwareFullResolver
        },
        data: {
          showDetail: true
        }
      },
      {
        path: 'parc-services-details/:id',
        component: ParcServicesDetailComponent,
        resolve: {
          parcServicesDetail: ParcServicesDetailResolver
        }
      },
      {
        path: 'document-full-list',
        canActivate : [EncondingGuard],
        component: DocumentFullListComponent,
        resolve: {
          // listDocumentCustomer: DocumentFullResolver,
          documentsTitle: DocumentTitleResolver,
          documentsType: TypeDocumentResolver
        }
      }, 
      {
        path: 'coordonnees-details',
        component: ContactsInformationDetailsComponent,
        resolve: {
          coordonnees: CordonnesResolver
        }
      },
      {
        path: 'requests-minitoring',
        component: RequestsMonitoringComponent,
        resolve: {
          requestsCustomer: CustomerMonitoringResolver,
          typesRequest: RequestTypeCustomerResolver
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeeAllRoutingModule {}
