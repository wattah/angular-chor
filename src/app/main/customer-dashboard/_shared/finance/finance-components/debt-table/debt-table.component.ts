import { DebtRecouverementService } from './../../../../../../_core/services/debt-recouverement.service';
import { DebteService } from './../../../../../../_core/services/debt.service';
import { isNullOrUndefined } from '../../../../../../_core/utils/string-utils';
import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CustomerDashboardService } from '../../../../customer-dashboard.service';
import { CustomerTotalsDebt } from '../../../../../../_core/models/customer-totals-debt';
import { UNIVERS_PENICHE } from '../../../../../../_core/constants/constants';

@Component({
  selector: 'app-debt-table',
  templateUrl: './debt-table.component.html',
  styleUrls: ['./debt-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DebtTableComponent implements OnInit, OnChanges {
  
  @Input()
  totalDebt: CustomerTotalsDebt[];

  
  totauxMobile: number ;
  totauxServices: number ;
  totauxDettestotals: number ;
  totauxCreditTotals: number ;
  totauxRemaining: number;
  totalsRemaining = [];
  mobile = [];
  service = [];
  dettesTotal = [];
  creditTotal = [];
  pageNumber: number;
  /**
	 * flag pour savoir si le client est une personne morale ou physique
	 */
  @Input()
  isEntreprise: boolean;

  @Input()
  customerId ; boolean;

  columnDefs: any;
  rowData: any;
  isRowCliked = false;
  
  rowStyle = { cursor: 'context-menu' };

  columnDefsTotals: any;
  rowDataTotals: any;
  rowStyleTotals = { cursor: 'context-menu', fontWeight: 'bold' };
  price: number;
  @Input() nicheValue: string;
  total: { detteTotalTTC: number; detteTotal: number; nichesWithRemainingGreatThanZero: string[] };

  @Output() rowIndexOfSelectedDebt = new EventEmitter();

  constructor(private route: ActivatedRoute,
    private router: Router,
     private customerDashboardService: CustomerDashboardService,
     private readonly debteService: DebteService,
     private readonly debtRecouverementService: DebtRecouverementService) {
  
    this.setColumnRef();
   
  }
  ngOnChanges(changes) {
    if (changes['nicheValue'] && !isNullOrUndefined(this.nicheValue) && !isNullOrUndefined(this.rowData) ) {
      this.sendDetteTotalTTCToProfil();
      this.pageNumber = 1;
      this.goToRowClikedPage();
    }
  }
 
  ngOnInit(): void {
    this.route.data.subscribe(resolversData => {
      this.totalDebt = resolversData['totalDebt'];
      this.countTotaux();
      this.rowData = this.totalDebt;
      this.sendDetteTotalTTCToProfil();
      this.rowDataTotals = [
        {
          detteMobileTTC: this.totauxMobile,
          detteServiceTTC: this.totauxServices,
          detteTotalTTC: this.totauxDettestotals,
          totalCreditTTC: this.totauxCreditTotals,
          totalRemaining: this.totauxRemaining
        }
      ];
    }); 

    this.route.queryParams
    .subscribe(params => {
      this.isRowCliked = params.isRowCliked;
      if(!this.isRowCliked){
        this.isRowCliked = true
      }
      this.pageNumber = 1;
      this.goToRowClikedPage();
    });

    this.route.paramMap.subscribe( params => {
      this.customerId = params.get('customerId');
    });

  }
  private sendDetteTotalTTCToProfil() {
    const debt = this.rowData.find(d => d.nicheIdentifier === this.nicheValue);
    this.total = {
      detteTotalTTC: debt ? this.debtRecouverementService.calculateRemaining(debt):0,
      detteTotal: this.debtRecouverementService.calculateTotlaOfRemaining(this.rowData),
      nichesWithRemainingGreatThanZero: this.debtRecouverementService.getNichesWithRemainingGreatThanZero(this.rowData) 
    }
    this.debteService.recoveryOfBill$.next(this.total)
  }

  goToRowClikedPage() {
    const pages = this.sliceTotalDebts();
    for(let i = 0 ; i < pages.length ; i++){
     if(!isNullOrUndefined(this.nicheValue)){
       this.getRowIndexToSendToFinancialHistory();
      const page = pages[i].filter(debt=> debt.nicheIdentifier === this.nicheValue)[0];
      if(!isNullOrUndefined(page)){
        this.pageNumber = i+1;
      }
     }
    }
  }
  

  getRowIndexToSendToFinancialHistory(){
    for(let i = 0 ; i< this.totalDebt.length; i++){
      if(this.totalDebt[i].nicheIdentifier === this.nicheValue){
        this.rowIndexOfSelectedDebt.emit(i);
        break;
      }
    }
  }

  /**
   * @role slice our totalDebs to pages , each page has a siz equal four
   * @author YOUNESS FATHI
   */
  sliceTotalDebts() {
    const debts = this.totalDebt.slice();
    const pages = [];
    while(1){
      if(debts.length > 4 ){
       pages.push(this.shiftFourItems(debts));
      }else{
        pages.push(debts);
        break;
      }
    }
    return pages;
  }
  /**
   * @role shift four item from debts table 
   *       to simulate page size of pagination ag grid
   * @param debts
   * @author YOUNESS FATHI 
   */
  shiftFourItems(debts) {
    const page = [];
    for(let i = 0 ; i< 4 ; i++){
      page.push(debts.shift());
    }
    return page;
  }
  countTotaux(): void {
    this.totauxMobile = 0.00;
    this.totauxServices = 0.00;
    this.totauxDettestotals = 0.00;
    this.totauxCreditTotals = 0.00;
    this.totauxRemaining = 0.00;
    this.totalsRemaining = [];
    this.mobile = [];
    this.service = [];
    this.dettesTotal = [];
    this.creditTotal = [];
    if (this.totalDebt !== undefined && this.totalDebt !== null) {  
      for ( let t of this.totalDebt) {
        this.totauxMobile += t.detteMobileTTC;
        this.totauxServices += t.detteServiceTTC;
        this.totauxDettestotals += t.detteTotalTTC;
        this.totauxCreditTotals += t.totalCreditTTC;
        this.totalsRemaining.push((t.detteTotalTTC - (-t.totalCreditTTC)).toFixed(2));
        this.mobile.push(t.detteMobileTTC.toFixed(2));
        this.service.push(t.detteServiceTTC.toFixed(2));
        this.dettesTotal.push(t.detteTotalTTC.toFixed(2));
        this.creditTotal.push(t.totalCreditTTC.toFixed(2));
      }
      this.totauxRemaining = (this.totauxDettestotals + this.totauxCreditTotals);
      /*this.totauxRemaining = (this.totauxDettestotals - this.totauxCreditTotals).toFixed(2);
      this.totauxMobile = (this.totauxMobile).toFixed(2);
      this.totauxServices = (this.totauxServices).toFixed(2);
      this.totauxDettestotals = (this.totauxDettestotals).toFixed(2);
      this.totauxCreditTotals = (this.totauxCreditTotals).toFixed(2);*/

    }   
  }

  getColorTotalRemaining(val: number , val2: number): String {
    const varResult = val - val2;
    return varResult > 0 ? 'red' : 'black';
  }

  setColumnRef(): void {	
    this.columnDefs = [
      {
        headerName: 'CONTRAT',
        headerTooltip: 'CONTRAT',
        field: 'nicheIdentifier',
        cellClass: 'cell-wrap-text',
        width: 120,
        cellClassRules :  {
          'rows-dynamic-style ': (params) => params.data.nicheIdentifier === this.nicheValue || (!this.isRowCliked && params.rowIndex===0 
            && this.totalDebt.length > 1 )
        },
        sort: 'asc'
        
      },
      {
        
        headerName: 'OFFRE',
        headerTooltip: 'OFFRE',
        field: 'offerLabel',
        cellClass: 'cell-wrap-text',
        width: 160,
        cellClassRules :  {
          'rows-dynamic-style ': (params) => params.data.nicheIdentifier === this.nicheValue || (!this.isRowCliked && params.rowIndex===0 
            && this.totalDebt.length > 1 )
        },
        autoHeight: true
        
      },
      {
        headerName: 'MOBILE',
        headerTooltip: 'MOBILE',
        field: 'detteMobileTTC',

        cellRenderer: 'linkRendererComponent',
        cellClass: 'text-right cell-wrap-text link',
        sortable: false,
        valueFormatter: (params) => params.value.toFixed(2),
        cellClassRules :  {
          'rows-dynamic-style': (params) => params.data.nicheIdentifier === this.nicheValue || (!this.isRowCliked && params.rowIndex===0 
            && this.totalDebt.length > 1)
        },
        width: 100 

      },
      {
        headerName: 'SERVICE',
        headerTooltip: 'SERVICE',
        field: 'detteServiceTTC',
        cellRenderer: 'linkRendererComponent',
        cellClass: 'text-right cell-wrap-text link',
        sortable: false,
        valueFormatter: (params) => params.value.toFixed(2),
        cellClassRules :  {
          'rows-dynamic-style': (params) => params.data.nicheIdentifier === this.nicheValue || (!this.isRowCliked && params.rowIndex===0 
            && this.totalDebt.length > 1)
        },
        width: 100 
      },
      {
        headerName: 'TOTAL',
        headerTooltip: 'TOTAL',
        field: 'detteTotalTTC',
        cellClass: 'text-right cell-wrap-text',
        sortable: false,
        width: 100 ,
        autoHeight: true,
        cellClassRules :  {
          'rows-dynamic-style': (params) => params.data.nicheIdentifier === this.nicheValue || (!this.isRowCliked && params.rowIndex===0 
            && this.totalDebt.length > 1)
        },
        valueFormatter: (params) => params.value.toFixed(2)
       
      },
      {
        headerName: 'EN COURS',
        headerTooltip: 'EN COURS',
        field: 'totalCreditTTC',
        cellClass: 'text-right cell-wrap-text',
        sortable: false,
        cellClassRules :  {
          'rows-dynamic-style': (params) => params.data.nicheIdentifier === this.nicheValue || (!this.isRowCliked && params.rowIndex===0 
            && this.totalDebt.length > 1)
        },
        width: 100 ,
        autoHeight: true,
        valueFormatter: (params) => params.value.toFixed(2)

      },
      {
        headerName: 'RESTE DÛ',
        headerTooltip: 'RESTE DÛ',
        field: 'totalRemaining',
        sortable: false,
        width: 100 ,
        autoHeight: true,
        cellClassRules :  {
          'rows-dynamic-style': (params) => params.data.nicheIdentifier === this.nicheValue || (!this.isRowCliked && params.rowIndex===0 
            && this.totalDebt.length > 1)
        },
        valueGetter: params => (params.data.detteTotalTTC - (-params.data.totalCreditTTC)).toFixed(2),
        cellClass: params => {
          let classes = 'text-right cell-wrap-text mr-5 ';
          classes += (params.data.detteTotalTTC - params.data.totalCreditTTC > 0) ? 'red' : 'black';
          return classes;
        }
      }
    ];

    this.columnDefsTotals = [
      {
        headerName: 'MOBILE',
        headerTooltip: 'MOBILE',
        field: 'detteMobileTTC',
        cellClass: 'text-right cell-wrap-text',
        sortable: false,
        width: 100 ,
        autoHeight: true,
        cellRenderer: params => `<strong> ${params.value.toFixed(2)}</strong>`
      },
      {
        headerName: 'SERVICE',
        headerTooltip: 'SERVICE',
        field: 'detteServiceTTC',
        cellClass: 'text-right cell-wrap-text',
        sortable: false,
        width: 100 ,
        autoHeight: true,
        cellRenderer: params => `<strong> ${params.value.toFixed(2)}</strong>`
      },
      {
        headerName: 'TOTAL',
        headerTooltip: 'TOTAL',
        field: 'detteTotalTTC',
        cellClass: 'text-right cell-wrap-text ',
        sortable: false,
        width: 100 ,
        autoHeight: true,
        cellRenderer: params => `<strong> ${params.value.toFixed(2)}</strong>`
      },
      {
        headerName: 'EN COURS',
        headerTooltip: 'EN COURS',
        field: 'totalCreditTTC',
        cellClass: 'text-right cell-wrap-text ',
        sortable: false,
        width: 100 ,
        autoHeight: true,
        cellRenderer: params => `<strong> ${params.value.toFixed(2)}</strong>`
      },
      {
        headerName: 'RESTE DÛ',
        headerTooltip: 'RESTE DÛ',
        field: 'totalRemaining',
        sortable: false,
        width: 100 ,
        autoHeight: true,
        cellRenderer: params => `<strong> ${(params.data.detteTotalTTC - (-params.data.totalCreditTTC)).toFixed(2)}</strong>`,
        cellClass: params => {
          let classes = 'text-right cell-wrap-text bold mr-5 ';
          classes += (params.data.detteTotalTTC - params.data.totalCreditTTC > 0) ? 'red' : 'black';
          return classes;
        }
      }
    ];
  }

  navigateToDebtDeatil( info: any ): void {
    const  univers = (info.colDef.headerName === UNIVERS_PENICHE.SERVICE.code) ? UNIVERS_PENICHE.SERVICE.code : UNIVERS_PENICHE.MOBILE.code ; 
    this.router.navigate(
      ['/customer-dashboard', this.customerId, 'financial-detail', 'history'],
      {
        queryParams: { rowSelected: info.rowIndex , univers , nicheIdentifier: info.data.nicheIdentifier },
        queryParamsHandling: 'merge'
      }
    );
  }

}
