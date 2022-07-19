import { DOWLOAD_COL_ID } from './../../../_core/constants/bill-constant';
import { BillManagementService } from '../../bill-management/bill-management-detail/bill-management.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment  from 'moment';
import { CheckboxRendrerComponent } from '../checkbox-rendrer/checkbox-rendrer.component';
import  {Moment} from 'moment-business-days';
import { BillCellRendererComponent } from './bill-cell-renderer/bill-cell-renderer.component';
import { BillingService } from '../../../_core/services/billing.service';
import { isNullOrUndefined } from '../../../_core/utils/string-utils';
import { ETAT_FACTURE, SousEtatLivrable, SOUS_ETAT_ICONE_CLASS,
  STATUS_FACTURE, STATUS_ICONE_CLASS, STATUT_LIVRABLE, UNIVERS_PENICHE, TYPE_BIll } from '../../../_core/constants/constants'; 
import { DatePipe } from '@angular/common';
import { FORMAT_DATE } from '../../../_core/constants/patterns-date';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadBillsService } from './upload-bills.service';
import { RelookingBillLotService } from './relooking-bill-lot.service';
import { ValidateRelookingStandardLot } from './validate-relooking-standard-lot.service';
import { LivrableVO } from '../../../_core/models/livrable-vo';
import { NON, OUI, RELOOKING, RELOOKING_WITHOUT_BILL_MESSAGE, SIZE ,BILL_MESSAGE,
  DELETE_COL_ID, DELETE_MESSAGE, DELETE_TASK, SECONDES, SEPARATOR_TO_JOIN_MESSAGES,
  SUCCESS_RELOOKING_CLASS_NAME, ARCHIVAGE_WITHOUT_BILL_MESSAGE, CONSTANTS_BILL,
  SUPRESSION, CONSERVE } from '../../../_core/constants/bill-constant';
import { ValidateLivrableService } from '../../bill-management/validate-livrable.service';
import { PenicheRelookingResponseVO } from '../../../_core/models/peniche-relooking-response-vo';
import { checkValidateToDeleteOrDownloadOrRelooking,
  checkValidateToPadlock, checkValidateToParameters } from '../../../_core/utils/bills-utils';
import { Subscription } from 'rxjs';

export const MY_FORMATS = {
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
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    RelookingBillLotService,
    ValidateRelookingStandardLot
  ],
})
export class BillsComponent implements OnInit , OnDestroy {

  date = new FormControl(moment());
  fState = new FormControl();
  fStatus = new FormControl();
  rowData: any[] = [];
  dateStr: string;
  currentDate = new Date();
  params: any;
  isExistLivrable = false;
  isUniversSelected = false;
  PICTO_TACHE_CLOSE_HORS_D_LAIS = 'picto-tache-close-hors-d-lais'
  PICTO_TACHE_ASSIGN_DANS_D_LAIS = 'picto-tache-assign-dans-d-lais';
  MESSAGE_ERROR = "Erreur Serveur : Une erreur technique inattendue est surevenue.";
  PICTO_PDF = 'pdf';
  universId: number;
  lUnivers = [];
  lStatusInvoice = [];
  lStateInvoice = [];
  getRowHeight: any;
  iconedownHtml: any = '<span class="icon download"></span>';
  relookingIcon = '<span class="icon etat-relooking"></span>';
  cadenasIcon = '<span class="icon cadenas"></span>';
  deleteIcon = '<span class="icon del"></span>';
  parameters = '<span class="icon parameters"></span>';
  SEPARATOR = ' ';
  selectedStatus: string[] = [];
  selectedEtat: string[] = [];
  frameworkComponents: Object;
  detailCellRenderer: any;
  loading = false;
  isSelectedSearch = false;
  billsToUploadList: File[] = [];
  messages: string = CONSTANTS_BILL.MESSAGE_INFO;
  billsToArchive :  File[] = [];
  SEPARATOR_TO_JOIN_MESSAGES=' '
  defaultSortModel = [];

