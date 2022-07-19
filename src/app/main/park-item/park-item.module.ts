import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParkItemRoutingModule } from './park-item-routing.module';
import { ParkItemComponent } from './park-item/park-item.component';
import { ParkItemDetailComponent } from './park-item-detail/park-item-detail.component';
import { SharedModule } from '../../_shared/shared.module';
import { MainSharedModule } from '../_shared/main-shared.module';
import { ParkItemGeneralInformationsComponent 
} from './park-item-detail/park-item-general-informations/park-item-general-informations.component';
import { ParkItemListParticularComponent } from './park-item-list-particular/park-item-list-particular.component';
import { ParkItemDetailMobileComponent } from './park-item-detail/park-item-detail-mobile/park-item-detail-mobile.component';
import { UnlockParkItemPopUpComponent } from './pop-up/unlock-park-item-pop-up/unlock-park-item-pop-up.component';
import { DeleteParkItemPopUpComponent } from './pop-up/delete-park-item-pop-up/delete-park-item-pop-up.component';
import { ActivateParkItemPopUpComponent } from './pop-up//activate-park-item-pop-up/activate-park-item-pop-up.component';
import { SuspendParkItemPopUpComponent } from './pop-up/suspend-park-item-pop-up/suspend-park-item-pop-up.component';
import { ParkItemInternetDetailComponent } from './park-item-detail/park-item-internet-detail/park-item-internet-detail.component';
import { ParkItemListEnterpriseComponent } from './park-item-list-enterprise/park-item-list-enterprise.component';

@NgModule({
  declarations: [
  ParkItemComponent, 
  ParkItemDetailComponent, 
  ParkItemGeneralInformationsComponent,
  ParkItemListParticularComponent,
  ParkItemListEnterpriseComponent,
  ParkItemInternetDetailComponent,
  UnlockParkItemPopUpComponent, 
  DeleteParkItemPopUpComponent,
  ActivateParkItemPopUpComponent,
  ParkItemDetailMobileComponent,
  SuspendParkItemPopUpComponent],
  imports: [
    CommonModule,
    ParkItemRoutingModule,
    SharedModule,
    MainSharedModule
  ],
})
export class ParkItemModule { }
