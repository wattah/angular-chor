import { Component, OnInit,Input,ViewEncapsulation } from '@angular/core';

import { FinanceFullHistoryService } from './../../finance-full-history.service';
import { SelectedDebt } from '../../../../../_core/models/customer-totals-debt';
import { CompteFacturation } from '../../../../../_core/models/compte-facturation-vo';
import { isNullOrUndefined } from '../../../../../_core/utils/string-utils';
import { ActivatedRoute } from '@angular/router';
import { DateFormatPipeFrench } from '../../../../../_shared/pipes';
import { dateComparator } from '../../../../../_core/utils/date-utils';
import { DocumentService } from '../../../../../_core/services/documents-service';
import { getDefaultStringEmptyValue } from './../../../../../_core/utils/string-utils';
import { InvoiceService } from './../../../../../_core/services/invoice.service';
import { FacturePaginationCriteria } from './../../../../../_core/models/factures-pagination-criteria';
import { PaginatedList } from './../../../../../_core/models/paginated-list';
import { InvoiceVO } from './../../../../../_core/models/invoice-vo';

@Component({
  selector: 'app-billing-account',
  templateUrl: './billing-account.component.html',
  styleUrls: ['./billing-account.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BillingAccountComponent implements OnInit {

  @ Input()
  billingAccount: CompteFacturation;

  @Input() univers: string;

  @Input() graybackground;

  @Input()
  selectedDebt: SelectedDebt;

  paymentMethod: string;
  controleSystem: string;
  typeEnvoi: string;
  typeDest: string;
  customerId: string;
  typeCustomer: string;
  defaultSortModel = [];
  columnDefs = [];
  datasource: any;
  paginationPageSize = 30;
  totalItems = 0;
  rowModelType;
  gridApi;
  gridColumnApi;
  gridParams;
  params: { force: boolean; suppressFlash: boolean; };
  rowStyle = { cursor: 'context-menu'  };


  constructor(private readonly route: ActivatedRoute,
    private readonly dateFormatPipeFrench: DateFormatPipeFrench,
    private readonly documentService: DocumentService, 
    readonly financeFullHistoryService: FinanceFullHistoryService,
    private readonly invoiceService: InvoiceService) { }


  ngOnInit() {
    this.getControleSystem(this.billingAccount);
    this.getPaymentMethod(this.billingAccount);
    this.getTypeEnvoi(this.billingAccount.allTypeEnvoi);
    this.getTypeEnvoiDestination(this.billingAccount);
    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
    });
    this.route.queryParamMap.subscribe(params => {
      this.typeCustomer = params.get('typeCustomer');
    });
    this.defaultSortModel = [
      { colId: 'dateEmission', sort: 'desc' }
    ];
    this.setColumnRef();
    this.initGrid();
  }
  

  getControleSystem(billingAccount) : void {
    if(billingAccount.controlCF) {
      this.controleSystem = ` Oui, ${this.getJustif(billingAccount.justificationControle)}`
    } else {
      this.controleSystem = 'Non';
    }
  }

  getJustif(justif): string {
    return justif ? justif.substring(0,10) : '-';
  }

getTypeEnvoi(typeEnvoi: string): void {
    let envoi;
    if(typeEnvoi != null){
      if(typeEnvoi === 'MAIL'){
        envoi = 'Numérique, envoyée à:';
      } else if(typeEnvoi === 'PAPIER_AUTO') {
        envoi = 'Papier, envoyée automatiquement à:';
      } else if(typeEnvoi === 'MANUEL') {
        envoi = 'Papier, à envoyer manuellement à:';
      } else if(typeEnvoi === 'ANNULE'){
        envoi = 'Envoi de mail annulé.';
      }
    }
    this.typeEnvoi = envoi;
  }

  getTypeEnvoiDestination(account: CompteFacturation): void {
    let result = '';
    if(account != null && account.allTypeEnvoi !== null){
      result = this.getTypeDestinataire(account);
    }
    this.typeDest =  result;
  }

  getTypeDestinataire(account): string {
    let type = '';
    if(account.allTypeEnvoi === 'MAIL'){
      type = account.mailNotification;
    } else if((account.allTypeEnvoi === 'PAPIER_AUTO') || (account.allTypeEnvoi === 'MANUEL')) {
      if(account.payerStreetNumber != null){
        type = account.payerStreetNumber.toString();
      }
      if(account.payerStreetType != null){
        type = `${type} ${account.payerStreetType}`;
      }
      if(account.payerStreetName != null){
        type = `${type} ${account.payerStreetName}`;
      }
      if(account.payerZipCode != null){
        type = `${type} ${account.payerZipCode}`;
      }
      if(account.payerCity != null){
        type = `${type} ${account.payerCity}`;
      }
   }
   return type;
  }

  setColumnRef(): void {
      this.columnDefs = [
        {
          headerName: 'DATE DU',
          headerTooltip: 'DATE DU',
          field: 'issueDate',
          colId: 'dateEmission',
          comparator: dateComparator,
          valueGetter: params => this.dateFormatPipeFrench.transform(params.data.issueDate),
          sortable: false
        },
        {
          headerName: 'MOUVEMENT/FACTURE',
          headerTooltip: 'MOUVEMENT/FACTURE',
          field: 'invoiceNumber',
          valueGetter: params => getDefaultStringEmptyValue(params.data.invoiceNumber),
          cellClass: 'link',
          sortable: false
        },
        {
          headerName: 'Type',
          headerTooltip: 'Type',
          valueGetter: params => (!isNullOrUndefined(params.data.invoiceNumber)) ? 'Facture' : '',
          sortable: false
        },
        {
          
          colId: 'download',
          headerName: '',
          cellRenderer: params => (params.data !== null)  ? `<span class='icon download clickable' ></span>`: '',
          cellClass: 'text-center',
          sortable: false
        }
          
      ];
    }

  getNameForInternet(isTitular: boolean): string {
    return this.financeFullHistoryService.getTitularOrPayerName(this.billingAccount, isTitular);
  }

  getPaymentMethod(account: CompteFacturation): void {
    let result = account.modeReglementLibelle;
    if(account.paymentMode === 'AMEX'){
      result = 'American Express';
    }
    let compteNumber;
    if(account.paymentMode !== null && ((account.paymentMode === 'PRELEVEMENT') ||
      (account.paymentMode === 'PRELEVEMENT_AMEX') ||
      (account.paymentMode === 'PRELEVEMENT_CB'))){
        if(account.bankCode!=null && account.officeName != null && account.bankAccountNumber != null && account.ribKey != null){
           compteNumber = account.bankCode.replace(/[0-9]/g, '*') + account.officeName.replace(/[0-9]/g, '*') +
                              account.bankAccountNumber.substring(0, (account.bankAccountNumber.length - 4)).replace(/[0-9]/g, '*') +
                              account.bankAccountNumber.substring((account.bankAccountNumber.length - 4), account.bankAccountNumber.length) +
                              account.ribKey.replace(/[0-9]/g, '*');
        }
        result = `${account.modeReglementLibelle} ${this.getCompteNumber(compteNumber)}`;
    }
    this.paymentMethod = result;
  }

  getCompteNumber(compteNumber) : string {
    return !isNullOrUndefined(compteNumber) ? `sur le compte ${compteNumber}` : '';
  }

  downloadBill(filename: string): void {
    this.documentService.downloadBill(filename);  
  }

  clickCell(params : any ): void {
    const colId = params.column.colId;
    if ( colId === 'download') {
      this.downloadBill(params.data.invoiceFileName);
    }
  }


  /**
 * init ag grid server side 
 */
 initGrid(): void {
  this.createServerSideDatasource(null);
}
  createServerSideDatasource(_event: any): void {
    this.totalItems = 0;
    this.datasource = {
      getRows: (params) => {
          const fc = this.buildFactureCriteria(params.request);
          this.invoiceService.getFacturesByBillAccount(fc).subscribe(
            data => {
              this.totalItems = data.total;
              this.addArrowsToItems(data);
              setTimeout(() => {
                params.success({ rowData: data.items, rowCount: data.total });
                this.params = { force: true, suppressFlash: true};
              }, 100);
            },
            _error => {
              params.fail();
            }
          )
       }
    };    
  }
  buildFactureCriteria(params): FacturePaginationCriteria {
        return {
         pageNumber:  params && params.startRow > 0 ? params.startRow / this.paginationPageSize : 0,
         pageSize: this.paginationPageSize,
         univers: this.univers,
         sortField : params && params.sortModel && params.sortModel.length > 0 ? params.sortModel[0].colId : '',
         sortOrder : params && params.sortModel && params.sortModel.length > 0 ? params.sortModel[0].sort : '',
         billAccount: this.billingAccount.identifier
      };
    }

  private addArrowsToItems(data: PaginatedList<InvoiceVO>) {
      if (data && data.items) {
        data.items.forEach((item) => item.arrow = '');
      }
    }
}