  columnDefs = [
    {
      headerName: ' ',
      headerTooltip: 'arrow',
      cellRenderer: 'agGroupCellRenderer',
      field: 'type',
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
      cellRenderer: (params) => {
        return `${this.createSpanElement(this.getPdfIcon(params))} ${params.data.label}`;
      },

    },

    {
      headerName: 'Compte de facturation',
      field: 'billAccountIdentifier',
      minWidth: 230,
      maxWidth: 230,
      cellStyle: { 'white-space': 'normal' },
      headerClass: 'non',
      cellClass: 'whitespace',
      cellRenderer: params => {
        return params.data.billAccountIdentifier;
      },

    },

    {
      headerName: 'Etat',
      field: 'status',
      cellClass: 'ml-1',
      cellRenderer: (params) => this.createSpanElement(this.getStatusIcon(params)),
      minWidth: 100,
      maxWidth: 100,
    },
    {
      headerName: 'Statut',
      headerTooltip: '',
      cellClass: 'ml-2',
      field: 'status',
      cellRenderer: (params) =>  this.createSpanElement(this.getIconColorBySousStatus(params)),
      minWidth: 375
    },
    {
      headerName: '',
      headerTooltip: '',
      field: 'parametres',
      cellRenderer: params => {
        return  checkValidateToParameters(params) ?this.createSpanElement('parameters') : '';
      },
      minWidth: 40,
      maxWidth: 40,
      headerClass: 'yess',
      cellClass: 'yess',

    },
    {
      headerName: '',
      headerTooltip: '',
      field: DOWLOAD_COL_ID,
      colId: DOWLOAD_COL_ID,
      cellRenderer: (params) =>  {
        return checkValidateToDeleteOrDownloadOrRelooking(params, false) ? `${this.iconedownHtml}`:``;
      },
      minWidth: 40,
      maxWidth: 40,
      headerClass: 'yess',
      cellClass: 'yess',

    },

    {
      headerName: '',
      colId: RELOOKING,
      field: RELOOKING,
      cellRenderer: params => {
        return checkValidateToDeleteOrDownloadOrRelooking(params, true) ? this.createSpanElement('etat-relooking'): '';
      },

      minWidth: 40,
      maxWidth: 40,
      headerClass: 'yess',
      cellClass: 'yess',

    },
    {
      headerName: '',
      field: '',
      cellRenderer: params => {
        return checkValidateToPadlock(params) ? this.createSpanElement('cadenas'): '';
      },
      minWidth: 40,
      maxWidth: 40,
      headerClass: 'yess',
      cellClass:'no-cursor',

    },
    {
      headerName: '',
      field: 'delete',
      colId:'delete',
      cellRenderer: params => {
        return  checkValidateToDeleteOrDownloadOrRelooking(params, true) ? this.createSpanElement('del') : '';
      },
      minWidth: 40,
      maxWidth: 40,
      headerClass: 'yess',
      cellClass: 'yess',

    },
  ];
  subscription: Subscription;

  constructor(private readonly billService:BillingService,
    private readonly datePipe: DatePipe,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly activeModal: NgbActiveModal,
    private readonly uploadBillsService : UploadBillsService,
    private readonly relookingBillLotService: RelookingBillLotService,
    private readonly validateRelookingStandardLot: ValidateRelookingStandardLot,
    private readonly validateLivrableService: ValidateLivrableService,
    private readonly billManagementService: BillManagementService) {
    this.detailCellRenderer = 'detailCellRenderer';
    this.frameworkComponents = {
      CheckboxRendrerComponent: CheckboxRendrerComponent,
      detailCellRenderer: BillCellRendererComponent,
    };
   }

  ngOnInit() {
    this.defaultSortModel = [
      { colId: 'label', sort: 'asc' }
    ];

    this.fState.setValue(ETAT_FACTURE.TOUS.cle);
    this.fStatus.setValue(STATUS_FACTURE.TOUS.cle);
    this.initUnivers();
    this.initStateInvoice();
    this.initStatusInvoice();
    this.calculateRowHeightOfMasterDetail();
    this.initDate();
    this.onChangeDate();
    this.refreshAfterRelookingManually();
  }

  refreshAfterRelookingManually(): void {
    this.relookingBillLotService.getBillAfterRelookingManually().subscribe(data => {
      if(data !== null) {
        this.mapperBillInRowData(data);
      }
    });
  }

  private mapperBillInRowData(bill: LivrableVO) {
    this.rowData = this.rowData.map(
      (livrableBeforeRelooking: LivrableVO) => {
        if (bill.livrableId != null && ((bill.livrableId === 0 || bill.livrableId === livrableBeforeRelooking.livrableId) &&
          bill.numero === livrableBeforeRelooking.numero && bill.date === livrableBeforeRelooking.date)) {
          livrableBeforeRelooking = bill;
          livrableBeforeRelooking.arrow = '';
        }
        return livrableBeforeRelooking;
      });
  }

