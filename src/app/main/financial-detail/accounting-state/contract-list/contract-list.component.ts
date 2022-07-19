import { Component, Input, OnChanges, Output, SimpleChanges, EventEmitter } from '@angular/core';

import { ContractsOffersVO } from '../../../../_core/models/contracts-offers-vo';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnChanges  {

  @Input() contractsOffers: ContractsOffersVO[];
  @Output() contractOfferSelected = new EventEmitter(); 

  @Input() nicheIdentifiant: string;
  @Input() offerLabelChange: string;
  @Input() offerLabel: string;

  rowSelected = 0;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contractsOffers'] && this.contractsOffers !== null && this.contractsOffers.length > 0) {
      this.contractOfferSelected.emit(this.contractsOffers[0]); 
    }
  }


  toAccountingState(contractOffer : ContractsOffersVO):void{
    this.contractOfferSelected.emit(contractOffer);
    this.nicheIdentifiant = contractOffer.nicheIdentifier;
    this.offerLabelChange = contractOffer.offerLabel;

  }




}
