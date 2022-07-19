import { getEncryptedValue } from './../../../../_core/utils/functions-utils';
import { Component, OnInit , Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BillingService } from './../../../../_core/services/billing.service';
import { RequestService } from './../../../../_core/services/request.service';
import { ConfirmationDialogService } from './../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { StatsCustomerBillsVO } from '../../../../_core/models/stats-customer-bills-vo';
import { PaginatedList } from '../../../../_core/models/paginated-list';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { IconRendererComponent } from './../../icon-renderer/icon-renderer.component';
import { UNIVERS, INVOISE_STATUS } from './../../../../_core/constants/constants';
import { getDefaultStringEmptyValue } from './../../../../_core/utils/string-utils';
import { ApplicationUserVO } from './../../../../_core/models/application-user';
import { AuthTokenService } from './../../../../_core/services/auth_token';


@Component({
  selector: 'app-invoices-table',
  templateUrl: './invoices-table.component.html',
  styleUrls: ['./invoices-table.component.scss']
})
export class InvoicesTableComponent implements OnInit {

  defaultSortModel = [ { colId: 'membre', sort: 'desc' } ];
  columnDefs: any[];
  
  @Input() invoices: PaginatedList<StatsCustomerBillsVO>[];
  @Input() invoiceSatus = '';
  @Input() selectedDeskId: number;
  @Input() isCallingToGot = false;
  @Input() connectedUserId: number;
  @Output() refreshTable: EventEmitter<string> = new EventEmitter<string>();
  @Output() startLoading: EventEmitter<string> = new EventEmitter<string>();
  rowData: StatsCustomerBillsVO[];
  totalPages: number;
  currentPage = 1;
  lastPageSize: number; 
  paginationPageSize = 4;
  inCompleteCall = false;
  frameworkComponents: any;
  invoiceSatusCST = INVOISE_STATUS;
  user : ApplicationUserVO;

