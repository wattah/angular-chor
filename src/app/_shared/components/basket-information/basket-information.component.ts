import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-basket-information',
  templateUrl: './basket-information.component.html',
  styleUrls: ['./basket-information.component.scss']
})
export class BasketInformationComponent implements OnInit {
  @Input() cartStatusValue: any;
  @Input() cartLabel: string;
  @Input() numberOfArticle: number;
  @Input() calculateMargePourcent: number;
  @Input() orderId: number;
  @Input() cartTotal: string;

  constructor() { }

  ngOnInit() {
  }

}
