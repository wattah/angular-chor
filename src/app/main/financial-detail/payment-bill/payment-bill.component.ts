import { PersonService } from './../../../_core/services';
import { DebtRecouverementService } from './../../../_core/services/debt-recouverement.service';
import { CustomerTotalsDebt } from './../../../_core/models/customer-totals-debt';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PayementVO } from '../../../_core/models/payement';
import { COLOR_TYPE_CUSTOMER, CONSTANTS } from '../../../_core/constants/constants';
import { ReferenceDataVO } from '../../../_core/models';
import { BeneficiaireView } from '../../../_core/models/profil-infos-dashboard';
import { ComponentCanDeactivate } from '../../../_core/guards/component-can-deactivate';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { BillingService } from '../../../_core/services/billing.service';
import { GassiMockLoginService } from '../../../_core/services';
import { getDecryptedValue } from '../../../_core/utils/functions-utils';
import { GoodToKnowResolver } from '../../../_core/resolvers';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-payment-bill',
  templateUrl: './payment-bill.component.html',
  styleUrls: ['./payment-bill.component.scss']
})
export class PaymentBillComponent extends ComponentCanDeactivate implements OnInit {

  infoProfil: BeneficiaireView;
  goodToKnow: GoodToKnowResolver;

  form: FormGroup;
  submitted: boolean;
  
  customerId: string;
  recoveryDate: Date;
  infoCustomer: BeneficiaireView;
  isEntreprise: boolean;
  isParticular: boolean;
  typeCustomer: string;

  rowsdynamicStyle: string;

  mediaData: ReferenceDataVO[];

  numFacture: string;

  stepPayment = 'Payer'; // Valider le paiement

  readonly constants = CONSTANTS;

  /************** Form *************/
  payment: Partial<PayementVO> = {
    transactionAmount: null,
    mediaRefId: null,
    transactionType: 'CB',
    comment: '',
    universeLabel: 'SERVICE'
  };

