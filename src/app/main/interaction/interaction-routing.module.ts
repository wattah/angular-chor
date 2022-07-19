import { TotalsDebtResolver } from './../../_core/resolvers/customer-dashboard/totals-debt.resolver';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PreviewMailComponent } from './preview-mail/preview-mail.component';
import { RequestAnswersResolver } from './../../_core/resolvers/customer-dashboard/request-answers.resolver';
import { DestinatairesSMSResolver } from './../../_core/resolvers/destinataires-sms.resolver';
import { SendingSmsComponent } from './sending-sms/sending-sms.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestDetailsResolver } from 'src/app/_core/resolvers/customer-dashboard/request-details.resolver';

import { CheckBrowserVersionGuard } from '../../_core/guards/check-browser-version-guard';
import {
  InfoProfilResolver,
  GoodToKnowResolver,
  DateRecouvrementResolver,
  RequestForCreationInteractionResolver,
  listAdressRdvRsRpPro,
  UserFilteredResolver,
  MessageTemplateResolver,
  DestinataireListResolver,
  ReferenceDataTypeResolver,
  UserConnectedResolver,
  DocumentTitleResolver,
  TypeDocumentResolver,
  AllUserResolver, 
  CustomerReferentResolver,
  InteractionResolver,
  RecipientsRequestResolver
} from '../../_core/resolvers';
import { InteractionComponent } from './interaction.component';
import { InteractionDetailComponent } from './interaction-detail/interaction-detail.component';
import { InteractionDetailMailComponent } from './interaction-detail-mail/interaction-detail-mail.component';
import { InteractionDetailSmsComponent } from './interaction-detail-sms/interaction-detail-sms.component';
import { InteractionDetailsResolver } from '../../_core/resolvers/customer-dashboard/interaction-details.resolver';
import { InteractionCreationComponent } from './interaction-creation/interaction-creation.component';
import { ReferencesDataResolver } from '../../_core/resolvers/customer-dashboard/references-data.resolver';
import { InterlocutorsRequestResolver } from '../../_core/resolvers/customer-dashboard/interlocutors-request.resolver';
import { DestinatairesRequestResolver } from '../../_core/resolvers/destinataires-request.resolver';
import { MailSendingComponent } from './sending-mail/mail-sending.component';
import { InteractionDetailMailResolver } from '../../_core/resolvers/interaction-detail-mail.resolver';
import { CanDeactivateGuard } from '../../_core/guards/can-deactivate-guard';
import { MessageStyleResolver } from '../../_core/resolvers/customer-dashboard/message-styles.resolver';
import { InteractionCompleteHistoryComponent } from './complete-history/interaction-complete-history.component';
import { DocumentTypeCustomerResolver } from 'src/app/_core/resolvers/customer-dashboard/document-customer-type.resolver';
import { DocumentFullResolver } from 'src/app/_core/resolvers/customer-dashboard/documents-all.resolver';
import { EncondingGuard } from 'src/app/_core/guards/encoding.guard';

