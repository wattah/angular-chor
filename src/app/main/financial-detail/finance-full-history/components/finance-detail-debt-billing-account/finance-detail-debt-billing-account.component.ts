import { FINANCE } from './../finance-constants';
import { BillDownloadService } from './../bill-download.service';
import { PenicheRefreshedAccountResponseVO } from './../../../../../_core/models/peniche-refreshe-account-response-vo';
import { HttpErrorResponse } from '@angular/common/http';
import { BillingService } from './../../../../../_core/services/billing.service';
import { HistoSolde50DVO } from './../../../../../_core/models/histo-solde50-vo';

import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FinanceFullHistoryService } from './../../finance-full-history.service';
import { CompteFacturation } from '../../../../../_core/models/compte-facturation-vo';
import { SelectedDebt } from '../../../../../_core/models/customer-totals-debt';
import { dateComparator } from '../../../../../_core/utils/date-utils';
import { getDefaultStringEmptyValue, isNullOrUndefined } from '../../../../../_core/utils/string-utils';
import { DateFormatPipeFrench } from '../../../../../_shared/pipes';

import { MouvementECVO } from '../../../../../_core/models/mouvementECVO';
import { CONTRAT_STATUTS,CSS_CLASS_NAME } from '../../../../../_core/constants/constants';
import { BillLivrableLightVO } from '../../../../../_core/models/models';
import { DocumentService } from '../../../../../_core/services/documents-service';
import { RedirectionService } from '../../../../../_core/services/redirection.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetailsDebtsBillingAccountService } from '../../../../../_core/services/details-debts-billing-account.service';
import { CheckboxRendrerComponent } from '../checkbox-rendrer/checkbox-rendrer.component';
import { ConfirmationDialogService } from '../../../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { formatterStatut } from '../../../../../_core/utils/formatter-utils';
import { InvoiceService } from '../../../../../_core/services/invoice.service';
import { MouvementPaginationCriteria } from '../../../../../_core/models/mouvement-pagination-criteria';
import { PaginatedList } from '../../../../../_core/models/paginated-list';


