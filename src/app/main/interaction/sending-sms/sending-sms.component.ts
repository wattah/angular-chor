import { CONSTANTS, NICHE_CONTRACTS_STATUTS } from './../../../_core/constants/constants';
import { ComponentCanDeactivate } from './../../../_core/guards/component-can-deactivate';
import { UserVo } from './../../../_core/models/user-vo';
import { MessageReceiverVO } from './../../../_core/models/Message-receiver-vo';
import { MessageVO } from './../../../_core/models/message-vo';
import { SMSService } from './../../../_core/services/sms.service';
import { DestinataireVO } from './../../../_core/models/destinataireVO';
import { isNullOrUndefined } from './../../../_core/utils/string-utils';
import {
  MessageTemplateLightVO,
  RequestAnswersVO
} from './../../../_core/models/models';
import { MessageTemplateService } from './../../../_core/services/message-template.service';
import { InteractionReasonVO } from './../../../_core/models/request/crud/interaction-reason';
import { InteractionService } from './../../../_core/services/interaction.service';
import { RequestCustomerVO } from './../../../_core/models/request-customer-vo';
import { ActivatedRoute, Router } from '@angular/router';
import { SmsPopUpComponent } from './../sms-pop-up/sms-pop-up.component';
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit
} from '@angular/core';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getCustomerIdFromURL } from '../../customer-dashboard/customer-dashboard-utils';
import { CustomerInteractionVO } from './../../../_core/models/request/crud/customer-interaction';
import { DatePipe } from '@angular/common';
import { DateFormatPipeFrench } from '../../../_shared/pipes';
import { BillingService } from '../../../_core/services/billing.service';
import { NotificationService } from './../../../_core/services/notification.service';


const dateFormat = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-sending-sms',
  templateUrl: './sending-sms.component.html',
  styleUrls: ['./sending-sms.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: MAT_DATE_FORMATS, useValue: dateFormat },
    { provide: DateAdapter, useClass: MomentDateAdapter }
  ]
})
export class SendingSmsComponent extends ComponentCanDeactivate implements OnInit, AfterViewInit {
  customerId: string;
  requestAnswers: RequestAnswersVO[];
  user: UserVo;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  destinatairesAsString: string[] = [];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  requestId: number;
  detailRequest: RequestCustomerVO;
  interactionMotifs: InteractionReasonVO[];
  messageTemplates: MessageTemplateLightVO[];
  libreTemplate: MessageTemplateLightVO = {} as MessageTemplateLightVO;
  destinataires: DestinataireVO[];
  filteredDestinataires: Observable<DestinataireVO[]>;
  typeStatut = NICHE_CONTRACTS_STATUTS.STATUS.slice();
 
