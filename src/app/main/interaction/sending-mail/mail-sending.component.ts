import { Component, ElementRef, ViewChild, AfterViewInit, Input, OnInit, EventEmitter, Output, Injector} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { startWith, map, switchMap, tap } from 'rxjs/operators';
import { __await } from 'tslib';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { emailIsValid, isNullOrUndefined, StringReplaceAll } from '../../../_core/utils/string-utils';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';
import { MessageTemplateLightVO } from '../../../_core/models/message-template-light-vo';
import { RequestAnswersVO } from '../../../_core/models/request-answers-vo';
import { DocumentVO } from '../../../_core/models/documentVO';
import { ObjectContextVO } from '../../../_core/models/object-context-vo';
import { DocumentTitleVO } from '../../../_core/models/document-title-vo';
import { InterlocutorVO } from '../../../_core/models/interlocutor-vo';
import { ReferenceDataVO } from '../../../_core/models/reference-data-vo';
import { UserVo } from '../../../_core/models/user-vo';
import { TypeDocument } from '../../../_core/models/Type-Document';
import { InteractionService } from '../../../_core/services/interaction.service';
import { InteractionReasonVO } from '../../../_core/models/request/crud/interaction-reason';
import { MessageReceiverVO } from '../../../_core/models/Message-receiver-vo';
import { CONSTANTS, KeyWords, CM_TYPE_DATA, ROLE_INTERLOCUTOR, CUSTOMER_TYPE_LABEL } from '../../../_core/constants/constants';
import { MessageService } from '../../../_core/services/message.service';
import { getCustomerIdFromURL } from '../../customer-dashboard/customer-dashboard-utils';
import { DocumentService } from '../../../_core/services/documents-service';
import { MessageVO } from '../../../_core/models/message-vo';
import { MessageMailVo } from '../../../_core/models/message-mail-vo';
import { ComponentCanDeactivate } from '../../../_core/guards/component-can-deactivate';
import { ParamVo } from '../../../_core/models/param-vo';
import { MessageTemplateService, ParcLigneService, ContactMethodService, UserService } from '../../../_core/services';
import { KeyWordsVO } from '../../../_core/models/models';
import { CmInterlocutorVO } from '../../../_core/models/cm-Interlocutor-vo';
import { DatePipe } from '@angular/common';
import { getDecryptedValue } from '../../../_core/utils/functions-utils';
import { NotificationService } from '../../../_core/services/notification.service';
import { PopAddMailComponent } from '../../_shared/pop-add-mail/pop-add-mail.component';
import { PopAddDocumentComponent } from '../../_shared/pop-add-document/pop-add-document.component';

@Component({
  selector: 'app-mail-sending',
  templateUrl: './mail-sending.component.html',
  styleUrls: ['./mail-sending.component.scss']
 
})
export class MailSendingComponent extends ComponentCanDeactivate implements AfterViewInit, OnInit {

  private readonly notificationService: NotificationService;

  @Input() request: RequestCustomerVO;
  @Input() messageTemplate: MessageTemplateLightVO[];
  @Input() connectedUser: UserVo;
  @Input() destinataires: InterlocutorVO[] = [];
  @Input() senders: ReferenceDataVO[];
  @Input() styles: ObjectContextVO[];
  @Input() documentsTitle: DocumentTitleVO[];
  @Input() documentsTypeList: TypeDocument[];
  @Output() onFormGroupChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  submitted: boolean;
  form: FormGroup;
  interactionReasonList: InteractionReasonVO[] = [];
  @Input() requestAnswers: RequestAnswersVO[] = [];
  params: ParamVo[] = [];
  paramAgGrid: { force: boolean; suppressFlash: boolean; };
  param: ParamVo;
  allContactMethod: CmInterlocutorVO[];
  parkItemDP = [] as  any;
  tabStringToCheck = [] as any;

  parnasseEmail: string;
  
  requestTitle: string;
  selectedModelObject;
  selectedSender;
  selectedDocument;
  selectedStyle;
  selectedObjet;
  selectedModelTitle;
  selectedModelBody;
  selectedModelSubtitle;
  titleValue: string = '';
  subtitleValue: string = '';
  bodyValue: string = '';

  langSelected = false;
  
  @Input() customerId: string;
  isEntreprise = false;
  typeCustomer: string;
  listOfReceivers: [];
  listOfFiles: [];
  CUSTOMER = 'CUSTOMER';
  REQUEST = 'REQUEST';

