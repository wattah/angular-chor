import { OnInit, Component, ViewEncapsulation } from '@angular/core';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';
import { ActivatedRoute } from '@angular/router';
import { ComponentCanDeactivate } from '../../../_core/guards/component-can-deactivate';
import { FormGroup } from '@angular/forms';
import { ReferenceDataVO } from 'src/app/_core/models/models';
import { Person, RequestAnswersVO } from '../../../_core/models';
import { BeneficiaryVO } from '../../../_core/models/beneficiaryVO';
import { CmPostalAddressVO } from 'src/app/_core/models/cm-postaladdress-vo';
import { UserVo } from '../../../_core/models/user-vo';


@Component({
    selector: 'app-interaction-creation',
    templateUrl: './interaction-creation.component.html',
    styleUrls: ['./interaction-creation.component.scss'],
    encapsulation: ViewEncapsulation.None
  })
export class InteractionCreationComponent extends ComponentCanDeactivate implements OnInit {

    requests: RequestCustomerVO[];
    request: RequestCustomerVO;
    mediaData: ReferenceDataVO[];
    customerId: string;
    form: FormGroup;
    submitted: boolean;
    is360 = false;
    interlocutors: Person[];
    destinataires: BeneficiaryVO[];
    adresseRdv: CmPostalAddressVO[];
    listUsers: UserVo[];
    requestAnswers: RequestAnswersVO[];

  
    constructor(private route: ActivatedRoute) {
      super();
    }

    ngOnInit(): void {
        this.route.data.subscribe(resolversData => {
            this.requests = resolversData['requests'];
            this.mediaData = resolversData['mediaData'];
            this.interlocutors = resolversData['interlocutorsRequest'];
            this.destinataires = resolversData['destinataires'];
            this.adresseRdv = resolversData['adresseRdv'];
            this.listUsers = resolversData['listUsers'];
            this.request = resolversData['request'];
            this.requestAnswers = resolversData['requestAnswers'];
          });
          this.route.parent.paramMap.subscribe(params => {
            this.customerId =params.get('customerId'); 
          });
          this.is360 = Boolean(this.route.snapshot.data['is360']);
    }

    onFormGroupChange( form: FormGroup): void {
      this.form = form;
    }
  
    onSubmittedChange( submitted: boolean): void {
      this.submitted = submitted;
    }
  
    onCanceledChange( canceled: boolean): void {
      console.log(canceled)
      this.canceled = canceled;
    }
}