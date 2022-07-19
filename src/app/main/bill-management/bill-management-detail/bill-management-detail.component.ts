import { BillManagementService } from './bill-management.service';
import { ParametrizePopupService } from './parametrize-popup.service';
import { CUSTOMER_DASHBOARD, ABSENTE, UPLOADEE, GENEREE_SANS_ERREURS,
  GENEREE_AVEC_WARNINGS, GENEREE_AVEC_ERREURS, RELOOKEE_MANUELLEMENT,
  A_VERIFIER, CORRECTION_VALIDEE, A_CORRIGER, VERIFIEE, ARCHIVEE,
  DATE_PATTERN, RELOOKING, DELETE_COL_ID, DELETE_TASK, DELETE_MESSAGE,
  PAIEMENT_COL_ID, DELETE_PAIEMENT, PAIEMENT_NOT_COMPLETION_MESSAGE,
  PAIEMENT_MESSAGE, PAIEMENT_COMPLETION_MESSAGE, PAIEMENT_TASK, ERROR_TASK,
  PICTO_TACHE_CLOSE_HORS_D_LAIS, PICTO_TACHE_ASSIGN_DANS_D_LAIS, PICTO_PDF,
  SEPARATOR_TO_JOIN_MESSAGES, UNIVERS_SERVICE, OUI, SIZE, NON,
  SNACK_BAR_SUCCESS_CLASS_NAME, SNACK_BAR_CONTAINER_SUCCESS_CLASS_NAME,
  RELOOKING_WITHOUT_BILL_MESSAGE, SUCCESS_RELOOKING_CLASS_NAME,
  SECONDES, BILL_MESSAGE, ARCHIVAGE_WITHOUT_BILL_MESSAGE,
  NON_I_DONT_WANT_TO_CONSERVE, YES_DELETE, DOWLOAD_COL_ID,
  PARAMETRIZE_COL_ID } from '../../../_core/constants/bill-constant';
import { HttpErrorResponse } from '@angular/common/http';

import { PenicheRelookingResponseVO } from './../../../_core/models/peniche-relooking-response-vo';
import { LivrableVO } from './../../../_core/models/livrable-vo';
import { ConfirmationDialogService } from './../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { RelookingLivrablesHolder } from './../relooking-livrables-holder.service';
import { ValidateLivrableService } from './../validate-livrable.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { Moment } from 'moment-business-days';
import { ActivatedRoute, Router } from '@angular/router';
import { BillManagementDetailCellRendererComponent } from '../bill-management-detail-cell-renderer/bill-management-detail-cell-renderer.component';
import { CheckboxRendrerComponent } from '../checkbox-rendrer/checkbox-rendrer.component';
import { STATUT_LIVRABLE, SousEtatLivrable as UNDER_STATUS_LIVRABLE,
         STATUS_ICONE_CLASS, SOUS_ETAT_ICONE_CLASS, 
         TYPE_BIll } from './../../../_core/constants/constants';
import { PenicheClientLivrablesResponseVO } from './../../../_core/models/peniche-client-livrables-response-vo';
import { DatePipe } from '@angular/common';
import { BillingService } from './../../../_core/services/billing.service';
import { RelookingManuelleService } from './relooking-manuelle.service';
import { UploadBillClientService } from './upload-bill-client.service';

import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { CustomerService } from '../../../_core/services';
import { CustomerView } from '../../../_core/models/customer-view';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { isEmpty } from '../../../_core/utils/array-utils';
import { checkAddAvoir, checkBlueCard, checkValidateToDeleteOrDownloadOrRelooking, 
  checkValidateToPadlock, checkValidateToParameters } from '../../../_core/utils/bills-utils';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../_core/services/notification.service';

export const dateFormat = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',

  },
};
@Component({
  selector: 'app-bill-management-detail',
  templateUrl: './bill-management-detail.component.html',
  styleUrls: ['./bill-management-detail.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: dateFormat },
  ],
})

export class BillManagementDetailComponent implements OnInit , OnDestroy {
  date = new FormControl(moment());
  updateString: string = null;
  detailCellRenderer: any;
  customerId: any;
  params: any;
  valuesState = [
    { id: 1, viewValue: ABSENTE },
    { id: 2, viewValue: UPLOADEE },
    { id: 3, viewValue: GENEREE_SANS_ERREURS },
    { id: 4, viewValue: GENEREE_AVEC_WARNINGS },
    { id: 5, viewValue: GENEREE_AVEC_ERREURS },
    { id: 6, viewValue: RELOOKEE_MANUELLEMENT }
  ];
  rowData: any[] = []
  valuesStatut = [
    { id: 1, viewValue: A_VERIFIER },
    { id: 2, viewValue: CORRECTION_VALIDEE },
    { id: 3, viewValue: A_CORRIGER },
    { id: 4, viewValue: VERIFIEE },
    { id: 5, viewValue: ARCHIVEE },
  ];
  selectedState: any[];
  selectedStatut: any[];
  getRowHeight: any;
  currentDate=new Date();
  searshDate: string;
  inclureLivrableAbsent = true;
  mappedEtat: string[];
  mappedStatus: string[];
  frameworkComponents: Object;
  messages = '<span class="message-info">infos...<span>';