  initUnivers(): void {
    this.lUnivers.push(UNIVERS_PENICHE.MOBILE);
    this.lUnivers.push(UNIVERS_PENICHE.SERVICE);
    this.lUnivers.push(UNIVERS_PENICHE.INTERNET);
    this.lUnivers.push(UNIVERS_PENICHE.FIXE);
  }

  initStateInvoice(): void {
    this.lStateInvoice.push(ETAT_FACTURE.TOUS);
    this.lStateInvoice.push(ETAT_FACTURE.FACTURE_UPLOADE);
    this.lStateInvoice.push(ETAT_FACTURE.FACTURE_ABSENTE);
    this.lStateInvoice.push(ETAT_FACTURE.GENEREE_SANS_ERREUR);
    this.lStateInvoice.push(ETAT_FACTURE.GENEREE_AVEC_ERREUR_MINEUR);
    this.lStateInvoice.push(ETAT_FACTURE.GENEREE_AVEC_ERREUR);
    this.lStateInvoice.push(ETAT_FACTURE.RELOOKEE_MANUELLEMENT);
  }

  initStatusInvoice(): void {
     this.lStatusInvoice.push(STATUS_FACTURE.TOUS);
     this.lStatusInvoice.push(STATUS_FACTURE.FACTURE_A_VERIFIE);
     this.lStatusInvoice.push(STATUS_FACTURE.CORRECTION_VALIDE);
     this.lStatusInvoice.push(STATUS_FACTURE.FACTURE_CORRIGER);
     this.lStatusInvoice.push(STATUS_FACTURE.FACTURE_VERIFIER);
     this.lStatusInvoice.push(STATUS_FACTURE.FACTURE_ARCHIVEE);
  }

  initDate() {
    this.dateStr = this.datePipe.transform(this.currentDate , FORMAT_DATE.YYYY__MM__DD);
   }

onChangeDate() {
  this.date.valueChanges.subscribe(
      (date: Date)=> {
        this.dateStr = this.datePipe.transform(date , FORMAT_DATE.YYYY__MM__DD);
      }
    );
  }

  selectedUnivers(value): void {
    this.universId = value;
    this.isUniversSelected = (!isNullOrUndefined(this.universId) && this.universId > 0);
  }

  onSelectedStatus(event): void {
    this.selectedStatus = this.getListStatusLivrables(event);
  }