  resultedDestinataires: DestinataireVO[] = [];
  corpsValue: string = '';
  isLibre: boolean = false;
  interactionReasonSelected: InteractionReasonVO;
  SMSRequest: FormGroup;
  templateMessage: string;
  message: MessageVO = {} as MessageVO;
  motifInvalid: boolean = false;
  isValidRequest: boolean = false;
  SMSRequestError: boolean = false;
  form: FormGroup;
  submitted: boolean;
  typeCustomer: string;
  customerInteraction: CustomerInteractionVO = {} as CustomerInteractionVO;
  isFromProcessRequest: boolean = false;
  phoneNumber;
  @ViewChild('fruitInput', { static: false }) fruitInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild('chipList', { static: false }) chipList;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private interactionService: InteractionService,
    private messageTemplateService: MessageTemplateService,
    private formBuilder: FormBuilder,
    private sMSService: SMSService,
    private router: Router,
    private readonly dateFormatPipeFrench: DateFormatPipeFrench,
    private readonly billingService: BillingService,
    private datePipe: DatePipe,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit() {
    this.isFromProcessRequest = !isNullOrUndefined(this.route.snapshot.queryParamMap.get('showSuspension'));
    this.getRequestDetail();
    this.getDestinataires();
    this.getConnectedUser();
    this.createForm();
    this.filteredDestinatairesAfterChoice();
    this.form = this.SMSRequest;
    this.submitted = false;
    this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer');
    this.route.parent.paramMap.subscribe( data  => this.customerId = data.get('customerId'));
    //positionner template par defaut pour le cas de suspension sms pour recouvrement
    if (this.isFromProcessRequest && !isNullOrUndefined(this.notificationService.getTemplates()) && this.notificationService.getTemplates().length>0) {
      this.notificationService.setTemplates(null);
      const template = this.messageTemplates.find( msg => msg.id === this.messageTemplates[0].id);
      if (!isNullOrUndefined(template)) {
        this.SMSRequest.get('model').setValue( template );
        this.templateMessage = this.SMSRequest.get('model').value.message;
      }
    }
  }
  filteredDestinatairesAfterChoice() {
    this.filteredDestinataires = this.SMSRequest.get(
      'destinataire'
    ).valueChanges.pipe(
      tap(console.log),
      startWith(null),
      map((destinataire: DestinataireVO) =>
        destinataire ? this._filter(destinataire) : this.destinataires.slice()
      )
    );
   
  }
  getConnectedUser() {
    this.route.data.subscribe(resolversData => {
      this.user = resolversData['connectedUser'];
      this.phoneNumber =
      !isNullOrUndefined(this.user) &&
      !isNullOrUndefined(this.user.parnassePhoneNumber) &&
      this.user.parnassePhoneNumber.length !== 0
        ? this.user.parnassePhoneNumber
        : 'Parnasse';
    });
  }
  getDestinataires() {
    this.route.data.subscribe(resolversData => {
      this.destinataires = resolversData['destinataires'];
      this.sortDestinataires();
    });
  }
  sortDestinataires() {
    if (!isNullOrUndefined(this.destinataires))
      this.destinataires.sort((one, two) =>
        one.firstName > two.firstName ? 1 : -1
      );
  }

  createForm(): void {
    this.SMSRequest = this.formBuilder.group({
      model: this.formBuilder.control(null, Validators.required),
      emetteur: this.formBuilder.control(this.phoneNumber, Validators.required),
      destinataire: this.formBuilder.control(null),
      corps: this.formBuilder.control('', Validators.required),
      motifInteraction: this.formBuilder.control(null, Validators.required),
      description: this.formBuilder.control('')
    });
  }

  getRequestDetail(): void {
    this.route.data.subscribe(resolversData => {
      this.detailRequest = resolversData['detailRequest'];
      this.requestAnswers = resolversData['requestAnswers'];
      this.getInteractionReasions();
      this.getTemplateMessages();
    });
  }
  getInteractionReasions(): void {
    const requestTypeId = this.detailRequest.requestTypeId;
    const universId = this.detailRequest.universId;
    this.interactionService.listInteractionReasons( universId, requestTypeId, 'CREATION', false, false)
      .subscribe(interactionReasons => this.interactionMotifs = interactionReasons);
  }

  getTemplateMessages(): void {
    if (this.isFromProcessRequest && !isNullOrUndefined(this.notificationService.getTemplates()) && this.notificationService.getTemplates().length>0) {
      this.messageTemplates = this.notificationService.getTemplates();
    } else {
      const requestTypeId = this.detailRequest.requestTypeId;
      const customerId = getCustomerIdFromURL(this.route);
      this.messageTemplateService
        .getListFormatedMessage(requestTypeId, 'SMS', '', customerId)
        .subscribe(
          templates => {
            this.messageTemplates = templates;
            this.addLibreTemplate();
            this.initializeDefaultTemplate();
          },
          _error => {
            this.isLibre = true;
            this.initLibreTemplate();
            this.openPOUP();
          },
          () => {
            this.isLibre = this.messageTemplates.length === 0 ? true : false;
            this.initLibreTemplate();
            this.openPOUP();
          }
        );
    }
  }

  private addLibreTemplate() {
    if (this.messageTemplates) {
      const template = {} as MessageTemplateLightVO;
      template.label = 'Libre';
      template.message = '';
      this.messageTemplates.unshift(template);
    }
  }

  initializeDefaultTemplate(): void {
    this.route.paramMap.subscribe( params => {
      if (!isNullOrUndefined(params.get('templateId')) && !isNullOrUndefined(params.get('idPaiement'))) {
        this.setDefaultSMSPayementTemplateInForm(Number(params.get('templateId')), Number(params.get('idPaiement')));
      }
    });
  }

