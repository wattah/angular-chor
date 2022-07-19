import { AgGridModule } from '@ag-grid-community/angular';
import { RadioBottonRenderComponent } from './../homologation/homologation-approval-documents/radio-botton-render/radio-botton-render.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../app/_shared/shared.module';
import { MainSharedModule } from '../../_shared/main-shared.module';

import { ContractualStatusComponent } from './contractual-status/contractual-status.component';
import { CustomerPenicheComponent } from './customer-peniche/customer-peniche.component';
import { DataParnasseComponent } from './data-parnasse/data-parnasse.component';
import { ProfilComponent } from './profil/profil.component';
import { RelationalComponent } from './relational/relational.component';
import { RelationalConsultationComponent } from './relational-consultation/relational-consultation.component';
import { RelationalModificationComponent } from './relational-modification/relational-modification.component';
import { SaleApprovalComponent } from './sale-approval/sale-approval.component';
import { ProfileContractComponent } from './profile-contract.component';
import { ProfileContractCreationComponent } from './profile-contract-creation/profile-contract-creation.component';
import { ProfileContractRoutingModule } from './profile-contract-routing.module';
import { ProfilConsultationComponent } from './profil-consultation/profil-consultation.component';
import { ProfilModificationComponent } from './profil-modification/profil-modification.component';
import { ProfilEntrepriseComponent } from './profil-entreprise/profil-entreprise.component';
import { ProfilEntrepriseConsultationComponent } from './profil-entreprise-consultation/profil-entreprise-consultation.component';
import { ProfilEntrepriseModificationComponent } from './profil-entreprise-modification/profil-entreprise-modification.component';
import { CustomerPenicheConsultationComponent } from './customer-peniche-consultation/customer-peniche-consultation.component';
import { CustomerPenicheModificationComponent } from './customer-peniche-modification/customer-peniche-modification.component';
import { DataParnasseConsultationComponent } from './data-parnasse-consultation/data-parnasse-consultation.component';
import { DataParnasseModificationComponent } from './data-parnasse-modification/data-parnasse-modification.component';
import { ContractualStatusConsultationComponent } from './contractual-status-consultation/contractual-status-consultation.component';
import { ContractualStatusModificationComponent } from './contractual-status-modification/contractual-status-modification.component';
import { SaleApprovalConsultationComponent } from './sale-approval-consultation/sale-approval-consultation.component';
import { SaleApprovalModificationComponent } from './sale-approval-modification/sale-approval-modification.component';
import { CancelConfirmationPopUpComponent } from '../../../_shared/components';
import { DataParnasseBackUpInfoComponent } from './data-parnasse-back-up-info/data-parnasse-back-up-info.component';




const COMPONENTS = [
  ContractualStatusComponent,
  CustomerPenicheComponent,
  DataParnasseComponent,
  ProfilComponent,
  ProfilEntrepriseComponent,
  ProfilConsultationComponent,
  ProfilModificationComponent,
  ProfilEntrepriseConsultationComponent,
  ProfilEntrepriseModificationComponent,
  CustomerPenicheConsultationComponent,
  CustomerPenicheModificationComponent, 
  ContractualStatusConsultationComponent,
  ContractualStatusModificationComponent,  
  RelationalComponent,
  RelationalConsultationComponent,
  RelationalModificationComponent,

  DataParnasseConsultationComponent,
  DataParnasseModificationComponent,
  DataParnasseBackUpInfoComponent,

  SaleApprovalComponent,
  SaleApprovalConsultationComponent,
  SaleApprovalModificationComponent,
  ProfileContractComponent,
  ProfileContractCreationComponent,
  RadioBottonRenderComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    SharedModule,
    MainSharedModule,
    ProfileContractRoutingModule,
    AgGridModule.withComponents([ RadioBottonRenderComponent ])
  ],
})
export class ProfileContractModule { }