  customer: CustomerView;
  loading = false;
  billsToUploadList: File[] = [];
  SEPARATOR_TO_JOIN_MESSAGES = ' ';
  subscription: Subscription;

  indexOfNewBillCredit : number;
  newBillCredit : LivrableVO;

  constructor(private readonly router: Router,
              private readonly route: ActivatedRoute,
              private readonly billingService: BillingService,
              private readonly datePipe: DatePipe,
              private readonly validateLivrableService: ValidateLivrableService,
              private readonly relookingLivrablesHolder: RelookingLivrablesHolder,
              private readonly confirmationDialogService: ConfirmationDialogService,
              private readonly relookingManuelleService : RelookingManuelleService,
              private readonly _snackBar: MatSnackBar,
              private readonly activeModal: NgbActiveModal,
              private readonly uploadBillClientService: UploadBillClientService,
              private readonly customerService: CustomerService,
              private readonly billManagementService: BillManagementService,
              private readonly notificationService: NotificationService) {
    this.detailCellRenderer = 'detailCellRenderer';
    this.frameworkComponents = {
      CheckboxRendrerComponent: CheckboxRendrerComponent,
      detailCellRenderer: BillManagementDetailCellRendererComponent
    };
  };

  ngOnInit() {
    this .route.parent.paramMap.subscribe(params => {
      this.customerId=params.get('customerId');
    });
    this.calculateRowHeightOfMasterDetail();
    this.selectedState = this.valuesState;
    this.selectedStatut = this.valuesStatut;
    this.initDate();
    this.getClientLivrable();
    this.watchDate();

    this.customerService.getCustomer(this.customerId).subscribe((response) => {
      this.customer = response;
    });
    this.relookingManuelleService.getLivrableResult().subscribe(livrableResult => {
      if(livrableResult != null){
        this.rowData.forEach((livrable, index)  => {
          if(livrable.livrableId != null && (livrable.livrableId.toString() === '0'  || livrable.livrableId ===livrableResult.livrableId )){
            this.rowData.splice(index,1);
          }
        });
        this.rowData.push(livrableResult);
        this.rowData = this.rowData.slice();
        this.rowData.forEach(item=> {
          item.arrow = '';
          item.download = '';
        });
      }
    });

    if(!isNullOrUndefined(this.notificationService.getPenicheBillCreditComplementaryVo())){
      this.searshDate = this.datePipe.transform(this.notificationService.getPenicheBillCreditComplementaryVo().transmitDate , DATE_PATTERN);
      this.getClientLivrable();
      this.date.setValue(moment(this.notificationService.getPenicheBillCreditComplementaryVo().transmitDate));
    }
  }

  initDate() {
      this.searshDate = this.datePipe.transform(this.currentDate , DATE_PATTERN);
  }

  watchDate() {
    this.date.valueChanges.subscribe(
        (date: Moment)=> {
          this.searshDate = this.datePipe.transform(date , DATE_PATTERN);
        }
    );
  }

  getClientLivrable() {
    const nicheIdentifier: string = sessionStorage.getItem('nicheIdentifier');
    this.billingService.getClientLivrablesBy(
        nicheIdentifier.replace(/\s/g , ''),
        this.searshDate,
        this.inclureLivrableAbsent
      ).subscribe(
        (data: PenicheClientLivrablesResponseVO)=>{
          if(data && data.livrableClient && data.livrableClient.livrables){
            if(!isNullOrUndefined(this.notificationService.getPenicheBillCreditComplementaryVo())){
              this.indexOfNewBillCredit = data.livrableClient.livrables.findIndex(livrable => livrable.numero === this.notificationService.getPenicheBillCreditComplementaryVo().billNumber);
              if(this.indexOfNewBillCredit !== -1){
                    this.newBillCredit = data.livrableClient.livrables.splice(this.indexOfNewBillCredit,1)[0];
                    data.livrableClient.livrables.splice(0,0,this.newBillCredit);
              }
            }
 
            this.rowData = data.livrableClient.livrables;
            this.rowData.forEach(item=> {
              item.arrow = '';
              item.download = '';
            });
            this.onMappeStatusAndLivrableStatus();
            this.rowData = this.rowData.filter(item=>this.filterByEtatAndStatus(item));
          }else{
            this.rowData = [];
          }
          this.relookingLivrablesHolder.toRelookingLivrables = [];
          this.validateLivrableService.toRelookingLivrables = [];
         },
        (error)=>console.log(error),
        ()=>this.initAfterRelooking()
    );
  }

   