@Component({
  selector: 'app-finance-detail-debt-billing-account',
  templateUrl: './finance-detail-debt-billing-account.component.html',
  styleUrls: ['./finance-detail-debt-billing-account.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FinanceDetailDebtBillingAccountComponent implements OnInit {
  dateSolde = "08 avr.2020";

  @ Input()
  billingAccount: CompteFacturation;
  @ Input()
  copmteSansSolde : boolean;
  

  creationDate ='Créé le'  ;
  modificationDate ='Modifié le' ;
  separator = ' ';

  @Input()
  selectedDebt: SelectedDebt;
  showHistrq = false;
  test = false;
  remainingAmounts=false;
  creationOrModificationDate ="";

  @Input()
  withSolde;

  @Input()
  index;

  defaultSortModel;
  billAccounts : BillLivrableLightVO[];
  @Input()
  customerId: string;
  typeCustomer: string;
  state = false;
  contactListNumbers: MouvementECVO []= [];

  columnDefs;

  rowStyle = { cursor: 'context-menu'  };
  rowStyles = {cursor: 'context-menu' , background : '#f0f2f5' }
  rowData: HistoSolde50DVO[] = [];
  soldUpdate ='Mise à jour du solde';

  @Input()
  univers: string;
  UNIVERSE_MOBILE = 'MOBILE';
  REFRESH_DONE = 'Rafraichissement effectué';
  REFRESH_ERROR = 'Erreur technique de rafraichissement';
  DATE_PATTERN = 'dd MMM yyyy';
  frameworkComponents: any;
  datasource: any;
  paginationPageSize = 30;
  totalItems = 0;
  rowModelType;
  gridApi;
  gridColumnApi;
  gridParams;
  params: { force: boolean; suppressFlash: boolean; };
  totalSolde

  constructor(private readonly dateFormatPipeFrench: DateFormatPipeFrench,
    private readonly route: ActivatedRoute,
    private readonly documentService: DocumentService,
    private readonly detailDebtService: DetailsDebtsBillingAccountService,
    private readonly router:Router,
    readonly redirectionService: RedirectionService,
    private readonly _snackBar: MatSnackBar,
    private readonly  modalService: NgbModal,
    private readonly billingService: BillingService,
    private readonly financeFullHistoryService: FinanceFullHistoryService,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly billDownloadService: BillDownloadService,
    private readonly datePipe: DatePipe,
    private readonly invoiceService: InvoiceService
    ) {
      this.frameworkComponents = { 
        CheckboxRendrerComponent: CheckboxRendrerComponent
      };
    }
    
    

  ngOnInit(): void {
    this.defaultSortModel = [
      { colId: 'dateMouvement', sort: 'desc' }
    ];
    this.setColumnRef();
    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
    });
    this.route.queryParamMap.subscribe(params => {
      this.typeCustomer = params.get('typeCustomer');
    }); 

    this.redirectionService.getAgGridLoader().subscribe(
      (load)=>{
        if(load){
          this.params =  {
            force: true,
            suppressFlash: true,
          };
        }
      }
    );
    this.getDateMoficationOrCreation();
    this.initGrid();
  }

  getClassCompteZero(balance: Number): String {
    return (balance === 0) ? 'block block-grey' : 'block';
  }

  getNameForMobileAndService(isTitular: boolean): string {
    return this.financeFullHistoryService.getTitularOrPayerName(this.billingAccount, isTitular);
  }

  getPaymentMethod(account: CompteFacturation): String {
    let result = account.modeReglementLibelle;
    if(account.paymentMode === 'AMEX'){
      result = 'American Express';
    }
    let compteNumber;
    if(account.paymentMode != null){
      if((account.paymentMode === 'PRELEVEMENT') || (account.paymentMode === 'PRELEVEMENT_AMEX') || (account.paymentMode === 'PRELEVEMENT_CB')){
        if(account.bankCode!=null && account.officeName != null && account.bankAccountNumber != null && account.ribKey != null){
           compteNumber = account.bankCode.replace(/[0-9]/g, '*') + account.officeName.replace(/[0-9]/g, '*') + 
                              account.bankAccountNumber.substring(0, (account.bankAccountNumber.length - 4)).replace(/[0-9]/g, '*') + 
                              account.bankAccountNumber.substring((account.bankAccountNumber.length - 4), account.bankAccountNumber.length) + 
                              account.ribKey.replace(/[0-9]/g, '*');
        }
        result = account.modeReglementLibelle + (compteNumber != null ? ' sur le compte ' + compteNumber: '' );
      }
    }
    return result;
  }

  getTypeEnvoi(typeEnvoi: String): String {
    let result;
    if(typeEnvoi != null){
      if(typeEnvoi === 'MAIL'){
        result = 'Numérique, envoyée à:';
      } else if(typeEnvoi === 'PAPIER_AUTO') {
        result = 'Papier, envoyée automatiquement à:';
      } else if(typeEnvoi === 'MANUEL') {
        result = 'Papier, à envoyer manuellement à:';
      } else if(typeEnvoi === 'ANNULE'){
        result = 'Envoi de mail annulé.';
      }
    }
    return result;
  }

  getTypeEnvoiDestination(account: CompteFacturation): String {
    let result = '';
    if(account != null){
     if(account.allTypeEnvoi != null){
      if(account.allTypeEnvoi === 'MAIL'){
        result = account.mailNotification;
      } else if((account.allTypeEnvoi === 'PAPIER_AUTO') || (account.allTypeEnvoi === 'MANUEL')) {
        if(account.payerStreetNumber != null){
          result = account.payerStreetNumber.toString();
        }
        if(account.payerStreetType != null){
          result = result + ' '	+ account.payerStreetType;
        }
        if(account.payerStreetName != null){
          result = result + ' '	+ account.payerStreetName;
        }
        if(account.payerZipCode != null){
          result = result + ' '	+ account.payerZipCode;
        }
        if(account.payerCity != null){
          result = result + ' '	+ account.payerCity;
        }
      }
     }
    }
    return result;
  }

  getType(data): any {    
    if (!isNullOrUndefined(data)  ) {
      if(!isNullOrUndefined(data.labelMouvement) ){
        return getDefaultStringEmptyValue(data.labelMouvement);
      }
      else if (!isNullOrUndefined(data.methodPaiment)){
        return getDefaultStringEmptyValue(data.methodPaiment);
      }
      return '';
    }
  }

  getField(): any {
    if (this.selectedDebt.mobileSelected ) {
      return 'labelMouvement';
    }
    return 'methodPaiment';
  }

  setColumnRef(): void {	
    this.columnDefs = [
      {
        headerName: '',
        field: '',
        cellStyle: { 'margin-top': '2px' },
        minWidth: 45,
        maxWidth: 45,
        cellRendererSelector : params => {
          const checkedDwnld = {
            component : 'CheckboxRendrerComponent'
          };
          if(!isNullOrUndefined(params.data) && ((params.data.labelMouvement==='Facture') ||
          (params.data.methodPaiment==='FACTURE') || 
          (params.data.labelMouvement==='Avoir') ||
          (params.data.methodPaiment==='AVOIR'))){
            return checkedDwnld;
          }
          return null;
        }
      },



      {
        headerName: 'DATE DU',
        headerTooltip: 'DATE DU',
        field: 'dateMouvement',
        valueGetter: params => !isNullOrUndefined(params.data) ? this.dateFormatPipeFrench.transform(params.data.dateMouvement) : '',
        width: 130,
        sortable: false
      },
      {
        headerName: 'MOUVEMENT/FACTURE',
        headerTooltip: 'MOUVEMENT/FACTURE',
        field: 'numberMouvement',
        valueGetter: params => !isNullOrUndefined(params.data) ? getDefaultStringEmptyValue(params.data.numberMouvement) : '',
        cellClass: 'link',
        width: 160,
        sortable: false
      },
      {
        headerName: 'Type',
        headerTooltip: 'Type',
        field: this.getField(),
        valueGetter: params => this.getType(params.data),
        width: 130,
        sortable: false
      },
      {
        headerName: 'FACTURÉ',
        headerTooltip: 'FACTURÉ',
        field: 'initialAmountTTC',
        width: 100, 
        valueGetter: params => !isNullOrUndefined(params.data) ? this.formatPrice(params.data.initialAmountTTC) : '',
        cellClass: 'text-right',
        sortable: false
      },
      {
        headerName: 'PAYÉ',
        headerTooltip: 'PAYÉ',
        field: 'paye',
        valueGetter: params => !isNullOrUndefined(params.data) ? this.formatPrice(params.data.initialAmountTTC - params.data.remainingAmount) : '',
        width: 130,
        cellClass: 'text-right',
        sortable: false
      },
      {
        headerName: 'SOLDE',
        headerTooltip: 'SOLDE',
        field: 'remainingAmount',
        valueGetter: params => !isNullOrUndefined(params.data) ? this.formatPrice(params.data.remainingAmount) : '',
        width: 130,
        cellClass: 'text-right',
        sortable: false
      },
      {
        
        colId: 'download',
        headerName: '',
        cellRenderer: params => 
        !isNullOrUndefined(params.data) && (params.data.labelMouvement==='Facture' ||
         params.data.methodPaiment==='FACTURE' || 
         params.data.labelMouvement==='Avoir' ||
         params.data.methodPaiment==='AVOIR')
         ? `<span class='icon download clickable' ></span>`: '',
        width: 80,
        cellClass: 'text-center',
        sortable: false
      },
        {
        headerName: '',
        field:'paiement',
        cellRenderer: params => 
         (!isNullOrUndefined(this.billingAccount.universe)) &&
         (!isNullOrUndefined(params.data) && this.billingAccount.universe ==='SERVICE' && params.data.methodPaiment==='FACTURE' && params.data.remainingAmount !== 0) && 
         this.redirectionService.hasPermission('affichage_paiement_libre') ? 
         `<span class='icon paiement icon-marged clickable' ></span>`: 
         '',
         width: 60,
        cellClass: 'text-center',
        sortable: false
        
      }
    ];
  }

  onHideRow(): void {
    this.showHistrq = true;
    this.initGrid();
  }

  onShowRow(): void {
    this.showHistrq = false;
    this.initGrid();
  }

  formatterStatut(value: string): string {
    return formatterStatut(value);
  }

  clickCell(params: any ): void {
    const colId = params.column.colId;
    if ( colId === 'download') {
      
      this.downloadBill(params.data.factureFileName);
    } 
      if (params.column.colId === 'paiement' && this.redirectionService.hasPermission('affichage_paiement_libre')) { 
      const { numberMouvement, remainingAmount } = params.data ;
      this.router.navigate(
        ['/customer-dashboard', this.customerId, 'financial-detail', 'payment', this.billingAccount.identifier, { numberMouvement, remainingAmount } ],
        { queryParamsHandling: 'merge' }
      );    
    }
  }

  downloadBill(filename: string): void {
    this.documentService.downloadBill(filename);  
  }


  refrecheAccount(){
    if(this.billingAccount.universe === this.UNIVERSE_MOBILE){
      this.billingService.refreshSoldeAccountFacturation(Number(this.billingAccount.idCompteFacturation)).subscribe(
        (refreshedAccount: PenicheRefreshedAccountResponseVO)=>{
          this.billingAccount = refreshedAccount.items;
          this.openSnackBar(this.REFRESH_DONE);
        },
        (error: HttpErrorResponse)=>{
          this.openSnackBar(this.REFRESH_ERROR , true);
        }
      );
    }
  }

  insert(idCompteFacturation : string) {

    this.detailDebtService.getForcerRenvoi50D(idCompteFacturation,true).subscribe(
      data => {
        if(data){
        this.openSnackBar('Le compte de facturation sera renvoyé en création lors du prochain batch 50D');
        }
      },
      _error => {
        this.openSnackBar('Erreur technique de renvoi 50D', true);
      },
      () => {
      }
    );
  }

  update(idCompteFacturation: string ) {
    this.detailDebtService.getForcerRenvoi50D(idCompteFacturation,false).subscribe(
      compteFacturation => {
        if(compteFacturation){
      this.openSnackBar('Le compte de facturation sera renvoyé en modification lors du prochain batch 50D');
      }
    },
    _error => {
        this.openSnackBar('Erreur technique de renvoi 50D', true);
      },
      () => {
        
      }
    );      
  }

  openSnackBar( text: string , isErrorMsg = false) {
    const classError = (isErrorMsg) ? 'center-snackbar-red' : 'center-snackbar';
    this._snackBar.open(text, undefined, {
      duration: 3000,
      panelClass: [ classError, 'snack-bar-container']
    });
  }

  openPopup(content) {
    this.getAccountSoldHistory(content);
  }
  getAccountSoldHistory(content) {
    this.billingService.getAccountSoldHistory(this.billingAccount.identifier).subscribe(
      (data)=> {
        if(data && data.accountHistory && data.accountHistory.accountHistories){
          this.rowData = data.accountHistory.accountHistories
        }
      },
      (error)=> console.error(error),
      ()=>{
        this.modalService.open(content,{ centered: true, 
          windowClass: 'popup_solde',
          size: 'lg', backdrop : 'static', keyboard: false
          });
      }
    );
  }
  
  columnDefshstrqSold = [
    {
      headerName: 'Date', 
      headerTooltip: 'date', 
      field: 'dateSolde',
      valueGetter: params => 
          params.data.dateSolde ?
         `${this.dateFormatPipeFrench.transform(params.data.dateSolde, 'dd MMM yyyy')}`: '-',
      minWidth:120,
      maxWidth:120,
      headerClass: 'borderRight',
      cellStyle: { 'border-right': '1px solid #dadada !important' },
      cellClass: CSS_CLASS_NAME.TEXT_CENTER,
 
    },
    {
      headerName: 'Montant solde (€/TTC)', 
      headerTooltip: 'montant',
      field: 'montantSolde',
      cellClass: CSS_CLASS_NAME.TEXT_CENTER,
      minWidth:130,
      maxWidth:130,
    },
  ];

  getDateMoficationOrCreation() : string {
 
    if ( this.selectedDebt.mobileSelected ) {
     this.creationOrModificationDate = `${this.soldUpdate} le ${this.dateFormatPipeFrench.transform(this.billingAccount.dateMaj, this.DATE_PATTERN)}`;
    }else{
      this.creationOrModificationDate = this.billingAccount.dateMaj === this.billingAccount.dateCreation ?
       this.creationDate + this.separator + this.dateFormatPipeFrench.transform(this.billingAccount.dateCreation, this.DATE_PATTERN) :
      this.modificationDate + this.separator + this.dateFormatPipeFrench.transform(this.billingAccount.dateMaj, this.DATE_PATTERN)
    }
  return this.creationOrModificationDate;
  }

   formatPrice(unitePriceTTC : number) : string{
    let unitePriceTTCResult = unitePriceTTC.toString();
    if(unitePriceTTC){
      const unitePriceTTCTab = unitePriceTTC.toString().split(".");
    if(unitePriceTTCTab && unitePriceTTCTab.length > 1){
      const unitePriceAfterComma = unitePriceTTCTab[1].substring(0,2);
      const unitePriceFormat = unitePriceTTCTab[0] + "." + unitePriceAfterComma;
     unitePriceTTCResult = unitePriceFormat ? unitePriceFormat : "0";
    } 
    }
    return unitePriceTTCResult; 
  }

  /**
   * main method to trigger mass download: ATHENA 4277
   * @author YFA
   */
  massDownload(): any {
    if(!this.billDownloadService.files || this.billDownloadService.files.length === 0){
      this.openMassDownLoadPopup(FINANCE.SELECT_FILE);
    }else{
      this.billingService.downloadBillAsZip(this.billDownloadService.files.join(FINANCE.JOIN_DELIMETOR)).subscribe(
        (data)=>this.saveZip(data),
        (error)=> this.openMassDownLoadPopup(FINANCE.FILE_NOT_FOUND),
        ()=>{}
      );
    }
  }

  private saveZip(data: any) {
    const blob = new Blob([data.body], {
      type: FINANCE.MEDIA_TYPE
    });
    saveAs(blob, this.formatFileName());
  }

  private formatFileName(): any {
    return `${FINANCE.FILE_NAME}${this.datePipe.transform(new Date(), FINANCE.DATE_PATTERN)}`;
  }

  private openMassDownLoadPopup(comment: string) {
    this.confirmationDialogService.confirm(FINANCE.TITLE, comment, FINANCE.BTN_OK_TEXT, null, FINANCE.SIZE, false)
      .then((confirmed) => {})
      .catch(() => {});
  }

getAllList(): string {
  if(!isNullOrUndefined(this.billingAccount.mouvementsCf) &&
    this.billingAccount.mouvementsCf.length > 9) {
       return 'download-btn';
    }
    return '';
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
          const mc = this.buildMouvementsCriteria(params.request);
          this.invoiceService.getMouvementsByBillAccount(mc).subscribe(
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
  buildMouvementsCriteria(params): MouvementPaginationCriteria {
        return {
         page:  params && params.startRow > 0 ? params.startRow / this.paginationPageSize : 0,
         pageSize: this.paginationPageSize,
         sortfield : params && params.sortModel && params.sortModel.length > 0 ? params.sortModel[0].colId : '',
         sortOrder : params && params.sortModel && params.sortModel.length > 0 ? params.sortModel[0].sort : '',
         withoutSoldeZero : this.showHistrq,
         univers: this.univers,
         numberBillAccount: this.billingAccount.identifier
      };
    }

  private addArrowsToItems(data: PaginatedList<MouvementECVO>) {
      if (data && data.items) {
        data.items.forEach((item) => item.arrow = '');
      }
    }
}