  onSelectedState(event): void {
   this.selectedEtat = this.getListEtatLivrables(event);
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

  rechercher(): void {
    if(this.isUniversSelected) {
      this.loading = true;
      this.billService.recupererLivrablesUnivers(1, this.universId, this.dateStr).subscribe(data => {
        this.rowData = data;
        if(!isNullOrUndefined(this.rowData) && this.rowData.length !== 0) {
            this.rowData.forEach(item=> {
            item.arrow = '';
            item.download = '';
            });
            this.filterByStateAndStatus();
          }
        },
        error => {
          this.isSelectedSearch = true;
          this.loading = false;
          this.rowData = [];
          this.openConfirmationDialoglg(this.MESSAGE_ERROR)
          this.isExistLivrable = false;
          this.initAfterRecherche();
        },
        () => {
          this.isSelectedSearch = true;
          this.loading = false;
          if(!isNullOrUndefined(this.rowData) && this.rowData.length !== 0) {
          this.isExistLivrable = true;
          } else {
            this.isExistLivrable = false;
          }
           this.initAfterRecherche();
           this.defaultSortModel = [
            { colId: 'label', sort: 'asc' }
          ];
        }
      );
    }
  }

  /**
   * permet d'initialiser les champs apres la recherche
   * bouton (relooking)
   */
  initAfterRecherche(): void {
      this.relookingBillLotService.livrablesToRelooking = [];
      this.validateRelookingStandardLot.nbFichiersMauvaisStatus = 0;
      this.validateRelookingStandardLot.listBillsToRelooking = [];

    }

  private filterByStateAndStatus(): void {
    if(this.selectedEtat.length !== 0) {
      this.rowData = this.rowData.filter(item =>  this.selectedEtat.includes(item.livrableStatus));
      this.relookingBillLotService.livrablesToRelooking = [];
    }
    if(this.selectedStatus.length !== 0) {
      this.rowData = this.rowData.filter(item =>  this.selectedStatus.includes(item.status));
      this.relookingBillLotService.livrablesToRelooking = [];
    }
  }

  getListStatusLivrables(value: string): string[] {
    switch(value){
      case STATUS_FACTURE.FACTURE_A_VERIFIE.cle:
        return [SousEtatLivrable.FOND_A_VALIDER_METIER,SousEtatLivrable.FORME_A_VALIDER_METIER];
      case STATUS_FACTURE.CORRECTION_VALIDE.cle:
        return [SousEtatLivrable.FORME_INVALIDE_METIER_CORRIGE , SousEtatLivrable.FOND_INVALIDE_METIER_CORRIGE];
      case STATUS_FACTURE.FACTURE_CORRIGER.cle:
        return [SousEtatLivrable.FOND_INVALIDE_METIER_ATTENTE_CORRECTION,SousEtatLivrable.FORME_INVALIDE_METIER_ATTENTE_CORRECTION]
      case STATUS_FACTURE.FACTURE_VERIFIER.cle:
        return [SousEtatLivrable.FORME_VALIDE_METIER,SousEtatLivrable.FORME_VALIDE_SI];
      case STATUS_FACTURE.FACTURE_ARCHIVEE.cle:
        return [SousEtatLivrable.ARCHIVE,SousEtatLivrable.A_ENVOYER,SousEtatLivrable.ENVOYE];
      default:
        return [];
    }
  }

  getListEtatLivrables(value: string): string[] {
    switch(value){
      case ETAT_FACTURE.FACTURE_ABSENTE.cle:
        return [STATUT_LIVRABLE.ORIGINAL_ABSENT , STATUT_LIVRABLE.ORIGINAL_PRESENT];
      case ETAT_FACTURE.FACTURE_UPLOADE.cle:
        return [STATUT_LIVRABLE.DONNEES_STOCKEES];
      case ETAT_FACTURE.GENEREE_SANS_ERREUR.cle:
        return [STATUT_LIVRABLE.GENERE];
      case ETAT_FACTURE.GENEREE_AVEC_ERREUR_MINEUR.cle:
        return [STATUT_LIVRABLE.GENERE_WARNING];
      case ETAT_FACTURE.GENEREE_AVEC_ERREUR.cle:
        return [STATUT_LIVRABLE.GENERE_ERREUR];
      case ETAT_FACTURE.RELOOKEE_MANUELLEMENT.cle:
        return [STATUT_LIVRABLE.FICHIER_RELOOKE_MANUELLEMENT];
      default:
        return [];
    }
  }

  getPdfIcon(params): string{
    const livrableStatus = params.data.livrableStatus;
    const dejaPayee = params.data.dejaPayee;
    if (livrableStatus === STATUT_LIVRABLE.ORIGINAL_ABSENT ||
      livrableStatus === STATUT_LIVRABLE.GENERABLE_COMPLET ||
      livrableStatus === STATUT_LIVRABLE.GENERABLE_PARTIEL ||
      livrableStatus === STATUT_LIVRABLE.NON_GENERABLE) {
      return this.PICTO_TACHE_CLOSE_HORS_D_LAIS;
    } else if (dejaPayee) {
      return this.PICTO_TACHE_ASSIGN_DANS_D_LAIS;
    } else {
      return this.PICTO_PDF;
    }
  }

  getStatusIcon(params) : string {
    const livrableStatus = params.data.livrableStatus;
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
        switch(status){
          case SousEtatLivrable.FOND_A_VALIDER_METIER:
          case SousEtatLivrable.FORME_A_VALIDER_METIER:
            return SOUS_ETAT_ICONE_CLASS.ROUND_BLUE;
          case SousEtatLivrable.FORME_INVALIDE_METIER_CORRIGE:
            return SOUS_ETAT_ICONE_CLASS.ROUND_ORANGE;
          case SousEtatLivrable.FOND_INVALIDE_METIER_ATTENTE_CORRECTION:
          case SousEtatLivrable.FORME_INVALIDE_METIER_ATTENTE_CORRECTION:
            return SOUS_ETAT_ICONE_CLASS.ROUND_RED;
          case SousEtatLivrable.FORME_VALIDE_METIER:
          case SousEtatLivrable.FORME_VALIDE_SI:
            return SOUS_ETAT_ICONE_CLASS.ROUND_GREEN_LIGHT;
          case SousEtatLivrable.ARCHIVE:
          case SousEtatLivrable.A_ENVOYER:
          case SousEtatLivrable.ENVOYE:
            return SOUS_ETAT_ICONE_CLASS.ROUND_GREEN
          default:
            return '';
        }
  }

  private createSpanElement(className: string) {
    return `<span class="icon ${className}"></span>`;
  }

  openConfirmationDialoglg(message: string): any {
    const TITLE = 'Erreur';
    const BTN_OK = 'OK';
    this.confirmationDialogService.confirm(TITLE, message, BTN_OK,null,'lg', false)
    .then((confirmed) => {
      this.activeModal.close(true)
    })
    .catch(() => console.log('User dismissed )'));
  }

 async relookingStandard() {
   if(!isNullOrUndefined(this.relookingBillLotService.livrablesToRelooking) &&
    this.relookingBillLotService.livrablesToRelooking.length > 0) {
      this.validateRelookingStandardLot.listBillsToRelooking = this.relookingBillLotService.livrablesToRelooking;
     await this.validateRelookingStandardLot.validateBillToBeRelooked();
     this.messages = `${this.validateRelookingStandardLot.logs.join(this.SEPARATOR)} ${this.messages}`;
     this.validateRelookingStandardLot.nbFichiersMauvaisStatus = 0;
     const start = new Date().getTime();
      this.genererFactureRelookee(this.validateRelookingStandardLot.listBillsToRelooking, start);
    } else {
      this.openPopUpError();
    }
  }

  genererFactureRelookee(bills: LivrableVO[], start: number) {
    if(!isNullOrUndefined(bills) && bills.length !== 0){
      this.billService.genererFactureRelookee(bills).subscribe(
        (data: PenicheRelookingResponseVO[]) =>
        this.messageHaldlingAfterRelooking(data, start)
      );
      this.initDataRelooking();
    }
  }

  messageHaldlingAfterRelooking(data: PenicheRelookingResponseVO[], start: number): void {
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
          this.validateRelookingStandardLot.formattedLogs(livrablesRelooke, messages, errorNumber);
          messages.unshift(this.formatAchivageSuccessMessageWithTime(data.length, start, false));
          this.messages = `${messages.join(this.SEPARATOR)} ${this.messages}`;
          messages = [];
      });
    }
  }
  updateRowData(data: PenicheRelookingResponseVO[]) {
    if(data){
      data.forEach(
        (penichResponseLivrable:PenicheRelookingResponseVO)=>{
          const livrable: LivrableVO = penichResponseLivrable.items;
          this.rowData = this.rowData.map(
             (livrableBeforeRelooking: LivrableVO) => {
              if (livrableBeforeRelooking.fichierOriginal === livrable.fichierOriginal) {
                livrableBeforeRelooking = livrable;
                livrableBeforeRelooking.arrow = '';
              }
              return livrableBeforeRelooking
            });
        }
      );
      this.initRefreshGridParams();
    }
  }

  private initRefreshGridParams(){
    this.params = {
      force: true,
      suppressFlash: true,
    };
  }

  private initDataRelooking() {
    this.validateRelookingStandardLot.nbFichiersMauvaisStatus = 0;
    this.validateRelookingStandardLot.logs = [];
    this.relookingBillLotService.livrablesToRelooking = [];
  }

  openPopUpError() {
    this.confirmationDialogService
     .confirm(RELOOKING,RELOOKING_WITHOUT_BILL_MESSAGE, OUI, NON, SIZE, false);
  }

  validateBillToBeParametrize(params: any): boolean {
    const livrableStatus = params && params.data &&
    params.data.livrableStatus ? params.data.livrableStatus:'';
    return (livrableStatus === STATUT_LIVRABLE.GENERE) ||
    (livrableStatus === STATUT_LIVRABLE.GENERE_ERREUR) ||
    (livrableStatus === STATUT_LIVRABLE.GENERE_WARNING) ||
    (livrableStatus === STATUT_LIVRABLE.FICHIER_RELOOKE_MANUELLEMENT);
  }

  isValidStatus(params: any) {
    const status = params && params.data &&
    params.data.status  ? params.data.status:'';
    return  status === SousEtatLivrable.FOND_INVALIDE_METIER_ATTENTE_CORRECTION ||
    status === SousEtatLivrable.FORME_INVALIDE_METIER_ATTENTE_CORRECTION ||
    status === SousEtatLivrable.FORME_A_VALIDER_METIER ||
    status === SousEtatLivrable.FOND_A_VALIDER_METIER;
  }

  checkIseligibleDelete(params: any): boolean {
    if(params && params.data){
      const bill: LivrableVO = params.data;
      if(bill.archive){
        return false;
      }
      const statusLivrable = bill.livrableStatus;
      const type  = bill.type;
      if (!type || !statusLivrable) {
        return false;
      }
      if (type === TYPE_BIll.FACTURE) {
        return (statusLivrable === STATUT_LIVRABLE.GENERE) ||
        (statusLivrable === STATUT_LIVRABLE.GENERE_ERREUR) ||
        (statusLivrable === STATUT_LIVRABLE.GENERE_WARNING) ||
        (statusLivrable === STATUT_LIVRABLE.FICHIER_RELOOKE_MANUELLEMENT);
      }
      if (type === TYPE_BIll.CR) {
        return (statusLivrable !== STATUT_LIVRABLE.NON_GENERABLE) &&
        (statusLivrable !== STATUT_LIVRABLE.GENERABLE_COMPLET) &&
        (statusLivrable !== STATUT_LIVRABLE.GENERABLE_PARTIEL) &&
        (statusLivrable !== STATUT_LIVRABLE.FICHIER_RELOOKE_MANUELLEMENT);
      }
    }
    return false;
  }