const routes: Routes = [
  {
    path: '',
    canActivate : [EncondingGuard],
    component: InteractionComponent,
    resolve: {
      infoProfil: InfoProfilResolver,
      goodToKnow: GoodToKnowResolver,
      recoveryDate: DateRecouvrementResolver,
      interactionDetails: InteractionDetailsResolver,
      interactionDetailMail: InteractionDetailMailResolver,
      totalDebt: TotalsDebtResolver
    },
    children: [
      {
        path: 'creation-360',
        canActivate: [CheckBrowserVersionGuard , NgxPermissionsGuard],
        component: InteractionCreationComponent,
        resolve: {
          requests: RequestForCreationInteractionResolver,
          mediaData: ReferencesDataResolver,
          interlocutorsRequest: InterlocutorsRequestResolver,
          destinataires: RecipientsRequestResolver,
          adresseRdv: listAdressRdvRsRpPro,
          listUsers: UserFilteredResolver
        },
        data: {
          is360: true,
          updateMode: false,
          typeData: 'CUSTOMER_INTERACTION_MEDIA',
          permissions: {
            only: 'ajout_interaction',
            redirectTo: '/'
          }
        },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'creation/:idRequest',
        canActivate: [CheckBrowserVersionGuard , NgxPermissionsGuard],
        component: InteractionCreationComponent,
        resolve: {
          mediaData: ReferencesDataResolver,
          interlocutorsRequest: InterlocutorsRequestResolver,
          destinataires: DestinatairesRequestResolver,
          adresseRdv: listAdressRdvRsRpPro,
          listUsers: UserFilteredResolver,
          request: RequestDetailsResolver,
          requestAnswers: RequestAnswersResolver
        },
        data: {
          is360: false,
          updateMode: false,
          typeData: 'CUSTOMER_INTERACTION_MEDIA',
          permissions: {
            only: 'ajout_interaction',
            redirectTo: '/'
          }
        },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'modification/:interactionId/:idRequest',
        canActivate: [CheckBrowserVersionGuard , NgxPermissionsGuard],
        component: InteractionCreationComponent,
        resolve: {
          mediaData: ReferencesDataResolver,
          interlocutorsRequest: InterlocutorsRequestResolver,
          destinataires: DestinatairesRequestResolver,
          adresseRdv: listAdressRdvRsRpPro,
          listUsers: UserFilteredResolver,
          request: RequestDetailsResolver,
          requestAnswers: RequestAnswersResolver,
          interaction: InteractionResolver,
        },
        data: {
          is360: false,
          updateMode: true,
          typeData: 'CUSTOMER_INTERACTION_MEDIA',
        },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'interaction-detail/:interactionId/:idRequest',
        canActivate: [CheckBrowserVersionGuard],
        component: InteractionDetailComponent,
        resolve: {
          interactionDetails: InteractionDetailsResolver,
          request: RequestDetailsResolver,
          requestAnswers: RequestAnswersResolver
        }
      },

      {
        path: 'interaction-detail-mail/:interactionId/:idRequest',
        canActivate: [CheckBrowserVersionGuard],
        component: InteractionDetailMailComponent,
        resolve: {
          interactionDetailMail : InteractionDetailMailResolver,
          request: RequestDetailsResolver,
          requestAnswers: RequestAnswersResolver
        }
      },
      {
        path: 'interaction-detail-sms/:interactionId/:idRequest',
        canActivate: [CheckBrowserVersionGuard],
        component: InteractionDetailSmsComponent,
        resolve: {
          interactionDetailMail: InteractionDetailMailResolver,
          request: RequestDetailsResolver,
          requestAnswers: RequestAnswersResolver
        }
      },
      {
        path: 'mail-sending/:idRequest/:requestTypeId/:universId',
        canActivate: [CheckBrowserVersionGuard,EncondingGuard , NgxPermissionsGuard],
        component: MailSendingComponent,
        resolve: {
          listUsers: UserFilteredResolver,
          request: RequestDetailsResolver,
          messageTemplate: MessageTemplateResolver,
          destinataireList: DestinataireListResolver,
          referenceDataType: ReferenceDataTypeResolver,
          connectedUser: UserConnectedResolver,
          messageStyles: MessageStyleResolver,
          documentsTitle: DocumentTitleResolver,
          documentsType: TypeDocumentResolver,
          documentTypeRequest: DocumentFullResolver,
          documentTypeCustomer: DocumentTypeCustomerResolver,
          requestAnswers: RequestAnswersResolver,
          referents: CustomerReferentResolver,
        },
        data: {
          category: 'MAIL',
          typeData: 'SENDER_EMAIL',
          permissions: {
            only: 'ajout_interaction',
            redirectTo: '/'
          }
        },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':idRequest/sending-sms',
        canActivate: [CheckBrowserVersionGuard , NgxPermissionsGuard],
        component: SendingSmsComponent,
        resolve: {
          detailRequest: RequestDetailsResolver,
          destinataires: DestinatairesSMSResolver,
          connectedUser: UserConnectedResolver,
          requestAnswers: RequestAnswersResolver
        },
        data:{
          permissions: {
            only: 'ajout_interaction',
            redirectTo: '/'
          }
        }
      },
      {
        path: 'complete-history',
        canActivate: [CheckBrowserVersionGuard],
        component: InteractionCompleteHistoryComponent,
        resolve: {
          mediaData: ReferencesDataResolver,
          listUsers: AllUserResolver
        },
        data: {
          typeData: 'CUSTOMER_INTERACTION_MEDIA'
        }
      },
      {
        path: 'mail-sending/:idRequest/:requestTypeId/:universId/preview-mail',
        canActivate: [CheckBrowserVersionGuard , NgxPermissionsGuard],
        component: PreviewMailComponent,
        resolve: {
          request: RequestDetailsResolver
        },
        data:{
          permissions: {
            only: 'ajout_interaction',
            redirectTo: '/'
          }
        },
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuard]
})
export class InteractionRoutingModule {}
