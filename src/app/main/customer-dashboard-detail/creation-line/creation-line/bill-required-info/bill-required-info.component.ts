import { ResponseIbanDetailsVO } from './../../../../../_core/models/response-iban-details-vo';
import { TelcoUniverse, PenicheCivilite } from './../../../../../_core/enum/billing-account.enum';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import { DEFAULT_STRING_EMPTY_VALUE,
   PRELEVEMENT_PENICHE_TYPES, PENICHE_PAYMENT_TYPE, CSS_CLASS_NAME } from '../../../../../_core/constants/constants';
import { PenicheState } from '../../../../../_core/enum/peniche-state.enum';
import { PenichePaymentCondition, Title, PenicheCiviliteByEnumLegacy } from '../../../../../_core/enum/billing-account.enum';
import { isNullOrUndefined, isEmpty } from '../../../../../_core/utils/string-utils';
import { PenicheBillAccountVO } from '../../../../../_core/models/peniche-bill-account-vo';
import { CustomerService, GassiMockLoginService, ParcLigneService } from '../../../../../_core/services';
import { CustomerProfileVO } from '../../../../../_core/models/customer-profile-vo';
import { InvoiceService } from '../../../../../_core/services/invoice.service';
import { InfoContextVO } from '../../../../../_core/models/info-context-vo';
import { InfoBodySendRIBVO } from '../../../../../_core/models/info-body-send-rib-vo';
import { InfoCustomerVO } from '../../../../../_core/models/info-customer-vo';
import { PersonVO } from '../../../../../_core/models/person-vo';
import { PenicheBillAccountLineVO } from '../../../../../_core/models/peniche-bill-account-line-vo';
import { CustomerParkItemVO } from '../../../../../_core/models/customer-park-item-vo';
import { ApplicationUserVO } from '../../../../../_core/models/application-user';
import { PayementVO } from '../../../../../_core/models/payement';
import { NotificationService } from '../../../../../_core/services/notification.service';
import { PenicheCountry } from '../../../../../_core/constants/peniche-country';
import { ConfirmationDialogService } from '../../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-bill-required-info',
  templateUrl: './bill-required-info.component.html',
  styleUrls: ['./bill-required-info.component.scss']
})
export class BillRequiredInfoComponent implements OnInit {

  typeCustomer: string;
  customerId: string;
  nicheIdentifier: string;
  customerFull: CustomerProfileVO = {} as CustomerProfileVO;
  universe: string;
  customerPark: CustomerParkItemVO = {} as CustomerParkItemVO;

  countryList: Array<{data: string, label: string}> = {} as Array<{data: string, label: string}>;

  datePattern = 'yyyy-MM-dd';

  @Input() isEditMode: boolean;
  penicheBillAccount: PenicheBillAccountVO = {} as PenicheBillAccountVO;
  @Output() hasChanged = new EventEmitter<boolean>();

  @Output() updateRequiredInfo = new EventEmitter<boolean>(null);
  @Output() changeForm = new EventEmitter<PenicheBillAccountVO>();
  @Output() changeDirtyRequiredInfoForm = new EventEmitter<boolean>();

  infoContext: InfoContextVO = {} as InfoContextVO;
  infoCustomer: InfoCustomerVO = {} as InfoCustomerVO;
  infoSendIbanRib: InfoBodySendRIBVO = {} as InfoBodySendRIBVO;
  connectedUser: ApplicationUserVO = {} as ApplicationUserVO;
  payment: PayementVO = {} as PayementVO;
  paymentRefNumber = null;
  responseIbanDetailsResult: ResponseIbanDetailsVO;

  showResiliationDate = false;
  showIbanButton = false;
  getIbanButton = false;
  getCard = false;
  sendCard = false;
  showIbanSentence = false;
  paymentModeAccount: any;
  cardNumberToShow: any;
  showCardSentence = false;
  customerDashboard = '/customer-dashboard';
  listNumLines: Array<string> = [];
  listCpi: CustomerParkItemVO[] = [];
  finalList: any = [];
  form: FormGroup;
  isSubmitted = false;
  isUpdate = false;
  isEntreprise = false;
  typeClient: string;
  seeAll: '';
  typeRequest: '';  

