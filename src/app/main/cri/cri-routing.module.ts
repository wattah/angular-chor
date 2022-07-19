import { TotalsDebtResolver } from './../../_core/resolvers/customer-dashboard/totals-debt.resolver';
import { ImpactParkItemLinesResolver } from './../../_core/resolvers/impact-park-item-lines.resolver';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CriComponent } from './cri.component';
import { CriCreationComponent } from './cri-creation/cri-creation.component';

import { InfoProfilResolver, GoodToKnowResolver, DateRecouvrementResolver,
   RequestAnswersResolver, DocumentTitleResolver, TypeDocumentResolver } from '../../../app/_core/resolvers';
import { CanDeactivateGuard } from '../../../app/_core/guards/can-deactivate-guard';


import { RequestDetailsResolver } from '../../_core/resolvers/customer-dashboard/request-details.resolver';

import { TaskResolver } from '../../_core/resolvers/customer-dashboard/task.resolver';
import { ReferencesDataResolver } from '../../_core/resolvers/customer-dashboard/references-data.resolver';
import { PopAddAddressComponent } from '../_shared/pop-add-address/pop-add-address.component';
import { ModaliteDataResolver } from '../../_core/resolvers/modalite-data.resolver';
import { UserTechResolver } from '../../_core/resolvers/customer-dashboard/user-tech.resolvers';
import { UserOtherResolver } from '../../_core/resolvers/customer-dashboard/user-other.resolvers';
import { InterventionReporResolver } from '../../_core/resolvers/intervention-report.resolver';
import { TimeDataResolver } from '../../_core/resolvers/time-data.resolver';
import { DestinatairesSMSResolver } from '../../_core/resolvers/destinataires-sms.resolver';


  const routes: Routes = [
    {
      path: '',
      component: CriComponent,
      resolve: {
        infoProfil: InfoProfilResolver,
        goodToKnow: GoodToKnowResolver,
        recoveryDate: DateRecouvrementResolver,
        totalDebt: TotalsDebtResolver
      },
      children: [
        {
          path: 'creation/:idRequest/:idTask',
          component: CriCreationComponent,
          resolve: {
            detailRequest: RequestDetailsResolver,
            requestAnswers: RequestAnswersResolver,
            currentTask: TaskResolver,  
            documentsTitle: DocumentTitleResolver,
            documentsType: TypeDocumentResolver,
            interventionHardwareReferenceData : ReferencesDataResolver,
            modaliteReferenceData :ModaliteDataResolver,
            techniciens : UserTechResolver,
            othersUsers : UserOtherResolver,
            interventionReport : InterventionReporResolver,
             impactParkItemLines: ImpactParkItemLinesResolver,
            times : TimeDataResolver,
            destinataires: DestinatairesSMSResolver,
          },
          data: {
            typeData: 'INTERVENTION_HARDWARE',
          },
          children: [
            {
              path: 'addAddress',
              component: PopAddAddressComponent
            }
          ]
        },
      ]
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ CanDeactivateGuard ]
  })

export class CriRoutingModule { }
