import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BillingService } from './../../../_core/services/billing.service';
import { GassiMockLoginService } from './../../../_core/services/gassi-mock-login.service';
import { UserService } from './../../../_core/services/user-service';
import { StatsCustomerBillsVO } from '../../../_core/models/stats-customer-bills-vo';
import { UserVo } from './../../../_core/models/user-vo';
import { ApplicationUserVO } from './../../../_core/models/application-user';
import { PaginatedList } from '../../../_core/models/paginated-list';
import { INVOISE_STATUS } from './../../../_core/constants/constants';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  @Output() numberOfInvoiceToGet = new EventEmitter();
  @Output() numberOfInvoiceToSend = new EventEmitter();
  @Output() numberOfInvoiceToCheck = new EventEmitter();

  invoicesToGet: PaginatedList<StatsCustomerBillsVO>[];
  invoicesToCheck: PaginatedList<StatsCustomerBillsVO>[];
  invoicesToSend: PaginatedList<StatsCustomerBillsVO>[];
  inCompleteCall = false;
  isCallingToGet = false;
  isCallingToCheck = false;
  isCallingToSend = false;
  deskList: any[] = [];
  selectedDeskId: number;
  connectedUser: UserVo = {} as UserVo;
  invoiceSatus = INVOISE_STATUS;
  jiraUrl: string;

  constructor(readonly router: Router, readonly route: ActivatedRoute, readonly userService: UserService,
    readonly billingService: BillingService, readonly gassiMockLoginService: GassiMockLoginService) { 
  }

  ngOnInit() {
    this.gassiMockLoginService.getCurrentConnectedUser().subscribe((onlineUser) => {
      if (onlineUser) {
  this.isCallingToGet = true;
  this.isCallingToCheck = true;
  this.isCallingToSend = true;
  //Desk List
  this.initDeskList(onlineUser);
  //Init invoices List By Status
  this.initInvoicesByStatus(this.invoiceSatus.TO_GET.key, false, onlineUser.coachId);
  this.initInvoicesByStatus(this.invoiceSatus.TO_CHECK.key, false, onlineUser.coachId);
  this.initInvoicesByStatus(this.invoiceSatus.TO_SEND.key, true, onlineUser.coachId);
        }
      });
  this.gassiMockLoginService.getJiraUrl().subscribe(
    (url)=> this.jiraUrl = url
  )
  }

  initDeskList(onlineUser: ApplicationUserVO): void {
    this.userService.usersByRole('DESK', 1).subscribe((data) => {
      this.deskList = data;
      if (this.deskList) {
        this.connectedUser.id = onlineUser.coachId;
        this.connectedUser.firstName = onlineUser.firstName;
        this.connectedUser.lastName = onlineUser.lastName;
        this.selectedDeskId = this.connectedUser.id;
        this.deskList.sort((a, b) => a.lastName.localeCompare(b.lastName) ) ;
        const isConnectedUserDesk = this.deskList.some(desk => desk.id === this.connectedUser.id);
        this.addConnectedUserToDeskList(isConnectedUserDesk);
      }
    });
  }

  addConnectedUserToDeskList(isConnectedUserDesk: boolean): void {
    if (!isConnectedUserDesk) {
      this.deskList.unshift(this.connectedUser);
    } else {
      this.deskList.sort((x, y) => x.id === this.connectedUser.id ? -1 : y === this.connectedUser.id ? 1 : 0 );
    }
  }

  refreshTable(event){
    //Parce que le traitement des factures ne se fait que pour les factures a recuperer et a verifier
    //donc le rafraishissemnt ne prend en consideration que ces 2 cas, du coup le 2em param est false
    if(event === this.invoiceSatus.TO_GET.key){
      this.isCallingToGet = true;
      this.initInvoicesByStatus(this.invoiceSatus.TO_GET.key, false, this.selectedDeskId);
    } else if(event === this.invoiceSatus.TO_CHECK.key){
      this.isCallingToCheck = true;
      this.initInvoicesByStatus(this.invoiceSatus.TO_CHECK.key, false, this.selectedDeskId);
    }
  }

  startLoading(event){
    if(event === this.invoiceSatus.TO_GET.key){
      this.isCallingToGet = true;
    } else if(event === this.invoiceSatus.TO_CHECK.key){
      this.isCallingToCheck = true;
    }
  }

  initInvoicesByStatus(invoiceSatus: string, addBillReport: boolean, onlineUserId: number): void {
    
    this.billingService.invoices('PAR', invoiceSatus, addBillReport, onlineUserId, 0, 4).subscribe(data => {

      if (invoiceSatus === this.invoiceSatus.TO_GET.key) {
        this.initToGetCase(data);  
      }

      if (invoiceSatus === this.invoiceSatus.TO_CHECK.key) {
        this.initToCheckCase(data);
      }

      if (invoiceSatus === this.invoiceSatus.TO_SEND.key) {
        this.initToSendCase(data);
      }
    },
    (error) => {
      console.error('initInvoicesByStatus, connection failed: ', error);
      this.isCallingToGet = false;
      this.isCallingToCheck = false;
      this.isCallingToSend = false;
      return of(null);
      }
      );
  }

  initToGetCase(data: any): void {  
    this.invoicesToGet = data;
    this.isCallingToGet = false;
    if (this.invoicesToGet !== null && this.invoicesToGet.length > 0 ) {
      this.numberOfInvoiceToGet.emit(this.invoicesToGet[0].total);
    } else {
      this.numberOfInvoiceToGet.emit(this.invoicesToGet.length);
    }
  }

  initToCheckCase(data: any): void { 
    this.invoicesToCheck = data;
    this.isCallingToCheck = false;
    if (this.invoicesToCheck !== null && this.invoicesToCheck.length > 0 ) {
      this.numberOfInvoiceToCheck.emit(this.invoicesToCheck[0].total);
    } else {
      this.numberOfInvoiceToCheck.emit(this.invoicesToCheck.length);
    }
  }

  initToSendCase(data: any): void {   
    this.invoicesToSend = data;
    this.isCallingToSend = false;
    if (this.invoicesToSend !== null && this.invoicesToSend.length > 0 ) {
      this.numberOfInvoiceToSend.emit(this.invoicesToSend[0].total);
    } else {
      this.numberOfInvoiceToSend.emit(this.invoicesToSend.length);
    }
  }

  changeDesk(): void {
    this.isCallingToGet = true;
    this.isCallingToCheck = true;
    this.isCallingToSend = true;
    this.initInvoicesByStatus(this.invoiceSatus.TO_GET.key, false, this.selectedDeskId);
    this.initInvoicesByStatus(this.invoiceSatus.TO_CHECK.key, false, this.selectedDeskId);
    this.initInvoicesByStatus(this.invoiceSatus.TO_SEND.key, true, this.selectedDeskId);

  }

}
