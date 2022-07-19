import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ManageCustomerPenicheService } from '../manage-customer-peniche.service';

@Component({
  selector: 'app-create-update-customer-peniche',
  templateUrl: './create-update-customer-peniche.component.html',
  styleUrls: ['./create-update-customer-peniche.component.scss']
})

export class CreateUpdateCustomerPenicheComponent implements OnInit {

    form: FormGroup;
    country = new FormControl();
    addressFrench = new FormControl();
    typology =  new FormControl();
    customerId : string;
    isPenicheUp = true;
    
    constructor(private readonly route: ActivatedRoute , private readonly fb: FormBuilder,
      private readonly manageCustomerPenicheService: ManageCustomerPenicheService) { }

    ngOnInit(): void {
      this.form = this.buildForm();
      this.route.paramMap.subscribe( params => {
        this.customerId = params.get('customerId');
      });
    }

    buildForm() : any {
      return this.fb.group({
      typology: this.fb.control(''),
      billReport: this.fb.control(true),
      billingTime: this.fb.control(''),
      title: this.fb.control('PM'),
      society: this.fb.control(''),
      lastName: this.fb.control(''),
      firstName: this.fb.control(''),
      addressFrench: this.fb.control(''),
      deliveryInfo: this.fb.control(''),
      address2: this.fb.control(''),
      address3: this.fb.control(''),
      address5: this.fb.control(''),
      country: this.fb.control(''),
      zipCode: this.fb.control(''),
      city: this.fb.control(''),
      address4: this.fb.control(''),
      isFrenchAddress: this.fb.control(true),
      mail: this.fb.control(''),
      nomInter: this.fb.control(''),
      typeEnvoi: this.fb.control('MANUEL'),
      facture: this.fb.control('NON')
    });
  }

  onCancel() : void {
    this.manageCustomerPenicheService.updateConsultationModePage(true);
    this.manageCustomerPenicheService.setUpdateFlag(false);
  }

  onSave() : void {
    this.manageCustomerPenicheService.updateConsultationModePage(true);
  }
}