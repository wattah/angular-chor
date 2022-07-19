import { Component, Input, OnInit, OnChanges, ViewEncapsulation, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';

import { SORT_ORDER } from './../../../../_core/constants/constants';
import { CustomerTotalsDebtService } from '../../../../_core/services/customer-totals-debt.service';
import { isNullOrUndefined, getDefaultStringEmptyValue } from '../../../../_core/utils/string-utils';
import { DateFormatPipeFrench } from '../../../../_shared/pipes';
import { dateComparator } from '../../../../_core/utils/date-utils';
import { firstNameFormatter } from '../../../../_core/utils/formatter-utils';
import { ContractsOffersVO } from '../../../../_core/models/contracts-offers-vo';

@Component({
  selector: 'app-accounting-state-list',
  templateUrl: './accounting-state-list.component.html',
  styleUrls: ['./accounting-state-list.component.scss'], 
  encapsulation: ViewEncapsulation.None

})
export class AccountingStateListComponent implements OnInit, OnChanges {

  @Input() contractsOffers: ContractsOffersVO[];
  @Output() contractOfferSelected = new EventEmitter();
  @Output() nicheIdentifiant = new EventEmitter();
  @Output() offerLabelChange = new EventEmitter();
  @Input() nicheIdentifier: string;
  @Input() offerLabel: string;
  isEntreprise: boolean;
  customerId: number;
  columnDefs: any[];
  defaultSortModel: any[];
  rowData: any;
  rowStyle = { cursor: 'context-menu' };
  isMultiContrat = false;
  isDisabledNext = false;
  lastNiche: string;
  firstNiche: string;
  DEF_MVT_CF_SORT_FIELD = 'dateMouvement';

  /* Server Side data */
  paginationPageSize = 20;
  datasource: any;
  totalItems;
  rowModelType = 'serverSide';
  gridApi;
  gridColumnApi;
  gridParams;
  params: { force: boolean; suppressFlash: boolean; };

  constructor(private customerDebtService: CustomerTotalsDebtService, private route: ActivatedRoute,
    private readonly dateFormatPipeFrench: DateFormatPipeFrench) {
    this.defaultSortModel = [
      { colId: this.DEF_MVT_CF_SORT_FIELD, sort: SORT_ORDER.DESC.toLowerCase() }
    ];
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      this.customerId = Number.parseInt(params.get('customerId'), 10);
    });
    this.isEntreprise = Boolean(this.route.snapshot.data['isEntreprise']);

    if(!isNullOrUndefined(this.contractsOffers) && this.contractsOffers.length > 1) {
      this.isMultiContrat = true;
    }

    if(!isNullOrUndefined(this.contractsOffers)) {
      this.lastNiche = this.contractsOffers[this.contractsOffers.length -1].nicheIdentifier;
      this.firstNiche = this.contractsOffers[0].nicheIdentifier;
    }
    this.setColumnRef();
    this.initGrid();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nicheIdentifier'] ) {
      this.initGrid();
    }
  }

  onGridReady(params: any): void {
    this.gridParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.initGrid();
  }

  initGrid(): void {
    this.createServerSideDatasource();
  }

  createServerSideDatasource(): void {
    this.datasource = {
      getRows: (params) => {
        const sortField = params && params.request && params.request.sortModel && params.request.sortModel.length > 0 ? 
                        params.request.sortModel[0].colId : this.DEF_MVT_CF_SORT_FIELD;
        const sortOrder = params && params.request && params.request.sortModel && params.request.sortModel.length > 0 ? 
                        params.request.sortModel[0].sort.toUpperCase() : SORT_ORDER.DESC;
        const pageNumber = params && params.request && params.request.startRow > 0 ? params.request.startRow / this.paginationPageSize : 0;
        const pageSize = this.paginationPageSize;
        this.customerDebtService.getMouvementsByNicheIdentifier(this.nicheIdentifier, pageNumber, pageSize, sortField, sortOrder)
          .subscribe(data => {
            this.totalItems = data.total;
            params.success({ rowData: data.items, rowCount: data.total });
          },
          (_error) => {
            params.fail();
          }
          );
      }
    };    
  }

  getDataPreviousOrNext(str: string): void {
    for (let i = 0; i < this.contractsOffers.length; i++) {
      if ( this.contractsOffers[i].nicheIdentifier === this.nicheIdentifier) {
        if (str === 'next') {
          this.contractOfferSelected.emit(this.contractsOffers[i + 1]);
          this.nicheIdentifier = this.contractsOffers[i + 1].nicheIdentifier;
          this.nicheIdentifiant.emit(this.contractsOffers[i + 1].nicheIdentifier);
          this.offerLabel = this.contractsOffers[i + 1].offerLabel;
          this.offerLabelChange.emit(this.contractsOffers[i + 1].offerLabel);
        } else if ( str === 'prev') {
          this.contractOfferSelected.emit(this.contractsOffers[i - 1]);
          this.nicheIdentifier = this.contractsOffers[i - 1].nicheIdentifier;
          this.nicheIdentifiant.emit(this.contractsOffers[i - 1].nicheIdentifier);
          this.offerLabel = this.contractsOffers[i - 1].offerLabel;
          this.offerLabelChange.emit(this.contractsOffers[i - 1].offerLabel);
        }
        this.initGrid();
      }
    }
  }

  /**
	 * 
	 * cette fonction retourne l'icone suivant le compte de facturation
	 * si c'est mobile on affiche icone mobile 
	 * si c'est service on affiche icone service 
	 */

  getIconeByCFType(val: string): string {
    let icon = '';
    if (!isNullOrUndefined(val)) {
      if (val.localeCompare('MOBILE') === 0) {
        icon = 'phone-mobile-grey';
      }else if (val.localeCompare('SERVICE') === 0) {
        icon = 'service';
      } 
    } 
    return icon;
  }
  /**
	 * cette methode permet de griser l'icone de 
	 * download lorsque la liste des mouvements est vide 
	 */
  getIconeDownload(): string {
    return this.totalItems > 0 ? 'icon download' : 'icon download isDisabled';
  }

  /**
	 * cette methode permet de télécharger le ficher recupéré depuis la bd
	 * avec le format xls
	 */
  exportXLS(): void {
    if ( this.totalItems !== 0 && !isNullOrUndefined(this.nicheIdentifier)) {
      this.customerDebtService.getXlsFile(this.nicheIdentifier)
      .subscribe(data => {
        //save it on the client machine.
        saveAs( new Blob([data], {type: 'application/vnd.ms-excel'}), this.getFilename() );
      });
    }
  }

  /** 
   *methode pour modeliser le nom du fichier etat comptable
   */
  getFilename():string{
    if(this.offerLabel!=null){
      return `Etat comptable_Contrat N°${this.nicheIdentifier}_Offre ${this.offerLabel}.xls` ;
    }
    else return `Etat comptable_Contrat N°${this.nicheIdentifier}_Offre -.xls` ;
  }

  getTypeMouvement(val: string, type: string, libelle: string): string {
    let str = '';
    if (!isNullOrUndefined(val)) {
      if (val.localeCompare('MOBILE') === 0) {
        str = getDefaultStringEmptyValue(libelle);
      } else if (val.localeCompare('SERVICE') === 0) {
        str = getDefaultStringEmptyValue(firstNameFormatter(type));
      }
    }
    return str;

  }

  setColumnRef(): void {	
    this.columnDefs = [
      {
        headerName: 'COMPTE',
        children: [
          {
            headerName: 'NUMERO',
            headerTooltip: 'NUMERO',
            colId: 'numCptFact',
            cellRenderer: params => {
              let compte = ``; 
              compte += `<span class='icon ${this.getIconeByCFType(params.data.universCF)}'></span>`;
              compte += ( params.data.numCptFact) ? params.data.numCptFact : '-';
              return compte;
            },
            width: 200,
            cellClass: 'cell-wrap-text border-right',
            autoHeight: true
          }
        ]
      },
      {
        headerName: 'MOUVEMENT',
        children: [
          {
            headerName: 'Date du',
            headerTooltip: 'Date du',
            colId: 'dateMouvement',
            comparator: dateComparator,
            valueGetter: params => params.data ? this.dateFormatPipeFrench.transform(params.data.dateMouvement) : '-',
            cellClass: /cell-wrap-text/,
            width: 160,
            autoHeight: true
          },
          {
            headerName: 'DERNIERE MAJ',
            headerTooltip: 'DERNIERE MAJ',
            colId: 'dateMaj',
            comparator: dateComparator,
            valueGetter: params => params.data ? this.dateFormatPipeFrench.transform(params.data.dateMaj) : '-',
            cellClass: 'cell-wrap-text',
            width: 170,
            autoHeight: true
          },
          {
            headerName: 'Numéro',
            headerTooltip: 'Numéro',
            colId: 'numMouvement',
            valueGetter: params => params.data ? getDefaultStringEmptyValue(params.data.numberMouvement) : '-',
            cellClass: 'cell-wrap-text',
            width: 180,
            autoHeight: true
          },
          {
            headerName: 'Type',
            headerTooltip: 'Type',
            colId: 'labelMouvement',
            valueGetter: params => params.data ? 
                        this.getTypeMouvement(params.data.universCF, params.data.typeMouvement, params.data.labelMouvement) : '-',
            cellClass: 'cell-wrap-text border-right',
            width: 140,
            autoHeight: true
          }
        ]
      },
      {
        headerName: 'Montant/€TTC',
        children: [
          {
            headerName: 'INITIAL',
            headerTooltip: 'INITIAL',
            colId: 'initialAmountTTC',
            valueGetter: params => !params.data || isNullOrUndefined(params.data.initialAmountTTC) ? '0,00' : params.data.initialAmountTTC,
            cellClass: 'cell-wrap-text text-right',
            width: 170,
            autoHeight: true
          },
          {
            headerName: 'RESTANT',
            headerTooltip: 'RESTANT',
            colId: 'remainingAmount',
            valueGetter: params => !params.data || isNullOrUndefined(params.data.remainingAmount) ? '0,00' : params.data.remainingAmount,
            cellClass: 'cell-wrap-text text-right',
            width: 180,
            autoHeight: true
          }
        ]
      }
    ];
  }
  
}
