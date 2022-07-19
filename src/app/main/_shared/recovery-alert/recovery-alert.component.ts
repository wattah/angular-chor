import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RequestService } from '../../../_core/services/request.service';
import { CONSTANTS, CONTRAT_STATUTS } from '../../../_core/constants/constants';
import { RequestStatut } from '../../../_core/enum/request-statut.enum';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';

@Component({
  selector: 'app-recovery-alert',
  templateUrl: './recovery-alert.component.html',
  styleUrls: ['./recovery-alert.component.scss']
})
export class RecoveryAlertComponent implements OnInit, OnChanges {

  @Input() recoveryDate: Date;
  @Input() detteTotalTTC: number;
  @Input() detteTotal: number;
  @Input() entrepriseRecoveryDate: Date
  @Input() nicheIdentifier: string;
  @Input() error: boolean;
  @Input() statusClient : string;
  @Input() displayTotal : boolean = true;
  selectedStatuList = [ RequestStatut.PENDING]
  requestchoose = 'recouvrement'
  selectedTypeList = [21]
  remaining: number;
  customerId: string;
  typeCustomer: string;
  idreq = [];
  requestId: number;
  isEntreprise: boolean;
  constructor(private readonly route: ActivatedRoute, private readonly requestService: RequestService ) {
  }

  ngOnInit(): void {
    this.getCustomerIdAndIsEntreprise();  
  }

  getCustomerIdAndIsEntreprise(){
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.customerId = (params.get('customerId'));
    });
    this.route.queryParamMap.subscribe( params => this.isEntreprise = (params.get('typeCustomer')===CONSTANTS.TYPE_COMPANY));
  }

  checkClientStatus(){
    if(this.statusClient == CONTRAT_STATUTS.CONTACT.label || this.statusClient == CONTRAT_STATUTS.PROSPECT.label){
      this.selectedTypeList.push(55);
    }
  }

  getRequestByFilters(){
    this.requestService.getRequestsByFilters(this .customerId, this.selectedStatuList,this.selectedTypeList,this.isEntreprise).
    subscribe(data =>{
      if (data !== null){
        for (let i = 0; i < data.length; i++) {
            this.idreq.push(data[i].idRequest)
        }
        this.requestId=this.idreq[0];
      }
    });
  }

  ngOnChanges(changes: SimpleChanges):void {
    if(!isNullOrUndefined(changes['statusClient'])){
      this.checkClientStatus();
      if(isNullOrUndefined(this.customerId) || isNullOrUndefined(this.isEntreprise)){
        this.getCustomerIdAndIsEntreprise();
      }
      if(!isNullOrUndefined(this.customerId)){
        this.getRequestByFilters();
      }
    }
  }
  

}
