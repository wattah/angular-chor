import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BillInformationComponent } from "./creation-line/bill-information/bill-information.component";
import { BillRequiredInfoComponent } from "./creation-line/bill-required-info/bill-required-info.component";
import { CustomerPenicheComponent } from "./creation-line/customer-peniche/customer-peniche.component";
import { LineDetailComponent } from "./creation-line/line-detail/line-detail.component";
import { CreationLineComponent } from "./creation-line.component";
import { CreationLineRoutingModule } from "./creation-line-routing.module";
import { SharedModule } from "../../../_shared/shared.module";
import { MainSharedModule } from "../../_shared/main-shared.module";
import { ParkItemFormUpdateComponent } from './creation-line/park-item-form-update/park-item-form-update.component';


const COMPONENTS = [
  CreationLineComponent, 
  BillInformationComponent, 
  BillRequiredInfoComponent, 
  CustomerPenicheComponent, 
  LineDetailComponent,
  ParkItemFormUpdateComponent,
   ];

@NgModule({
    declarations: COMPONENTS,
    imports: [
      CommonModule, 
      SharedModule, 
      MainSharedModule, 
      CreationLineRoutingModule],
})
export class CreationLineModule {}
