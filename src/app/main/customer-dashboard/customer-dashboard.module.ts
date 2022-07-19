import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../_shared/shared.module';
import { MainSharedModule } from '../_shared/main-shared.module';
import { FinancialDetailModule } from './../financial-detail/financial-detail.module';
import { BeneficiaireListComponent } from './beneficiaire-list/beneficiaire.list.component';
import { ContactsInformationComponent } from './contacts-information/contacts-information.component';
import { CustomerDashboardRoutingModule } from  './customer-dashboard-routing.module';
import { CustomerDocumentComponent } from './cutomer-document/customer-document.component';
import { EntrepriseCustomerDashboardComponent } from './entreprise-customer-dashboard/entreprise-customer-dashboard.component';
import { GoodToKnowComponent } from './good-to-know/good-to-know.component';
import { ParticularCustomerDashboardComponent } from './particular-customer-dashboard/particular-customer-dashboard.component';
import { SeeAllModule } from './see-all/see-all.module';
import { CustomerDashboardSharedModule } from './_shared/customer-dashboard-shared.module';
import { CustomerCardChangeComponent } from '../customer-card-change/customer-card-change.component';
import { NotFoundDocumentComponent } from './not-found-document/not-found-document.component';
import { RequestsCustomerComponent } from './requests-customer/requests-customer.component';
import { InterlocutorComponent } from './interlocutor/interlocutor.component';
import { CustomerComplaintComponent } from './customer-complaint/customer-complaint.component';
import { AbcPageComponent } from '../abc-page/abc-page.component';
import { AddDocumentComponent } from './add-document/add-document.component';
import { LinkRendererAgGridComponent } from '../../_shared/components/athena-ag-grid/link-renderer-ag-grid.component';
import { SearchBtnRendererAgGridComponent } from '../../_shared/components/athena-ag-grid/search-btn-renderer-ag-grid.component';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { TabInterlocutorComponent } from './interlocutor/tab-interlocuteur/tab-interlocutor.component';
import { TabUsageComponent } from './interlocutor/tab-usage/tab-usage.component';
const COMPONENTS = [
  GoodToKnowComponent,
  ContactsInformationComponent,
  CustomerDocumentComponent,
  EntrepriseCustomerDashboardComponent,
  ParticularCustomerDashboardComponent,
  BeneficiaireListComponent,
  CustomerCardChangeComponent,
  NotFoundDocumentComponent,
  RequestsCustomerComponent,
  InterlocutorComponent,
  TabInterlocutorComponent,
  TabUsageComponent,
  AbcPageComponent,
  AddDocumentComponent,
  AbcPageComponent
];

@NgModule({
  imports: [CustomerDashboardRoutingModule, SharedModule, CustomerDashboardSharedModule, 
    SeeAllModule, MainSharedModule, FinancialDetailModule , ContentLoaderModule],
  declarations: [COMPONENTS, NotFoundDocumentComponent, CustomerComplaintComponent],
  providers: [DatePipe]
})
export class CustomerDashboardModule {}
