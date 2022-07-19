import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SerpComponent } from './serp.component';

import { 
  SerpAllComponent, 
  SerpFiltreComponent,
  SerpMultipleTablesComponent,
  SerpInterlocutorsComponent,
  SerpProductsComponent,
  SerpErrorComponent,
  SerpImeiSerialNumbreComponent,
  TerminalsAcquiredComponent,
  TerminalsUsedComponent,
  ServiceMaterialsComponent
} from './serp-components';

import {
  AllResolver,
  ContactsResolver,
  InterlocuteursResolver,
  MembersResolver,
  NonMembersResolver,
  ProductsResolver,
  ProspectsResolver,
  ResiliesResolver 
} from '../../_core/resolvers';

export const SerpComponents = [
  // SearchBtnRendererComponent,
  SerpAllComponent,
  SerpFiltreComponent,
  SerpMultipleTablesComponent,
  SerpInterlocutorsComponent,
  SerpProductsComponent,
  SerpErrorComponent,
  SerpImeiSerialNumbreComponent,
  TerminalsAcquiredComponent,
  TerminalsUsedComponent,
  ServiceMaterialsComponent
];

const routes: Routes = [
  {
    path: '',
    component: SerpComponent,
    resolve: {
      all: AllResolver,
      contacts: ContactsResolver,
      interlocutors: InterlocuteursResolver,
      members: MembersResolver,
      nonMembers: NonMembersResolver,
      products: ProductsResolver,
      prospects: ProspectsResolver,
      resilies: ResiliesResolver 
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    children: [
      {
        path: 'all',
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        component: SerpAllComponent,
        resolve: {
          all: AllResolver
        }
      },
      {
        path: 'members',
        component: SerpMultipleTablesComponent,
        resolve: {
          gridData: MembersResolver
        },
        data: {
          memberType: { isMember: true }
        },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange'
      },
      {
        path: 'non-members',
        component: SerpMultipleTablesComponent,
        resolve: {
          gridData: NonMembersResolver
        },
        data: {
          memberType: { isMember: false }
        },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange'
      },
      {
        path: 'contacts',
        component: SerpMultipleTablesComponent,
        resolve: {
          gridData: ContactsResolver
        },
        data: {
          memberType: { isMember: false }
        },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange'
      },
      {
        path: 'prospects',
        component: SerpMultipleTablesComponent,
        resolve: {
          gridData: ProspectsResolver
        },
        data: {
          memberType: { isMember: false }
        },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange'
      },
      {
        path: 'interlocutorsType',
        component: SerpInterlocutorsComponent,
        resolve: {
          interlocuteurs: InterlocuteursResolver
        },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange'
      },
      {
        path: 'resilies',
        component: SerpMultipleTablesComponent,
        resolve: {
          gridData: ResiliesResolver
        },
        data: {
          memberType: { isMember: false }
        },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange'
      },
      {
        path: 'produits',
        component: SerpProductsComponent,
        resolve: {
          products: ProductsResolver
        },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange'
      }
    ]
  },
  {
    path: 'membersAndNonMembers',
    component: SerpAllComponent,
    resolve: {
      all: AllResolver
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
  {
    path: 'imei',
    component: SerpImeiSerialNumbreComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SerpRoutingModule {}