//********************************SERVICE UPLOAD BILLS*****************************/
async upload(event){
  this.billsToUploadList = [];
  this.billsToUploadList.push(event.addedFiles);
  let billsNameToUpload = this.uploadBillsService.prepareBillsToUpload(this.billsToUploadList, this.dateStr);
  this.uploadBills(billsNameToUpload);
  this.messages = `${this.uploadBillsService.messages.join(this.SEPARATOR_TO_JOIN_MESSAGES)} ${this.messages}`;
  this.uploadBillsService.messages = [];
}
uploadBills(billsNameToUpload : string[]){
  // Call upload Service 
  if(billsNameToUpload && billsNameToUpload.length > 0){
    this.loading = true;
    this.billService.uploadBills(billsNameToUpload).subscribe(billsAfterUpload => {
      if(billsAfterUpload){
       this.uploadBillsService.processBillsAfterUpload(billsAfterUpload);
       this.messages = `${this.uploadBillsService.messages.join(this.SEPARATOR_TO_JOIN_MESSAGES)} ${this.messages}`;
       this.uploadBillsService.messages = []; 
       this.updateDataGridBillsAfterUplaod(billsAfterUpload);
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
 updateDataGridBillsAfterUplaod(billsAfterUpload : LivrableVO[]){
    if(billsAfterUpload && billsAfterUpload.length > 0){
      billsAfterUpload.forEach(billAfterUpload => {
        if(isNullOrUndefined(billAfterUpload.libelleErreurTraitement)){
          const label = billAfterUpload.fichierOriginal.split('_').join(' ').replace('.pdf','');
          this.rowData.forEach( (billInGrid, index) => {
            if(billInGrid.label === label){
              this.rowData.splice(index,1);
            }
        });
        this.rowData.unshift(billAfterUpload);
        this.rowData = this.rowData.slice();
        this.rowData.forEach(item=> {
          item.arrow = '';
          item.download = '';
        });
        }
      });
    }
 }
 /************************************************************************************************************** */
 hasPermission(params): boolean{
  const livrableStatus = params.data.livrableStatus;
   if(livrableStatus === STATUT_LIVRABLE.DONNEES_STOCKEES){
     return false
   }
  return true;
 }
//********************************SERVICE ARCHIVE BILLS*****************************/
archiveLivrable(){
  if(this.relookingBillLotService.livrablesToRelooking.length !== 0){
    const livrablesIdsToSend  = this.validateLivrableService.validateLivrableToArchive(
      this.relookingBillLotService.livrablesToRelooking
    );
    this.messages = `${ this.validateLivrableService.messages.join(SEPARATOR_TO_JOIN_MESSAGES)} ${this.messages}`;
    this.validateLivrableService.messages = [];
    this.sendLisvrablsIdsToBeArchived(livrablesIdsToSend);
  }else{
    this.openPopUp(ARCHIVAGE_WITHOUT_BILL_MESSAGE);
  }
}
 //* Methode qui permet de récuperer la liste des livrable selectionés */
sendLisvrablsIdsToBeArchived(livrablesIdsToSend: number[]) {
  if(livrablesIdsToSend && livrablesIdsToSend.length !== 0){
    this.billService.archiverBill(livrablesIdsToSend).subscribe(
      (livrablesAfterArchivage: PenicheRelookingResponseVO[])=>this.updateRowDataForArchive(livrablesAfterArchivage, livrablesIdsToSend)
    )
  }
}
//* Methode qui permet d'afficher le message de succés et le temps que l'exécution a pris */
formatAchivageSuccessMessageWithTime(numberOfArchivedFactures: number ,
  start: number, isInfo: boolean): string {
  return  `<span class=${SUCCESS_RELOOKING_CLASS_NAME}>${numberOfArchivedFactures} 
  ${BILL_MESSAGE} ${Math.round(((new Date().getTime() - start) / 1000))} 
  ${SECONDES}<span/><br /> ${isInfo ? this.messages : ''}`;
}

// * Methode qui met à jour le livrable après son archivage */
updateRowDataForArchive(data: PenicheRelookingResponseVO[], livrablesIdsToSend : number []) {
  const start = new Date().getTime(); 
  if(data){
    data.forEach(
      (penichResponseLivrable:PenicheRelookingResponseVO)=>{
        const livrable: LivrableVO = penichResponseLivrable.items;
        this.rowData = this.rowData.map(
          (livrableBeforeRelooking: LivrableVO)=> {
            if(livrableBeforeRelooking.label === livrable.label){
              livrableBeforeRelooking = livrable;
              livrableBeforeRelooking.arrow = '';
            }
            return livrableBeforeRelooking
        })
      }
      
    );
    this.messages =  this.formatAchivageSuccessMessageWithTime(livrablesIdsToSend.length , start, true)
    this.initRefreshGridParams();
  }
}


openPopUp(message: string) {
  this.confirmationDialogService
   .confirm(RELOOKING,message, OUI, NON, SIZE, false);
}

  clickCell(event: any) {
    if (event.column.colId === 'delete' && checkValidateToDeleteOrDownloadOrRelooking(event, true)) {
    this.deleteBill(event);
    } else if(event.column.colId === RELOOKING && checkValidateToDeleteOrDownloadOrRelooking(event, true)) {
     this.relookingBillLotService.relookingManuallyConfirmation(event.data);
   }
  this.parametrize(event);
  this.download(event);
}
  parametrize(event: any) {
    this.billManagementService.rowData = this.rowData;
    this.billManagementService.parametrize(event);
    this.subscription  = this.billManagementService.finishRowDataUpdate$.subscribe(
      (finish)=>{
    if(finish){
              this.rowData = this.billManagementService.rowData;
            }
    });
  }

  /**
   * ATHENA-3757
   * main method to trigger download treatement
   * @param event 
   */
  download(event: any) {
    this.billManagementService.download(event);
  }
  //* Methode qui supprime le livrable */
 deleteBill(event: any) {
   if(event.column.colId === DELETE_COL_ID ){
     this.openPopUpForTaskOnLivrable(DELETE_TASK , this.getDeletingMessage(event.data.label) ,  true).then(
       (chose)=>{
         if(chose){
           this.billService.deleteBill(event.data).subscribe(
             (responseAfterDeleting)=> {
               this.rowData = this.rowData.map((livrable: LivrableVO)=>{
                 if(responseAfterDeleting.items && livrable.label === responseAfterDeleting.items.label){
                   livrable = responseAfterDeleting.items;
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
  const labelAfterModification = label.substring(0,21);
  return `${DELETE_MESSAGE} <br /> &laquo; ${labelAfterModification} &raquo; ?`;
}
 openPopUpForTaskOnLivrable(tache: string , message: string , visibleCancelButton: boolean) {
  
  return this.confirmationDialogService
   .confirm(tache,message, SUPRESSION, CONSERVE, SIZE, visibleCancelButton);
}
ngOnDestroy(): void {
  if(this.subscription){
    this.subscription.unsubscribe();
  }
}
}

