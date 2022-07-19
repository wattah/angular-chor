import { catchError } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import { DataSendMessageExtension, dataSendListPicker, consumerData } from './dataTemplate';
import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  AfterViewInit
} from '@angular/core';
import { CustomerService } from 'src/app/_core/services';
import { LiveEngageView } from 'src/app/_core/models/abc-view';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NotificationService } from './../../_core/services/notification.service';
import { environment } from './../../../environments/environment';
import { isNullOrUndefined } from './../../_core/utils/string-utils';
import { CustomerCivilityService } from '../customer-dashboard-detail/profile-contract/customer-civility.service';
import { PENICHE_CUSTOMER_TYPOLOGY } from './../../_core/constants/constants';

declare const lpTag;
declare const sendMessageExtension;
declare const getOpaqueID;
@Component({
  selector: 'app-abc-page',
  templateUrl: './abc-page.component.html',
  styleUrls: ['./abc-page.component.scss']
})
export class AbcPageComponent implements OnInit, AfterViewInit {
  pathToData = 'authenticatedData.customerDetails';
  abcuid;
  lastSavedConnectionDate: string;
  lastInteractionDate: string;
  lastCoachMeetingDate: string;
  civility: string;

  /**
   * Constructeur
   * @param  customerService
   */
  constructor(
    private customerService: CustomerService,
    readonly notificationService: NotificationService,
    private readonly datePipe: DatePipe,
    private readonly customerCivilityService: CustomerCivilityService
  ) {
    this.notificationService.notifyIsLivePage().subscribe(data => console.log('abc comp data ', data));
  }

  @Input()
  abcData: LiveEngageView;

  ngOnInit() {
    //this.getInfo();
  }
  ngAfterViewInit(): void {
    console.log('in ngAfterViewInit');
    const cryptedOpaqueId = getOpaqueID();

    if (!isNullOrUndefined(cryptedOpaqueId)) {
      this.notificationService.isLivePage(true);
    }

    console.log('my opaqueId in ngAfterViewInit = ', cryptedOpaqueId);
    if(cryptedOpaqueId){
      this.getInfo(cryptedOpaqueId);
    }

    if ( cryptedOpaqueId ) {
      this.setConsumerProfile();
      console.log('consumer');
    }
  }

  toView360(customerId: string, typeItem: string): void {
    let url = environment.baseUrl + '/#/customer-dashboard/';
    if (typeItem === 'BENEFICIAIRE') {
      url += 'particular/' + customerId + '?typeCustomer=beneficiary';
    } else if (typeItem === 'PARTICULIER') {
      url += 'particular/' + customerId + '?typeCustomer=particular';
    } else {
      url += 'entreprise/' + customerId + '?typeCustomer=company';
    }
    window.open(url);
  }

  notifyWhenDone(err) {
    if (err) {
      console.log(err);
    }
  }

  updateCallback(data) {
    var path = data.key;
    var value = data.newValue;
    this.abcuid = value.customerId;
    console.log('data after bind', data);
    document.getElementById('appleId').innerHTML = 'Apple Id: ' + this.abcuid;
    console.log('abcuid in update call', this.abcuid);
    this.setConsumerProfile();
  }

  public launchScriptLiveEngage() {
    const bid = `${environment.bid}`;
    const cryptedOpaqueId = sendMessageExtension(bid);
    console.log('my opaqueId = ', cryptedOpaqueId);
    this.getInfo(cryptedOpaqueId);
    this.setConsumerProfile();
  }
  getInfo(cryptedOpaqueId): void {

    const datePattern = "dd MMM yyyy - HH'h'mm";

    // this.route.data.subscribe(resolversData => {
    //   this.abcData = resolversData['abcData'];
    // });
    this.customerService
      .getLiveEngageData(cryptedOpaqueId)
      .pipe(catchError(() => of(null)))
      .subscribe(data => {
        this.abcData = data;
        let firstName = this.abcData.customerView.firstName
        firstName = firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1):'';
        this.civility = `${this.customerCivilityService.getPersonTitle(this.abcData.customerView.civility)} ${firstName} ${this.abcData.customerView.lastName}`;
        console.log(data);
      },
      (error)=>{
        console.log('abc error' , error);
      },
      ()=>{
        console.log('onComplete');
        this.lastSavedConnectionDate = this.datePipe.transform(this.abcData.lastSaveOpaqueIdDate, datePattern);
        this.lastInteractionDate = this.datePipe.transform(this.abcData.lastInteractionDate, datePattern);
        this.lastCoachMeetingDate = this.datePipe.transform(this.abcData.lastCoachMeeting, datePattern);
        if(!isNullOrUndefined(this.abcData.customerView)){
        if (this.abcData.customerView.customerCategory === PENICHE_CUSTOMER_TYPOLOGY.ENTREPRISE.key){
          consumerData.firstName = '';
          consumerData.lastName = this.abcData.companyName;
        } else {
          consumerData.firstName = this.abcData.customerFirstName;
          consumerData.lastName = this.abcData.customerLastName;
        }
      }
        console.log('real coach meeting date:', this.abcData.lastCoachMeeting);
        console.log('my coach meeting date:', this.lastCoachMeetingDate);
        console.log('customer first Name:', this.abcData.customerFirstName);
        console.log('customer first Name:', this.abcData.customerLastName);
        this.setConsumerProfile();
      });

  }
  setDataToSendFromTemplateData(
    appId: number,
    appName: string,
    bid: string,
    imageURL: string,
    URL: string
  ) {
    DataSendMessageExtension.metadata[0].appId = appId;
    DataSendMessageExtension.metadata[0].appName = appName;
    DataSendMessageExtension.metadata[0].bid = bid;
    DataSendMessageExtension.metadata[0].receivedMessage.imageURL = imageURL;
    DataSendMessageExtension.metadata[0].URL = URL;
  }

  // consumer profile

  onSuccess = function() {
    console.log('success');
  };

  onError = function(error: any): void {
    if (error) {
      console.log(error);
    }
  };

  setConsumerProfile() {  
    lpTag.agentSDK.setConsumerProfile(consumerData, this.onSuccess, this.onError);
    console.log('set consumer profile:', consumerData);
  }

  sendListPicker() {
    var cmdName = lpTag.agentSDK.cmdNames.writeSC;
    lpTag.agentSDK.command(cmdName, dataSendListPicker, this.notifyWhenDone);
  }

  notificationHandler(data) {
    console.log('notificationHandler ', data);
  }

  focusHandler() {
    console.log('focusHandler');
  }

  blurHandler() {
    console.log('blurHandler');
  }
}
