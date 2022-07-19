import { NgxPermissionsGuard } from 'ngx-permissions';
import { UsersNameResolver } from './../_core/resolvers/users-name.resolver';
import { RolesNameResolver } from './../_core/resolvers/roles-name.resolver';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AbsenceAllResolver } from './../_core/resolvers/absence-all.resolver';
import { Runner } from 'protractor';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskMonitoringComponent } from './task-monitoring/task-monitoring.component';
import { RequestMonitoringComponent } from './request-monitoring/request-monitoring.component';
import { AbsenceMonitoringComponent } from './absence-monitoring/absence-monitoring.component';
import { AddAbsenceComponent } from './add-absence/add-absence.component';
import { CheckBrowserVersionGuard } from '../_core/guards/check-browser-version-guard';
import { RequestTypeCustomerResolver } from '../_core/resolvers';
import { PopUpDeleteAbsenceComponent } from './pop-up-delete-absence/pop-up-delete-absence.component';
import { UserResolver } from './../_core/resolvers/customer-dashboard/user.resolvers';
import { RequestsMonitoringResolver } from '../_core/resolvers/requests-monitoring.resolver';
import { AllRequestTypeResolver } from './../_core/resolvers/all-request-type.resolver';
import { AllRolesResolver } from './../_core/resolvers/all-roles.resolver';
import { AllUsersResolver } from './../_core/resolvers/index';
import { ServerSideComponent } from './server-side/server-side.component';
import { AddAbsenceCancelPopUpComponent } from './add-absence-cancel-pop-up/add-absence-cancel-pop-up.component';
import { PopUpMessagesEpcbComponent } from './pop-up-messages-epcb/pop-up-messages-epcb.component';
import { AllActifUsersResolver } from '../_core/resolvers/all-actif-users.resolver';
const breadCrumb = 'Page.HomeComponent.breadcrumb';
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [CheckBrowserVersionGuard],
    data: {
      breadcrumb: breadCrumb
    }
  },
  {
    path: 'task-monitoring',
    component: TaskMonitoringComponent,
    canActivate: [CheckBrowserVersionGuard , NgxPermissionsGuard],
    resolve: {
      listUsers: AllUsersResolver,
      typesRequest: AllRequestTypeResolver,
      listRoles: AllRolesResolver
    },
    data: {
      breadcrumb: 'Page.TaskMonitoringComponent.breadcrumb',
      permissions: {
        only: 'affichage_taches',
        redirectTo: '/'
      }
    }
  },
  {
    path: 'request-monitoring',
    component: RequestMonitoringComponent,
    canActivate: [CheckBrowserVersionGuard , NgxPermissionsGuard],
    data: {
      breadcrumb: 'Page.RequestMonitoringComponent.breadcrumb',
      permissions: {
        only: 'affichage_demandes',
        redirectTo: '/'
      }
    },
    resolve: {
      allRequestType: AllRequestTypeResolver,
      allUsers: AllUsersResolver,
      allRoles: AllRolesResolver
    }
  },
  {
    path: 'requests',
    component: ServerSideComponent,
    canActivate: [CheckBrowserVersionGuard , NgxPermissionsGuard],
    data: {
      breadcrumb: 'Page.RequestMonitoringComponent.breadcrumb',
      permissions: {
        only: 'affichage_demandes',
        redirectTo: '/'
      }
    },
    resolve: {
      requests: RequestsMonitoringResolver,
      allRequestType: AllRequestTypeResolver,
      allUsers: AllUsersResolver,
      allRoles: AllRolesResolver
    }
  },
  {
    path: 'absence-monitoring',
    component: AbsenceMonitoringComponent,
    canActivate: [CheckBrowserVersionGuard , NgxPermissionsGuard],
    resolve: {
      roles: RolesNameResolver,
      users: UsersNameResolver,
      actifUsers : AllActifUsersResolver
    },
    data: {
      breadcrumb: breadCrumb,
      permissions: {
        only: 'afficher_absences',
        redirectTo: '/'
      }
    },
    children: [
      {
        path: 'confirm-delete',
        component: PopUpDeleteAbsenceComponent
      }
    ]
  },
  {
    path: 'add-absence',
    component: AddAbsenceComponent,
    canActivate: [CheckBrowserVersionGuard , NgxPermissionsGuard],
    resolve: {
      absences: AbsenceAllResolver,
      users: UsersNameResolver
    },
    data: {
      breadcrumb: breadCrumb,
        permissions: {
          only: 'afficher_absences',
          redirectTo: '/'
        }
    },
    children: [
      {
        path: 'confirm-delete',
        component: AddAbsenceCancelPopUpComponent
      }
    ]
  },
  {
    path: 'epcb-response/:url',
    component: PopUpMessagesEpcbComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