  libreTemplate: MessageTemplateLightVO = {} as MessageTemplateLightVO;

  mailSendingForm: FormGroup;
  sentMail: MessageVO = {} as MessageVO;
  messageMail: MessageMailVo = {} as MessageMailVo;
  isNotExistDocument: boolean;

  MailError: boolean = false;
  labelDocument: string = 'Client';
  labelDocumentRequest = 'Demande';

  procedureTemplate: MessageTemplateLightVO[];
  templateCR: MessageTemplateLightVO;
  showCR = false;

  /** gestion des erreurs */
  isValidBtn = true;
  mailSenderInvalid = false;
  formatMailInvalide = false;
  interlocutorInvalid = false;
  objetInvalid = false;
  titreInvalid = false;
  corpsInvalid = false;
  styleInvalid = false;
  motifInvalid = false;
  isNotValid = false;
  /**end */

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  // all recipient CC or CCI
  allRecipientCC = [];
  filteredDestinataires: Observable<InterlocutorVO[]>;
  filteredCC: Observable<InterlocutorVO[]>;
  filteredCCI: Observable<InterlocutorVO[]>;
  filteredSenders: Observable<ReferenceDataVO[]>;

  destinatairesList: InterlocutorVO[] = [];
  destinataireCC: InterlocutorVO[] = [];
  destinataireCCI: InterlocutorVO[] = [];

  editorBodyConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '15rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: '',
    defaultFontName: 'Segoe UI',
    defaultFontSize: '3',
    uploadUrl: 'v1/image',
    uploadWithCredentials: true,
    sanitize: true,
    fonts: [
      {class: 'Segoe UI', name: 'Segoe UI'}
    ],
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'fontName',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };

  @ViewChild('fruitInput', { static: false }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild('chipList', { static: false }) chipList;

  @ViewChild('CCInput', { static: false }) CCInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipCCList', { static: false }) chipCCList;
  @ViewChild('autocc', { static: false }) matAutoCCcomplete: MatAutocomplete;

  @ViewChild('CCIInput', { static: false }) CCIInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipCCIList', { static: false }) chipCCIList;
  @ViewChild('autocci', { static: false }) matAutoCCIcomplete: MatAutocomplete;
  CUSTOME_POPUP = 'customer-popup-document';
  STATIC = 'static';
  columnDefs: any[];
  defaultSortModel: any[];
  listDocumentToSend: DocumentVO[] = [];
  DOWLOAD_COL_ID = 'download';
  DELETE_COL_ID = 'del';
  CONTENT_TYPE = 'Content-Type';
  APPLICATION_STREAM = 'application/octet-stream';
  BLANK = '_blank';
  constructor(private readonly route: ActivatedRoute, private readonly modalService: NgbModal, private readonly fb: FormBuilder,
    private readonly router: Router, private readonly interactionService: InteractionService, private readonly messageService: MessageService,
    private readonly documentService: DocumentService, private readonly messageTemplateService: MessageTemplateService,
    private readonly parcLigneService: ParcLigneService, private readonly contactMethodService: ContactMethodService,
    private readonly datePipe: DatePipe, private readonly injector : Injector, private readonly userService: UserService ) {
    super();
    this.notificationService = injector.get<NotificationService>(NotificationService);
    this.procedureTemplate = this.notificationService.getMessageTemplate();
  }

  ngOnInit(): void {

    this.mailSendingForm = this.createFormGroup();
    this.form = this.mailSendingForm;
    this.initLibreTemplate();

    if (!isNullOrUndefined(this.procedureTemplate) && this.procedureTemplate.length>0) {
      this.showCR = true;
      this.templateCR = this.procedureTemplate.find( msg => msg.id === this.procedureTemplate[0].id);

      this.mailSendingForm.get('modele').setValue(this.templateCR);
      this.selectedModelObject = this.templateCR.object;
      this.selectedModelSubtitle = this.templateCR.subtitle;
      this.selectedModelTitle = this.templateCR.title;
      this.selectedModelBody = this.templateCR.message;
    }

    this.route.data.subscribe(resolversData => {
      this.request = resolversData['request'];
      this.messageTemplate = resolversData['messageTemplate'];
      this.senders = resolversData['referenceDataType'];
      this.connectedUser = resolversData['connectedUser'];
      this.destinataires = resolversData['destinataireList'];
      this.styles = resolversData['messageStyles'];
      this.requestAnswers = resolversData['requestAnswers'];
      this.addAccountManagerToRecipientCCList();
      this.addCoachToRecipientCCList(resolversData['referents']);
      this.allRecipientCC = [ ...this.allRecipientCC, ...this.destinataires];
    });
    this.route.parent.paramMap.subscribe(params => {
      this.customerId =params.get('customerId'); 
    });

    this.route.parent.queryParamMap.subscribe(params => {
      this.typeCustomer = params.get('typeCustomer');
      this.isEntreprise = (this.typeCustomer === CONSTANTS.TYPE_COMPANY);
    });

    this.interactionService.listInteractionReasons(this.request.universId,
      this.request.requestTypeId, 'CREATION', false, false).subscribe(irList => {
        this.interactionReasonList = irList;
        if (this.interactionReasonList && this.interactionReasonList.length === 1
          && this.interactionReasonList[0].children.length === 1) {
            this.requestTitle = `${this.interactionReasonList[0].label} >  ${this.interactionReasonList[0].children[0].label}`;
        }
      });

    this.parcLigneService.getAllByCustomerForMessage(getCustomerIdFromURL(this.route), 'MAIL', true)
      .subscribe(list => {
        if ( list !== null) {
          this.parkItemDP = list;
        }
      });

    this.contactMethodService.getContactMethods(getCustomerIdFromURL(this.route))
      .subscribe(list => {
        if ( list !== null) {
          this.allContactMethod = list;
        }
      });

    this.param = new ParamVo(getDecryptedValue(getCustomerIdFromURL(this.route)), 'customer');
    this.params.push(this.param);
    this.param = new ParamVo(this.connectedUser.id, 'user');
    this.params.push(this.param);
    const toSelectSender = this.senders.find(c => c.id === 3294);
    this.selectedSender = toSelectSender;
    const toSelectStyle = this.styles.find(s => s.id === 1);
    this.selectedStyle = toSelectStyle;
    this.onFormGroupChange.emit(this.mailSendingForm);
    this.filterInterlocutorsLists();
    this.setColumnDocumentsRef();
    this.addConnectedUser();
    this.filterSenders();

  }

  addConnectedUser(): void {
    const sender = {} as ReferenceDataVO;
    if(this.connectedUser.parnasseEmail !== undefined
        && this.connectedUser.parnasseEmail !== null
        && this.connectedUser.parnasseEmail !== '') {
          sender.label = this.connectedUser.parnasseEmail;
    } else {
      sender.label = "adresse@introuvable.fr";
    }
    
    this.senders.push(sender);
  }

  filterSenders(): void {
    this.filteredSenders = this.mailSendingForm.get('senderList').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.label)),
      map(label => (label ? this._senderFilter(label) : this.senders.slice())),
    ); 
  }

  displayFn(sender: ReferenceDataVO): string {
    return sender && sender.label ? sender.label : '';
  }

  _senderFilter(label: string): ReferenceDataVO[] {
    const filterValue = label.toLowerCase();

    return this.senders.filter(sender => sender.label.toLowerCase().includes(filterValue));
  }

  filterInterlocutorsLists(): void {
    this.filteredDestinataires = this.mailSendingForm.get('fruitCtrl').valueChanges.pipe(
      startWith(<string>null),
      map((interlocutor: InterlocutorVO | null) => interlocutor ? this._filter(interlocutor) : this.destinataires.slice()));
    
      this.filteredCC = this.mailSendingForm.get('CCCtrl').valueChanges.pipe(
        startWith(''),
        map(() =>  this.allRecipientCC));
    this.filteredCCI = this.mailSendingForm.get('CCICtrl').valueChanges.pipe(
      startWith(''),
      map(() => this.allRecipientCC));
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.chipList.errorState = this.interlocutorInvalid;
      this.chipCCList.errorState = this.interlocutorInvalid;
      this.chipCCIList.errorState = this.interlocutorInvalid;
    });
  }

  initLibreTemplate(): void {
    this.libreTemplate.id = null;
    this.libreTemplate.label = 'Libre';
    this.libreTemplate.message = '';
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      langSelected: this.fb.control('FRENCH'),
      modele: this.fb.control(this.libreTemplate),
      senderList: this.fb.control(null, [Validators.required]),
      objet: this.fb.control(null, [Validators.required]),
      styleControl: this.fb.control(null, [Validators.required]),
      description: this.fb.control(''),
      motif: this.fb.control(null, [Validators.required]),
      sonde: this.fb.control(''),
      title: this.fb.control(null, [Validators.required]),
      body: this.fb.control(null, [Validators.required]),
      subtitle: this.fb.control(''),
      fruitCtrl: this.fb.control(null, [Validators.required]),
      CCCtrl: this.fb.control(''),
      CCICtrl: this.fb.control(''),
      document: this.fb.control('')
    });
  }

  getParamsFromURL(route: ActivatedRoute, paramName: string) {
    return route.snapshot.paramMap.get(paramName);
  }

  radioLanguageChangeHandler(event: any): void {
    console.log(event.target.value)
    const requestTypeId = Number(
      this.getParamsFromURL(this.route, 'requestTypeId')
    );
    this.messageTemplateService.getListFormatedMessage(requestTypeId, 'MAIL', event.target.value, this.customerId).subscribe(templates => {
      this.messageTemplate = templates;
    });
    if (event.target.value === 'ENGLISH') {
      this.langSelected = true;
      this.mailSendingForm.get('modele').setValue(this.libreTemplate);
      this.selectedModelObject = '';
      this.selectedModelTitle = '';
      this.selectedModelSubtitle = '';
      this.selectedModelBody = ''; 
    } else {
      this.langSelected = false;
      this.mailSendingForm.get('modele').setValue(this.libreTemplate);
      this.selectedModelObject = '';
      this.selectedModelTitle = '';
      this.selectedModelSubtitle = '';
      this.selectedModelBody = '';
    } 
  }

  classError(value: boolean): string {
    if (value) {
      return 'form-control error';
    }
    return 'form-control';
  }
    
  onChangeTemplate(): void {
    if (this.mailSendingForm.get('modele').value.id !== null) {
      this.messageTemplateService.getFormatedMessage(this.mailSendingForm.get('modele').value.id , getCustomerIdFromURL(this.route), 
      this.connectedUser.id ).subscribe(template => {
        this.selectedModelObject = template.object;
        this.selectedModelTitle = template.title;
        this.selectedModelSubtitle = template.subtitle;
        this.selectedModelBody = template.message;
        this.manageFillList(template.keyWordsList);
      });
    } else if (this.mailSendingForm.get('modele').value.id === null ) {
      this.selectedModelObject = '';
      this.selectedModelTitle = '';
      this.selectedModelSubtitle = '';
      this.selectedModelBody = '';
    }
  }

  manageFillList(keyWordList: KeyWordsVO[] = null): void {
    if (keyWordList !== null) {
      for (const keyWord of keyWordList) {
        if (keyWord.isList) {
          this.addComboList(keyWord);
        } else {
          this.tabStringToCheck.push(keyWord.label);
        }
      }
    }
    this.highlightKeywords();
  }

  highlightKeywords(): void {
    for (const keyword of this.tabStringToCheck) {
      this.selectedModelBody = StringReplaceAll(this.selectedModelBody, keyword, `<FONT COLOR="#FF0000"> ${keyword} </FONT>`);
    }
  }

  addComboList(keyWord: KeyWordsVO): void {
    var tmpDP: [] = this.getDataProviderListCB(keyWord.key);
    if (tmpDP.length > 1) {
      var counter = 1;
      while (this.selectedModelBody.indexOf(keyWord.label) !== -1) {
        var genName: string = keyWord.label.replace(']', `_  ${counter.toString()} ]`);
        this.selectedModelBody = this.selectedModelBody.replace(keyWord.label, genName);
      }
    }
  }

  getDataProviderListCB(keywordKey: string): [] {
    var comboDP= [] as  any;
    switch (keywordKey) {
      case KeyWords.LIST_PARC_TELCO:
        comboDP.push(this.parkItemDP);
        break;
      case KeyWords.LIST_MAIL:
        comboDP.push(this.getDataprovider(CM_TYPE_DATA.EMAIL));
        break;
      case KeyWords.LIST_FAX:
        comboDP.push(this.getDataprovider(CM_TYPE_DATA.FAX));
        break;
      case KeyWords.LIST_MOBILE:
        comboDP.push(this.getDataprovider(CM_TYPE_DATA.TEL_MOBILE));
        break;
      case KeyWords.LIST_PHONE:
        comboDP.push(this.getDataprovider(CM_TYPE_DATA.TEL_FIXE));
        break;
      case KeyWords.LIST_POSTAL_ADRESSE:
        comboDP.push(this.getDataprovider(CM_TYPE_DATA.POSTAL_ADDRESS));
        break;
    }
    return comboDP;
  }

  getDataprovider(typeData: string): [] {
    var tmp= [] as  any;
    for (const cm of this.allContactMethod) {
      if (cm.mediaRefKey === typeData) {
        tmp.push(cm);
      }
    }
    return tmp;
  }

  remove(i: InterlocutorVO): void {
    const index = this.destinatairesList.indexOf(i);
    if (index >= 0) {
      this.destinatairesList.splice(index, 1);
    }
  }

  getInterlocutorRole(role : string){
    if(this.typeCustomer === 'particular' && ROLE_INTERLOCUTOR.ROLE_BENEFICIARE.value == role){
      return CUSTOMER_TYPE_LABEL.PARTICULAR;
    }
    return role;
  }

  removeCC(i: InterlocutorVO): void {
    const index = this.destinataireCC.indexOf(i);
    if (index >= 0) {
      this.destinataireCC.splice(index, 1);
    }
  }

  removeCCI(i: InterlocutorVO): void {
    const index = this.destinataireCCI.indexOf(i);
    if (index >= 0) {
      this.destinataireCCI.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!isNullOrUndefined(this.destinatairesList)) {
      const isExist = this.destinatairesList.find(interlocutor => interlocutor.value === event.option.value.value);
      if (isNullOrUndefined(isExist)) {
        this.destinatairesList = [];
        this.destinatairesList.push(event.option.value);
       
      }
    }
    this.fruitInput.nativeElement.value = '';
    this.mailSendingForm.get('fruitCtrl').setValue(null);
    this.chipList.errorState = false;
  }

  selectedCC(event: MatAutocompleteSelectedEvent): void {
    if (!isNullOrUndefined(this.destinataireCC)) {
      const isExist = this.destinataireCC.find(interlocutor => interlocutor.value === event.option.value.value);
      if (isNullOrUndefined(isExist)) {
        this.destinataireCC.push(event.option.value);
      }
    }
    this.CCInput.nativeElement.value = '';
    this.mailSendingForm.get('CCCtrl').setValue(null);
    this.chipCCList.errorState = false;
  }

  selectedCCI(event: MatAutocompleteSelectedEvent): void {
    if (!isNullOrUndefined(this.destinataireCCI)) {
      const isExist = this.destinataireCCI.find(interlocutor => interlocutor.value === event.option.value.value);
      if (isNullOrUndefined(isExist)) {
        this.destinataireCCI.push(event.option.value);
      }
    }
    this.CCIInput.nativeElement.value = '';
    this.mailSendingForm.get('CCICtrl').setValue(null);
    this.chipCCIList.errorState = false;
  }

  onChangeTextTitle(event: any): void {
    this.mailSendingForm.get('title').setValue(event.target.value);
  }

  onChangeTextSubtitle(event: any): void {
    this.mailSendingForm.get('subtitle').setValue(event.target.value);
  }

  onChangeTextMessage(message: any): void {
    this.selectedModelBody = message;
    this.corpsInvalid = false;
  }

  ValidForm(): boolean {

    if ((this.mailSendingForm.get('senderList').value.label !== undefined 
          && this.mailSendingForm.get('senderList').value.label !== null 
          && this.mailSendingForm.get('senderList').value.label !== '')
          || (typeof this.mailSendingForm.get('senderList').value === 'string'
          && this.mailSendingForm.get('senderList').value !== '') ) {
      this.mailSenderInvalid = false;
      this.validEmail();
    } else {
      this.mailSenderInvalid = true;
    }

    if (isNullOrUndefined(this.destinatairesList) || this.destinatairesList.length === 0) {
      this.interlocutorInvalid = true;
    } else {
      this.interlocutorInvalid = false;
    }

    if (!isNullOrUndefined(this.mailSendingForm.value.objet) &&  this.mailSendingForm.value.objet !== '') {
      this.objetInvalid = false;
    } else {
      this.objetInvalid = true;
    }
    
    if (!isNullOrUndefined(this.selectedModelTitle) && this.selectedModelTitle !== '') {
      this.titreInvalid = false;
    } else {
      this.titreInvalid = true;
    }
    
    if (!isNullOrUndefined(this.selectedModelBody) && this.selectedModelBody !== '') {
      this.corpsInvalid = false;
    } else {
      this.corpsInvalid = true;
    }
    this.suitValidForm();
    return this.isNotValid;
  }

  validEmail() {
    if(typeof this.mailSendingForm.get('senderList').value === 'string') {
      this.formatMailInvalide = !emailIsValid(this.mailSendingForm.get('senderList').value);
    } else {
      this.formatMailInvalide = !emailIsValid(this.mailSendingForm.get('senderList').value.label);
    }

}

  suitValidForm() : void {
    if ( this.mailSendingForm.get('styleControl').value !== null ) {
      this.styleInvalid = false;
    } else {
      this.styleInvalid = true;
    }
    
    if (this.mailSendingForm.get('motif').value !== null ) {
      this.motifInvalid = false;
    } else {
      this.motifInvalid = true;
    }

    if (this.mailSenderInvalid || this.formatMailInvalide || this.interlocutorInvalid || this.objetInvalid
      || this.titreInvalid || this.corpsInvalid || this.styleInvalid || this.motifInvalid) {
      this.isNotValid = true;
      this.isValidBtn = false;
    } else {
      this.isNotValid = false;
      this.isValidBtn = true;
    }
  }

  initValidator(): void {
    this.mailSenderInvalid = true;
    this.formatMailInvalide = true;
    this.interlocutorInvalid = true;
    this.objetInvalid = true;
    this.titreInvalid = true;
    this.corpsInvalid = true;
    this.styleInvalid = true;
    this.motifInvalid = true;
  }

  onObjetChange(event: any): void {
    this.mailSendingForm.get('objet').setValue(event.target.value);
  }

  setReceivers(): MessageReceiverVO[] {
    const destinatairesList = this.destinatairesList;
    const destinatairesCCList = this.destinataireCC;
    const destinatairesCCIList = this.destinataireCCI;
    const receivers = [];
    if (destinatairesList) {
      destinatairesList.forEach((destinataire: InterlocutorVO) => {
        const receiverDestinataire: MessageReceiverVO = {} as MessageReceiverVO;
        receiverDestinataire.contactMethodId = destinataire.contactMethodId;
        receiverDestinataire.value = destinataire.value;
        receiverDestinataire.copy = false;
        receiverDestinataire.hidden = false;
        receivers.push(receiverDestinataire);
      });
    }
    if (destinatairesCCList) {
      destinatairesCCList.forEach((cc: InterlocutorVO) => {
        const receiverCC: MessageReceiverVO = {} as MessageReceiverVO;
        receiverCC.contactMethodId = cc.contactMethodId;
        receiverCC.value = cc.value;
        receiverCC.copy = true;
        receiverCC.hidden = false;
        receivers.push(receiverCC);
      });
    }
    if (destinatairesCCList) {
      destinatairesCCIList.forEach((cci: InterlocutorVO) => {
        const receiverCCI: MessageReceiverVO = {} as MessageReceiverVO;
        receiverCCI.contactMethodId = cci.contactMethodId;
        receiverCCI.value = cci.value;
        receiverCCI.copy = false;
        receiverCCI.hidden = true;
        receivers.push(receiverCCI);
      });
    } 
    return receivers;
  }

  prepareMailForSave(): void {
    this.sentMail.createAtStr = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.sentMail.createdBy = this.connectedUser.id;
    this.sentMail.messageTemplateId = this.mailSendingForm.get('modele').value.id;
    this.sentMail.requestId = this.request.idRequest;
    this.sentMail.interactionReasonId = this.mailSendingForm.get('motif').value;
    if(typeof this.mailSendingForm.get('senderList').value === 'string') {
      this.sentMail.sender = this.mailSendingForm.get('senderList').value;
    } else {
      this.sentMail.sender = this.mailSendingForm.get('senderList').value.label;
    }
    this.sentMail.listReceivers = this.setReceivers();
    this.sentMail.styleId = this.mailSendingForm.get('styleControl').value.id;
    this.sentMail.subject = this.mailSendingForm.get('objet').value;
    this.sentMail.description = this.mailSendingForm.get('description').value;
    this.sentMail.title = '<font style="font-family: \'Segoe UI\'; font-size: 27pt; font-weight: bold;">'+ this.selectedModelTitle +'</font>' ;
    if(!isNullOrUndefined(this.selectedModelSubtitle)){
      this.sentMail.subtitle = '<font style="font-family: \'Segoe UI\'; font-size: 14pt;" >'+ this.selectedModelSubtitle.toUpperCase() +'</font>';
    }
    this.sentMail.message = this.selectedModelBody;
    this.sentMail.isSatisfied = this.mailSendingForm.get('sonde').value;
    this.sentMail.userId = this.connectedUser.id;
    this.sentMail.customerId = getDecryptedValue(getCustomerIdFromURL(this.route));
    this.sentMail.category = 'MAIL';
  }

  onPreview(): void {
    this.prepareMailForSave();
    localStorage.setItem('sentMail', JSON.stringify(this.sentMail));
  }

  save(): void {
    this.prepareMailForSave();
    if (!this.ValidForm()) {
        this.messageMail.message = this.sentMail;
        if(isNullOrUndefined(this.listDocumentToSend) || this.listDocumentToSend.length === 0 ) {
           this.listDocumentToSend = [];
        }
        this.messageMail.listFile = this.listDocumentToSend;
        this.messageService.sendMessage(this.messageMail).subscribe(
          message => console.log,
          error => console.log,
          () => this.redirect(false, true)
        );
        this.isValidBtn = false;
    } else {    
      this.isValidBtn = true;
    }

  }

  annuler(): void {  
    this.initValidator();
    this.redirect(true, false);
  }

  redirect(canceled: boolean, submitted: boolean): void {
    this.submitted = submitted;
    this.canceled = canceled;
    const customerId = getCustomerIdFromURL(this.route);
    this.router.navigate(
      ['customer-dashboard', customerId, 'detail','request', this.request.idRequest ],
      {
        queryParams: { typeCustomer: this.typeCustomer },
        queryParamsHandling: 'merge'
      }
    );
  }

  onSelectMotif(motif: any): void {
    this.mailSendingForm.controls.motif.setValue(motif.id);
  }
  addCoachToRecipientCCList(referents) {
    referents.forEach(element => {
      if (element.roleId === CONSTANTS.ROLE_COACH) {
        const coach = { firstName: element.firstName, lastName: element.lastName, roleLabel: 'Coach', value: ( element.parnasseEmail ? element.parnasseEmail : element.email)} as InterlocutorVO;
        this.allRecipientCC.push(coach);
      }
    });
  }
  addAccountManagerToRecipientCCList() {
    this.userService.getUserVoById(this.request.idRespAffaire).subscribe((user) => {
      this.parnasseEmail = user.parnasseEmail;
    },
    (err)=>{  console.log('error', err); },
    ()=>{
      this.addResponsableAffaireToList();
    });
  }

  addResponsableAffaireToList() {
    if (!isNullOrUndefined(this.request.idRespAffaire)) {
      const ra = { 
        firstName: this.request.firstNameRespAffaire, 
        lastName: this.request.lastNameRespAffaire, 
        roleLabel: 'Responsable d\'affaires',
        value: this.parnasseEmail ? this.parnasseEmail : this.request.emailRespAffaire
      } as InterlocutorVO;
      this.allRecipientCC.unshift(ra);
    }
  }

  private _filter(value: InterlocutorVO): InterlocutorVO[] {
    return this.destinataires.filter(interlocutor => !isNullOrUndefined(interlocutor.lastName) && interlocutor.lastName.toLowerCase().indexOf(value.lastName.toLowerCase()) === 0);
  }

  openPopup() {
    let valueResult: InterlocutorVO = {} as InterlocutorVO;
    const popUp = this.modalService.open(PopAddMailComponent,{ centered: true,
      windowClass: this.CUSTOME_POPUP,
      size: 'lg', backdrop : 'static', keyboard: false,
      });
      popUp.componentInstance.customerId = this.customerId;
      popUp.componentInstance.typeCustomer = this.typeCustomer;
      popUp.componentInstance.resultMail.subscribe((value: InterlocutorVO) => {
        valueResult = value;
      });
      popUp.result.then((result) => {
        if(result) {
          this.setDestinataireByNewContact(valueResult, this.destinataires);
        }
      })
    }

    setDestinataireByNewContact(interlocutorVO: InterlocutorVO, listDestinataires:InterlocutorVO[]): boolean {
      if(!isNullOrUndefined(listDestinataires) && !isNullOrUndefined(interlocutorVO)) {
            const interVo: InterlocutorVO = {} as InterlocutorVO;
            interVo.value = interlocutorVO.value;
            interVo.personId = interlocutorVO.personId;
            interVo.firstName = interlocutorVO.firstName;
            interVo.lastName = interlocutorVO.lastName;
            interVo.roleLabel = interlocutorVO.roleLabel;
            this.destinataires.push(interVo);
            this.allRecipientCC.push(interVo);
            this.destinatairesList = [];
            this.destinatairesList.push(interVo);
            this.destinataireCC.push(interVo);
            this.destinataireCCI.push(interVo);
            this.filterInterlocutorsLists();
            return true;
      }
      return false;
    }

    initComponentRecipient(destinataire: InterlocutorVO): void {
      this.allRecipientCC = [ ...this.destinataires];
      this.destinatairesList.push(destinataire);
      this.destinataireCC.push(destinataire);
      this.destinataireCCI.push(destinataire);
    }

    openPopDocument() {
      let results = [];
      const popUpDocument = this.modalService.open(PopAddDocumentComponent,{ centered: true,
        windowClass: this.CUSTOME_POPUP,
        size: 'lg', backdrop : 'static', keyboard: false,
        });
        popUpDocument.componentInstance.customerId = this.customerId;
        popUpDocument.componentInstance.request = this.request;
        popUpDocument.componentInstance.documentsToSend.subscribe((values: DocumentVO[]) => {
          results = values;
        });
        popUpDocument.result.then((result) => {
          if(result) {
            const dataRow = this.listDocumentToSend;
            this.listDocumentToSend = [];
            for( const document of results) {
              const checkDocumentExist = docParam => dataRow.some( ({fileName}) => fileName === docParam)
              if(!checkDocumentExist(document.fileName)) {
                dataRow.push(document);
              }
            }
            this.mapperDocument(dataRow);
          }
        })
    }

    mapperDocument(documents: DocumentVO[]) {
      for (const doc of documents) {
        this.listDocumentToSend.push(doc);
      }
    }
    /**
     * ag-grid pour tablau des documents
     */
     setColumnDocumentsRef(): void {	
      this.columnDefs = [
        {
          headerName: 'fichier',
          headerTooltip: '',
          field: 'titreDocument',
          colId: 'titreDocument',
          autoHeight: true,
          width: 140
        },
        {
          headerName: 'type',
          headerTooltip: '',
          field: 'targetType',
          colId: 'targetType',
          valueGetter: (params) => this.getValueType(params.data.targetType),
          autoHeight: true,
          width: 140
        },
        {
          headerName: '',
          headerTooltip: '',
          field:  this.DOWLOAD_COL_ID,
          colId: this.DOWLOAD_COL_ID,
          cellRenderer: params => {
            return  this.createSpanElement(this.DOWLOAD_COL_ID);
          },
          minWidth: 40,
          maxWidth: 40,
        },
        {
          headerName: '',
          headerTooltip: '',
          field: this.DELETE_COL_ID,
          colId: this.DELETE_COL_ID,
          cellRenderer: params => {
            return  this.createSpanElement(this.DELETE_COL_ID);
          },
          minWidth: 40,
          maxWidth: 40,
        }
      ];
    }
    private createSpanElement(className: string) {
      return `<span class="icon ${className}"></span>`;
    }

    private getValueType(type: string): string {
      if(type === this.CUSTOMER) {
        return this.labelDocument;
      } else if(type === this.REQUEST) {
        return this.labelDocumentRequest;
      } 
      return '';
    }

    clickCell(event: any) {
      if (event.column.colId === this.DOWLOAD_COL_ID) {
          this.downloadFile(event.data.fileName, event.data.customerNicheIdentifer);
      } else if(event.column.colId === this.DELETE_COL_ID) {
        const dataRow = this.listDocumentToSend;
        this.listDocumentToSend = [];
         dataRow.forEach( (item, index) => {
          if(item.fileName === event.data.fileName) { 
            dataRow.splice(index,1);
          }
        });
        this.mapperDocument(dataRow);
      }
    }

    downloadFile(name, nicheIdentif) {
      this.documentService.downloadFile(name, nicheIdentif).subscribe(
        (doc) => {
          const type = doc.headers.get(this.CONTENT_TYPE);
          const file = new Blob([doc.body], { type });     
          if ( type !== this.APPLICATION_STREAM) {
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
          } else {
            const elementDoc = document.createElement('a');
            elementDoc.target = this.BLANK;
            elementDoc.href = URL.createObjectURL(file);
            elementDoc.download = name;
            document.body.appendChild(elementDoc);
            elementDoc.click();
          }
        });
      }
}
