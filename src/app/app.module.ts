import { NgxPermissionsModule } from 'ngx-permissions';
import { AuthTokenService } from './_core/services/auth_token';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID, NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProgressBarModalComponent } from './progressbar-modal.component';
import { CoreModule } from './_core/core.module';
import { WebpackTranslateLoader } from './_core/utils/webpack-translate-loader';
 import { AdaBannerModule } from './ada-banner/ada-banner.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LogoutPageComponent } from './logout-page/logout-page.component';


registerLocaleData(localeFr);

@NgModule({
  declarations: [AppComponent, NotFoundComponent , ProgressBarModalComponent, LogoutPageComponent],
  imports: [
    AdaBannerModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader
      }
    }),
    CoreModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
    DashboardModule,
    NgxPermissionsModule.forRoot(),
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    {provide: APP_INITIALIZER,useFactory: (authToken: AuthTokenService) =>() => authToken.doAuthenticate(),deps: [AuthTokenService],multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
