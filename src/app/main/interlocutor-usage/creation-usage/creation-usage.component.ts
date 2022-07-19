import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ComponentCanDeactivate } from '../../../_core/guards/component-can-deactivate';

@Component({
  selector: 'app-creation-usage',
  templateUrl: './creation-usage.component.html',
  styleUrls: ['./creation-usage.component.scss']
})
export class CreationUsageComponent extends ComponentCanDeactivate implements OnInit {

  form: FormGroup;
  submitted: boolean;

  customerId: string;
  typePage = 'particular';

  constructor(private readonly route: ActivatedRoute) {
    super();
    this.initializeTextOfCancelPopUp();
  }

  ngOnInit(): void {
    this.initializeTextOfCancelPopUp();

    this.route.parent.paramMap.subscribe(params => {
      this.customerId = params.get('customerId');
    });
  }

  onFormGroupChange( form: FormGroup): void {
    this.form = form;
  }

  onSubmittedChange( submitted: boolean): void {
    this.submitted = submitted;
  }

  onCanceledChange( canceled: boolean): void {
    console.log(canceled);
    this.canceled = canceled;
    this.initializeTextOfCancelPopUp();
  }
  initializeTextOfCancelPopUp(): void {
    this.message = 'Êtes-vous sûr de vouloir annuler votre création ?';
    this.btnOkText = 'Oui, j’annule ma création';
    this.btnCancelText = 'Non, je reviens à ma création';
  }

}
