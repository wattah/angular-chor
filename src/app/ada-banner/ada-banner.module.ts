import { NgxPermissionsModule } from 'ngx-permissions';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdaBannerComponent } from './ada-banner.component';

@NgModule({
  declarations: [AdaBannerComponent],
  imports: [CommonModule , NgxPermissionsModule.forChild()],
  exports: [AdaBannerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdaBannerModule {}
