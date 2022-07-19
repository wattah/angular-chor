import { NgxPermissionsModule } from 'ngx-permissions';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';

// import { AdaBannerModule } from '../ada-banner/ada-banner.module';
import { SharedModule } from '../_shared/shared.module';
import { BreadcrumbComponent, FooterComponent, LanguageComponent, SearchBarComponent, ToolbarComponent } from './components';
import { CacheInterceptor } from './interceptors/cache.interceptor';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { BasicAuthInterceptor } from './interceptors/basic-auth-interceptor';


const COMPONENTS = [ToolbarComponent, BreadcrumbComponent, LanguageComponent, FooterComponent, SearchBarComponent];

@NgModule({
  // imports: [RouterModule, SharedModule, AdaBannerModule],
  imports: [RouterModule, SharedModule , NgxPermissionsModule.forChild()],
  declarations: [...COMPONENTS],
  exports: [RouterModule, ToolbarComponent, BreadcrumbComponent, FooterComponent]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
       { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }, 
       { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
