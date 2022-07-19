import { TotalsDebtResolver } from './../../_core/resolvers/customer-dashboard/totals-debt.resolver';
import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

import { RequestAnswersResolver } from '../../_core/resolvers/customer-dashboard/request-answers.resolver';
import { TaskAffectationListComponent } from '../../main/_shared/task-affectation-list/task-affectation-list.component';
import { CanDeactivateGuard } from '../../_core/guards/can-deactivate-guard';
import { ListParcoursResolver } from '../../_core/resolvers/customer-dashboard/list-parcours.resolver';
import { CheckBrowserVersionGuard } from '../../_core/guards/check-browser-version-guard';
import { DateRecouvrementResolver, GoodToKnowResolver, InfoProfilResolver, OpenRequestByTypeResolver,
  ReferenceDataResolver, RequestDetailsResolver, UserFilteredResolver, WelcomeMailResolver,
  CustomerReferentResolver, HomologationsIdsResolver, RecipientsRequestResolver} from '../../_core/resolvers';
import { InterlocutorsRequestResolver } from '../../_core/resolvers/customer-dashboard/interlocutors-request.resolver';
import { RequestTypeCustomerResolver } from '../../_core/resolvers/customer-dashboard/request.type.customer.resolver';
import { TaskDetailResolver } from '../../_core/resolvers/customer-dashboard/task-detail.resolver';
import { TaskHistoryResolver } from '../../_core/resolvers/customer-dashboard/task-history.resolver';
import { ReferencesDataResolver } from './../../_core/resolvers/customer-dashboard/references-data.resolver';
import { ParcoursListComponent } from './parcours-list/parcours-list.component';
import { RequestCreationComponent } from './request-creation/request-creation.component';
import { RequestComponent } from './request.component';
import { TaskCreationComponent } from './task-creation/task-creation.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { RequestTypeResolver } from '../../_core/resolvers/customer-dashboard/request.type.resolver';
import { UpdateTaskComponent } from './update-task/update-task.component';
import { TaskResolver } from '../../_core/resolvers/customer-dashboard/task.resolver';
import { AssignmentTaskComponent } from './task-assignment/task-assignment.component';
import { RequestCloserComponent } from './request-closer/request-closer.component';
import { EncondingGuard } from '../../_core/guards/encoding.guard';
import { TaskCreationRequestSummaryComponent } from './_shared/task-creation-request-summary/task-creation-request-summary.component';
import { CartResolver } from '../../_core/resolvers/cart-resolvers';
import { ProcedureWelcomeMailComponent } from './procedure-welcome-mail/procedure-welcome-mail.component';

const routes: Routes = [
  {
    path: '',
    canActivate : [EncondingGuard],
    component: RequestComponent,
    resolve: {
      infoProfil: InfoProfilResolver,
      goodToKnow: GoodToKnowResolver,
      recoveryDate: DateRecouvrementResolver,
      referents: CustomerReferentResolver,
      totalDebt: TotalsDebtResolver
    },
    children: [
      {
        path: 'parcours',
        canActivate: [CheckBrowserVersionGuard],
        component: ParcoursListComponent,
        resolve: {
          listParcours: ListParcoursResolver,
          listUsers: UserFilteredResolver
        } 
      },
      {
        path: 'creation',
        canActivate: [CheckBrowserVersionGuard],
        component: RequestCreationComponent,
        resolve: {
          typesRequest: RequestTypeCustomerResolver,
          mediaData: ReferencesDataResolver,
          listUsers: UserFilteredResolver,
          interlocutorsRequest: InterlocutorsRequestResolver,
          recipientsRequest: RecipientsRequestResolver,
          requestTypeResolver: RequestTypeResolver,
          referenceDataList: ReferenceDataResolver,
          openRequests: OpenRequestByTypeResolver
        },
        data: {
          typeData: 'CUSTOMER_INTERACTION_MEDIA'
        },
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path: 'affectation-taches',
        canActivate: [CheckBrowserVersionGuard],
        component: TaskAffectationListComponent,
        resolve: {
          listUsers: UserFilteredResolver
        }
      },
      {
        path: ':idRequest/task-creation',
        canActivate: [CheckBrowserVersionGuard],
        component: TaskCreationComponent,
        resolve: {
          detailRequest: RequestDetailsResolver,
          users: UserFilteredResolver,
          referenceDataList: ReferenceDataResolver,
          requestAnswers: RequestAnswersResolver
        },
        data: {
          notOnWfCreation: true
        },
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path: ':idRequest/modifyTask/:idTask',
        canActivate: [CheckBrowserVersionGuard],
        component: UpdateTaskComponent,
        canDeactivate: [ CanDeactivateGuard ],
        resolve: {
          currentTask: TaskResolver,
          users: UserFilteredResolver,
          detailRequest: RequestDetailsResolver,
          requestAnswers: RequestAnswersResolver
        },
        data:{
          permissions: {
            only: 'modification_taches',
            redirectTo: '/'
          }
        }
      },
      {
        path: ':idRequest/taskassignment/:idTask',
        canActivate: [CheckBrowserVersionGuard],
        component: AssignmentTaskComponent,
        canDeactivate: [ CanDeactivateGuard ],
        resolve: {
          detailRequest: RequestDetailsResolver,
          currentTask: TaskResolver,
          users: UserFilteredResolver,
          requestAnswers: RequestAnswersResolver
        }
      },
      {
        path: ':idRequest/task-details/:taskId',
        canActivate: [CheckBrowserVersionGuard],
        component: TaskDetailsComponent,
        resolve: {
          detailRequest: RequestDetailsResolver,
          taskDetail: TaskDetailResolver,
          taskHistory: TaskHistoryResolver,
          requestAnswers: RequestAnswersResolver,
          homologationsIds: HomologationsIdsResolver
        },
        data: {
          notOnWfCreation: true,
          permissions: {
            only: 'affichage_taches',
            redirectTo: '/'
          }
        }
      },
      {
        path: ':idRequest/closure-request',
        canActivate: [CheckBrowserVersionGuard],
        component: RequestCloserComponent,
        canDeactivate: [ CanDeactivateGuard ],
        resolve: {
          detailRequest: RequestDetailsResolver,
          requestAnswers: RequestAnswersResolver,
          currentTask: TaskResolver,
          users: UserFilteredResolver
        },
        data: {
          closerOutsideProcess: true
        }
      },
      {
        path: 'task-details/:idRequest',
        canActivate: [CheckBrowserVersionGuard],
        component: TaskCreationRequestSummaryComponent,
        canDeactivate: [ CanDeactivateGuard ],
        resolve: {
        carts: CartResolver
        }
      },
      {
        path: ':idRequest/:idTask/welcome-mail',
        canActivate: [CheckBrowserVersionGuard],
        component: ProcedureWelcomeMailComponent,
        resolve: {
          detailRequest: RequestDetailsResolver,
          requestAnswers: RequestAnswersResolver,
          currentTask: TaskResolver,
          interlocutors: InterlocutorsRequestResolver,
          welcomeMail: WelcomeMailResolver
        }
      }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ CanDeactivateGuard ]
})
export class RequestRoutingModule { }
