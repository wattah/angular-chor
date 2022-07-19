import { ReferenceDataVO } from './../../../_core/models/reference-data-vo';
import { ReferenceData } from 'src/app/_core/models/reference-data';
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CSS_CLASS_NAME} from './../../../_core/constants/constants';
import { InterventionReportService } from 'src/app/_core/services/intervention-report.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { isNullOrUndefined } from 'src/app/_core/utils/string-utils';
import { ReferenceDataService } from 'src/app/_core/services';
import { PostalAdresseVO } from 'src/app/_core/models/postalAdresseVO';
import { InterventionReportVO } from '../../../_core/models/cri/intervention-report-vo';
import { NotificationService } from '../../../_core/services/notification.service';


@Component({
  selector: 'app-recovery-information',
  templateUrl: './recovery-information.component.html',
  styleUrls: ['./recovery-information.component.scss']
})
export class RecoveryInformationComponent implements OnInit, OnChanges {

  
    /*--------Form Control liste Interventions--------------*/
    @Input() interventionReport;
    @Input() isCancel;
    @Output() selectIntervReport: EventEmitter<InterventionReportVO> = new EventEmitter<InterventionReportVO>();

    /*-------- End --------------*/

 
    customerId : string;
    requestId : number;
    typesIntervention : ReferenceDataVO[] = [];
    rowData : any[] = [];
    separator = ' ';
    dataExists : boolean;
    showResult = false;
    getRowHeight: any;
    isCellClicked = false;
    selectedRow : any;
    defaultSortModel = [{ colId: 'interventionStartTime', sort: 'desc' }];
    columnDefs = [
      {
        headerName: '',
        headerTooltip: '',
        field: 'checkbox',
        cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
        checkboxSelection: (params)=> this.renderCheckBox(params),
        width: 40,
        
      },
      {
        headerName: 'Date',
        headerTooltip: 'date',
        valueGetter: params => {
          if ( !isNullOrUndefined(params.data) && !isNullOrUndefined(params.data.interventionStartTime)) {
            return `${this.datePipe.transform(params.data.interventionStartTime, 'dd MMMM yyyy')}`;
          } 
          return '-'; 
        },
        field: 'interventionStartTime',
        cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
        width: 120,
        sortable: true,
        
      },
      {
        headerName: 'Type d\'intervention',
        field: 'type.label',
        valueGetter : params => {
          return this.getTypeLabelOfIntervention(params.data);
        },
        cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
        width: 140,
        sortable: false
      },
      {
        headerName: 'Client',
        field: "customerLastNameFirstName",
        valueGetter : params => {
          return this.formatCustomerName(params.data.customer);
        },
        cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
        width: 140,
        sortable: false
      },
      {
        headerName: 'Adresse',
        field: 'adresse',
        valueGetter : params => { if(params.data.postalAdress !== null) { return this.getAddress(params.data.postalAdress); } return '';},
        cellClass: CSS_CLASS_NAME.CELL_WRAP_TEXT,
        width: 240,
        sortable: false
      },
     
    ];
    
  
    constructor(private readonly interventionReportService : InterventionReportService,
                private readonly referenceDataService : ReferenceDataService,
                private readonly route: ActivatedRoute,
                private readonly datePipe: DatePipe,
                private readonly notificationService: NotificationService) { }

  //===================================================================================
  ngOnChanges(changes: SimpleChanges): void {
     if(changes['isCancel']
    && !changes['isCancel'].firstChange){
      this.isCellClicked = false;
      this.selectedRow.node.setSelected(false); 
    }
  }
  
    ngOnInit() {
      this.calculateRowHeightOfMasterDetail();
      this.search();
    }


    getTypeLabelOfIntervention(interv : any){
      if(interv.interventionDetail && interv.interventionDetail.length > 0){
        return interv.interventionDetail[0].refInterventionTypeLabel;
      }
      if(interv.type){
        return interv.type.label;
      }
      return '-';
    }
    
