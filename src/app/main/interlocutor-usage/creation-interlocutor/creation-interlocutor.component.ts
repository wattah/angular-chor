import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentCanDeactivate } from '../../../_core/guards/component-can-deactivate';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-creation-interlocutor',
  templateUrl: './creation-interlocutor.component.html',
  styleUrls: ['./creation-interlocutor.component.scss']
})
export class CreationInterlocutorComponent extends ComponentCanDeactivate implements OnInit {

  customerId: string;
  typeCustomer: string;
  form: FormGroup;
  submitted: boolean;

  
  constructor(private readonly route: ActivatedRoute) {
    super();
    this.initializeTextOfCancelPopUp();
  }

  ngOnInit(): void {
    this.route.parent.paramMap.subscribe(params => {
      this.customerId = params.get('customerId');
    });

    this.route.queryParamMap.subscribe(params => {
      this.typeCustomer = params.get('typeCustomer');
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
