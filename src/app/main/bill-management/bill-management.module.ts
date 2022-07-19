import { ParametrizePopupComponent } from './parametrize-popup/parametrize-popup.component';
import { DocumentService } from './../../_core/services/documents-service';
import { BillManagementService } from './bill-management-detail/bill-management.service';
import { ParametrizePopupService } from './bill-management-detail/parametrize-popup.service';
import { ValidateLivrableService } from './validate-livrable.service';
import { RelookingPopupConfirmationComponent } from '../../_shared/components/relooking/relooking-popup-confirmation/relooking-popup-confirmation.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../_shared/shared.module';
import { BillManagementComponent } from './bill-management.component';
import { BillManagementDetailComponent } from './bill-management-detail/bill-management-detail.component';
import { BillManagementModuleRoutingModule } from './bill-management-routing.module';
import { MainSharedModule } from '../_shared/main-shared.module';
import { AddCreditComponent } from './add-credit/add-credit.component';
import { OtherCreditComponent } from './other-credit/other-credit.component';
import { BillManagementDetailCellRendererComponent } from './bill-management-detail-cell-renderer/bill-management-detail-cell-renderer.component';
import { CheckboxRendrerComponent } from './checkbox-rendrer/checkbox-rendrer.component';

const COMPONENTS = [
  BillManagementComponent,
  BillManagementDetailComponent,
  CheckboxRendrerComponent,
  AddCreditComponent,
  OtherCreditComponent,
  BillManagementDetailCellRendererComponent,
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    SharedModule,
    MainSharedModule,
    BillManagementModuleRoutingModule
  ],
  providers:[
    ValidateLivrableService,
    BillManagementService,
    ParametrizePopupService,
    DocumentService
  ]
})
export class BillManagementModule { }


