import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutosizeModule } from 'ngx-autosize';

import { InteractionRoutingModule } from './interaction-routing.module';
import { InteractionComponent } from './interaction.component';
import { MainSharedModule } from '../_shared/main-shared.module';
import { SharedModule } from '../../_shared/shared.module';
import { InteractionCreation360FormComponent } from './interaction-creation/interaction-creation-360-form/interaction-creation-360-form.component';
import { InteractionCreationFormComponent } from './interaction-creation/interaction-creation-form/interaction-creation-form.component';
import { InteractionDetailComponent } from './interaction-detail/interaction-detail.component';
import { InteractionDetailMailComponent } from './interaction-detail-mail/interaction-detail-mail.component';
import { InteractionDetailSmsComponent } from './interaction-detail-sms/interaction-detail-sms.component';
import { InteractionCreationComponent } from './interaction-creation/interaction-creation.component';
import { MailSendingComponent } from './sending-mail/mail-sending.component';
import { MailSendingPopUpComponent } from './mail-sending-pop-up/mail-sending-pop-up.component';
import { CancelConfirmationPopUpComponent } from '../../_shared/components';
import { SendingSmsComponent } from './sending-sms/sending-sms.component';
import { SmsPopUpComponent } from './sms-pop-up/sms-pop-up.component';
import { InteractionCompleteHistoryComponent } from './complete-history/interaction-complete-history.component';
import { PreviewMailComponent } from './preview-mail/preview-mail.component';
import { PopAddMailComponent } from '../_shared/pop-add-mail/pop-add-mail.component';
import { PopAddDocumentComponent } from '../_shared/pop-add-document/pop-add-document.component';

const COMPONENTS = [
  InteractionCreation360FormComponent,
  InteractionCreationFormComponent,
  InteractionCreationComponent,
  MailSendingComponent,
  InteractionComponent,
  InteractionDetailComponent, 
  InteractionDetailMailComponent, 
  InteractionDetailSmsComponent,
  MailSendingPopUpComponent,
  InteractionCompleteHistoryComponent,
  MailSendingPopUpComponent,
  PreviewMailComponent
];

@NgModule({
  declarations: [ COMPONENTS, SendingSmsComponent, SmsPopUpComponent, PreviewMailComponent ],
  imports: [
    CommonModule,
    InteractionRoutingModule,
    SharedModule,
    MainSharedModule,
    AutosizeModule
  ],
})
export class InteractionModule { }