  columnDefs = [
    {
      headerName: ' ',
      headerTooltip: 'arrow',
      cellRenderer: 'agGroupCellRenderer',
      field: 'arrow',
      minWidth: 35,
      maxWidth: 35,
    },
    {
      headerName: '',
      field: '',
      cellStyle: { 'margin-top': '2px' },
      minWidth: 45,
      maxWidth: 45,
      cellRenderer: 'CheckboxRendrerComponent',
    },

    {
      headerName: 'Nom',
      field: 'label',
      cellClass: 'whitespace',
      minWidth: 270,
      maxWidth: 270,
      cellRenderer: (params)=> {
        return `${this.createSpanElement(this.getPdfIcon(params))} ${params.data.label}`
      },
    },

    {
      headerName: 'Compte de facturation',
      field: 'billAccountIdentifier',
      minWidth: 215,
      maxWidth: 215,
      cellStyle: { 'white-space': 'normal' },
      headerClass: 'non',
      cellClass: 'whitespace',
    },

    {
      headerName: 'Etat',
      field: 'etat',
      cellClass: 'ml-1',
      cellRenderer: (params) => this.createSpanElement(this.getStatusIcon(params)),
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: 'Statut',
      headerTooltip: '',
      cellClass: 'ml-2',
      field: 'statut',
      cellRenderer: (params) => this.createSpanElement(this.getIconColorBySousStatus(params)),
      minWidth: 330,
    },
    {
      headerName: '',
      headerTooltip: '',
      field: DOWLOAD_COL_ID,
      colId: DOWLOAD_COL_ID,
      cellRenderer: params => {
        return checkValidateToDeleteOrDownloadOrRelooking(params, false) ? this.createSpanElement(DOWLOAD_COL_ID):'';
      },
      minWidth: 40,
      maxWidth: 40,
    },

    {
      headerName: '',
      headerTooltip: '',
      colId: 'add',
      field: 'add',
      cellRenderer: params => {
        return checkAddAvoir(params) ? this.createSpanElement('add-on') : '';
      },
      minWidth: 40,
      maxWidth: 40,
    },

    {
      headerName: '',
      colId: RELOOKING, 
      field: RELOOKING,
      cellRenderer: params => {
        return checkValidateToDeleteOrDownloadOrRelooking(params, true) ? this.createSpanElement('etat-relooking') : '';
      },
      minWidth: 40,
      maxWidth: 40,

    },
    {
      headerName: '',
      field: 'cadenas',
      cellRenderer: params => {
        return checkValidateToPadlock(params) ? this.createSpanElement('cadenas') : '';
      },
      cellClass: 'no-cursor',
      minWidth: 40,
      maxWidth: 40,


    },
    {
      headerName: '',
      field: DELETE_COL_ID,
      colId: DELETE_COL_ID,
      cellRenderer: params => {
        return checkValidateToDeleteOrDownloadOrRelooking(params, true) ? this.createSpanElement('del') : '';
      },
      minWidth: 40,
      maxWidth: 40,
    },
    {
      headerName: '',
      field: PARAMETRIZE_COL_ID,
      cellRenderer: params => {
        return checkValidateToParameters(params) ? this.createSpanElement(PARAMETRIZE_COL_ID) : '';
      },
      minWidth: 40,
      maxWidth: 40,
    },
    {
      headerName: '',
      field: PAIEMENT_COL_ID,
      colId: PAIEMENT_COL_ID,
      cellRenderer: params => {
        return checkBlueCard(params) ? this.createSpanElement('paiement'): '';
      },
      minWidth: 40,
      maxWidth: 40,
    },
  ];

  private createSpanElement(className: string) {
    return `<span class="icon ${className}"></span>`;
  }

  private filterByEtatAndStatus(item: any): boolean {
    return this.mappedEtat.includes(item.livrableStatus) && this.mappedStatus.includes(item.status);
  }
    

  selectState() {
    this.selectedState = this.valuesState
  }
  deselectState() {
    this.selectedState = [];
  }

  selectStatut() {
    this.selectedStatut = this.valuesStatut
  }
  deselectStatut() {
    this.selectedStatut = [];
  }

  updateEtat() {
    this.updateString = this.selectedState.map(element => element.viewValue).join(", ");
    return this.updateString;
  }
  updateStatut() {
    this.updateString = this.selectedStatut.map(element => element.viewValue).join(", ");
    return this.updateString;
  }