  identifierIsValid;
  paymentModeIsValid;

  /**
   * these lists are to be moved to constants file
   */
  stateList = [{ key: PenicheState.ACTIF, data: 'Actif' }, { key: PenicheState.INACTIF, data: 'Inactif' }];
  recurrentList = [{ key: true, data: 'Oui' }, { key: false, data: 'Non' }];
  paymentConditonsList = [
    { key: null, data: '--' },
    { key: PenichePaymentCondition.C15_JOURS_FACTURE, data: '15 jours date de facture' },
    { key: PenichePaymentCondition.C30_JOURS_FACTURE, data: '30 jours date de facture' },
    { key: PenichePaymentCondition.C45_JOURS_FACTURE, data: '45 jours date de facture' },
    { key: PenichePaymentCondition.C60_JOURS_FACTURE, data: '60 jours date de facture' }
  ];
  PenichPaymentType = [
    { key: '', data: '--' },
    { key: PENICHE_PAYMENT_TYPE.PRELEVEMENT, data: this.prelevementFormatter('PRELEVEMENT') },
    { key: PENICHE_PAYMENT_TYPE.CHEQUE, data: this.prelevementFormatter('CHEQUE') },
    { key: PENICHE_PAYMENT_TYPE.VIREMENT, data: this.prelevementFormatter('VIREMENT') },
    { key: PENICHE_PAYMENT_TYPE.CB, data: this.prelevementFormatter('CB') },
    { key: PENICHE_PAYMENT_TYPE.AMEX, data: this.prelevementFormatter('AMEX') },
    { key: PENICHE_PAYMENT_TYPE.PRELEVEMENT_AMEX, data: this.prelevementFormatter('AMEXREC') },
    { key: PENICHE_PAYMENT_TYPE.PRELEVEMENT_CB, data: this.prelevementFormatter('CBREC') }
  ];

  PERSON_CUSTOMER_LEGAL_REPRESENTATIVE = 'ref_customer_person_role_type_representant_legal';
  PERSON_CUSTOMER_TITU = 'ref_customer_person_role_type_titulaire';
  PERSON_CUSTOMER_BEN = 'ref_customer_person_role_type_beneficiaire';

  defaultSortModel = [];

  rowData: PenicheBillAccountLineVO[] = [];

  columnDefs = [
    {
      headerName: '',
      headerTooltip: '',  
      width: 10
    },
    {
      headerName: 'N° de ligne', headerTooltip: 'lineIdentifier', 
      field: 'numero',
      minWidth: 108,
      maxWidth: 108,
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, autoHeight: true,
      valueGetter: params => params.data.lineIdentifier
    },
    {
      headerName: 'Offre', headerTooltip: 'Offre', field: 'offer',
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, autoHeight: true,
      minWidth: 200,
      maxWidth: 200,
      valueGetter: params => params.data.offer
    },
    {
      headerName: 'Alias', headerTooltip: 'Alias', field: 'lineAlias',
      editable: true,
      cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT, autoHeight: true,
      minWidth: 327,
      maxWidth: 327,
      valueGetter: params => params.data.lineAlias
    }
  ];
  
  constructor(private readonly route: ActivatedRoute, private readonly _formBuilder: FormBuilder,
    private readonly customerService: CustomerService, private readonly invoiceService: InvoiceService,
    readonly parkItemService: ParcLigneService, readonly gassiService: GassiMockLoginService, readonly router: Router,
    readonly datePipe: DatePipe,
    private readonly notificationService: NotificationService, 
    private readonly confirmationDialogService: ConfirmationDialogService) { }
  
