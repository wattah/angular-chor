import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterlocutorRoutingModule } from './interlocutor-usage-routing.module';
import { CreationFirstStepComponent } from './creation-first-step/creation-first-step.component';
import { InterlocutorUsageComponent } from './interlocutor-usage.component';
import { SharedModule } from '../../_shared/shared.module';
import { MainSharedModule } from '../_shared/main-shared.module';
import { CreationUsageComponent } from './creation-usage/creation-usage.component';
import { UsageFormComponent } from './usage-form/usage-form.component';
import { InterlocutorFormComponent } from './interlocutor-form/interlocutor-form.component';
import { ModificationUsageComponent } from './modification-usage/modification-usage.component';
import { CreationInterlocutorComponent } from './creation-interlocutor/creation-interlocutor.component';
import { ModificationParticulierComponent } from './modification-particulier/modification-particulier.component';
import { ModificationEntrepriseComponent } from './modification-entreprise/modification-entreprise.component';

@NgModule({
  declarations: [CreationFirstStepComponent, InterlocutorUsageComponent, CreationUsageComponent,
    UsageFormComponent, ModificationUsageComponent, CreationInterlocutorComponent,
    ModificationEntrepriseComponent, InterlocutorFormComponent, ModificationParticulierComponent],
  imports: [
    CommonModule,
    InterlocutorRoutingModule,
    SharedModule,
    MainSharedModule
  ],
})
export class InterlocutorUsageModule { }
