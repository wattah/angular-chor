import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from '../../_core/guards/can-deactivate-guard';
import { ManagementBatchesComponent } from './management-batches.component';
import { LoadingFiftyDComponent } from './loading-fifty-d/loading-fifty-d.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: ManagementBatchesComponent,
    data: {
         breadcrumb: 'Page.ManagementBatchesComponent.breadcrumb',
       }
  },
  {
    path: 'loading-50D',
    component: LoadingFiftyDComponent,
  },
];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ CanDeactivateGuard, NgbActiveModal ]
  })

export class ManagementBatchesRoutingModule { }