  calculateRowHeightOfMasterDetail(): void {
    this.getRowHeight = (params) => {
      if (params.node && params.node.level === 0) {
        const offset = 14;
        const lignes = params.data.label.split(/\r\n|\r|\n/);
        let allDetailRowHeight = lignes.length;

        lignes.forEach((ligne: string) => {
          const snb = ligne.length / 60;
          if (snb > 1) {
            allDetailRowHeight += snb - 1;
          }
        });
        return allDetailRowHeight * 20 + offset;
      }
      return null;
    };
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }
  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  clickCell(event: any): void {

    if (event.column.colId === 'add' && checkAddAvoir(event)) {
      this.router.navigate(
        [CUSTOMER_DASHBOARD, this.customerId, 'bill-management', 'add-credit'],
        {
          queryParams: { billAccountIdentifier: event.data.billAccountIdentifier,
            date : event.data.date, clientIdentifier : event.data.clientIdentifier,
           paymentMethod : event.data.paymentMethod,
            referenceBillNumber : event.data.numero },
          queryParamsHandling: 'merge'
        }
      );
    }
    if (event.column.colId === RELOOKING && checkValidateToDeleteOrDownloadOrRelooking(event, true)) {
      const result = this.relookingManuelleService.popUpRelookingConfirmation(event.data);
    }
    this.markBillPaid(event);
    this.deleteBill(event);
    this.parametrize(event);
    this.download(event);
  }

  /**
   * ATHENA-3758
   * main method to trigger download treatement
   * @param event 
   */
  download(event: any) {
    this.billManagementService.download(event);
  }

  /**
   * ATHENA-3758
   * main method to trigger parametrize treatement
   * @param event 
   */
  parametrize(event: any) {
    this.billManagementService.rowData = this.rowData;
    this.billManagementService.parametrize(event);
    this.subscription = this.billManagementService.finishRowDataUpdate$.subscribe(
      (finish)=>{
        if(finish){
          this.rowData = this.billManagementService.rowData;
        }
    });
  }
  
  /**
   * ATHENA-3954
   * main method to trigger delete traitement
   * @param event 
   */
  deleteBill(event: any) {
    if(event.column.colId === DELETE_COL_ID && checkValidateToDeleteOrDownloadOrRelooking(event, true)){
      this.openPopUpForTaskOnLivrable(DELETE_TASK , this.getDeletingMessage(event.data.label) , true , NON_I_DONT_WANT_TO_CONSERVE , YES_DELETE).then(
        (chose)=>{
          if(chose){
            this.billingService.deleteBill(event.data).subscribe(
              (responseAfterDeleting)=> {
                this.rowData = this.rowData.map((livrable: LivrableVO)=>{
                  if(responseAfterDeleting.items && livrable.label === responseAfterDeleting.items.label && livrable.numero === responseAfterDeleting.items.numero){
                    livrable.livrableStatus = STATUT_LIVRABLE.ORIGINAL_ABSENT
                    livrable.arrow = '';
                  }
                  return livrable;
                });
              });
          }
        }
      );
    }
  }
  getDeletingMessage(label: string): string {
    const labelWithoutCF = label.substring(0,21);
    return `${DELETE_MESSAGE} <br /> &laquo; ${labelWithoutCF} &raquo; ?`;
  }

  /**
   * ATHENA-3954
   * main method for trigger the paiement traitement
   * @author YFA
   * @param event 
   */
  markBillPaid(event: any): void {
    if (event.column.colId === PAIEMENT_COL_ID && checkBlueCard(event)) {
      const livrableToBePaid: LivrableVO = event.data;
      if(livrableToBePaid.dejaPayee){
        this.afterPopupChose(
          livrableToBePaid,
          false,
          DELETE_PAIEMENT,
          PAIEMENT_NOT_COMPLETION_MESSAGE
        );
      }else{
        this.afterPopupChose(
          livrableToBePaid,
          true,
          PAIEMENT_MESSAGE,
          PAIEMENT_COMPLETION_MESSAGE
        );
      }
    }
  }

  /**
   * to trigger the popup mechanism 'oui/non'
   * @author YFA
   * @param livrableToBePaid 
   * @param gardPaiment 
   * @param message 
   * @param paiementCompletionMessage 
   */
  private afterPopupChose(livrableToBePaid: LivrableVO , gardPaiment: boolean = true , message: string , paiementCompletionMessage: string): void {
    this.openPopUpForTaskOnLivrable(PAIEMENT_TASK, message, true)
      .then((chose) => {
        if (chose) {
          this.paiement(
            livrableToBePaid,
            gardPaiment,
            paiementCompletionMessage
          );
        }
      });
  }

  /**
   * to handel user chose 
   * @param livrableToBePaid 
   * @param gardPaiment 
   * @param paiementCompletionMessage 
   */
  private paiement(livrableToBePaid: LivrableVO , gardPaiment = true , paiementCompletionMessage: string): void {
    livrableToBePaid.dejaPayee = gardPaiment;
    this.billingService.markBillAsPaid(livrableToBePaid).subscribe(
      (paidLivrable: PenicheRelookingResponseVO) => this.replaceOldLivrable(paidLivrable),
      (error: HttpErrorResponse) => this.openPopUpForTaskOnLivrable(ERROR_TASK, error.message, false),
      () => this.openSnackBar(paiementCompletionMessage)
    );
  }

