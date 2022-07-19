import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestAnswersVO } from '../../../_core/models/models';


import { InteractionLight } from '../../../_core/models/interaction-vo';
import { RequestCustomerVO } from '../../../_core/models/request-customer-vo';

@Component({
  selector: 'app-interaction-detail',
  templateUrl: './interaction-detail.component.html',
  styleUrls: ['./interaction-detail.component.scss']
})
export class InteractionDetailComponent implements OnInit {
  @Input() 
  request: RequestCustomerVO;
  @Input()
  requestAnswers: RequestAnswersVO[];
  @Input()
  customerId: string;
  participants : Array<any>;
  
  interactionDetails: InteractionLight;
  newDate;
  createHourAndMin;
  startHourAndMin;
  constructor(private readonly route: ActivatedRoute , private readonly datePipe: DatePipe) { 
    
  }

  ngOnInit() {
    this.route.data.subscribe(resolversData => {
      this.interactionDetails = resolversData['interactionDetails'];
      this.createHourAndMin = this.datePipe.transform(this.interactionDetails.creeLe , "HH'h'mm");
      console.log('createHourAndMin = ',this.createHourAndMin);
      this.startHourAndMin = this.datePipe.transform(this.interactionDetails.startDate , "HH'h'mm");
      console.log('startHourAndMin = ',this.startHourAndMin);
      this .route.parent.paramMap.subscribe(params => {
        this.customerId =params.get('customerId');


      }); 
      if(this.interactionDetails.participants != null && this.interactionDetails.participants.length > 0){
      this.participants= Array.of(this.interactionDetails.participants.join(' , ')); 
      }
      this.request = resolversData['request'];
      this.requestAnswers = resolversData['requestAnswers'];
    });

  }

}
