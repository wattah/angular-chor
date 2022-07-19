import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../_shared/shared.module';
import { SeeAllRoutingModule } from './see-all-routing.module';
import { SeeAllComponent } from './see-all.component';
import { CustomerDashboardSharedModule } from '../_shared/customer-dashboard-shared.module';
import { MainSharedModule } from '../../_shared/main-shared.module';

@NgModule({
  declarations: [ SeeAllComponent ],
  imports: [CommonModule, SeeAllRoutingModule, CustomerDashboardSharedModule, SharedModule, MainSharedModule]
})
export class SeeAllModule {}