  /**
   * to replace old livrable by the new one
   * @param paidLivrable 
   */
  replaceOldLivrable(paidLivrable: PenicheRelookingResponseVO): void {
    this.rowData.forEach(
      (livrable:LivrableVO)=> {
        if(livrable.label === paidLivrable.items.label && livrable.numero === paidLivrable.items.numero){
          livrable=paidLivrable.items;
        }
    });
    this.rowData = this.rowData.slice();
  }

  getPdfIcon(params): string{
    const livrableStatus = params.data.livrableStatus
    const dejaPayee = params.data.dejaPayee
    if (livrableStatus == STATUT_LIVRABLE.ORIGINAL_ABSENT || livrableStatus == STATUT_LIVRABLE.GENERABLE_COMPLET || livrableStatus == STATUT_LIVRABLE.GENERABLE_PARTIEL || livrableStatus == STATUT_LIVRABLE.NON_GENERABLE) {
      return PICTO_TACHE_CLOSE_HORS_D_LAIS;
    } else if (dejaPayee) {
      return PICTO_TACHE_ASSIGN_DANS_D_LAIS;
    } else {
      return PICTO_PDF;
    }
  }

  getStatusIcon(params) : string {
    const livrableStatus = params.data.livrableStatus
    if (livrableStatus) {
      switch (livrableStatus) {
        case STATUT_LIVRABLE.ORIGINAL_ABSENT:
        case STATUT_LIVRABLE.ORIGINAL_PRESENT:
          return  STATUS_ICONE_CLASS.ETAT_RED;
        case STATUT_LIVRABLE.DONNEES_STOCKEES:
          return STATUS_ICONE_CLASS.ETAT_GREEN;
        case STATUT_LIVRABLE.GENERE:
          return STATUS_ICONE_CLASS.STATUS_RENEWAL_DONE;
        case STATUT_LIVRABLE.GENERE_ERREUR:
          return STATUS_ICONE_CLASS.PICTO_EXCLAMATION_ROUGE;
        case STATUT_LIVRABLE.GENERE_WARNING:
          return STATUS_ICONE_CLASS.PICTO_EXCLAMATION_ORANGE;
        case STATUT_LIVRABLE.FICHIER_RELOOKE_MANUELLEMENT:
          return STATUS_ICONE_CLASS.ETAT_RELOOKING;
        default:
          return STATUS_ICONE_CLASS.ETAT_RED;
        }
    } else {
        return null;
    }
  }
    
  getIconColorBySousStatus(params){
    const status = params.data.status;
      if(status){
        switch(status){
          case UNDER_STATUS_LIVRABLE.FOND_A_VALIDER_METIER:
          case UNDER_STATUS_LIVRABLE.FORME_A_VALIDER_METIER:
            return SOUS_ETAT_ICONE_CLASS.ROUND_BLUE;
          case UNDER_STATUS_LIVRABLE.FORME_INVALIDE_METIER_CORRIGE:
            return SOUS_ETAT_ICONE_CLASS.ROUND_ORANGE;
          case UNDER_STATUS_LIVRABLE.FOND_INVALIDE_METIER_ATTENTE_CORRECTION:
          case UNDER_STATUS_LIVRABLE.FORME_INVALIDE_METIER_ATTENTE_CORRECTION:
            return SOUS_ETAT_ICONE_CLASS.ROUND_RED;
          case UNDER_STATUS_LIVRABLE.FORME_VALIDE_METIER:
          case UNDER_STATUS_LIVRABLE.FORME_VALIDE_SI:
            return SOUS_ETAT_ICONE_CLASS.ROUND_GREEN_LIGHT;
          case UNDER_STATUS_LIVRABLE.ARCHIVE:
          case UNDER_STATUS_LIVRABLE.A_ENVOYER:
          case UNDER_STATUS_LIVRABLE.ENVOYE:
            return SOUS_ETAT_ICONE_CLASS.ROUND_GREEN
          default:
            return '';
        }
      }
  }

  onSearchOnClientLivrables(){
      this.onMappeStatusAndLivrableStatus();
      if(this.isValidSearchCriteria()){
        this.getClientLivrable();
      }
  }

  private onMappeStatusAndLivrableStatus() {
    const mappedSlectedState = this.selectedState.map(chose => this.getEtats(chose.viewValue));
    this.mappedEtat = this.flatArrays(mappedSlectedState);
    const mappedSelectedStatut = this.selectedStatut.map(chose => this.getStatus(chose.viewValue));
    mappedSelectedStatut.push([UNDER_STATUS_LIVRABLE.EN_ATTENTE, UNDER_STATUS_LIVRABLE.EN_RETARD]);
    this.mappedStatus = this.flatArrays(mappedSelectedStatut);
  }

