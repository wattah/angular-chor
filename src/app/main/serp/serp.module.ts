import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../_shared/shared.module';
import { SerpComponents, SerpRoutingModule } from './serp-routing.module';
import { SerpComponent } from './serp.component';

@NgModule({
  imports: [SerpRoutingModule, CommonModule, SharedModule],
  declarations: [SerpComponent, SerpComponents]
})
export class SerpModule {}
