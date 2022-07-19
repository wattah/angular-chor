import { DebtRecouverementService } from './../../../_core/services/debt-recouverement.service';
import { PersonService } from '../../../_core/services';
import { CustomerTotalsDebt } from './../../../_core/models/customer-totals-debt';
import { BillingDetailsComponent } from './billing-details/billing-details.component';

import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { GoodToKnowResolver } from '../../../_core/resolvers';
import { BillingService } from './../../../_core/services/billing.service';
import { ContactMethodService } from './../../../_core/services/contact-method.service';
import { PenicheBillAccountVO } from './../../../_core/models/peniche-bill-account-vo';
import { PenicheBillAccountLineVO } from './../../../_core/models/peniche-bill-account-line-vo';
import { RequiredInformationComponent } from './required-information/required-information.component';
import { CmUsageVO } from './../../../_core/models/cm-usage-vo';
import { BeneficiaireView } from '../../../_core/models/profil-infos-dashboard';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { PenicheState, PenicheTypeEnvoiLivrable, PenicheCivilite, TelcoUniverse } from './../../../_core/enum/billing-account.enum';
import { CM_USAGE, CM_MEDIA_REF, CONSTANTS, PENICHE_PAYMENT_TYPE } from './../../../_core/constants/constants';
import { isEmpty } from './../../../_core/utils/string-utils';
import { PenicheCountry } from '../../../_core/constants/peniche-country';
const UNIVERS = 'univers';

@Component({
  selector: 'app-creation-modification-bill',
  templateUrl: './creation-modification-bill.component.html',
  styleUrls: ['./creation-modification-bill.component.scss']
})
export class CreationModificationBillComponent implements OnInit {

  @ViewChild(RequiredInformationComponent, { read: RequiredInformationComponent, static: false }) 
  requiredInformationComponent: RequiredInformationComponent;
  @ViewChild(BillingDetailsComponent, { read: BillingDetailsComponent, static: false }) 
  billingDetailsComponent: BillingDetailsComponent;

  penicheBillAccount: PenicheBillAccountVO = {} as PenicheBillAccountVO;
  cmBillingUsageVO: CmUsageVO;
  billAccountIdentifier: string;
  customerId: string;
  nicheIdentifier: string;
  universe: string;
  stateChange = false;

  globalFormConrols: any;
  submittedConrols: any;
  isBDFormValid = true;
  isRIFormValid = true;
  submitted = false;
  recurrentOption = false;
  
  isEditMode: boolean;
  
  infoProfil: BeneficiaireView;
  goodToKnow: GoodToKnowResolver;
  recoveryDate: Date;
  typeCustomer: string;

  billAccountToUpdate: PenicheBillAccountVO;
  totalDebt: CustomerTotalsDebt[];
  nichesWithRemainingGreatThanZero: string[];
  entrepriseRecoveryDate: Date;
  nicheValue: string;
  detteTotalTTC: number;
  detteTotal: number;

  constructor(readonly route: ActivatedRoute, readonly router: Router, readonly location: Location,
    readonly billingService: BillingService, readonly contactMethodService: ContactMethodService,
    readonly fb: FormBuilder, readonly confirmationDialogService: ConfirmationDialogService, readonly datePipe: DatePipe,
    private readonly debtRecouverementService: DebtRecouverementService,
    private readonly personService: PersonService) { }

