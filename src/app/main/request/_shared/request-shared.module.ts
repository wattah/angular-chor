import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../_shared/shared.module';

import { RequestCloserFormComponent } from './request-closer-form/request-closer-form.component';

import { RequestRoutingModule } from '../request-routing.module';

const COMPONENTS = [
  RequestCloserFormComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    SharedModule,
    RequestRoutingModule
  ],
  exports: COMPONENTS
  
})
export class RequestSharedModule { }
