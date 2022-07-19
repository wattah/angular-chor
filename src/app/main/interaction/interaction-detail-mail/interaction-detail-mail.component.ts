import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestAnswersVO } from 'src/app/_core/models/models';

import { MailInteractionVo } from '../../../_core/models/mailInteractionVo';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';

@Component({
  selector: 'app-interaction-detail-mail',
  templateUrl: './interaction-detail-mail.component.html',
  styleUrls: ['./interaction-detail-mail.component.scss']
})
export class InteractionDetailMailComponent implements OnInit {
  @Input() 
  request: RequestCustomerVO;
  detailRequest: any ;
  @Input()
  requestAnswers: RequestAnswersVO[];
  
  customerId: string;
  interactionDetailMail: MailInteractionVo;
  receiverss: Array<any>;
  receivers = [];
  ccreceiver= [];
  ccireceiver= [];
  ccreceivers: Array<any>;
  ccireceivers: Array<any>;

  constructor(private route: ActivatedRoute) {
   
  }

  ngOnInit() {
    this.route.data.subscribe(resolversData => {
      this.request=resolversData['request'];
      this.requestAnswers = resolversData['requestAnswers'];
      this.interactionDetailMail = resolversData['interactionDetailMail']; 
      this .route.parent.paramMap.subscribe(params => {
        this.customerId = params.get('customerId');
       
      });
     if (this.interactionDetailMail != null && this.interactionDetailMail.receiverss.length > 0) {
      for (let i = 0; i < this.interactionDetailMail.receiverss.length; i++) {
        this.receivers.push(this.interactionDetailMail.receiverss[i].value)
      }
    } 
    return this.receivers.join(' ,  ') ;
    });
    this.receiverss= Array.of(this.receivers.join(' , '));
    this.getCcAndCCiReceivers();
  }

  getCcAndCCiReceivers(){
    if (this.interactionDetailMail != null && this.interactionDetailMail.receiverss.length > 0) {
      for (let i = 0; i < this.interactionDetailMail.receiverss.length; i++) {
       if(this.interactionDetailMail.receiverss[i].copy=== true){
        this.ccreceiver.push(this.interactionDetailMail.receiverss[i].value);
        this.ccreceiver.join(' ,  ') ;
        this.ccreceivers= Array.of(this.ccreceiver.join(' , '));

       }if(this.interactionDetailMail.receiverss[i].hidden=== true){
       this.ccireceiver.push(this.interactionDetailMail.receiverss[i].value);
       this.ccireceiver.join(' ,  ') ;
       this.ccireceivers= Array.of(this.ccireceiver.join(' , '));
       }
  }
    }

  }

  
    





}
