import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HardwareParkItemRoutingModule } from './hardware-park-item-routing.module';
import { HardwareParkItemCreationComponent } from './hardware-park-item-creation/hardware-park-item-creation.component';
import { SharedModule } from '../../_shared/shared.module';
import { HardwareParkItemComponent } from './hardware-park-item/hardware-park-item.component';
import { MainSharedModule } from '../_shared/main-shared.module';
import { HardwareParkItemUpdateComponent } from './hardware-park-item-update/hardware-park-item-update.component';
import { CancelConfirmationPopUpComponent } from '../../_shared/components';

@NgModule({
  declarations: [HardwareParkItemCreationComponent, HardwareParkItemComponent, HardwareParkItemUpdateComponent],
  imports: [
    CommonModule,
    SharedModule,
    MainSharedModule,
    HardwareParkItemRoutingModule
  ],
})
export class HardwareParkItemModule { }