  private isValidSearchCriteria() {
     return this.selectedState && this.selectedState.length !== 0 && this.selectedStatut && this.selectedStatut.length !== 0;
  }

  getStatus(viewValue: string): any {
    switch(viewValue){
      case A_VERIFIER:
        return [UNDER_STATUS_LIVRABLE.FOND_A_VALIDER_METIER,UNDER_STATUS_LIVRABLE.FORME_A_VALIDER_METIER];
      case CORRECTION_VALIDEE:
        return [UNDER_STATUS_LIVRABLE.FORME_INVALIDE_METIER_CORRIGE , UNDER_STATUS_LIVRABLE.FOND_INVALIDE_METIER_CORRIGE];
      case A_CORRIGER:
        return [UNDER_STATUS_LIVRABLE.FOND_INVALIDE_METIER_ATTENTE_CORRECTION,UNDER_STATUS_LIVRABLE.FORME_INVALIDE_METIER_ATTENTE_CORRECTION]
      case VERIFIEE:
        return [UNDER_STATUS_LIVRABLE.FORME_VALIDE_METIER,UNDER_STATUS_LIVRABLE.FORME_VALIDE_SI];
      case ARCHIVEE:
        return [UNDER_STATUS_LIVRABLE.ARCHIVE,UNDER_STATUS_LIVRABLE.A_ENVOYER,UNDER_STATUS_LIVRABLE.ENVOYE];
      default:
        return '';
    }
  }

  getEtats(viewValue: string): any {
    switch(viewValue){
      case ABSENTE:
        return [STATUT_LIVRABLE.ORIGINAL_ABSENT , STATUT_LIVRABLE.ORIGINAL_PRESENT];
      case UPLOADEE:
        return STATUT_LIVRABLE.DONNEES_STOCKEES;
      case GENEREE_SANS_ERREURS:
        return STATUT_LIVRABLE.GENERE;
      case GENEREE_AVEC_WARNINGS:
        return STATUT_LIVRABLE.GENERE_WARNING;
      case GENEREE_AVEC_ERREURS:
        return STATUT_LIVRABLE.GENERE_ERREUR;
      case RELOOKEE_MANUELLEMENT:
        return STATUT_LIVRABLE.FICHIER_RELOOKE_MANUELLEMENT;
    }
  }
    
  /**
   * to convert array of arrays to ftal array
   * @param matrix
  */
  flatArrays(matrix: string[]): string[] {
    return [].concat.apply([], matrix);
  }
  
  async standardRelooking(){
    if(this.relookingLivrablesHolder.toRelookingLivrables.length !== 0){
      this.validateLivrableService.toRelookingLivrables = this.relookingLivrablesHolder.toRelookingLivrables;
      await this.validateLivrableService.validateLivrableToBeRelooked();
      const finalRelookingLivrables: Array<LivrableVO> = this.validateLivrableService.toRelookingLivrables;
      this.messages = `${this.validateLivrableService.messages.join(SEPARATOR_TO_JOIN_MESSAGES)} ${this.messages}`;
      this.genererFactureRelookee(finalRelookingLivrables);
    }else{
      this.openPopUp(RELOOKING_WITHOUT_BILL_MESSAGE);
    }
  }  
  genererFactureRelookee(finalRelookingLivrables: LivrableVO[]) {
    if(finalRelookingLivrables && finalRelookingLivrables.length !== 0){
      this.billingService.genererFactureRelookee(finalRelookingLivrables).subscribe(
        (data: PenicheRelookingResponseVO[])=>this.messageHaldlingAfterRelooking(data)
      );
      this.initAfterRelooking();
    }
  }
  messageHaldlingAfterRelooking(data: PenicheRelookingResponseVO[]): void {
    let errorNumber = 0;
    let messages: string[] = [];
    this.updateRowData(data);
    if(data){
      data.forEach(
        (penicheRelookingResponse: PenicheRelookingResponseVO)=>{
          const livrablesRelooke: LivrableVO = penicheRelookingResponse.items;
          const erreurs = livrablesRelooke.erreurs;
          if(erreurs && erreurs.length !==0){
            errorNumber = erreurs.filter((error)=>error.origine === 1).length;
          }
          this.validateLivrableService.getFormattedMessages(livrablesRelooke, messages, errorNumber);
          this.messages = `${messages.join(SEPARATOR_TO_JOIN_MESSAGES)} ${this.messages}`;
          messages = [];
      });
    }
  }
  updateRowData(data: PenicheRelookingResponseVO[]) {
    if(data){
      data.forEach(
        (penichResponseLivrable:PenicheRelookingResponseVO)=>{
          const livrable: LivrableVO = penichResponseLivrable.items;
          this.mappeLivrableVOInRowData(livrable);
        }
      );
      this.initRefreshGridParams();
    }
  }