  ngOnInit() {
    this.customerPark = this.notificationService.getCPI();  
    // tslint:disable-next-line: no-console
    console.log('park', this.customerPark);

    this.seeAll = this.route.snapshot.queryParams['from'];
    this.typeRequest = this.route.snapshot.queryParams['typeRequest'];
    this.route.parent.parent.parent.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
      this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer'); 
    });
    this.isEntreprise = this.itIsAnEntreprise();
    this.customerService.getCustomerProfile(this.customerId).subscribe(response => {
      this.customerFull = response;
    });

    this.gassiService.getCurrentConnectedUser().pipe(take(1)).subscribe((user) => {
      this.connectedUser = user;
    });
    this.countryList = PenicheCountry.values;
    this.initCreation();
    this.universe = this.customerPark.universe;
    this.form = this.buildFrom();
    this.initValues(this.penicheBillAccount);

    
    if(this.route.snapshot.queryParams['modificationLine'] === 'true'){
      this.isUpdate = true
     }
   if(this.route.snapshot.queryParams['modificationLine'] === 'false'){
     this.isUpdate = false
     }
  }

  buildFrom(): any {
    return this._formBuilder.group({
      identifier: this._formBuilder.control(null, Validators.required),
      status: this._formBuilder.control(null),
      terminationDate: this._formBuilder.control(null),
      recurrent: this._formBuilder.control(null),
      paymentCondition: this._formBuilder.control(null),
      controlCF: this._formBuilder.control(null),
      justificationControle: this._formBuilder.control({ value: null, disabled: true }),
      compteRenduAttendu: this._formBuilder.control(null),
      billingDay: this._formBuilder.control(null),
      paymentMode: this._formBuilder.control(null, Validators.required)
    });
  }

  initValues(penicheBillAccount: PenicheBillAccountVO): void {
    this.form.get('identifier').setValue(penicheBillAccount.identifier);
    this.form.get('status').setValue(penicheBillAccount.status);
    this.form.get('status').disable();
    this.form.get('terminationDate').setValue(penicheBillAccount.terminationDate);
    this.form.get('recurrent').setValue(penicheBillAccount.recurrent);
    if (penicheBillAccount.status === PenicheState.INACTIF) {  
      this.showResiliationDate = true;
      this.form.get('terminationDate').setValue(new Date().toString());
    }

    this.form.get('paymentCondition').setValue(!isEmpty(penicheBillAccount.paymentCondition) ? penicheBillAccount.paymentCondition : null);
    this.form.get('controlCF').setValue(penicheBillAccount.controlCF);
    this.form.get('justificationControle').setValue(penicheBillAccount.justificationControle);
    this.form.get('compteRenduAttendu').setValue(penicheBillAccount.compteRenduAttendu);
    this.form.get('billingDay').setValue(penicheBillAccount.billingDay);
    this.form.get('paymentMode').setValue(!isEmpty(penicheBillAccount.paymentMode) ? penicheBillAccount.paymentMode : '');
    if (penicheBillAccount.paymentMode === PENICHE_PAYMENT_TYPE.PRELEVEMENT && this.penicheBillAccount.bankAccountNumber !== '') {
      this.showIbanSentence = true;
      const numCompteSize = this.penicheBillAccount.bankAccountNumber.length;
      this.paymentModeAccount = PENICHE_PAYMENT_TYPE.INFO_BANK_SEPA_PRELEVMENT + 
          this.penicheBillAccount.bankAccountNumber.substring(numCompteSize - 4);
    } else {
      this.showIbanSentence = false;
    }
    
    this.rowData = this.penicheBillAccount.billAccountLines;
    console.log('Lines', this.penicheBillAccount.billAccountLines);
  }

  onChangeState(): any {
    if ( this.form.get('status').value === PenicheState.INACTIF ) {
      this.showResiliationDate = true;
      this.form.get('terminationDate').setValue(new Date());
    } else {
      this.showResiliationDate = false;
    }
  }

  onTypeSelect(): any {
    if ( this.form.get('paymentMode').value === PENICHE_PAYMENT_TYPE.PRELEVEMENT) {
      this.showIbanButton = true; 
      this.sendCard = false;
      this.getCard = false;  
      this.getIbanButton = false;
      if ( !isNullOrUndefined(this.paymentModeAccount)) {
        this.showIbanSentence = true;
      }
    } else if (this.form.get('paymentMode').value === PENICHE_PAYMENT_TYPE.PRELEVEMENT_AMEX || 
    this.form.get('paymentMode').value === PENICHE_PAYMENT_TYPE.PRELEVEMENT_CB) {
      this.sendCard = true;  
      this.showIbanSentence = false;
      this.showIbanButton = false;
      this.getIbanButton = false;
      this.getCard = false;
    } else {
      this.showIbanSentence = false;
      this.showIbanButton = false;
      this.getIbanButton = false;
      this.sendCard = false;
      this.getCard = false;
    }
  }

  enableTextArea(event: any): void {
    if (event.checked) {
      this.form.get('justificationControle').enable();
    } else {
      this.form.get('justificationControle').disable();
    }
  }

  onSendIbanClick(): any {
    const CALLER_ATN = 'ATN';
    this.getIbanButton = true;
    this.infoContext.callerId = CALLER_ATN;
    this.infoContext.callerUseCase = 'Saisie IBAN Chorniche';
    this.infoContext.backUrl = '';
    this.infoContext.cancelUrl = '';
    this.infoContext.mediaCode = 'W';
    this.infoContext.contextLabel = 'A envoyer. Ne pas afficher';
    this.infoContext.paragraph = '<br>Après validation, l’IBAN sera transformé en jeton.<br>Merci de cliquer sur le bouton' +
     '"Récupérer l\'IBAN" dans Athena pour mettre à jour l\'IHM.';
    this.infoContext.allowDigitalSignature = 'false';
    this.infoSendIbanRib.infoContext = this.infoContext;
      // info customer
    let personTitulaire = {} as PersonVO;
    let personLegal = {} as PersonVO;
    let personBeneficiaire = {} as PersonVO;
      
    let idPersonTitulaire = 0;
    let idPersonLegal = 0;
    let idPersonBeneficiaire = 0;
      
    for ( const elm of this.customerFull.customer.personCustomerRoles) {
      if (elm.refRole.key === this.PERSON_CUSTOMER_TITU) {
        idPersonTitulaire = elm.personId;
      } else if (elm.refRole.key === this.PERSON_CUSTOMER_LEGAL_REPRESENTATIVE) {
        idPersonLegal = elm.personId;
      } else if (elm.refRole.key === this.PERSON_CUSTOMER_BEN) {
        idPersonBeneficiaire = elm.personId;
      }
    }
          
    for (const cpt of this.customerFull.customer.persons) {
      if (cpt.id === idPersonTitulaire) {
        personTitulaire = cpt;
      } else if (cpt.id === idPersonLegal) {
        personLegal = cpt;
      } else if (cpt.id === idPersonBeneficiaire) {
        personBeneficiaire = cpt;
      }
    }
    this.infoSendIbanRib.infoCustomer = {} as InfoCustomerVO;
        // SI on a les infos payeur dans billAccount
    if (!isNullOrUndefined(this.penicheBillAccount.payerLastName) && !isNullOrUndefined(this.penicheBillAccount.payerFirstName) &&
     this.penicheBillAccount.payerFirstName !== '' && this.penicheBillAccount.payerLastName !== '') {
      
      this.infoSendIbanRib.infoCustomer.civility = this.getTitle(this.penicheBillAccount.payerTitle);
      this.infoSendIbanRib.infoCustomer.lastName = this.penicheBillAccount.payerLastName;
      this.infoSendIbanRib.infoCustomer.firstName = this.penicheBillAccount.payerFirstName;
      this.infoSendIbanRib.infoCustomer.companyName = this.penicheBillAccount.payerCompany;
          
    } else { 
      // Sinon on prend les infos sur le titulaire et le representant legal, pour une entreprise
      if (!isNullOrUndefined(this.penicheBillAccount.payerCompany) && this.penicheBillAccount.payerCompany !== '') {  
      
        this.infoSendIbanRib.infoCustomer.companyName = this.penicheBillAccount.payerCompany;

      } else if (personTitulaire !== null) {
      
        this.infoSendIbanRib.infoCustomer.companyName = personTitulaire.crmName;
      }
      if (personLegal !== null) {
      
        this.infoSendIbanRib.infoCustomer.civility = this.getTitle(personLegal.title);
        this.infoSendIbanRib.infoCustomer.lastName = personLegal.crmName;
        this.infoSendIbanRib.infoCustomer.firstName = personLegal.firstName;
            
      } else if (personBeneficiaire !== null) { // ou sur le bénéficiaire pour un particuliers
      
        this.infoSendIbanRib.infoCustomer.civility = this.getTitle(personBeneficiaire.title);
        this.infoSendIbanRib.infoCustomer.lastName = personBeneficiaire.crmName;
        this.infoSendIbanRib.infoCustomer.firstName = personBeneficiaire.firstName;
      } else {
      
        this.infoSendIbanRib.infoCustomer.lastName = personTitulaire.crmName;
        this.infoSendIbanRib.infoCustomer.firstName = personTitulaire.firstName;
      }
    }

    this.invoiceService.postIbanRib(this.infoSendIbanRib).subscribe((res) => {
      // tslint:disable-next-line: no-console
      console.log('send info iban rib', res);     
      this.connectedUser.uuid = res.uuid;
      window.open(res.ui, 
        'ibanWindow', 'width=600,height=300,left=0,top=0,toolbar=No,location=No,scrollbars=No,status=No,resizable=No,fullscreen=No');
    });
  }

  getTitle(title: string): string {
    let result: string;
    if (title !== null && title === Title.M) {
      result = 'Monsieur';
    } else if (title !== null && title === Title.MME) {
      result = 'Madame';
    } else {
      result = '';
    }
    return result;
  }

  getCiviliteByEnumLegacy(title: string): string {
    let result: string;
    if (title === PenicheCiviliteByEnumLegacy.M) {
      result = 'M';
    } else if (title === PenicheCiviliteByEnumLegacy.MME) {
      result = 'MME';
    } else if (title === PenicheCiviliteByEnumLegacy.MR) {
      result = 'MR';
    } else if (title === PenicheCiviliteByEnumLegacy.MLE) {
      result = 'MME';
    } else if (title === PenicheCiviliteByEnumLegacy.STE) {
      result = 'PM';
    } else {
      result = '';
    }
    return result;
  }

  isBillingDayEmpty(event: any): void {
    if ( event.target.value === '') {
      this.form.get('billingDay').setValue(1);
    }
  }

  onGetIbanClick(): any {
    this.invoiceService.getDetailsIbanRib(this.connectedUser.uuid).subscribe((r) => {
      // tslint:disable-next-line: no-console
      console.log('get detail iban rib', r);
      if (r !== null && r.code === 'SUCCESS' && r.rib !== null) {
        this.responseIbanDetailsResult = r;
        if ( !this.isEditMode ) {
          this.showIbanSentence = true;
        }
        const numCompteSize = r.rib.accountNumber.length;
        this.paymentModeAccount = PENICHE_PAYMENT_TYPE.INFO_BANK_SEPA_PRELEVMENT + 
        r.rib.accountNumber.substring(numCompteSize - 4);
      } 
      this.connectedUser.responseIbanDetails = r;
    });
  }

  prelevementFormatter(prelevement: string): string {
    if (isNullOrUndefined(prelevement) ) {
      return DEFAULT_STRING_EMPTY_VALUE;
    } 
    return ( PRELEVEMENT_PENICHE_TYPES[prelevement] ) ? PRELEVEMENT_PENICHE_TYPES[prelevement] : DEFAULT_STRING_EMPTY_VALUE;
  }

  countryFormatter(country: string): string {
    if (isNullOrUndefined(country) ) {
      return DEFAULT_STRING_EMPTY_VALUE;
    } 
    return ( PenicheCountry[country] ) ? PenicheCountry[country] : DEFAULT_STRING_EMPTY_VALUE;
  }

  gotoBillInfo(): any {
    this.isSubmitted = true;
    this.notificationService.setCPI(this.customerPark);
    this.prepareObjectForSave();
    this.checkFormValidity();
    if (this.form.valid) {
      this.notificationService.setBillAccount(this.prepareObjectForSave());
      this.router.navigate(
          [this.customerDashboard, this.customerId, 'detail', 'creation-line', 'bill-info'],
        {
          queryParams: { typeCustomer: this.typeCustomer },    
          queryParamsHandling: 'merge'
        }
        ); 
    }
  }

  checkFormValidity(){
    this.identifierIsValid = this.form.get('identifier').invalid ? false : true;
    this.paymentModeIsValid = this.form.get('paymentMode').invalid ?  false : true;
  }

  createFromCustomerParkItem(customerParkItem: CustomerParkItemVO): PenicheBillAccountLineVO {
    const lineVO: PenicheBillAccountLineVO = {} as PenicheBillAccountLineVO;
    lineVO.lineIdentifier = customerParkItem.webServiceIdentifier;
    lineVO.lineStatus = PenicheState.ACTIF;
    lineVO.lineDateStatus = customerParkItem.dateSubscription === null ?
    this.datePipe.transform(new Date(), this.datePattern) : this.datePipe.transform(new Date(customerParkItem.dateSubscription), this.datePattern);
    lineVO.lineAlias = '';
    return lineVO;
  }

  initCreation(): void {
    if ( this.universe === TelcoUniverse.FIXE) {
      this.penicheBillAccount.identifier = '';
    } else {
      this.penicheBillAccount.identifier = this.customerPark.numClient;
    }
    this.penicheBillAccount.customerIdentifier = this.customerPark.customerIdentifier;
    this.penicheBillAccount.universe = this.customerPark.universe;
    this.penicheBillAccount.status = PenicheState.ACTIF;
    this.penicheBillAccount.billingDay = 1;
    if (this.customerPark.dateSubscription !== null) {
      this.penicheBillAccount.nicheAdmissionDate = this.datePipe.transform(new Date(this.customerPark.dateSubscription), this.datePattern);
    } else {
      this.penicheBillAccount.nicheAdmissionDate = this.datePipe.transform(new Date(), this.datePattern);
    }
    this.penicheBillAccount.recurrent = true;
    this.penicheBillAccount.balance = 0;
      
    this.penicheBillAccount.billAccountLines = [];
    this.penicheBillAccount.billAccountLines.push(this.createFromCustomerParkItem(this.customerPark));
      
    if (this.penicheBillAccount.universe === 'SERVICE') {
      this.penicheBillAccount.bankCode = this.customerPark.codeBanqueFromWebservice;
      this.penicheBillAccount.officeCode = this.customerPark.codeGuichetFromWebservice;
      this.penicheBillAccount.ribKey = this.customerPark.cleRIBFromWebservice;
      this.penicheBillAccount.accountName = this.customerPark.nomTitulaireFromWebservice;
      this.penicheBillAccount.bankAccountNumber = this.customerPark.numCompteFromWebservice;
    }
      
    if (this.customerPark.universe === 'MOBILE') {
      this.penicheBillAccount.paymentMode = this.customerPark.modePaymentFromWebservice;
    }
    if (this.customerPark.dateSubscription) {
      this.penicheBillAccount.creationDate = this.datePipe.transform(this.customerPark.dateSubscription, this.datePattern);
    }

    // tslint:disable-next-line: no-console
    console.log('init required bill', this.penicheBillAccount);
  }

  prepareObjectForSave(): PenicheBillAccountVO {
    this.penicheBillAccount = { ...this.penicheBillAccount, ...this.form.value };
    if (this.penicheBillAccount.terminationDate) {
      this.penicheBillAccount.terminationDate = this.datePipe.transform(this.penicheBillAccount.terminationDate, this.datePattern);
    } else {
      this.penicheBillAccount.terminationDate = null;
    }
    this.penicheBillAccount.billAccountLines = this.getAssociatedLinesModified();
    if (TelcoUniverse.MOBILE === this.universe && this.rowData && this.rowData.length > 0) {
      this.penicheBillAccount.billAccountLines.forEach(line => delete line['initialLineAlias']);
    }
    this.updateInfosBank();
    return this.penicheBillAccount;
  }

  getAssociatedLinesModified(): PenicheBillAccountLineVO[] {
    if (TelcoUniverse.MOBILE === this.universe && this.rowData && this.rowData.length > 0) {
      return this.rowData.filter(line => {
        return this.flagModificationAlias(line) || !isEmpty(line.lineAlias);
      });
    }
    return [];
  }
  
  flagModificationAlias(line: PenicheBillAccountLineVO): boolean {
    if (line.lineAlias && line['initialLineAlias']) {
      return false;
    } 
    if (!line.lineAlias || !line['initialLineAlias']) {
      return true;
    }
    return line.lineAlias !== line['initialLineAlias'];
  }

  updateInfosBank(): void {
    if (this.penicheBillAccount.paymentMode !== PENICHE_PAYMENT_TYPE.PRELEVEMENT_CB && 
      this.penicheBillAccount.paymentMode !== PENICHE_PAYMENT_TYPE.PRELEVEMENT_AMEX) {
      this.penicheBillAccount.cbAmexToken = null;
      this.penicheBillAccount.cbAmexDateFin = null;
    }
      
    if (this.penicheBillAccount.paymentMode !== PENICHE_PAYMENT_TYPE.PRELEVEMENT) {
      // on est dansun mode de paiement different de prelevement : donc les coordonnées ne sont pas saisis
      this.penicheBillAccount.accountName = '';
      this.penicheBillAccount.ribKey = '';
      this.penicheBillAccount.bankAccountNumber = '';
      this.penicheBillAccount.officeCode = '';
      this.penicheBillAccount.bankCode = '';
      this.penicheBillAccount.ibanCode = '';

    } else if (this.responseIbanDetailsResult) {
      // on est dans le mode de paiement prelevement : alors les données d'iban sont recuperes depuis le resultat d'epcb
      if (this.penicheBillAccount.titularTitle === PenicheCivilite.PM) {
          // le titulaire est une entreprise, donc on met la raison sociale du payeur
        this.penicheBillAccount.accountName = this.penicheBillAccount.payerCompany;
      } else {
          // le titulaire est une personne physique donc on met le nom et prenom du payeur
        this.penicheBillAccount.accountName = `${this.penicheBillAccount.payerLastName} ${this.penicheBillAccount.payerFirstName}`;
      }

      if (this.responseIbanDetailsResult.rib) {
        this.penicheBillAccount.ribKey = this.responseIbanDetailsResult.rib.accountKey;
        this.penicheBillAccount.bankAccountNumber = this.responseIbanDetailsResult.rib.accountNumber;
        this.penicheBillAccount.officeCode = this.responseIbanDetailsResult.rib.bankBranchID;
        this.penicheBillAccount.bankCode = this.responseIbanDetailsResult.rib.bankID;
        this.penicheBillAccount.ibanCode = this.responseIbanDetailsResult.rib.codeIban;
      }
    }
  }

  gobackTo(): any {
    if (this.typeCustomer === 'company') {
      this.router.navigate(
       ['/customer-dashboard', this.customerId, 'park-item', 'list-entreprise'],  
        {
          queryParams: { 
            typeCustomer: this.typeCustomer
          },
          queryParamsHandling: 'merge'
        }
          );
    } else {
      this.router.navigate(
        ['/customer-dashboard', this.customerId, 'park-item', 'list-particular'],  
        {
          queryParams: { 
            typeCustomer: this.typeCustomer
          },
          queryParamsHandling: 'merge'
        }
      );
    }
  }

  annuler(): void {
        const title = 'Erreur!';
        const comment = 'Êtes-vous sûr de vouloir annuler votre saisie ?';
        const btnOkText = 'Oui';
    const btnCancelText = 'Non';
        this.confirmationDialogService.confirm(title, comment, btnOkText, btnCancelText, 'lg', true)
         .then((confirmed) => {
       if (confirmed) {
         this.cancel();
       } 
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  } 

  cancel(): any {
    if (!isNullOrUndefined(this.seeAll) || !isNullOrUndefined(this.typeRequest)) {
      if ( this.typeCustomer === 'company') {
        this.router.navigate(
            ['/customer-dashboard', this.customerId, 'park-item', 'list-enterprise'],  
                {
                  queryParams: { 
                    typeCustomer: this.typeCustomer,
                    typeRequest: 'all'
                  },
                  queryParamsHandling: 'merge'
                }
            );
      } else {
        this.router.navigate(
          ['/customer-dashboard', this.customerId, 'park-item', 'list-particular'],  
             {
               queryParams: { 
                 typeCustomer: this.typeCustomer
               },
               queryParamsHandling: 'merge'
             }
         );
        }
    } else {
      this.router.navigate(
              (this.isEntreprise) ? ['/customer-dashboard/entreprise', this.customerId]  
              : ['/customer-dashboard/particular', this.customerId],
             
            {
              queryParams: { 
                typeCustomer: this.typeCustomer
              },
              queryParamsHandling: 'merge'
            }
            );
    }
  }

  itIsAnEntreprise(): boolean {
    return this.route.snapshot.queryParamMap.get('typeCustomer') === 'company';
  }

}
