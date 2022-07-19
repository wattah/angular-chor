import { SessionGuard } from './_core/guards/session.guard';
import { LogoutPageComponent } from './logout-page/logout-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './_core/guards/auth.guard';
import { CheckBrowserVersionGuard } from './_core/guards/check-browser-version-guard';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard]
  },
  {
    path: 'customer-dashboard',
    canActivate: [CheckBrowserVersionGuard, AuthGuard , NgxPermissionsGuard],
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('./main/customer-dashboard/customer-dashboard.module').then(m => m.CustomerDashboardModule),
    data: {
      permissions: {
        only: 'consultation_fiche360',
        redirectTo: '/'
      }
    }
  },
  {
    path: 'serp',
    canActivate: [CheckBrowserVersionGuard, AuthGuard],
    loadChildren: () => import('./main/serp/serp.module').then(m => m.SerpModule)
  },
  {
    path: 'logout',
    component: LogoutPageComponent,
    canActivate: [SessionGuard]
  },
  {
    path: '**',
    component: NotFoundComponent,
    data: {
      breadcrumb: 'Page.NotFoundComponent.breadcrumb'
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
