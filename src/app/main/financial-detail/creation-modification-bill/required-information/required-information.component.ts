import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

import { CSS_CLASS_NAME, DEFAULT_STRING_EMPTY_VALUE,
   PRELEVEMENT_PENICHE_TYPES, PENICHE_PAYMENT_TYPE } from '../../../../_core/constants/constants';
import { PenicheState } from '../../../../_core/enum/peniche-state.enum';
import { PenichePaymentCondition, TelcoUniverse, PenicheCivilite } from '../../../../_core/enum/billing-account.enum';
import { PenicheBillAccountVO } from '../../../../_core/models/peniche-bill-account-vo';
import { CustomerService, GassiMockLoginService, ParcLigneService } from '../../../../_core/services';
import { CustomerProfileVO } from '../../../../_core/models/customer-profile-vo';
import { InvoiceService } from '../../../../_core/services/invoice.service';
import { InfoContextVO } from '../../../../_core/models/info-context-vo';
import { InfoBodySendRIBVO } from '../../../../_core/models/info-body-send-rib-vo';
import { InfoCustomerVO } from '../../../../_core/models/info-customer-vo';
import { PersonVO } from '../../../../_core/models/person-vo';
import { PenicheBillAccountLineVO } from '../../../../_core/models/peniche-bill-account-line-vo';
import { CustomerParkItemVO } from '../../../../_core/models/customer-park-item-vo';
import { ApplicationUserVO } from '../../../../_core/models/application-user';
import { PayementVO } from '../../../../_core/models/payement';
import { ResponseIbanDetailsVO } from './../../../../_core/models/response-iban-details-vo';
import { TransactionResponseVO } from './../../../../_core/models/transaction-response-vo';
import { getDecryptedValue } from '../../../../_core/utils/functions-utils';
import { isEmpty, isNullOrUndefined } from './../../../../_core/utils/string-utils';

@Component({
  selector: 'app-required-information',
  templateUrl: './required-information.component.html',
  styleUrls: ['./required-information.component.scss']
})
export class RequiredInformationComponent implements OnInit, OnChanges {
  customerId: any;
  customerFull: CustomerProfileVO = {} as CustomerProfileVO;
  universe: string;

  @Input() isEditMode: boolean;
  @Input() penicheBillAccount: PenicheBillAccountVO = {} as PenicheBillAccountVO;
  @Output() hasChanged = new EventEmitter<boolean>();
  @Output() isControlbill = new EventEmitter<boolean>();
  @Input() submitted: boolean;

  @Output() updateRequiredInfo = new EventEmitter<boolean>(null);
  @Output() updateState = new EventEmitter<boolean>(null);
  @Output() changedRequiredInfosForm = new EventEmitter<FormGroup>();
  @Output() changeRecurrentOption = new EventEmitter<boolean>(null);
  infoContext: InfoContextVO = {} as InfoContextVO;
  infoCustomer: InfoCustomerVO = {} as InfoCustomerVO;
  infoSendIbanRib: InfoBodySendRIBVO = {} as InfoBodySendRIBVO;
  connectedUser: ApplicationUserVO = {} as ApplicationUserVO;
  payment: PayementVO = {} as PayementVO;
  paymentRefNumber = null;
  responseCardInfoResult: TransactionResponseVO;
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
  test = false;
  
  listNumLines: Array<string> = [];
  listCpi: CustomerParkItemVO[] = [];
  finalList: any = [];
  form: FormGroup;

  TelcoUniverse: typeof TelcoUniverse = TelcoUniverse;

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

