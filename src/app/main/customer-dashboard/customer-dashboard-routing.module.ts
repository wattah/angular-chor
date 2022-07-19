import { TotalNumberRecouverementResolver } from './../../_core/resolvers/customer-dashboard/total-number-recouverement.resolver';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CheckBrowserVersionGuard } from '../../_core/guards/check-browser-version-guard';
import { BeneficiairesResolver, /** CordonnesResolver */ DocumentResolver, GoodToKnowResolver, InfoClientResolver,
   InfoNoteFacturationResolver, InfoProfilResolver, ParcLigneResolver, ParcServicesEntrepriseResolver,
    ParcServicesResolver, SeveralCustomersTitulaireResolver, TotalsDebtResolver, 
    TypeDocumentResolver, InterlocutorListResolver, RequestAnswersResolver, DocumentTitleResolver } from '../../_core/resolvers';
import { DateRecouvrementResolver } from '../../_core/resolvers/customer-dashboard/date-recouvrement.resolver';
import { RequestCustomerResolver } from '../../_core/resolvers/customer-dashboard/request.customer.resolver';
import { CustomerCardChangeComponent } from './../customer-card-change/customer-card-change.component';
import { EntrepriseCustomerDashboardComponent } from './entreprise-customer-dashboard/entreprise-customer-dashboard.component';
import { NotFoundDocumentComponent } from './not-found-document/not-found-document.component';
import { ParticularCustomerDashboardComponent } from './particular-customer-dashboard/particular-customer-dashboard.component';
import { AjouterModifierInfoNoteComponent } from './_shared';
import { CustomerReferentResolver } from '../../_core/resolvers/customer-dashboard/customer-referent.resolver';
import { CustomerComplaintResolver } from '../../_core/resolvers/customer-dashboard/customer-complaint.resolver';
import { AbcPageComponent } from '../abc-page/abc-page.component';
import { LiveEngageResolver } from 'src/app/_core/resolvers/customer-dashboard/abc.resolver';
import { Resolver } from 'dns';
import { resolve } from 'q';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { EncondingGuard } from 'src/app/_core/guards/encoding.guard';
import { AddDocumentComponent } from './add-document/add-document.component';
import { DocumentFullResolver } from '../../_core/resolvers/customer-dashboard/documents-all.resolver';
import { DocumentTypeCustomerResolver } from '../../_core/resolvers/customer-dashboard/document-customer-type.resolver';
import { HomologationsIdsResolver } from './../../_core/resolvers/homologations-ids.resolver';

const dashboardParticulierResolvers = {
  //parcLignes: ParcLigneResolver,
  //parcServices: ParcServicesResolver,
  infoClientLight: InfoClientResolver,
  //typeDocuments: TypeDocumentResolver,
  //documents: DocumentResolver,
 // cordonnes: CordonnesResolver,
  infoCustomer: InfoProfilResolver,
  //goodToKnow: GoodToKnowResolver,
  totalDebt: TotalsDebtResolver,
  //infoFacturation: InfoNoteFacturationResolver,
  dateRecouvrement: DateRecouvrementResolver,
  //requestsCustomer: RequestCustomerResolver,
  //referents: CustomerReferentResolver,
  //interlocutorList: InterlocutorListResolver,
  //customerComplaint: CustomerComplaintResolver
  homologationsIds: HomologationsIdsResolver
};

