import { GassiMockLoginService, ContactMethodService } from '../../../../_core/services';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { PenicheCustomerResponseVO } from '../../../../_core/models/peniche-customer-response-vo';
import { BillingService } from '../../../../_core/services/billing.service';
import { ProfilContractService } from '../profil-contract.service';
import { CM_MEDIA_REF, CM_USAGE } from '../../../../_core/constants/constants';
import { CmUsageVO } from '../../../../_core/models/cm-usage-vo';

@Component({
  selector: 'app-customer-peniche',
  templateUrl: './customer-peniche.component.html',
  styleUrls: ['./customer-peniche.component.scss']
})
export class CustomerPenicheComponent implements OnInit {

  consultationModePage$: BehaviorSubject<boolean>;

  @Input()
  penicheCustomerResponseVO: PenicheCustomerResponseVO;

  @Output()
  changePenicheForm = new EventEmitter<PenicheCustomerResponseVO>();

  @Input()
  customerId: string;

  @Input()
  isSelected: boolean;

  cmBillingUsageVO: CmUsageVO;

  @Output() changeDirtyPenicheForm = new EventEmitter<boolean>();

  @Output() isAddressFrench = new EventEmitter<boolean>();

  @Output() isFormatValid = new EventEmitter<boolean>();

  @Output() isEntreprise = new EventEmitter<boolean>();

  @Input()
  nicheIdentifier: string;

  @Input()  isPenicheUp: boolean;
  @Input()  isClientExist: boolean;
  jiraUrl: string;

  constructor(private readonly profilContractService: ProfilContractService,
    readonly billingService: BillingService, readonly contactMethodService: ContactMethodService ,
    private readonly mockLoginService: GassiMockLoginService) { }

  ngOnInit(): void {
    this.consultationModePage$ = this.profilContractService.getConsultationModePage();
    this.initBillingUsage();
    this.mockLoginService.getJiraUrl().subscribe(
      (url)=> this.jiraUrl = url
    );
  }

  initPenicheVO(): void {
    this.billingService.getBillCRDetailsByPeniche('PAR', this.nicheIdentifier).subscribe(data => {
      this.penicheCustomerResponseVO = data;
        if(isNullOrUndefined(this.penicheCustomerResponseVO)) {
          this.isClientExist = false;
        }
        this.isPenicheUp = true;
      },
      (error) => {
        this.isPenicheUp = false;
      },
      () => {
        console.log('complete')
      }
    );
  }


  initBillingUsage(): void {
        this.contactMethodService.getUsageByCustomerIdAndRefKeyAndMedia(this.customerId, CM_USAGE.BILLING.key, CM_MEDIA_REF.EMAIL).subscribe(
          data => {
            this.cmBillingUsageVO = data;
          }, error => {
          console.error('getUsageByCustomerIdAndRefKeyAndMedia failed: ', error);
          return of(null);
        }
     );
  }

  onUpdateCustomerPeniche(mode: boolean): void {
    this.profilContractService.updateConsultationModePage(mode);
  }


  onChangePenicheForm(penicheCustomerResponseVO: PenicheCustomerResponseVO): void {
    this.changePenicheForm.emit(penicheCustomerResponseVO);
  }

  OnchangeDirtyPenicheForm(val: boolean): void {
    this.changeDirtyPenicheForm.emit(val);
  }

  onChangeIsFrench(val: boolean): void {
    this.isAddressFrench.emit(val);
  }

  onChangeFormatValid(val: boolean): void {
    this.isFormatValid.emit(val);
  }

  onChangIsEntreprise(val: boolean): void {
    this.isEntreprise.emit(val);
  }

}