  constructor(readonly router: Router, readonly route: ActivatedRoute, readonly confirmationDialogService: ConfirmationDialogService, 
    readonly billingService: BillingService, readonly requestService: RequestService,
    private readonly authTokenService: AuthTokenService) { 
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent
    };
  }

  ngOnInit(): void {
    this.setColumnRef();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['invoices'] && !isNullOrUndefined(this.invoices)) {
      this.adaptListWithTable();
    }
  }

  adaptListWithTable(): void {
    if (this.invoices && this.invoices[0] && this.invoices[0].total !== 0) {        
      // Fill and Adapt ag-grid list 
      this.rowData = this.invoices[0].items;
      this.currentPage = 1;
      this.totalPages = Math.ceil(this.invoices[0].total / this.paginationPageSize);
      this.extractUniversesNumber();
      this.inCompleteCall = false;
    }
  }
  openConfirmationDialog(e): any {
    // r.rowData
    const title = 'Bloc Facture';
    const comment = 'Confirmez-vous que vous prenez en charge les factures de ce client ?' +
     'Attention une demande de contrôle facture va vous être affectée.';
    const btnOkText = 'Oui, je prends en charge la facture';
    const btnCancelText = 'Non, je refuse';
    this.confirmationDialogService.confirm(title, comment, btnOkText, btnCancelText)
    .then((confirmed) => { 
      if(confirmed){
        this.createInvoicesRequestBills(e);
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  createInvoicesRequestBills(e: any){
    const addBillReport = (this.invoiceSatus === this.invoiceSatusCST.TO_SEND.key);
    this.startLoading.emit(this.invoiceSatus);
    this.user = this.authTokenService.applicationUser;
    this.requestService.traiterFactures('PAR', getEncryptedValue(e.rowData.customerId) , this.invoiceSatus, 
      addBillReport, this.connectedUserId, this.user.activeRole.roleName).subscribe(data => {
      this.invoices = [];
    },
    (error) => {
      console.error('createInvoicesRequestBills failed: ', error);
      this.refreshTable.emit(this.invoiceSatus);
      return of(null);
      },
    ()=>{
      console.log('onComplete');
      this.refreshTable.emit(this.invoiceSatus);
    }
    );

  }

  goToPageClick(page: number): void {
    page = page - 1;
    if (this.invoices && this.invoices[0] && this.invoices[0].page !== page) {
      this.isCallingToGot = true;
      let addBillReport = false;
      if (this.invoiceSatus === this.invoiceSatusCST.TO_SEND.key) {
        addBillReport = true;
      }
      this.billingService.invoices('PAR', this.invoiceSatus, addBillReport, this.selectedDeskId, page, 4).subscribe(data => {
        this.invoices = data;
        if (this.invoices && this.invoices[0] && this.invoices[0].total !== 0) {
          this.rowData = this.invoices[0].items;
          this.totalPages = Math.ceil(this.invoices[0].total / this.paginationPageSize);
          this.extractUniversesNumber();
          this.isCallingToGot = false;
        }
      },
      (error) => {
        console.error('initInvoicesByStatus, connection failed: ', error);
        this.isCallingToGot = false;
        return of(null);
        }
      );
    }  
  }

  extractUniversesNumber(): void {
    this.rowData.forEach(invoice => {
      invoice.mobileNbr = invoice.homeNbr = invoice.internetNbr = invoice.serviceNbr = 0;
      if (invoice.statsUniverse) {
        invoice.statsUniverse.forEach(univers => {
          switch (univers.universe.toUpperCase()) {
            case UNIVERS.MOBILE.value.toUpperCase():
              invoice.mobileNbr = univers.count;
              break;
            case UNIVERS.FIXE.value.toUpperCase():
              invoice.homeNbr = univers.count;
              break;
            case UNIVERS.INTERNET.value.toUpperCase():
              invoice.internetNbr = univers.count;
              break;
            case UNIVERS.SERVICE.value.toUpperCase():
              invoice.serviceNbr = univers.count;
              break;    
            default:
              break;
          }
        });
      }
    });
  }

  satusLabel(): string {
    switch (this.invoiceSatus) {
      case this.invoiceSatusCST.TO_GET.key:        
        return this.invoiceSatusCST.TO_GET.label;
      case this.invoiceSatusCST.TO_CHECK.key:        
        return this.invoiceSatusCST.TO_CHECK.label;
      case this.invoiceSatusCST.TO_SEND.key:        
        return this.invoiceSatusCST.TO_SEND.label;  
    
      default:
        return '';
    }
  }

  setColumnRef(): void {
    if (this.invoiceSatus === this.invoiceSatusCST.TO_SEND.key) {
      this.columnDefs = [
        {
          headerName: 'membre',
          headerTooltip: 'membre',
          width: 220,
          field: 'customerName',
          valueGetter: params => getDefaultStringEmptyValue(params.data.customerName)
        },
        {
          headerName: '',
          headerTooltip: '',
          headerComponentParams: { template: '<span class="icon phone-mobile-grey"></span>' },
          width: 80,
          field: 'mobileNbr',
          sortable: false
        },
        {
          headerName: '',
          headerTooltip: '',
          field: 'internetNbr',
          headerComponentParams: { template: '<span class="icon sav-home-grey"></span>' },
          width: 80,
          sortable: false
        },
        {
          headerName: '',
          headerTooltip: '',
          field: 'serviceNbr',
          headerComponentParams: { template: '<span class="icon service"></span>' },
          width: 80,
          sortable: false
        },
        {
          headerName: '',
          headerTooltip: '',
          field: 'homeNbr',
          headerComponentParams: { template: '<span class="icon phone-home-grey"></span>' },
          width: 80,
          sortable: false
        }
      ];
    } else {
      this.columnDefs = [
        {
          headerName: 'membre',
          headerTooltip: 'membre',
          width: 220,
          field: 'customerName',
          valueGetter: params => getDefaultStringEmptyValue(params.data.customerName)
        },
        {
          headerName: '',
          headerTooltip: '',
          headerComponentParams: { template: '<span class="icon phone-mobile-grey"></span>' },
          width: 80,
          field: 'mobileNbr',
          sortable: false
        },
        {
          headerName: '',
          headerTooltip: '',
          field: 'internetNbr',
          headerComponentParams: { template: '<span class="icon sav-home-grey"></span>' },
          width: 80,
          sortable: false
        },
        {
          headerName: '',
          headerTooltip: '',
          field: 'serviceNbr',
          headerComponentParams: { template: '<span class="icon service"></span>' },
          width: 80,
          sortable: false
        },
        {
          headerName: '',
          headerTooltip: '',
          field: 'homeNbr',
          headerComponentParams: { template: '<span class="icon phone-home-grey"></span>' },
          width: 80,
          sortable: false
        },
        {
          headerName: '',
          headerTooltip: '',
          width: 90,
          cellRenderer: 'iconRenderer',
          cellRendererParams: {
            onClick: this.openConfirmationDialog.bind(this)
          },
          sortable: false
        }
      ];
    }
  }

}