  private mappeLivrableVOInRowData(livrable: LivrableVO) {
    this.rowData = this.rowData.map(
      (livrableBeforeRelooking: LivrableVO) => {
        if (livrableBeforeRelooking.label === livrable.label && livrableBeforeRelooking.numero === livrable.numero) {
          livrableBeforeRelooking = livrable;
          livrableBeforeRelooking.arrow = '';
        }
        return livrableBeforeRelooking;
      });
  }


  private initRefreshGridParams(){
    this.params = {
      force: true,
      suppressFlash: true,
    };
  }
  private initAfterRelooking() {
    this.validateLivrableService.nbFichiersMauvaisStatus = 0;
    this.validateLivrableService.messages = [];
    this.relookingLivrablesHolder.toRelookingLivrables = [];
  }

  openPopUp(message: string) {
    this.confirmationDialogService
     .confirm(RELOOKING,message, OUI, NON, SIZE, false);
  }

  validateBillToBeParametrize(params: any): boolean {
    const livrableStatus = params && params.data && params.data.livrableStatus ? params.data.livrableStatus:'';
    return (livrableStatus === STATUT_LIVRABLE.GENERE) ||
    (livrableStatus === STATUT_LIVRABLE.GENERE_ERREUR) ||
    (livrableStatus === STATUT_LIVRABLE.GENERE_WARNING) ||
    (livrableStatus === STATUT_LIVRABLE.FICHIER_RELOOKE_MANUELLEMENT);
  }

  validateBillToBeDownloaded(params: any) {
    const livrable: LivrableVO = params.data;
    return !livrable.archive && this.validateBillToBeParametrize(params);
  }

  isValidStatus(params: any) {
    const status = params && params.data && params.data.status  ? params.data.status:'';
    return  status === UNDER_STATUS_LIVRABLE.FOND_INVALIDE_METIER_ATTENTE_CORRECTION ||
    status === UNDER_STATUS_LIVRABLE.FORME_INVALIDE_METIER_ATTENTE_CORRECTION ||
    status === UNDER_STATUS_LIVRABLE.FORME_A_VALIDER_METIER ||
    status === UNDER_STATUS_LIVRABLE.FOND_A_VALIDER_METIER;
  }

  /**
   * to check is livrable is eligible to have a paiement button
   * @author YFA
   * @param params 
   */
  eligibleToSeePaiementButton(params: any): boolean {
    if(params && params.data){
      const livrable: LivrableVO = params.data;
      return livrable.type === TYPE_BIll.FACTURE &&
        livrable.univers === UNIVERS_SERVICE &&
        !livrable.archive &&
        livrable.livrableStatus !== STATUT_LIVRABLE.ORIGINAL_ABSENT
    }
    return false;
  }

  openPopUpForTaskOnLivrable(tache: string , message: string,visibleCancelButton: boolean , nonButtonContent: string = NON , ouiButtonContent: string = OUI) {
    return this.confirmationDialogService
     .confirm(tache,message, ouiButtonContent, nonButtonContent , SIZE, visibleCancelButton);
  }
  openSnackBar( text: string ) {
    this._snackBar.open(text, undefined, {
      duration: 3000,
      panelClass: [SNACK_BAR_SUCCESS_CLASS_NAME , SNACK_BAR_CONTAINER_SUCCESS_CLASS_NAME]
    });
  }

  /**
   * ATHENA-3954
   * main method for trigger archivage traitement
   * @author YFA
   */
  archiveLivrable(){
    if(this.relookingLivrablesHolder.toRelookingLivrables.length !== 0){
      const livrablesIdsToSend  = this.validateLivrableService.validateLivrableToArchive(
        this.relookingLivrablesHolder.toRelookingLivrables
      );
      this.messages = `${ this.validateLivrableService.messages.join(SEPARATOR_TO_JOIN_MESSAGES)} ${this.messages}`;
      this.validateLivrableService.messages = [];
      this.sendLisvrablsIdsToBeArchived(livrablesIdsToSend);
    }else{
      this.openPopUp(ARCHIVAGE_WITHOUT_BILL_MESSAGE);
    }
  }

  /**
   * to send livrable after validation 
   * @author YFA
   * @param livrablesIdsToSend 
   */
  sendLisvrablsIdsToBeArchived(livrablesIdsToSend: number[]) {
    if(livrablesIdsToSend && livrablesIdsToSend.length !== 0){
      const start = new Date().getTime(); 
      this.billingService.archiverBill(livrablesIdsToSend).subscribe(
        (livrablesAfterArchivage: PenicheRelookingResponseVO[])=>this.updateRowData(livrablesAfterArchivage),
        (error)=>{},
        ()=>{
          this.formatAchivageSuccessMessageWithTime(livrablesIdsToSend.length , start);
          this.relookingLivrablesHolder.toRelookingLivrables = [];
        }
      )
    }
  }