    formatCustomerName(customer : any){
      let customerName = '';
      if(customer.persons[0] !== null){
        if(customer.persons[0].firstName !== null){
          customerName += customer.persons[0].firstName.substr(0,1).toUpperCase() + customer.persons[0].firstName.substr(1).toLowerCase() + ' ';
        }
        if(customer.persons[0].lastName !== null){
          customerName += customer.persons[0].lastName.toUpperCase();
        }
      }
      
      return customerName;

    }

    calculateRowHeightOfMasterDetail(): void {
      this.getRowHeight = (params) => {
          if (params.node) {
              const offset = 20;
              const lignes = params.data.customerLastNameFirstName.split(/\r\n|\r|\n/);
              let allDetailRowHeight = lignes.length;
              lignes.forEach((ligne: string) => {
                  const snb = ligne.length / 60;
                  if (snb > 1) {
                      allDetailRowHeight += snb - 1;
                  }
              });
              return allDetailRowHeight * 20 + offset;
          }
      };

    }
    

    search() {
      
      this.requestId = Number(this.route.snapshot.paramMap.get('idRequest'));
      this.route.parent.paramMap.subscribe(params => {
        this.customerId = params.get('customerId');
      }); 
      this.interventionReportService.searchInterventionReport(this.customerId).subscribe(
        (data) => {
          if(data.length > 0){
            this.rowData = data;
            this.dataExists = true;
          }else {
            this.dataExists = false;
          }
          this.showResult = true;
        }
      );
    }

    
    getAddress(postalAddress: PostalAdresseVO): string {
      
      let str = '';
      if (postalAddress.addrLine2 !== null && postalAddress.addrLine2 !== '') {
        str += postalAddress.addrLine2 + this.separator ;
      }
      if (postalAddress.addrLine3 !== null && postalAddress.addrLine3 !== '') {
        str += postalAddress.addrLine3 + this.separator ;
      }
      if (postalAddress.logisticInfo !== null && postalAddress.logisticInfo !== '') {
        str += postalAddress.logisticInfo;
      }
      if (postalAddress.addrLine4 !== null && postalAddress.addrLine4 !== '') {
        str += postalAddress.addrLine4 + this.separator ;
      }
      if (postalAddress.addrLine5 !== null && postalAddress.addrLine5 !== '') {
        str += postalAddress.addrLine5 + this.separator ;
      }
      if (postalAddress.postalCode !== null && postalAddress.postalCode !== '') {
        str += postalAddress.postalCode + ' ';
      }
      if (postalAddress.city !== null) {
        str += postalAddress.city;
      }
      if (postalAddress.cedex !== null) {
        str += ' ' + postalAddress.cedex;
      }
      if (postalAddress.country) {
        str += this.separator + postalAddress.country.label;
      }
      
      return str;
    }

    renderCheckBox(params){
    return true; 
  }

  clickCell(params: any): void {
    if(!this.isCellClicked){
      this.notificationService.setIsFromCriAndCriChange(true);
      this.selectedRow = params;
      const taskId = this.interventionReport.taskId;
      this.interventionReport = null;
      this.interventionReport = Object.assign({}, params.data);
      this.interventionReport.id = null;
      this.interventionReport.taskId = taskId;
      if(this.interventionReport.interventionDetail && this.interventionReport.interventionDetail[0]){
        this.interventionReport.interventionDetail[0].id = null
        this.interventionReport.interventionDetail[0].interventionReportId = null;
        if(!isNullOrUndefined(this.interventionReport.interventionDetail[0].fibreOptique)){
          this.interventionReport.interventionDetail[0].fibreOptique.forEach((fibre ,index)=> {
            this.interventionReport.interventionDetail[0].fibreOptique[index].id = null;
          });
        }
        if(!isNullOrUndefined(this.interventionReport.interventionDetail[0].interventionWifi)){
            this.interventionReport.interventionDetail[0].interventionWifi.id = null;  
        }
        if(!isNullOrUndefined(this.interventionReport.interventionDetail[0].interventionMobile)){
          this.interventionReport.interventionDetail[0].interventionMobile.id = null;  
      }
      }
     // MOBILE SONOS 
      this.selectIntervReport.emit(this.interventionReport);
      this.isCellClicked = true;
    }
  
}

}
