import { PenicheIsDownPopupComponent } from './../_core/components/search-bar/peniche-is-down-popup/peniche-is-down-popup/peniche-is-down-popup.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from '@ag-grid-community/angular';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../_shared/shared.module';
import { MainSharedModule } from './../main/_shared/main-shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InvoicesComponent } from './dashboard/invoices/invoices.component';
import { IconRendererComponent } from './dashboard/icon-renderer/icon-renderer.component';
import { RequestMonitoringDetailCellRendererComponent } from './request-monitoring/request-monitoring-detail-cell-renderer/request-monitoring-detail-cell-renderer.component';
import { InvoicesTableComponent } from './dashboard/invoices/invoices-table/invoices-table.component';
import { TaskToProcessComponent } from './dashboard/task-to-process/task-to-process.component';
import { TaskMonitoringComponent } from './task-monitoring/task-monitoring.component';
import { RequestMonitoringComponent } from './request-monitoring/request-monitoring.component';
import { AbsenceMonitoringComponent } from './absence-monitoring/absence-monitoring.component';
import { PopUpDeleteAbsenceComponent } from './pop-up-delete-absence/pop-up-delete-absence.component';
import { AddAbsenceComponent } from './add-absence/add-absence.component';
import { ServerSideComponent } from './server-side/server-side.component';
import { AddAbsenceCancelPopUpComponent } from './add-absence-cancel-pop-up/add-absence-cancel-pop-up.component';
import { PopUpMessagesEpcbComponent } from './pop-up-messages-epcb/pop-up-messages-epcb.component';
import { InvoiceStatisticsComponent } from './invoice-statistics/invoice-statistics.component';
import { InvoiceStatisticsTotalComponent } from './invoice-statistics/invoice-statistics-total/invoice-statistics-total.component';
import { GridUnblockActionComponent } from './request-monitoring/grid-unblock-action.component';
import { InteractionsComponent } from './linteractions/interactions.component';
import { ListInteractionAgGridComponent } from './linteractions/list-interaction-ag-grid/list-interaction-ag-grid.component';

const COMPONENTS = [ 
  DashboardComponent,
  InvoicesComponent,
  InvoicesTableComponent,
  RequestMonitoringDetailCellRendererComponent,
  TaskToProcessComponent,
  TaskMonitoringComponent,
  RequestMonitoringComponent,
  ServerSideComponent,
  AbsenceMonitoringComponent,
  PopUpDeleteAbsenceComponent, 
  AddAbsenceComponent, 
  AddAbsenceCancelPopUpComponent,
  PopUpMessagesEpcbComponent,
  InvoiceStatisticsComponent,
  InvoiceStatisticsTotalComponent,
  PenicheIsDownPopupComponent,
  GridUnblockActionComponent,
  InteractionsComponent,
  ListInteractionAgGridComponent
];

const MODULES = [ 
  SharedModule, 
  FormsModule,
  CommonModule,
  DashboardRoutingModule,
  MainSharedModule,
  AgGridModule.withComponents([IconRendererComponent, RequestMonitoringDetailCellRendererComponent]),
  NgxPermissionsModule.forChild()
];

@NgModule({
  declarations: [ COMPONENTS ],
  imports: [ MODULES ],
  providers: [
    DatePipe
  ]
})
export class DashboardModule { }
