import { Component, OnInit,Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomologationVO } from '../../../../_core/models';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-homologation-key-dates',
  templateUrl: './homologation-key-dates.component.html',
  styleUrls: ['./homologation-key-dates.component.scss']
})
export class HomologationKeyDatesComponent implements OnInit {
 condition:any
 @Input() homologation: HomologationVO;
 @Input() typeCustomer: string;
 @Input() isEntreprise: boolean;
 @Input() isParticular: boolean; 

  constructor(readonly route: ActivatedRoute,
    private readonly datePipe: DatePipe) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe( params => {
      this.typeCustomer = params.get('typeCustomer');
    });

    if (this.typeCustomer ==='company') {
      this.isEntreprise=true
    } else {
      this.isEntreprise=false
    }
  }

  getDate(dateTime: Date){
    return !isNullOrUndefined(dateTime) ? this.datePipe.transform(dateTime, 'dd MMM yyyy') : "-" ;
  }

  getTime(dateTime: Date){
    return !isNullOrUndefined(dateTime) && new Date(dateTime).getHours()
            && new Date(dateTime).getMinutes() ? `${new Date(dateTime).getHours()}h${new Date(dateTime).getMinutes()}` : "-" ;
  }

}