  setDefaultSMSPayementTemplateInForm(templateId: any, idPaiement: any): void {
    const template = this.messageTemplates.find( msg => msg.id === templateId);
    if (!isNullOrUndefined(template)) {
      this.SMSRequest.get('model').setValue( template );
      let formattedMessage = this.SMSRequest.get('model').value.message;
      this.billingService.getPayement(idPaiement).subscribe ( data => {
        formattedMessage = formattedMessage.replace('[#Payement.amountTTC]', data.transactionAmount);
        formattedMessage = formattedMessage.replace('[#Payement.getTypePayementLabel]', data.typePayementLabel);
        formattedMessage = formattedMessage.replace('[#Payement.autorizationRefNumber]', data.autorizationRefNumber);
        formattedMessage = formattedMessage.replace('[#Payement.autorizationDate]',this.dateFormatPipeFrench.transform(data.datePayement.toString()));
        this.templateMessage = formattedMessage;
      });
    }
  }

  initLibreTemplate() {
    this.libreTemplate.label = 'Libre';
    this.libreTemplate.message = '';
  }
  openPOUP() {
    if (this.isLibre) {
      this.modalService.open(SmsPopUpComponent, { centered: true });
    }
  }
  getRequestIdFromURL(route: ActivatedRoute): number {
    return Number(route.snapshot.paramMap.get('requestId'));
  }

  ngAfterViewInit(): void {
    // setTimeout(() => {
    //   this.chipList.errorState = true;
    // });
  }

  add(event: MatChipInputEvent): void {
    console.log('event', event);
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.destinatairesAsString.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.SMSRequest.get('destinataire').setValue(null);
  }

