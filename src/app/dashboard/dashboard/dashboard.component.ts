import { TitleServices } from './../../_core/services/title-services.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RequestVO as RequestMonitoring } from './../../_core/models/models.d';
import { getEncryptedValue } from '../../_core/utils/functions-utils';
import { CustomerService } from '../../_core/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  numberOfTasks: number;
  numberOfInvoiceToGet: number;
  numberOfInvoiceToCheck: number;
  numberOfInvoiceToSend: number;
  requests: RequestMonitoring[];
  customerId: string;
  constructor(readonly route: ActivatedRoute, private readonly titleServices : TitleServices,
    private readonly router: Router, private readonly customerService: CustomerService
    ) {

  }
  ngOnInit(): void {
    this.route.data.subscribe(resolversData => {
      this.requests = resolversData['requests'];
    });
    this.titleServices.setTitle("Athena");
  }

  getNumberOfTasks(event: any): void {
    this.numberOfTasks = event;
  }
  getNumberOfInvoiceToGet(event: any): void {
    this.numberOfInvoiceToGet = event;
  }
  getNumberOfInvoiceToCheck(event: any): void {
    this.numberOfInvoiceToCheck = event;
  }
  getNumberOfInvoiceToSend(event: any): void {
    this.numberOfInvoiceToSend = event;
  }

  toCatalogue() : void{
    this.router.navigate(
      ['/customer-dashboard',getEncryptedValue(0),'cart','catalog-administration']
      
    )
  }
  openUrlApollon(){
    this.customerService.getApollonUrl().subscribe( data => {
      window.open(data, '_blank');
    })
    
  }

}