const routes: Routes = [
  {
    path: 'particular/:customerId',
    data: {
      breadcrumb: 'Page.CustomerDashboardComponent.breadcrumb'
    },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        canActivate: [CheckBrowserVersionGuard,EncondingGuard],
        component: ParticularCustomerDashboardComponent,
        resolve: dashboardParticulierResolvers,
        data: {
          breadcrumb: 'Page.CustomerDashboardComponent.breadcrumb'
        }
      },
      {
        path: 'modification',
        canActivate: [CheckBrowserVersionGuard],
        component: CustomerCardChangeComponent,
        data: {
          breadcrumb: 'Page.CustomerCardChangeComponent.breadcrumb'
        }
      },
      {
        path: 'modification-note/:personIdNote',
        canActivate: [CheckBrowserVersionGuard,EncondingGuard],
        component: AjouterModifierInfoNoteComponent,
        resolve: {
          infoCustomer: InfoProfilResolver,
          dateRecouvrement: DateRecouvrementResolver,
          infoFacturation: InfoNoteFacturationResolver,
          totalDebt: TotalsDebtResolver
        },
        data: {
          breadcrumb: 'Page.CustomerCardChangeComponent.breadcrumb'
        }
      }
    ]
  },
  {
    path: 'entreprise/:customerId',
    data: {
      breadcrumb: 'Page.CustomerDashboardComponent.breadcrumb'
    },
    children: [
      {
        path: 'modification',
        canActivate: [CheckBrowserVersionGuard],
        component: CustomerCardChangeComponent,
        data: {
          breadcrumb: 'Page.CustomerCardChangeComponent.breadcrumb'
        }
      },
      {
        path: 'modification-note/:personIdNote',
        canActivate: [CheckBrowserVersionGuard, EncondingGuard],
        component: AjouterModifierInfoNoteComponent,
        resolve: {
          infoCustomer: InfoProfilResolver,
          dateRecouvrement: DateRecouvrementResolver,
          infoFacturation: InfoNoteFacturationResolver,
          totalDebt: TotalsDebtResolver
        },
        data: {
          breadcrumb: 'Page.CustomerCardChangeComponent.breadcrumb'
        }
      },
      {
        path: '',
        canActivate: [CheckBrowserVersionGuard, EncondingGuard],
        component: EntrepriseCustomerDashboardComponent,
        resolve: {
          //beneficiares: BeneficiairesResolver,
          //parcServicesEntreprise: ParcServicesEntrepriseResolver,
          infoClientLight: InfoClientResolver,
          totalNumberOfRecouverement: TotalNumberRecouverementResolver,
          //cordonnes: CordonnesResolver,
          totalDebt: TotalsDebtResolver,
          infoFacturation: InfoNoteFacturationResolver,
          dateRecouvrement: DateRecouvrementResolver,
          infoCustomer: InfoProfilResolver,
          severalCustomerTit: SeveralCustomersTitulaireResolver,
          homologationsIds: HomologationsIdsResolver
         // referents: CustomerReferentResolver,
         // goodToKnow: GoodToKnowResolver,
         // typeDocuments : TypeDocumentResolver,
         // documents : DocumentResolver,
         // requestsCustomer: RequestCustomerResolver,
         // interlocutorList: InterlocutorListResolver,
        //  customerComplaint: CustomerComplaintResolver

        },
        data: {
          breadcrumb: 'Page.CustomerDashboardComponent.breadcrumb'
        }
      }
    ]
  },
  {
    path: ':customerId/see-all',
    loadChildren: () => import('./see-all/see-all.module').then(m => m.SeeAllModule)
  },
  {
    path: ':customerId/financial-detail',
    canActivate: [CheckBrowserVersionGuard],
    loadChildren: () => import('../financial-detail/financial-detail.module').then(m => m.FinancialDetailModule)
  },
  {
    path: ':customerId/detail',
    canActivate: [CheckBrowserVersionGuard],
    loadChildren: () => import('../customer-dashboard-detail/customer-dashboard-detail.module').then(m => m.CustomerDashboardDetailModule)
  },
  {
    path: ':customerId/request',
    canActivate: [CheckBrowserVersionGuard , NgxPermissionsGuard],
    loadChildren: () => import('../request/request.module').then(m => m.RequestModule)
  },
  {
    path: ':customerId/interaction',
    canActivate: [CheckBrowserVersionGuard],
    loadChildren: () => import('../interaction/interaction.module').then(m => m.InteractionModule)
  },
  {
    path: ':customerId/park-item',
    canActivate: [CheckBrowserVersionGuard],
    loadChildren: () => import('../park-item/park-item.module').then((m) => m.ParkItemModule)
  },
  {
    path: ':customerId/hardware-park-item',
    canActivate: [CheckBrowserVersionGuard],
    loadChildren: () => import('../hardware-park-item/hardware-park-item.module').then((m) => m.HardwareParkItemModule)
  },

  {
    path: ':customerId/cart',
    canActivate: [CheckBrowserVersionGuard, EncondingGuard],
    loadChildren: () => import('../cart/cart.module').then((m) => m.CartModule)
  },
  {
    path: ':customerId/cri',
    canActivate: [CheckBrowserVersionGuard, EncondingGuard],
    loadChildren: () => import('../cri/cri.module').then((m) => m.CriModule)
  },
  {
    path: ':customerId/interlocutor-usage',
    canActivate: [CheckBrowserVersionGuard, EncondingGuard],
    loadChildren: () => import('../interlocutor-usage/interlocutor-usage.module').then((m) => m.InterlocutorUsageModule)
  },
  {
    path: 'not-found-document',
    component: NotFoundDocumentComponent  
  },
  {
    path: 'abc/:opaqueId',
    component: AbcPageComponent,
    resolve: {
      abcData : LiveEngageResolver
    }  
  },
  {
    path: ':customerId/add-document',
    canActivate: [CheckBrowserVersionGuard],
    component: AddDocumentComponent,
    resolve: {
      infoProfil: InfoProfilResolver,
      goodToKnow: GoodToKnowResolver,
      recoveryDate: DateRecouvrementResolver,
      documentsTitle: DocumentTitleResolver,
      documentsType: TypeDocumentResolver,
      documentTypeRequest: DocumentFullResolver,
      documentTypeCustomer: DocumentTypeCustomerResolver,
      totalDebt: TotalsDebtResolver
    }
  },

  {
    path: ':customerId/bill-management',
    canActivate: [CheckBrowserVersionGuard],
    loadChildren: () => import('../bill-management/bill-management.module').then(m => m.BillManagementModule)
  },
  {
    path: 'management-batches',
    canActivate: [CheckBrowserVersionGuard],
    loadChildren: () => import('../management-batches/management-batches.module').then(m => m.ManagementBatchesModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerDashboardRoutingModule {}
