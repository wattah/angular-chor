import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { ComponentCanDeactivate } from '../../../_core/guards/component-can-deactivate';
import { CM_USAGE } from '../../../_core/constants/constants';


@Component({
  selector: 'app-modification-usage',
  templateUrl: './modification-usage.component.html',
  styleUrls: ['./modification-usage.component.scss']
})
export class ModificationUsageComponent extends ComponentCanDeactivate implements OnInit {

  form: FormGroup;
  submitted: boolean;

  customerId: string;
  usageRefKey : string;
  typePage = 'particular';
  USAGE_REF_LIST = [
    { key: CM_USAGE.EVENT.key, label: CM_USAGE.EVENT.label},
    { key: CM_USAGE.BILLING.key, label: CM_USAGE.BILLING.label},
    { key: CM_USAGE.CONTRACTUAL_INFO.key, label: CM_USAGE.CONTRACTUAL_INFO.label},
    { key: CM_USAGE.DIRECT_MARKETING.key, label: CM_USAGE.DIRECT_MARKETING.label},
    { key: CM_USAGE.DEFAULT.key, label: CM_USAGE.DEFAULT.label}
  ];

  constructor(private readonly route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.initializeTextOfCancelPopUp();
    this.route.parent.paramMap.subscribe(params => {
      this.customerId = params.get('customerId');
    }); 
    this.route.paramMap.subscribe(params => {
      this.usageRefKey = this.USAGE_REF_LIST.find((x) => x.key === params.get('usageRefKey')).label;
    }); 
  }

  onFormGroupChange( form: FormGroup): void {
    this.form = form;
  }

  onSubmittedChange( submitted: boolean): void {
    this.submitted = submitted;
  }

  onCanceledChange( canceled: boolean): void {
    this.canceled = canceled;
    this.initializeTextOfCancelPopUp();
  }
  initializeTextOfCancelPopUp(): void {
    this.message = 'Êtes-vous sûr de vouloir annuler votre modification ?';
    this.btnOkText = 'Oui, j’annule ma modification';
    this.btnCancelText = 'Non, je reviens à ma modification';
  }

}