  /**
   * to calculate time between call and result and to formate message
   * @author YFA
   * @param start 
   */
  formatAchivageSuccessMessageWithTime(numberOfArchivedFactures: number , start: number): void {
    this.messages = `<span class=${SUCCESS_RELOOKING_CLASS_NAME}>${numberOfArchivedFactures} ${BILL_MESSAGE} ${Math.round(((new Date().getTime() - start) / 1000))} ${SECONDES}<span/><br /> ${this.messages}`;
  }

  /**
   * to ckeck if livrabe is not archived
   * @author YFA
   * @param params 
   */
  eligibleToSeeDeleteButton(params: any): boolean {
    if(params && params.data){
      const livrable: LivrableVO = params.data;
      if(livrable.archive){
        return false;
      }
      const livrableStatus = livrable.livrableStatus;
      const type  = livrable.type;
      if (!type || !livrableStatus) {
        return false;
      }
      if (type == TYPE_BIll.FACTURE) {
        return (livrableStatus === STATUT_LIVRABLE.GENERE) ||
        (livrableStatus === STATUT_LIVRABLE.GENERE_ERREUR) ||
        (livrableStatus === STATUT_LIVRABLE.GENERE_WARNING) ||
        (livrableStatus === STATUT_LIVRABLE.FICHIER_RELOOKE_MANUELLEMENT);
      }
      if (type == TYPE_BIll.CR) {
        return (livrableStatus !== STATUT_LIVRABLE.NON_GENERABLE) &&
        (livrableStatus !== STATUT_LIVRABLE.GENERABLE_COMPLET) &&
        (livrableStatus !== STATUT_LIVRABLE.GENERABLE_PARTIEL) &&
        (livrableStatus !== STATUT_LIVRABLE.FICHIER_RELOOKE_MANUELLEMENT);
      }
    }
    return false;
  }

  // ********************************SERVICE UPLOAD BILLS*****************************/

  openConfirmationDialoglg(message: string): any {
    const TITLE = 'Erreur';
    const BTN_OK = 'OK';
    this.confirmationDialogService.confirm(TITLE, message, BTN_OK, null, 'lg', false)
    .then((_confirmed) => {
      this.activeModal.close(true);
    })
    .catch(() => console.log('User dismissed'));
  }

  async upload(event: any) {
    this.billsToUploadList = [];
    this.billsToUploadList.push(event.addedFiles);
    const billsNameToUpload = this.uploadBillClientService.prepareBillsToUpload(this.billsToUploadList, this.searshDate,
       this.customer.nicheIdentifier);
    this.uploadBills(billsNameToUpload);
    this.messages = `${this.uploadBillClientService.messages.join(this.SEPARATOR_TO_JOIN_MESSAGES)} ${this.messages}`;
    this.uploadBillClientService.messages = [];
  }

  uploadBills(billsNameToUpload: string[]): any {
  // Call upload Service
    if (!isEmpty(billsNameToUpload)) {
      this.loading = true;
      this.billingService.uploadBills(billsNameToUpload).subscribe(billsAfterUpload => {
        if (billsAfterUpload) {
          this.uploadBillClientService.processBillsAfterUpload(billsAfterUpload);
          this.messages = `${this.uploadBillClientService.messages.join(this.SEPARATOR_TO_JOIN_MESSAGES)} ${this.messages}`;
          this.uploadBillClientService.messages = [];
          this.updateDataGridBillsAfterUplaod(billsAfterUpload);
          this.getClientLivrable();
        }},
      error => {
        this.loading = false;
        this.openConfirmationDialoglg(error.error.message);
      },
      () => {
        this.loading = false;
      }
    );
    }
  }
/************************************************************************************************************** */
  updateDataGridBillsAfterUplaod(billsAfterUpload: LivrableVO[]): any {
    if (!isEmpty(billsAfterUpload)) {
      billsAfterUpload.forEach(billAfterUpload => {
        if (isNullOrUndefined(billAfterUpload.libelleErreurTraitement)) {
          const label = billAfterUpload.fichierOriginal.split('_').join(' ').replace('.pdf', '');
          this.rowData.forEach( (billInGrid, index) => {
            if (billInGrid.label === label) {
              this.rowData.splice(index, 1);
            }
          });
          this.rowData.unshift(billAfterUpload);
          this.rowData = this.rowData.slice();
          this.rowData.forEach(item => {
            item.arrow = '';
            item.download = '';
          });
        }
      });
    }
  }
 /************************************************************************************************************** */
  hasPermission(params: any): boolean {
    const livrableStatus = params.data.livrableStatus;
    if (livrableStatus === STATUT_LIVRABLE.DONNEES_STOCKEES) {
      return false;
    }
    return true;
  }
/************************************************************************************************************/

ngOnDestroy(): void {
  if(this.subscription){
    this.subscription.unsubscribe();
  }
}
}
