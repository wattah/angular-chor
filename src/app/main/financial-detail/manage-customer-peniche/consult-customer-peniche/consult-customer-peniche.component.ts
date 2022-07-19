import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageCustomerPenicheService } from '../manage-customer-peniche.service';

@Component({
  selector: 'app-consult-customer-peniche',
  templateUrl: './consult-customer-peniche.component.html',
  styleUrls: ['./consult-customer-peniche.component.scss']
})

export class ConsultCustomerPenicheComponent implements OnInit {
  
    isPenicheUp = true;
    doesCustomerPenicheExist = false;
    customerId : string;

    @Output() updateCustomerPeniche = new EventEmitter<boolean>(null);

    constructor(private readonly route: ActivatedRoute, 
      private readonly manageCustomerPenicheService: ManageCustomerPenicheService) { }

    ngOnInit(): void {
      this.doesCustomerPenicheExist = this.manageCustomerPenicheService.getUpdateFlag();
      this.route.paramMap.subscribe( params => {
            this.customerId = params.get('customerId');
          });
    }
    
    onUpdateCustomerPeniche(): void {
        this.updateCustomerPeniche.emit(false);
    }

    showPenichKO(): void {
      this.isPenicheUp = false;
    }
}