  loading = false;
  totalDebt: CustomerTotalsDebt[];
  nichesWithRemainingGreatThanZero: string[];
  entrepriseRecoveryDate: Date;
  nicheValue: string;
  detteTotalTTC: number;
  detteTotal: number;
  constructor( private readonly fb: FormBuilder, private readonly route: ActivatedRoute,
    private readonly billingService: BillingService, private readonly gassiMockLoginService: GassiMockLoginService, 
    private readonly router: Router, private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly debtRecouverementService: DebtRecouverementService,
    private readonly personService: PersonService) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
    });
    this.typeCustomer = this.route.snapshot.queryParamMap.get('typeCustomer');
    this.route.data.subscribe(resolversData => {
      this.recoveryDate = resolversData['recoveryDate'];
      this.infoProfil = resolversData['infoProfil'];
      this.goodToKnow = resolversData['goodToKnow'];
      this.totalDebt = resolversData['totalDebt'];
    });
    this.buildForm();

    this .route.data.subscribe(resolversData => { 
      this.infoCustomer = resolversData['infoCustomer'];
      this.mediaData = resolversData['mediaData'].sort( (a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase()));
    }); 

    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
      this.payment.customerId = getDecryptedValue(this.customerId);
      this.payment.refBillAcount = params.get('refBillAcount');
      this.payment.refBill = params.get('numberMouvement');
      if (!isNullOrUndefined(params.get('remainingAmount'))) {
        this.payment.transactionAmount = Number(params.get('remainingAmount'));
        this.form.get('transactionAmount').setValue(this.payment.transactionAmount);
        this.form.get('transactionAmount').disable();
      }
    });
    
    this.payment.userId = this.gassiMockLoginService.getCurrentUserId().getValue();

    this.route.queryParamMap.subscribe(params => {
      this.typeCustomer = params.get('typeCustomer');
      this.isEntreprise = ( this.typeCustomer === CONSTANTS.TYPE_COMPANY );
      this.isParticular = (this.typeCustomer === CONSTANTS.TYPE_PARTICULAR );
    });  
  }

  getClassEnvByTypeCustomer(): string {
    return `env-${COLOR_TYPE_CUSTOMER[this.typeCustomer]}`;
  }

  buildForm(): void {
    this.form = this.fb.group({
      transactionAmount: this.fb.control(this.payment.transactionAmount, [ Validators.required, Validators.pattern(/^\d{0,9}(\.\d{1,9})?$/) ]),
      mediaRefId: this.fb.control(this.payment.mediaRefId),
      transactionType: this.fb.control(this.payment.transactionType, [ Validators.required ]),
      comment: this.fb.control(this.payment.comment)
    });
  }

  onCancel(): void {
    this.submitted = false;
    this.canceled = true;
  }

  onPay(form: any): void {
    this.submitted = form.submitted;
    if (this.stepPayment === 'Payer') {
      this.onSavePayement();
    } else {
      this.onValidatePayement();
    }
  }

  onSavePayement(): void {
    if (this.form.valid) {
      this.loading = true;
      this.payment = { 
        ...this.payment,
        ...this.form.value
      };
      if ( this.payment.transactionType === 'VISA' || this.payment.transactionType === 'MASTERCARD') {
        this.payment.transactionType = 'CB';
      }
      this.billingService.savePayement(this.payment).subscribe( data => {
        this.payment = data;
        this.loading = false;
        window.open(this.payment.url);
        this.stepPayment = 'Valider le paiement';

      });
    } 
  }

  onValidatePayement(): void {  
    this.loading = true;
    this.billingService.askInfoPayement(this.payment.id).subscribe(
      data => {
        this.loading = false;
        console.log('******************************', data)
        if ( !isNullOrUndefined(data) && (data === 'OK')) {
          this.openSMSPopup();
        } else {
          this.interpretErrorResult(data);
        }
      },
      _error => {
        this.loading = false;
        this.openErrorPopup('Erreur Serveur : Une erreur technique inattendue est survenue.');
      }
    );
  }

  interpretErrorResult(result: string): void {
    let errorText = '';
    if ( !isNullOrUndefined(result)) {
      if (result === 'OK') {
        this.openSMSPopup();
      } else if (result === 'KO') {
        errorText = 'le paiement n\'est pas autorisé.';
      } else if (result === 'RESP_NOT_FOUND' ) {
        errorText = `Erreur technique.<br/>Pas de correspondance trouvée dans chorniche.<br/>Veuillez contacter l\'équipe RUN.`;
      } else if (result === 'PAY_NOT_FOUND' ) {
        errorText = 'Erreur technique.<br/>Pas de correspondance trouvée dans chorniche.<br/>Veuillez contacter l\'équipe RUN.';
      } else {
        // si == bug aussi
        errorText = 'Erreur technique.\nVeuillez contacter l\'équipe RUN.';
      }
    } else {
      errorText = 'Erreur technique.\nVeuillez contacter l\'équipe RUN.';
    }
    this.openErrorPopup(errorText);
  }

  openSMSPopup(): void {
    const dialog = this.confirmationDialogService.confirm(
      '', 
      'Félicitation, votre paiement a été validé.<br /> Souhaitez-vous envoyer un sms de confirmation?', 
      'Oui, je veux envoyer un sms', 
      'Non, je ne veux pas', 
      'lg', 
      true
    );
    dialog.then( response => {
      if (response) {
        this.redirectToSendSms();
      } else {
        this.redirectToRequest();
      }
    });
  }

  openErrorPopup(errorText: string): void {
    this.confirmationDialogService.confirm('', errorText, 'Terminer', null, 'lg', false).then( response => {
      if (response) {
        this.redirectToRequest();
      }
    });
  }

  redirectToRequest(): void {
    this.router.navigate(
      ['/customer-dashboard', this.customerId, 'detail', 'request', this.payment.requestId], 
      { queryParamsHandling: 'merge' }
    );
  }

  redirectToSendSms(): void {
    this.router.navigate(
      ['/customer-dashboard', this.customerId, 'interaction', this.payment.requestId, 'sending-sms', 
      { 
       'templateId': this.payment.payementTemplateId,
       'idPaiement': this.payment.id
      }], 
      { queryParamsHandling: 'merge' }
    );
  }

}
