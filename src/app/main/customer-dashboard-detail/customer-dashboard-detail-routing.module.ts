import { TotalsDebtResolver } from './../../_core/resolvers/customer-dashboard/totals-debt.resolver';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerDashboardDetailComponent } from './customer-dashboard-detail.component';
import { InfoProfilResolver, GoodToKnowResolver, DateRecouvrementResolver, UserFilteredResolver,
  RequestDocumentsResolver, RequestAnswersResolver, RequestDetailsResolver, RequestDetailForUpdateResolver, TypeDocumentResolver, 
  DocumentTitleResolver, CustomerReferentResolver, HomologationsIdsResolver } from '../../_core/resolvers';
import { CheckBrowserVersionGuard } from '../../_core/guards/check-browser-version-guard';
import { EncondingGuard } from '../../_core/guards/encoding.guard';
import { DetailRequestComponent } from './detail-request/detail-request.component';
import { RequestUpdateComponent } from '../request/request-update/request-update.component';
import { TaskClosureComponent } from './detail-task/components/task-closure/task-closure.component'; 
import { CanDeactivateGuard } from '../../_core/guards/can-deactivate-guard';
import { CartResolver } from '../../_core/resolvers/cart-resolvers';
import { HomologationComponent } from './homologation';
import { HomologationResolver } from '../../_core/resolvers/homologation.resolver';
import { AddDocumentDetailComponent } from './add-document-detail/add-document-detail.component';
import { CanalDataResolver } from '../../_core/resolvers/customer-dashboard/canal-data.resolver';
import { StoreDataResolver } from '../../_core/resolvers/customer-dashboard/store-data.resolver';
import { StoreCompanyDataResolver } from '../../_core/resolvers/customer-dashboard/store-company-data.resolver';
import { BusinessDataResolver } from '../../_core/resolvers/customer-dashboard/business-data.resolver';
import { MarketingCanalDataResolver } from '../../_core/resolvers/customer-dashboard/marketing-canal-data.resolver';
import { SponsorDataResolver } from '../../_core/resolvers/customer-dashboard/sponsor-data.resolver';
import { MembershipReasonDataResolver } from '../../_core/resolvers/customer-dashboard/membership-reason-data.resolver';
import { KnowledgeParnasseDataResolver } from '../../_core/resolvers/customer-dashboard/knowledge-parnasse-data.resolve';
import { InfoCustomerHomologationResolver } from '../../_core/resolvers/customer-dashboard/info-cutomer-homologation.resolver';
import { GoodToKnowModificationComponent } from './good-to-know-modification/good-to-know-modification.component';
const routes: Routes = [ 
  {
    path: '',
    canActivate: [EncondingGuard],
    component: CustomerDashboardDetailComponent,
    resolve: {
      infoProfil: InfoProfilResolver,
      goodToKnow: GoodToKnowResolver,
      recoveryDate: DateRecouvrementResolver,
      referents: CustomerReferentResolver,
      totalDebt: TotalsDebtResolver
    },
    children: [
      {
        path: 'request/:idRequest',
        canActivate: [CheckBrowserVersionGuard , NgxPermissionsGuard],
        runGuardsAndResolvers: 'always',
        component: DetailRequestComponent,
        resolve: {
          detailRequest: RequestDetailsResolver,
          requestAnswers: RequestAnswersResolver,
          carts: CartResolver,
          documents: RequestDocumentsResolver,
          homologationsIds: HomologationsIdsResolver
        },
        data:{
          permissions: {
            only: 'affichage_demandes',
            redirectTo: '/'
          }
        }
      },
      {
        path: 'request/:idRequest/update-request',
        canActivate: [CheckBrowserVersionGuard],
        component: RequestUpdateComponent,
        resolve: {
          currentRequest: RequestDetailForUpdateResolver,
          users: UserFilteredResolver
        },
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path: 'closureTask/:idTask',
        canActivate: [CheckBrowserVersionGuard],
        component: TaskClosureComponent,
        resolve: {
          listUsers: UserFilteredResolver
        }
      },
      {
        path: 'homologation/:id',
        component: HomologationComponent,
        resolve: {
          homologation: HomologationResolver,
          canaux : CanalDataResolver,
          stores : StoreDataResolver,
          storesCompany : StoreCompanyDataResolver,
          businessCanal : BusinessDataResolver,
          marketingCanal : MarketingCanalDataResolver,
          sponsorCanal : SponsorDataResolver,
          membershipReasons: MembershipReasonDataResolver,
          knowledgeParnasse: KnowledgeParnasseDataResolver,
          infoCustomerHomologationResolver: InfoCustomerHomologationResolver
        } 
      },
      {
        path: 'profile-contract',
        canActivate: [CheckBrowserVersionGuard, EncondingGuard],
        loadChildren: () => import('./profile-contract/profile-contract.module').
        then((m) => m.ProfileContractModule)
      },
      {
        path: 'creation-line',
        canActivate: [CheckBrowserVersionGuard, EncondingGuard],
        loadChildren: () => import('./creation-line/creation-line.module').
        then((m) => m.CreationLineModule)
      },

      {
        path: 'addDocumentDetail',
        component: AddDocumentDetailComponent,
        resolve: {
          documentsTitle: DocumentTitleResolver,
          documentsType: TypeDocumentResolver
        }
      },

      {
        path: 'modification-bonsavoir/:personIdNote',
        component: GoodToKnowModificationComponent    
      },
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ CanDeactivateGuard ]
})
export class CustomerDashboardDetailRoutingModule { } 
