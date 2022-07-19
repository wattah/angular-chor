import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AutosizeModule } from 'ngx-autosize';

import { SharedModule } from '../../../_shared/shared.module';
import { MainSharedModule } from '../../_shared/main-shared.module';
import { HomologationAccessPopupComponent } from './../../_shared/homologation-access-popup/homologation-access-popup.component';

import { 
   ParcServicesComponent , 
   ParcLignesComponent, 
   DocumentFullListComponent,
   ContactsInformationDetailsComponent,
   ParcServicesDetailComponent,
   FinanceComponent,
   DebtTableComponent,
   BillingInfoComponent,
   AjouterModifierInfoNoteComponent,
   InteractionsCustomerComponent,
   RequestsMonitoringComponent
  } from '.';
import { TeamParnasseComponent } from './team-parnasse/team-parnasse.component';
import { FiltersFormComponent } from './document-full-list/filters-form/filters-form.component';

const COMPONENTS = [
  ParcServicesComponent,
  ParcLignesComponent,
  DocumentFullListComponent,
  FiltersFormComponent,
  ContactsInformationDetailsComponent,
  ParcServicesDetailComponent,
  FinanceComponent,
  DebtTableComponent,
  BillingInfoComponent,
  AjouterModifierInfoNoteComponent,
  InteractionsCustomerComponent,
  TeamParnasseComponent,
  RequestsMonitoringComponent
];

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule, MainSharedModule, AutosizeModule],
  declarations: COMPONENTS,
  entryComponents: [HomologationAccessPopupComponent],
  exports: COMPONENTS
})
export class CustomerDashboardSharedModule {}