  remove(destinatairePhoneNumber: string): void {
    if (!isNullOrUndefined(destinatairePhoneNumber)) {
      this.destinatairesAsString = this.destinatairesAsString.filter(
        currentDestinataire => currentDestinataire !== destinatairePhoneNumber
      );
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let destinataire = event.option.viewValue;
    if (!this.isExiste(destinataire))
      this.destinatairesAsString.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.SMSRequest.get('destinataire').setValue(null);
    this.chipList.errorState = false;
  }

  isExiste(destinataire: string) {
    return this.destinatairesAsString.includes(destinataire);
  }

  private _filter(destinataireIn: DestinataireVO): DestinataireVO[] {
    return this.destinataires.filter(
      destinataire => destinataire.personId === destinataireIn.personId
    );
  }

  sendInteractionRequest() {
    this.isValidRequest = this.validateSMSRequest();
    if (this.SMSRequest.valid) {
      this.convertDestinataires();
      this.SMSRequest.get('destinataire').setValue(this.resultedDestinataires);
      this.SMSRequestPreparation();
      this.sendSMS();
    } else {
      this.SMSRequestError = true;
      this.motifInvalid = this.SMSRequest.get('model').value === null;
    }
  }
  validateSMSRequest() {
    return (
      this.SMSRequest.get('model').value !== null &&
      this.SMSRequest.get('destinataire').value !== null &&
      this.SMSRequest.get('destinataire').value.length !== 0 &&
      this.SMSRequest.get('emetteur').value !== '' &&
      this.SMSRequest.get('motifInteraction').value !== null &&
      this.SMSRequest.get('corps').value !== ''
    );
  }
  SMSRequestPreparation() {
    this.message.createAtStr = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.message.createdBy = this.user.id;
    this.message.listReceivers = this.setReceivers();
    this.message.description = this.SMSRequest.get('description').value;
    this.message.sender = this.SMSRequest.get('emetteur').value;
    this.message.messageTemplateId = this.SMSRequest.get('model').value.id;
    this.message.message = this.SMSRequest.get('corps').value;
    this.message.interactionReasonId = this.SMSRequest.get(
      'motifInteraction'
    ).value.id;
    this.message.requestId = this.detailRequest.idRequest;
    this.message.category = 'SMS';
  }
  setReceivers(): MessageReceiverVO[] {
    let destinataires = this.SMSRequest.get('destinataire').value;
    let receivers = new Array<MessageReceiverVO>();
    if (destinataires) {
      destinataires.forEach((destinataire: DestinataireVO) => {
        let receiver: MessageReceiverVO = {} as MessageReceiverVO;
        receiver.customerParkItemId = destinataire.parcItemId;
        receiver.contactMethodId = destinataire.contactMethodId;
        receiver.value = destinataire.phoneNumber;
        receivers.push(receiver);
      });
    }
    return receivers;
  }
  sendSMS() {
    this.submitted = true;
    this.sMSService.snedSMS(this.message).subscribe(
      message => console.log,
      error => console.log,
      () => this.redirecte(false, true)
    );
  }
  convertDestinataires() {
    if (this.destinatairesAsString.length !== 0) {
      this.destinatairesAsString.forEach(destinataire => {
        let phoneNumber = this.getPhoneNumberFromString(destinataire);
        this.resultedDestinataires.push(
          this.getDestinataireByPhoneNumber(phoneNumber)
        );
      });
    }
  }
  getPhoneNumberFromString(destinataire: string) {
    let destinataireInfo = destinataire.split('-');
    return destinataireInfo[destinataireInfo.length - 1];
  }
  getDestinataireByPhoneNumber(phoneNumber: string) {
    return this.destinataires.find(
      destinataire => destinataire.phoneNumber === phoneNumber
    );
  }

  toString(destinataire: DestinataireVO) {
    
    let statuts = this.typeStatut.filter((status)=>status.key===destinataire.status);
    const CONCATENATION ='-';
    const PARC  = 'parc-';
    if (destinataire && (destinataire.firstName || destinataire.lastName)) {
      if (!destinataire.parc) {
        const contactType = destinataire.contactType;
        const name =  ((!isNullOrUndefined(destinataire.firstName) &&  destinataire.firstName != " ")
        ? (destinataire.firstName +  CONCATENATION ) : "")  
        + ( !isNullOrUndefined(destinataire.lastName) ? (destinataire.lastName +  '-' ) : "")
        return (
         name +
          destinataire.role +
          '-' +
          contactType +
          '-' +
          destinataire.phoneNumber
        );
      } else if ((this.typeCustomer === CONSTANTS.TYPE_BENEFICIARY  && statuts.length !==0) || this.typeCustomer !== CONSTANTS.TYPE_BENEFICIARY ) {
       
        return this.getNameParkString(destinataire);
      } 
     
  }

}
getNameParkString(destinataire: DestinataireVO):string{
  const CONCATENATION ='-';
  const PARC  = 'parc-';
  const name = ((!isNullOrUndefined(destinataire.firstName)  &&  destinataire.firstName != " " ) ?
  (destinataire.firstName +  CONCATENATION ) : "") 
  + ( !isNullOrUndefined(destinataire.lastName) ? (destinataire.lastName +  CONCATENATION ) : "")
 return (
       name +
       PARC +
       destinataire.phoneNumber
     );
}
  onChangeTemplate() {
    this.templateMessage = this.SMSRequest.get('model').value.message;
  }
  onSelectMotif(event) {
    this.motifInvalid = event === null;
    this.SMSRequest.get('motifInteraction').setValue(event);
  }
  onCancelSMSSending() {
    this.redirecte(true, false);
  }
  redirecte(cancled: boolean, submitted: boolean) {
    this.submitted = submitted;
    this.canceled = cancled;
    let isEntreprise = this.typeCustomer === CONSTANTS.TYPE_COMPANY;
    let customerId = getCustomerIdFromURL(this.route);
    if (isEntreprise) {
      this.router.navigate(
        [
          'customer-dashboard',
          customerId,
          'detail',
          'request',
          this.detailRequest.idRequest
        ],
        {
          queryParams: { typeCustomer: this.typeCustomer },
          queryParamsHandling: 'merge'
        }
      );
    } else {
      this.router.navigate(
        [
          'customer-dashboard',
          customerId,
          'detail',
          'request',
          this.detailRequest.idRequest
        ],
        {
          queryParams: { typeCustomer: this.typeCustomer }
        }
      );
    }
  }
}
