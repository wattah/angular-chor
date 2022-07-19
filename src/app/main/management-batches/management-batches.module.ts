import { ConfirmationDialogService } from './../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { BillingService } from './../../_core/services/billing.service';
import { DocumentService } from './../../_core/services/documents-service';
import { ParametrizePopupService } from './../bill-management/bill-management-detail/parametrize-popup.service';
import { BillManagementService } from './../bill-management/bill-management-detail/bill-management.service';
import { ParametrizePopupComponent } from './../bill-management/parametrize-popup/parametrize-popup.component';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from '../../_shared/shared.module';
import { MainSharedModule } from '../_shared/main-shared.module';
import { ManagementBatchesComponent } from './management-batches.component';
import { BillsComponent } from './bills/bills.component';
import { CheckboxRendrerComponent } from './checkbox-rendrer/checkbox-rendrer.component';
import { ManagementBatchesRoutingModule } from "./management-batches-routing.module";
import { ReportsComponent } from "./reports/reports.component";
import { LoadingFiftyDComponent } from "./loading-fifty-d/loading-fifty-d.component";
import { BillCellRendererComponent } from "./bills/bill-cell-renderer/bill-cell-renderer.component";
import { CancelConfirmationPopUpComponent } from "../../_shared/components";
import { RelookingPopupConfirmationComponent } from "../../_shared/components/relooking/relooking-popup-confirmation/relooking-popup-confirmation.component";
import { LoadingFiftyRendererComponent } from "./loading-fifty-renderer/loading-fifty-renderer.component";






const COMPONENTS = [
  ManagementBatchesComponent,
  ReportsComponent,
  BillsComponent,
  CheckboxRendrerComponent,
  LoadingFiftyDComponent,
  BillCellRendererComponent,
  LoadingFiftyRendererComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    SharedModule,
    MainSharedModule,
    ManagementBatchesRoutingModule
  
  ],
  providers: [
    BillManagementService,
    ParametrizePopupService,
    DocumentService,
    BillingService,
    ConfirmationDialogService
  ]
})
export class ManagementBatchesModule { }


