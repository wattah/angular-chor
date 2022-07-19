import { RequestImmediateClosureComponent } from './request-immediate-closure/request-immediate-closure.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestRoutingModule } from './request-routing.module';
import { SharedModule } from '../../_shared/shared.module';
import { MainSharedModule } from '../_shared/main-shared.module';
import { RequestComponent } from './request.component';
import { ParcoursListComponent } from './parcours-list/parcours-list.component';
import { RequestCreationComponent } from './request-creation/request-creation.component';
import { TaskCreationComponent } from './task-creation/task-creation.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { TaskCreationFormComponent } from './task-creation/task-creation-form/task-creation-form.component';
import { TaskCreationConfirmationPopUpComponent } from './task-creation/task-creation-confirmation-pop-up/task-creation-confirmation-pop-up.component';
import { CancelConfirmationPopUpComponent } from '../../_shared/components/cancel-confirmation-pop-up/cancel-confirmation-pop-up.component';
import { UpdateTaskComponent } from './update-task/update-task.component';
import { TaskCreationRequestSummaryComponent } from './_shared/task-creation-request-summary/task-creation-request-summary.component';
import { UpdateTaskFormComponent } from './update-task/task-update-form/task-update-form.component';
import { AssignmentTaskComponent } from './task-assignment/task-assignment.component';
import { AssignmentTaskFormComponent } from './task-assignment/task-assignment-form/task-assignment-form.component';
import { DynamicFormQuestionComponent } from '../_shared/dynamic-form-question/dynamic-form-question.component';
import {AutosizeModule} from 'ngx-autosize';
import { 
  CheckingRequestCurrentlyOpenedPopUpComponent 
} from './request-creation/checking-request-currently-opened-pop-up/checking-request-currently-opened-pop-up.component'
import { RequestSharedModule } from './_shared/request-shared.module';
import { RequestCloserComponent } from './request-closer/request-closer.component';
import { ProcedureWelcomeMailComponent } from './procedure-welcome-mail/procedure-welcome-mail.component';

const COMPONENTS = [
  RequestComponent,
  ParcoursListComponent,
  RequestCreationComponent,
  TaskCreationComponent,
  UpdateTaskComponent,
  UpdateTaskFormComponent,
  TaskCreationRequestSummaryComponent,
  TaskCreationFormComponent,
  TaskCreationConfirmationPopUpComponent,
  TaskDetailsComponent,
  RequestImmediateClosureComponent,
  AssignmentTaskComponent,
  AssignmentTaskFormComponent,
  CheckingRequestCurrentlyOpenedPopUpComponent,
  RequestCloserComponent,
  ProcedureWelcomeMailComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    RequestRoutingModule,
    SharedModule,
    MainSharedModule,
    AutosizeModule,
    RequestSharedModule
  ],
})
export class RequestModule { }
