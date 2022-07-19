import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillInformationComponent } from './creation-line/bill-information/bill-information.component';
import { BillRequiredInfoComponent } from './creation-line/bill-required-info/bill-required-info.component';
import { CustomerPenicheComponent } from './creation-line/customer-peniche/customer-peniche.component';
import { LineDetailComponent } from './creation-line/line-detail/line-detail.component';
import { CreationLineComponent } from './creation-line.component';
import { InfoProfilResolver, GoodToKnowResolver, DateRecouvrementResolver } from '../../../_core/resolvers';
import { CanDeactivateGuard } from '../../../_core/guards/can-deactivate-guard';
import { ReferencesDataResolver } from '../../../_core/resolvers/customer-dashboard/references-data.resolver';
import { FullCustomerResilver } from '../../../_core/resolvers/full-cutomer.resolver';
import { ImpactParkItemLinesResolver } from '../../../_core/resolvers/impact-park-item-lines.resolver';
import { CheckBrowserVersionGuard } from '../../../_core/guards/check-browser-version-guard';
import { ParkItemFormUpdateComponent } from './creation-line/park-item-form-update/park-item-form-update.component';
import { CustomerParkItemCurrentResolver } from '../../../_core/resolvers/customer-dashboard/customer-park-Item.resolver';

  const routes: Routes = [
    {
      path: '',
      component: CreationLineComponent,
      resolve: {
        infoProfil: InfoProfilResolver,
        goodToKnow: GoodToKnowResolver,
        recoveryDate: DateRecouvrementResolver
      },
       children: [
         {
           path: 'line-detail',
           component: LineDetailComponent,
           resolve: {
            origineLineReferenceData : ReferencesDataResolver,
            fullCustomerss: FullCustomerResilver,
            impactParkItemLines: ImpactParkItemLinesResolver
           }
         },
          {
            path: 'required-info',
            component: BillRequiredInfoComponent
          },
          {
            path: 'bill-info',
            component: BillInformationComponent
          },
          {
            path: 'customer-peniche',
            component: CustomerPenicheComponent
          },
          {
            path: 'update-line',
            component: CustomerPenicheComponent
          },
          {
            path: ':id/update',
            canActivate: [CheckBrowserVersionGuard],
            component: ParkItemFormUpdateComponent,
            resolve: {
               currentCustomerParkItem: CustomerParkItemCurrentResolver,
               origineLineReferenceData : ReferencesDataResolver
              },
            data: {
                typeData: 'LINE_ORIGIN',
              },
            
          }
      ]
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ CanDeactivateGuard ]
  })

export class CreationLineRoutingModule { }
