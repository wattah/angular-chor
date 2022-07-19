import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProfilInformationComponent } from './profil-information/profil-information.component';
import { RecoveryAlertComponent } from './recovery-alert/recovery-alert.component'
import { SeeAllProfilComponent } from './see-all-profil/see-all-profil.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question/dynamic-form-question.component';
import { SharedModule } from '../../_shared/shared.module';
import { TaskAffectationListComponent } from './task-affectation-list/task-affectation-list.component';
import { TaskAffectationComponent } from './task-affectation-list/task-affectation/task-affectation.component';
import { RequestSummaryComponent } from './request-summary/request-summary.component';
 import { TaskSummaryComponent } from '../_shared/task-summary/task-summary.component';

import {AutosizeModule} from 'ngx-autosize';
import { PopAddAddressComponent } from './pop-add-address/pop-add-address.component';
import { NumberInputDirective } from '../../_core/directive/number-input.directive';
import { CharacterInputDirective } from '../../_core/directive/character-input.directive';
import { CanalAcquisitionComponent } from '../customer-dashboard-detail/homologation/homologation-contractual-information/canal-acquisition/canal-acquisition.component';
import { LogoPopUpComponent } from './logo-pop-up/logo-pop-up.component';
import { NumberPhoneInternationalInputDirective } from '../../_core/directive/number-phone-international-input.directive';
import { PopAddMailComponent } from './pop-add-mail/pop-add-mail.component';
import { PopAddDocumentComponent } from './pop-add-document/pop-add-document.component';
import { SharedPopupService } from './shared-popup.service';
import { HomologationAccessPopupComponent } from './homologation-access-popup/homologation-access-popup.component';
import { HomologationAccessService } from './../../_core/services/homologation-access.service';
import { NumberInputAndTwoDigitAfterDotDirective } from '../../_core/directive/number-input-two-digit-after-dot.directive';

const COMPONENTS = [
  ProfilInformationComponent,
  RecoveryAlertComponent,
  SeeAllProfilComponent,
  DynamicFormQuestionComponent,
  TaskAffectationListComponent,
  TaskAffectationComponent,
  RequestSummaryComponent,
  TaskSummaryComponent,
  PopAddAddressComponent,
  NumberInputDirective,
  CharacterInputDirective,
  LogoPopUpComponent,
  CanalAcquisitionComponent,
  NumberPhoneInternationalInputDirective,
  PopAddMailComponent,
  PopAddDocumentComponent,
  HomologationAccessPopupComponent,
  NumberInputAndTwoDigitAfterDotDirective
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule, SharedModule, RouterModule , AutosizeModule
  ],
  providers: [
    SharedPopupService, HomologationAccessService, DecimalPipe,
  ],
  entryComponents: [HomologationAccessPopupComponent],
  exports: COMPONENTS
})
export class MainSharedModule { }