  CHEQUE_PAYMENT_TYPE = { key: PENICHE_PAYMENT_TYPE.CHEQUE, data: this.prelevementFormatter('CHEQUE') };
  PRELEVEMENT_CB_PAYMENT_TYPE = { key: PENICHE_PAYMENT_TYPE.PRELEVEMENT_CB, data: this.prelevementFormatter('CBREC') };
  isUpdatePenicheListTypes : boolean = true;

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
    readonly parkItemService: ParcLigneService, readonly gassiService: GassiMockLoginService) { }
  
  ngOnInit() {

    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
    });
    this.customerService.getCustomerProfile(this.customerId).subscribe(response => {
      this.customerFull = response;
      console.log('customer', this.customerFull); 
    });

    this.route.queryParamMap.subscribe( params => {
      this.universe = params.get('univers');
    });

    this.gassiService.getCurrentConnectedUser().pipe(take(1)).subscribe((user) => {
      // tslint:disable-next-line: no-console
      console.log('myuser = ', user);
      this.connectedUser = user;
    });

    
    // onChang.....
  }

  ngOnChanges(change: SimpleChanges) {
    if (change['penicheBillAccount'] && this.penicheBillAccount) {  
      this.form = this.buildFrom();
      if (this.penicheBillAccount.billAccountLines) {
        this.getLineOffers(this.penicheBillAccount); 
      }
      this.initValues(this.penicheBillAccount);
      if (this.penicheBillAccount.identifier) {
        this.invoiceService.getIbanFromAsMetiers(this.penicheBillAccount.identifier).subscribe((repon) => {
          this.showIbanSentence = true;
          const accountSize = repon.length;
          this.paymentModeAccount = PENICHE_PAYMENT_TYPE.INFO_BANK_SEPA_PRELEVMENT + 
          repon.substring(accountSize - 4);

        });
      }
      this.changedRequiredInfosForm.emit(this.form);
      this.onChangeForm();
    }
  }

  onChangeForm(): void {
    if (this.form) {
      this.form.valueChanges.subscribe( () => {
        this.changedRequiredInfosForm.emit(this.form);
      });
    }
  }

  getLineOffers(penicheBill: PenicheBillAccountVO): void { 
    for ( const item of penicheBill.billAccountLines) {
      this.listNumLines.push(item.lineIdentifier);
    } 
    this.parkItemService.getBillAccountLineOffers(this.listNumLines).subscribe((reponse) => {
      this.listCpi = reponse;     
    },
    // tslint:disable-next-line: no-console
    (error) => { console.log('error', error); },
    () => {
      for ( const l of this.listCpi) {
        for ( const line of penicheBill.billAccountLines) { 
          if (l.webServiceIdentifier === line.lineIdentifier) {
            line.offer = l.libelleContract;
          }
        }
      }
      for ( const ligne of penicheBill.billAccountLines) {
        if ( ligne.lineStatus === PenicheState.ACTIF) {
          ligne['initialLineAlias'] = ligne.lineAlias;
          this.finalList.push(ligne);
        }
      }
      this.rowData = this.finalList;
    });
    
  }

  buildFrom(): any {
    return this._formBuilder.group({
      status: this._formBuilder.control(null),
      terminationDate: this._formBuilder.control(null),
      recurrent: this._formBuilder.control(null),
      paymentCondition: this._formBuilder.control(null, 
        TelcoUniverse.SERVICE === this.penicheBillAccount.universe ? Validators.required : null),
      controlCF: this._formBuilder.control(null),
      justificationControle: this._formBuilder.control({ value: null}),
      compteRenduAttendu: this._formBuilder.control(null),
      billingDay: this._formBuilder.control(null),
      paymentMode: this._formBuilder.control(null, Validators.required)
    });
  }

  get f(): any { return this.form.controls; }

  isNotValid(formControlName: string): boolean {
    return this.submitted && this.form.get(formControlName) && 
    this.form.get(formControlName).hasError('required');
  }

  initValues(penicheBillAccount: PenicheBillAccountVO): void {
    if(penicheBillAccount.controlCF===true){
      this.test=true;
    }else{
      this.test=false;
    }

    this.form.get('status').setValue(penicheBillAccount.status);
    this.route.queryParamMap.subscribe( params => {
    this.universe = params.get('univers');
    if (this.isEditMode && this.universe !== 'MOBILE' ) {
      this.form.get('status').disable();
    }
  });

    this.form.get('terminationDate').setValue(penicheBillAccount.terminationDate);
    
    this.form.get('recurrent').setValue(penicheBillAccount.recurrent);
    if (penicheBillAccount.status === PenicheState.INACTIF) {  
      this.showResiliationDate = true;
      this.form.get('terminationDate').setValue(new Date());
    }

    this.form.get('paymentCondition').setValue(penicheBillAccount.paymentCondition);
    
    this.form.get('controlCF').setValue(penicheBillAccount.controlCF);
    this.form.get('justificationControle').setValue(penicheBillAccount.justificationControle);
    this.form.get('compteRenduAttendu').setValue(penicheBillAccount.compteRenduAttendu);
    console.info(this.form.get('justificationControle').value, ' ---- ', penicheBillAccount.justificationControle);
    if (this.form.get('justificationControle').value) {
     this.form.get('justificationControle').enable();
    }
    this.form.get('billingDay').setValue(penicheBillAccount.billingDay);

    this.form.get('paymentMode').setValue(!isEmpty(penicheBillAccount.paymentMode) ? penicheBillAccount.paymentMode : '');
    if (penicheBillAccount.paymentMode === PENICHE_PAYMENT_TYPE.PRELEVEMENT && this.penicheBillAccount.universe && 
      TelcoUniverse.SERVICE === this.penicheBillAccount.universe) { 
      this.showIbanButton = true;
      if (this.penicheBillAccount.bankAccountNumber && this.penicheBillAccount.bankAccountNumber !== '') {
        this.showIbanSentence = true;
        const numCompteSize = this.penicheBillAccount.bankAccountNumber.length;
        this.paymentModeAccount = PENICHE_PAYMENT_TYPE.INFO_BANK_SEPA_PRELEVMENT + 
      this.penicheBillAccount.bankAccountNumber.substring(numCompteSize - 4);
      } else {
        this.showIbanSentence = false;
      }
    }

    if(this.isEditMode){
      if(penicheBillAccount.paymentMode != PENICHE_PAYMENT_TYPE.CHEQUE){
        this.removePenicheTypes(PENICHE_PAYMENT_TYPE.CHEQUE);
      }
      
      if(penicheBillAccount.paymentMode != PENICHE_PAYMENT_TYPE.PRELEVEMENT_CB) {
        this.removePenicheTypes(PENICHE_PAYMENT_TYPE.PRELEVEMENT_CB);
      }
    }else{
      this.removePenicheTypes(PENICHE_PAYMENT_TYPE.CHEQUE);
      this.removePenicheTypes(PENICHE_PAYMENT_TYPE.PRELEVEMENT_CB);
    }
  }

  onChangeState(): any {
    this.OnUpdateState();
    if ( this.form.get('status').value === PenicheState.INACTIF ) {
      this.showResiliationDate = true;
      this.form.get('terminationDate').setValue(new Date());
    } else {
      this.showResiliationDate = false;
    }
  }

  onChangeRecurrentOption() : void{
    this.changeRecurrentOption.emit(true);
  }

  onTypeSelect(): any {
    if ( this.form.get('paymentMode').value === PENICHE_PAYMENT_TYPE.PRELEVEMENT ) {
      this.showIbanButton = true; 
      this.sendCard = false;
      this.getCard = false;  
      this.getIbanButton = false;
      if ( !isNullOrUndefined(this.paymentModeAccount)) {
        this.showIbanSentence = true;
      }
    } else if (this.form.get('paymentMode').value === PENICHE_PAYMENT_TYPE.PRELEVEMENT_AMEX || 
    this.form.get('paymentMode').value === PENICHE_PAYMENT_TYPE.PRELEVEMENT_CB ) {
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

  onCardSelect(): any {
    this.payment.transactionAmount = 1;
    this.payment.transactionType = this.form.get('paymentMode').value;
    this.payment.customerId = getDecryptedValue(this.customerId);
    this.payment.refBillAcount = this.penicheBillAccount.identifier;
    this.payment.universeLabel = this.universe;
    // tslint:disable-next-line: no-unused-expression
    this.invoiceService.getUrlPayment(this.connectedUser.coachId, this.payment).subscribe((responses) => {
      // tslint:disable-next-line: no-console
      console.log('send info cart', responses);
      window.open(responses.url);
      this.paymentRefNumber = responses.paymentRefNumber;
    });
    this.getCard = true;
  }

  onClickResponseCardInfo(): any {
    const transactionType = this.form.get('paymentMode').value;
    const transactionAmount = 100;
    const custId = getDecryptedValue(this.customerId);
    const numClient = this.penicheBillAccount.identifier.slice(2, this.penicheBillAccount.identifier.length);
    this.invoiceService.getToken(transactionType, numClient, custId, transactionAmount, this.paymentRefNumber).subscribe((d) => {
      console.log('get info carte', d);
      this.responseCardInfoResult = d;
      const accountSize = d.token !== null ? d.token.length : 0;
      const message = PENICHE_PAYMENT_TYPE.PRELEVEMENT_AMEX === this.form.get('paymentMode').value ? 
      'Prélèvement sur l\'AMEX terminant par *******' : 'Prélèvement sur la carte terminant par *******';
      this.cardNumberToShow = message + (d.token !== null ? d.token.substring(accountSize - 4, accountSize) : '');
      this.showCardSentence = true;
    });
  }

  enableTextArea(event: any): void {
    if (event.checked) {
      this.test = true;
      this.isControlbill.emit(false)
    } else {
      this.test = false;
      this.isControlbill.emit(true)
    }
  }

  onSendIbanClick(): any {
    const CALLER_ATN = 'ATN';
    this.getIbanButton = true;
    this.infoContext.callerId = CALLER_ATN;
    this.infoContext.callerUseCase = 'Saisie IBAN ATHENA';
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
    if (title !== null && title === PenicheCivilite.MR) {
      result = 'Monsieur';
    } else if (title !== null && title === PenicheCivilite.MME) {
      result = 'Madame';
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
        this.showIbanSentence = true;
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

  onUpdateRequiredInfo(): void {
    this.updateRequiredInfo.emit(false);
  }

  OnUpdateState() : void{
    this.updateState.emit(true)
  }

  clickPenicheListTypes(){
    if(this.form.get('paymentMode').value === PENICHE_PAYMENT_TYPE.CHEQUE || 
      this.form.get('paymentMode').value === PENICHE_PAYMENT_TYPE.PRELEVEMENT_CB){
        if(this.isUpdatePenicheListTypes){
          if(this.form.get('paymentMode').value === PENICHE_PAYMENT_TYPE.CHEQUE){
            this.removePenicheTypes(PENICHE_PAYMENT_TYPE.CHEQUE);
          }else{
            this.removePenicheTypes(PENICHE_PAYMENT_TYPE.PRELEVEMENT_CB);
          }
        }else{
          if(this.form.get('paymentMode').value === PENICHE_PAYMENT_TYPE.CHEQUE){
            this.PenichPaymentType.push(this.CHEQUE_PAYMENT_TYPE);
          }else{
            this.PenichPaymentType.push(this.PRELEVEMENT_CB_PAYMENT_TYPE);
          }
        }
        this.isUpdatePenicheListTypes = !this.isUpdatePenicheListTypes;
    }
  }

  removePenicheTypes(key){
    let index = this.PenichPaymentType.findIndex(t => t.key === key);
    if(index != -1){
      this.PenichPaymentType.splice(index, 1);
    }
  }


  blurPenicheListTypes(){
    if((this.form.get('paymentMode').value == PENICHE_PAYMENT_TYPE.CHEQUE || 
      this.form.get('paymentMode').value === PENICHE_PAYMENT_TYPE.PRELEVEMENT_CB) && !this.isUpdatePenicheListTypes){
        if(this.form.get('paymentMode').value === PENICHE_PAYMENT_TYPE.CHEQUE){
          this.PenichPaymentType.push(this.CHEQUE_PAYMENT_TYPE);
        }else{
          this.PenichPaymentType.push(this.PRELEVEMENT_CB_PAYMENT_TYPE);
        }
        this.isUpdatePenicheListTypes = !this.isUpdatePenicheListTypes;
    }
  }


}
