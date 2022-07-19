import { AgGridModule } from '@ag-grid-community/angular';
import { FileNotFoundPopupComponent } from './homologation/homologation-approval-documents/file-not-found-popup/file-not-found-popup.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../_shared/shared.module';
import { RequestUpdateComponent } from '../request/request-update/request-update.component';
import { MainSharedModule } from '../_shared/main-shared.module';
import { CustomerDashboardDetailRoutingModule } from './customer-dashboard-detail-routing.module';
import { CustomerDashboardDetailComponent } from './customer-dashboard-detail.component';
import { DetailRequestInteractionListComponent, DetailRequestSummaryComponent, 
  DetailRequestTaskListComponent, DetailRequestDocumentListComponent } from './detail-request/components';
import { DetailRequestComponent } from './detail-request/detail-request.component';

import { TaskClosureComponent } from './detail-task/components/task-closure/task-closure.component';
import { DetailTaskComponent } from './detail-task/detail-task.component';


import { HomologationComponent , HomologationKeyDatesComponent ,
  HomologationContractHolderComponent , HomologationContractualInformationComponent ,
  HomologationHolderBusinessControlComponent , HomologationItemMobileDetailComponent,
  PreHomologationHolderBusinessControlComponent ,
   HomologationItemServiceComponent , HomologationApprovalDocumentsComponent,
    HomologationItemMobileComponent, HomologationBeneficiaryListComponent, 
    HomologationBeneficiariesBusinessControlComponent, HomologationCommiteeSelectionComponent } from './homologation';
import { AddDocumentDetailComponent } from './add-document-detail/add-document-detail.component';
import { ProfileContractModule } from './profile-contract/profile-contract.module';
import { CreationLineModule } from './creation-line/creation-line.module';
import { GoodToKnowModificationComponent } from './good-to-know-modification/good-to-know-modification.component';
import { DetailRequestTaskCompletedComponent } from './detail-request/components/detail-request-task-completed/detail-request-task-completed.component';
import { ToggleLinkTaskCompletedRendererComponent } from './detail-request/components/toggle-link-task-completed-renderer/toggle-link-task-completed-renderer.component';
import { TaskCompletedAnwserCellRenderComponent } from './detail-request/components/detail-request-task-completed/task-completed-anwser-cell-render/task-completed-anwser-cell-render.component';




const COMPONENTS_HOMOLOGATION = [
  HomologationComponent, HomologationKeyDatesComponent, 
  HomologationContractHolderComponent, 
  HomologationContractualInformationComponent,
  HomologationItemServiceComponent,
  HomologationItemMobileComponent,
  HomologationHolderBusinessControlComponent,
  PreHomologationHolderBusinessControlComponent,
  HomologationApprovalDocumentsComponent ,
  HomologationBeneficiaryListComponent,
  HomologationItemMobileDetailComponent,
  HomologationBeneficiariesBusinessControlComponent,
  HomologationCommiteeSelectionComponent,
  FileNotFoundPopupComponent
];

const COMPONENTS = [
  CustomerDashboardDetailComponent, 
  DetailRequestComponent, 
  DetailRequestSummaryComponent,
  DetailRequestTaskListComponent,
  DetailRequestInteractionListComponent,
  TaskClosureComponent,
  DetailTaskComponent,
  RequestUpdateComponent,
  DetailRequestDocumentListComponent,
  GoodToKnowModificationComponent,
  DetailRequestTaskCompletedComponent,
  ToggleLinkTaskCompletedRendererComponent
  // TaskSummaryComponent
]; 

@NgModule({
  declarations: [...COMPONENTS, ...COMPONENTS_HOMOLOGATION, AddDocumentDetailComponent, TaskCompletedAnwserCellRenderComponent],
  imports: [
    CommonModule,
    MainSharedModule,
    CustomerDashboardDetailRoutingModule,
    SharedModule,
    ProfileContractModule,
    CreationLineModule,
    AgGridModule.withComponents([TaskCompletedAnwserCellRenderComponent])
  ],
})
export class CustomerDashboardDetailModule { }
