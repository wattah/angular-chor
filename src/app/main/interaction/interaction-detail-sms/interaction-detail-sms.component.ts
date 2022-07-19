import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestAnswersVO } from 'src/app/_core/models/models';

import { MailInteractionVo } from '../../../_core/models/mailInteractionVo';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';

@Component({
  selector: 'app-interaction-detail-sms',
  templateUrl: './interaction-detail-sms.component.html',
  styleUrls: ['./interaction-detail-sms.component.scss']
})
export class InteractionDetailSmsComponent implements OnInit {

  detailRequest: any ;
  customerId;
  interactionDetailMail: MailInteractionVo;
  receiverss: Array<any>;
  receivers = [];
  ccreceivers: Array<any>;
  ccireceivers: Array<any>;
  @Input() 
  request: RequestCustomerVO;
  @Input()
  requestAnswers: RequestAnswersVO[];

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
      for (var i = 0; i < this.interactionDetailMail.receiverss.length; i++) {
        this.receivers.push(this.interactionDetailMail.receiverss[i].value)
      }
    } 
    return this.receivers.join(' ,  ') ;
    });
    this.receiverss= Array.of(this.receivers.join(' , '));
    console.log(this.receiverss)
    
  }

}