  ngOnInit() {
    this.isEditMode = this.route.snapshot.data['isEditMode'];
    
    this.route.queryParamMap.subscribe(params => {
      this.typeCustomer = params.get('typeCustomer');
      this.nicheIdentifier = params.get('nicheIdentifier');
      this.universe = params.get(UNIVERS);
    });

    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
      this.billAccountIdentifier = params.get('id');
    });
    
    this.route.data.subscribe(resolversData => {
      this.recoveryDate = resolversData['recoveryDate'];
      this.infoProfil = resolversData['infoProfil'];
      this.goodToKnow = resolversData['goodToKnow'];
      this.totalDebt = resolversData['totalDebt'];
    });

    this.initBillingUsage();

    if (this.isEditMode) {
      this.billingService.getBillAccountByPeniche(this.nicheIdentifier, this.billAccountIdentifier).subscribe(
      data => {
        this.penicheBillAccount = data;
        this.billAccountToUpdate = { ...data };
        console.info('this.penicheBillAccount: Modification', this.penicheBillAccount);
      },
      error => {
        console.error('getBillAccountByPeniche failed: ', error);
        return of(null);
      });
    } else {
      this.initCreation();
    }

  }



  isPenicheBillAccountLoaded(): boolean {
    return Object.entries(this.penicheBillAccount).length > 0;
  }

  initCreation(): void {

    this.penicheBillAccount.customerIdentifier = this.nicheIdentifier;
    this.penicheBillAccount.universe = this.universe;
    this.penicheBillAccount.status = PenicheState.ACTIF;
    this.penicheBillAccount.nicheAdmissionDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.penicheBillAccount.recurrent = true;
    this.penicheBillAccount.balance = 0;

    this.penicheBillAccount.alias = '';
    this.penicheBillAccount.terminationDate = null;
    this.penicheBillAccount.paymentMode = '';
    this.penicheBillAccount.paymentCondition = null;
    this.penicheBillAccount.accountName = '';
    this.penicheBillAccount.bankCode = null;
    this.penicheBillAccount.bankName = '';
    this.penicheBillAccount.officeCode = null;
    this.penicheBillAccount.officeName = '';
    this.penicheBillAccount.bankAccountNumber = '';
    this.penicheBillAccount.ribKey = '';
    this.penicheBillAccount.ibanCode = null;
    this.penicheBillAccount.cbAmexToken = null;
    this.penicheBillAccount.cbAmexDateFin = null;
    this.penicheBillAccount.payerTitle = PenicheCivilite.MME;
    this.penicheBillAccount.payerLastName = '';
    this.penicheBillAccount.payerFirstName = '';
    this.penicheBillAccount.payerCompany = '';
    this.penicheBillAccount.payerAddress4 = '';
    this.penicheBillAccount.payerAddress2 = '';
    this.penicheBillAccount.payerAddress3 = '';
    this.penicheBillAccount.payerZipCode = '';
    this.penicheBillAccount.payerCity = '';
    this.penicheBillAccount.payerCountry = 'FRANCE';
    this.penicheBillAccount.titularTitle = PenicheCivilite.MME;
    this.penicheBillAccount.titularLastName = '';
    this.penicheBillAccount.titularFirstName = '';
    this.penicheBillAccount.titularCompany = '';
    this.penicheBillAccount.titularAddress4 = '';
    this.penicheBillAccount.titularAddress2 = '';
    this.penicheBillAccount.titularAddress3 = '';
    this.penicheBillAccount.titularZipCode = '';
    this.penicheBillAccount.titularCity = '';
    this.penicheBillAccount.titularCountry = 'FRANCE';
    this.penicheBillAccount.billingDay = 1;
      
    this.penicheBillAccount.mailNotification = null;
    this.penicheBillAccount.mailOldNotification = '';
    this.penicheBillAccount.justificationControle = '';
    this.penicheBillAccount.creationDate = '';
    this.penicheBillAccount.typeEnvoi = PenicheTypeEnvoiLivrable.PAPIER_AUTO;
    this.billAccountToUpdate = { ...this.penicheBillAccount };
    console.info('this.penicheBillAccount: creation', this.penicheBillAccount);
  }

  initBillingUsage(): void {
    this.contactMethodService.getUsageByCustomerIdAndRefKeyAndMedia(this.customerId, CM_USAGE.BILLING.key, CM_MEDIA_REF.EMAIL).subscribe(
      data => {
        this.cmBillingUsageVO = data;
      }, error => {
      console.error('getUsageByCustomerIdAndRefKeyAndMedia failed: ', error);
      return of(null);
    }
    );
  }

  changedForm(form: FormGroup): void {
    console.warn('NEW: GlobalFormConrols (FORM): ', this.globalFormConrols);
    console.warn('NEW: this.penicheBillAccount: ', this.penicheBillAccount);
    console.warn('NEW: event.value: ', form);

    this.globalFormConrols = { ...this.globalFormConrols, ...form.controls };
    this.billAccountToUpdate = { ...this.billAccountToUpdate, ...form.value };
    
    console.warn('NEW: updated peniche bill account', this.billAccountToUpdate );
  }

  changedBillngDetailsForm(event: FormGroup): void {
    this.changedForm(event);
    this.isBDFormValid = event.valid;
  }

  changedRequiredInfosForm(event: FormGroup): void {
    this.changedForm(event);
    this.isRIFormValid = event.valid;
  }
  updateState(event: any): void {
    if(event){
    this.stateChange= true;
    }
  }

  changeRecurrentOption(event: any): void {
    if(event){
    this.recurrentOption= true;
    }
  }

  isControlbill(event: any): void {
    if(event){
      this.billAccountToUpdate.justificationControle = null;
    }
  }
  
  isNotValid(formControlName: string): boolean {
    return this.submittedConrols && this.submittedConrols[formControlName] && 
    this.submittedConrols[formControlName].hasError('required');
  }

  isNotAddressValid(formControlName: string, isOras: string): boolean {
    return this.submittedConrols && this.submittedConrols[formControlName] && this.submittedConrols[isOras] && 
    this.submittedConrols[isOras].value && this.submittedConrols[formControlName].value && 
    typeof this.submittedConrols[formControlName].value !== 'object';
  }

  isSirenNotValid(formControlName: string, isTitular: boolean): boolean {
    if (!isTitular && !this.billingDetailsComponent.hasPayerDifferentAddress) {
      return false;
    }
    if (this.submittedConrols && this.submittedConrols[formControlName].value && 
      PenicheCountry.FRANCE.data === this.submittedConrols[isTitular ? 'titularCountry' : 'payerCountry'].value) {
      return !/^\d+$/.test(this.submittedConrols[formControlName].value) || 
      this.submittedConrols[formControlName].value.length < 9 || 
      this.submittedConrols[formControlName].value.length > 13;
    }
    return false;
  }

  save(): void {
    this.submitted = true;
    this.submittedConrols = { ...this.globalFormConrols };
    if (this.billingDetailsComponent.billingDetailsForm.valid !== this.isBDFormValid) {
      this.isBDFormValid = this.billingDetailsComponent.billingDetailsForm.valid;
    }
    if (this.isGlobalFormValid()) {
      console.warn('NEW-SAVE: this.billAccountToUpdate: ', this.billAccountToUpdate);
      this.submitted = false;
      this.getPenicheCustomer();
    }
  }

  isGlobalFormValid(): boolean {
    return this.isRIFormValid && this.isBDFormValid && !this.isNotAddressValid('titularAddressFrench', 'isOrasTitularAddress') && 
    !this.isNotAddressValid('payerAddressFrench', 'isOrasPayerAddress') && 
    !this.isSirenNotValid('titularSiren', true) && !this.isSirenNotValid('payerSiren', false);
  }

  getPenicheCustomer(): void {
    this.billingService.getBillCRDetailsByPeniche('PAR', this.nicheIdentifier).subscribe(
      (data) => {
        if (data) {
          this.updateAndCallPopUpToSaveBillAccount();
        } else {
          this.openPenicheCustomerNotFoundDialog();
        }
      }, 
      (error) => {
        console.error('getBillCRDetailsByPeniche KO: ', error);
      });
  }

  popUptoSaveBillAccount( comment : string, btnOkText: string, btnCancelText: string){
    this.confirmationDialogService.confirm('', comment, btnOkText, btnCancelText, 'sm')
        .then(
          (confirmed) => {
            if (confirmed) {
      this.saveBillAccout()
      
            }
          }     
        );
  }

  updateAndCallPopUpToSaveBillAccount(): void {
    this.updatePenicheBillAccountFromView();
    const CONFIRMATION_COMMENT = 'Êtes-vous sûr(e) de vouloir désactiver le compte de facturation? Suite à votre modification, le compte de facturation n\'aura plus de factures attendues.<br/> Pour information : Si le compte de facturation est associé à des lignes actives, la désactivation ne sera pas prise en compte"';
    const BOUTON_OK_TEXT = 'Je confirme la désactivation';
    const BOUTON_CANCEL_TEXT = 'Annuler';
    const BOUTON_OK_FOR_MODIFICATION ='Je confirme la modification';
    const MESSAGE = 'Êtes-vous sûr(e) de vouloir rendre le compte de facturation non récurrent? Suite à votre modification, le compte de facturation n\'aura plus de factures attendues';
    if(this.billAccountToUpdate.status===PenicheState.INACTIF && this.universe===TelcoUniverse.MOBILE && this.stateChange === true  ){
    this.popUptoSaveBillAccount(CONFIRMATION_COMMENT,BOUTON_OK_TEXT,BOUTON_CANCEL_TEXT);
    }
    if(this.billAccountToUpdate.recurrent===false && this.universe === TelcoUniverse.SERVICE && this.recurrentOption === true) {
      this.popUptoSaveBillAccount( MESSAGE, BOUTON_OK_FOR_MODIFICATION, BOUTON_CANCEL_TEXT);
    }
    if((this.billAccountToUpdate.status===PenicheState.ACTIF && this.billAccountToUpdate.recurrent===true) || (this.stateChange === false && this.universe !== TelcoUniverse.SERVICE) || (this.universe === TelcoUniverse.SERVICE && this.recurrentOption === false )){
      this.saveBillAccout();
    }
  }

  saveBillAccout(): void {
    this.billingService.saveBillAccount(this.billAccountToUpdate).subscribe(billAccount => {
      console.info('billAccount Saved: ', billAccount);
      if (billAccount && PenicheTypeEnvoiLivrable.MAIL === this.billAccountToUpdate.typeEnvoi && 
        this.billAccountToUpdate.idMailNotification > 0) {
        this.contactMethodService.useCmInPeniche(this.billAccountToUpdate.idMailNotification).subscribe(isOK => {
          console.info('isOK = ', isOK);
        }, error => {
          console.error('useCmInPeniche KO: ', error);
        });
      }
      this.redirectToHistoryFinance();
    }, error => {
      this.saveBillAccountFailedDialog();
      console.error('saveBillAccount KO: ', error);
    });
  }

  saveBillAccountFailedDialog(): any {
    const title = 'Erreur';
    const message = `Erreur lors du traitement des données reçues par Péniche.
    Merci de transmettre une signalisation au Run Parnasse.`;
    const btnOkText = 'OK';
    this.confirmationDialogService.confirm(title, message, btnOkText, null, 'lg', false)
    .then((confirmed) => {
      console.info('Utilisateur à confirmé: ', confirmed);
    })
    .catch(() => console.log('User dismissed )'));
  }

  updatePenicheBillAccountFromView(): void {
    this.billAccountToUpdate['isOrasTitularAddress'] = ('object' === typeof this.billAccountToUpdate['titularAddressFrench']);
    this.billAccountToUpdate['isPayerTitularAddress'] = ('object' === typeof this.billAccountToUpdate['payerAddressFrench']);
    this.buildTitularAddress();
    this.buildPayerAddress();
    if (this.billAccountToUpdate.terminationDate) {
      this.billAccountToUpdate.terminationDate = this.datePipe.transform(this.billAccountToUpdate.terminationDate, 'yyyy-MM-dd');
    } else {
      this.billAccountToUpdate.terminationDate = null;
    }
    this.billAccountToUpdate.billAccountLines = this.getAssociatedLinesModified();
    if (this.isEditMode && TelcoUniverse.MOBILE === this.universe && 
      this.requiredInformationComponent.rowData && this.requiredInformationComponent.rowData.length > 0) {
      this.billAccountToUpdate.billAccountLines.forEach(line => delete line['initialLineAlias']);
    }
    this.updateInfosBank();
  }

  buildTitularAddress(): void {
    this.billAccountToUpdate.titularAddress5 = '';
    if (this.billAccountToUpdate['isOrasTitularAddress'] && this.billAccountToUpdate['titularAddressFrench']) {
      this.billAccountToUpdate.titularOrasId = this.billAccountToUpdate['titularAddressFrench'].orasId;
      this.billAccountToUpdate.titularAddress4 = this.buildTitularLine4();
      this.billAccountToUpdate.titularZipCode = this.billAccountToUpdate['titularAddressFrench'].postalCode;
      this.billAccountToUpdate.titularCity = this.billAccountToUpdate['titularAddressFrench'].cityName;
      this.billAccountToUpdate.titularStreetExtension = this.billAccountToUpdate['titularAddressFrench'].streetExtension;
      this.billAccountToUpdate.titularStreetName = this.billAccountToUpdate['titularAddressFrench'].streetName;
      this.billAccountToUpdate.titularStreetType = this.billAccountToUpdate['titularAddressFrench'].streetType;
      this.billAccountToUpdate.titularStreetNumber = Number(this.billAccountToUpdate['titularAddressFrench'].streetNumber);	
      this.billAccountToUpdate.titularGeocodeX = Number(this.billAccountToUpdate['titularAddressFrench'].geoCodeX);
      this.billAccountToUpdate.titularGeocodeY = Number(this.billAccountToUpdate['titularAddressFrench'].geoCodeY);
      this.billAccountToUpdate.titularOrasId = Number(this.billAccountToUpdate['titularAddressFrench'].orasId);
            
      this.billAccountToUpdate.titularInseeId = this.billAccountToUpdate['titularAddressFrench'].cityInseeId;
      this.billAccountToUpdate.titularRivoliId = this.billAccountToUpdate['titularAddressFrench'].rivoliCode;
      this.billAccountToUpdate.titularCedex = this.billAccountToUpdate['titularAddressFrench'].cedex;
      if (!isEmpty(this.billAccountToUpdate['titularAddressFrench'].line5)) {
        this.billAccountToUpdate.titularAddress5 = this.billAccountToUpdate['titularAddressFrench'].line5;	
      }
      if (isEmpty(this.billAccountToUpdate['titularAddressFrench'].line6)) {
        this.billAccountToUpdate.titularAddress6 = this.billAccountToUpdate['titularAddressFrench'].line6;	
      } else {
        this.billAccountToUpdate.titularAddress6 = 
        `${this.billAccountToUpdate['titularAddressFrench'].postalCode} ${this.billAccountToUpdate['titularAddressFrench'].cityName}`;
        if (this.billAccountToUpdate['titularAddressFrench'].cedex) {
          this.billAccountToUpdate.titularAddress6 += ' ' + this.billAccountToUpdate['titularAddressFrench'].cedex;
        }
      }
    } else {
      this.billAccountToUpdate.titularOrasId = null;
      this.billAccountToUpdate.titularAddress6 = `${this.billAccountToUpdate.titularZipCode} ${this.billAccountToUpdate.titularCity}`;
    }
  }

  buildPayerAddress(): void {
    this.billAccountToUpdate.payerAddress5 = '';
    if (this.billAccountToUpdate['isOrasPayerAddress'] && this.billAccountToUpdate['payerAddressFrench']) {
      this.billAccountToUpdate.payerOrasId = this.billAccountToUpdate['payerAddressFrench'].orasId;
      this.billAccountToUpdate.payerAddress4 = this.buildPayerLine4();
      this.billAccountToUpdate.payerZipCode = this.billAccountToUpdate['payerAddressFrench'].postalCode;
      this.billAccountToUpdate.payerCity = this.billAccountToUpdate['payerAddressFrench'].cityName;
      this.billAccountToUpdate.payerStreetExtension = this.billAccountToUpdate['payerAddressFrench'].streetExtension;
      this.billAccountToUpdate.payerStreetName = this.billAccountToUpdate['payerAddressFrench'].streetName;
      this.billAccountToUpdate.payerStreetType = this.billAccountToUpdate['payerAddressFrench'].streetType;
      this.billAccountToUpdate.payerStreetNumber = Number(this.billAccountToUpdate['payerAddressFrench'].streetNumber);	
      this.billAccountToUpdate.payerGeocodeX = Number(this.billAccountToUpdate['payerAddressFrench'].geoCodeX);
      this.billAccountToUpdate.payerGeocodeY = Number(this.billAccountToUpdate['payerAddressFrench'].geoCodeY);
      this.billAccountToUpdate.payerOrasId = Number(this.billAccountToUpdate['payerAddressFrench'].orasId);
            
      this.billAccountToUpdate.payerInseeId = this.billAccountToUpdate['payerAddressFrench'].cityInseeId;
      this.billAccountToUpdate.payerRivoliId = this.billAccountToUpdate['payerAddressFrench'].rivoliCode;
      this.billAccountToUpdate.payerCedex = this.billAccountToUpdate['payerAddressFrench'].cedex;
      if (!isEmpty(this.billAccountToUpdate['payerAddressFrench'].line5)) {
        this.billAccountToUpdate.payerAddress5 = this.billAccountToUpdate['payerAddressFrench'].line5;	
      }
      if (isEmpty(this.billAccountToUpdate['payerAddressFrench'].line6)) {
        this.billAccountToUpdate.payerAddress6 = this.billAccountToUpdate['payerAddressFrench'].line6;	
      } else {
        this.billAccountToUpdate.payerAddress6 = 
        `${this.billAccountToUpdate['payerAddressFrench'].postalCode} ${this.billAccountToUpdate['payerAddressFrench'].cityName}`;
        if (this.billAccountToUpdate['payerAddressFrench'].cedex) {
          this.billAccountToUpdate.payerAddress6 += ' ' + this.billAccountToUpdate['payerAddressFrench'].cedex;
        }
      }
    } else {
      this.billAccountToUpdate.payerOrasId = null;
      this.billAccountToUpdate.payerAddress6 = `${this.billAccountToUpdate.payerZipCode} ${this.billAccountToUpdate.titularCity}`;
    }
  }

  buildTitularLine4(): string {
    if (isEmpty(this.billAccountToUpdate['titularAddressFrench'].line4)) {
      let line4 = '';
      if (this.billAccountToUpdate['titularAddressFrench'].streetExtension && 
      'Autre' !== this.billAccountToUpdate['titularAddressFrench'].streetExtension) {
        line4 += this.billAccountToUpdate['titularAddressFrench'].streetExtension;
      }
      if (!isEmpty(this.billAccountToUpdate['titularAddressFrench'].streetExtension)) {
        line4 += ' ' + this.billAccountToUpdate['titularAddressFrench'].streetExtension;
      }

      if (!isEmpty(this.billAccountToUpdate['titularAddressFrench'].streetName)) {
        line4 += ' ' + this.billAccountToUpdate['titularAddressFrench'].streetName;
      }
      return line4;
    }
    return this.billAccountToUpdate['titularAddressFrench'].line4;
  }

  buildPayerLine4(): string {
    if (isEmpty(this.billAccountToUpdate['payerAddressFrench'].line4)) {
      let line4 = '';
      if (this.billAccountToUpdate['payerAddressFrench'].streetExtension && 
      'Autre' !== this.billAccountToUpdate['payerAddressFrench'].streetExtension) {
        line4 += this.billAccountToUpdate['payerAddressFrench'].streetExtension;
      }
      if (!isEmpty(this.billAccountToUpdate['payerAddressFrench'].streetExtension)) {
        line4 += ' ' + this.billAccountToUpdate['payerAddressFrench'].streetExtension;
      }

      if (!isEmpty(this.billAccountToUpdate['payerAddressFrench'].streetName)) {
        line4 += ' ' + this.billAccountToUpdate['payerAddressFrench'].streetName;
      }
      return line4;
    }
    return this.billAccountToUpdate['payerAddressFrench'].line4;
  }

  getAssociatedLinesModified(): PenicheBillAccountLineVO[] {
    if (this.isEditMode && TelcoUniverse.MOBILE === this.universe && 
      this.requiredInformationComponent.rowData && this.requiredInformationComponent.rowData.length > 0) {
      return this.requiredInformationComponent.rowData.filter(line => {
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
    if (this.billAccountToUpdate.paymentMode !== PENICHE_PAYMENT_TYPE.PRELEVEMENT_CB && 
      this.billAccountToUpdate.paymentMode !== PENICHE_PAYMENT_TYPE.PRELEVEMENT_AMEX) {
      this.billAccountToUpdate.cbAmexToken = null;
      this.billAccountToUpdate.cbAmexDateFin = null;
    }
      
    if (this.billAccountToUpdate.paymentMode !== PENICHE_PAYMENT_TYPE.PRELEVEMENT) {
      // on est dansun mode de paiement different de prelevement : donc les coordonnées ne sont pas saisis
      this.billAccountToUpdate.accountName = '';
      this.billAccountToUpdate.ribKey = '';
      this.billAccountToUpdate.bankAccountNumber = '';
      this.billAccountToUpdate.officeCode = '';
      this.billAccountToUpdate.bankCode = '';
      this.billAccountToUpdate.ibanCode = '';

      if (this.requiredInformationComponent.responseCardInfoResult) {
        this.billAccountToUpdate.cbAmexToken = this.requiredInformationComponent.responseCardInfoResult.token;
        const cbAmexDateFin = this.requiredInformationComponent.responseCardInfoResult.endDate;
        this.billAccountToUpdate.cbAmexDateFin = this.datePipe.transform(cbAmexDateFin, 'yyyy-MM-dd');
      }
    } else if (this.requiredInformationComponent.responseIbanDetailsResult) {
      // on est dans le mode de paiement prelevement : alors les données d'iban sont recuperes depuis le resultat d'epcb
      if (this.billAccountToUpdate.titularTitle === PenicheCivilite.PM) {
          // le titulaire est une entreprise, donc on met la raison sociale du payeur
        this.billAccountToUpdate.accountName = this.billAccountToUpdate.payerCompany;
      } else {
          // le titulaire est une personne physique donc on met le nom et prenom du payeur
        this.billAccountToUpdate.accountName = `${this.billAccountToUpdate.payerLastName} ${this.billAccountToUpdate.payerFirstName}`;
      }

      if (this.requiredInformationComponent.responseIbanDetailsResult.rib) {
        this.billAccountToUpdate.ribKey = this.requiredInformationComponent.responseIbanDetailsResult.rib.accountKey;
        this.billAccountToUpdate.bankAccountNumber = this.requiredInformationComponent.responseIbanDetailsResult.rib.accountNumber;
        this.billAccountToUpdate.officeCode = this.requiredInformationComponent.responseIbanDetailsResult.rib.bankBranchID;
        this.billAccountToUpdate.bankCode = this.requiredInformationComponent.responseIbanDetailsResult.rib.bankID;
        this.billAccountToUpdate.ibanCode = this.requiredInformationComponent.responseIbanDetailsResult.rib.codeIban;
      }
    }
  }

  openPenicheCustomerNotFoundDialog(): any {
    const title = 'Erreur';
    const message = `Attention! Le client péniche n'existe pas, veuillez d'abord le créer avant la création d'un compte de facturation.`;
    const btnOkText = 'OK';
    this.confirmationDialogService.confirm(title, message, btnOkText, null, 'lg', false)
    .then((confirmed) => {
      this.router.navigate(
        ['/customer-dashboard', this.customerId, 'detail', 'profile-contract', 'creation', 
          CONSTANTS.TYPE_COMPANY === this.typeCustomer ? 4 : 5 ],
        {
          queryParamsHandling: 'merge' 
        }
      );
    })
    .catch(() => console.error('User dismissed )'));
  }

  onCancel(): void {
    const title = 'Erreur!';
    const comment = 'Êtes-vous sûr de vouloir annuler votre saisie ?';
    const btnOkText = 'Oui';
    const btnCancelText = 'Non';
    this.confirmationDialogService.confirm(title, comment, btnOkText, btnCancelText, 'lg', true)
    .then((confirmed) => {
      console.info('User confirmed:', confirmed);
      if (confirmed) {
       this.redirectToHistoryFinance();
      }
    })
    .catch(() => console.error('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
     
  }

  redirectToHistoryFinance() : void {
    this.router.navigate(
      ['/customer-dashboard', this.customerId, 'financial-detail', 'history'],
      {
        queryParamsHandling: 'merge'
      });
   }

}
