import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CustomerParcItemVO } from '../../../../_core/models/customer-parc-item-vo';
import { ParcLigneService } from './../../../../_core/services/parc-ligne.service';
import { isNullOrUndefined,getDefaultStringEmptyValue } from '../../../../_core/utils/string-utils';
import { formatForfait } from '../../../../_core/utils/formatter-utils';
import { getCustomerIdFromURL } from '../../customer-dashboard-utils';
import { ParkItemListParticularService } from '../../../park-item/park-item-list-particular/park-item-list-particular.service';
import { CSS_CLASS_NAME } from '../../../../_core/constants/constants';
import { DateFormatPipeFrench } from '../../../../_shared/pipes';

@Component({
  selector: 'app-parc-lignes',
  templateUrl: './parc-lignes.component.html',
  styleUrls: ['./parc-lignes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ParcLignesComponent implements OnInit {
  
  parcLignes: CustomerParcItemVO;

  @Input()
  isParticular: boolean;

  @Input()
  seeMore: boolean;
  datePattern =  "dd MMM yyyy";
  customerId: string;
  columnDefs: any[];
  defaultSortModel: any[];
  isEmptyParcLignes: boolean;
  inCompleteCall: boolean = true;
  FIXE = 'FIXE';
  TEXT_CENTER_NO_CURSOR = 'text-center no-cursor';
  TEXT_CENTER = 'text-center';
  CELL_WRAP_TEXT = 'cell-wrap-text';
  TEXT_RIGHT_CELL_WRAP_TEXT_NO_CURSOR = 'text-right cell-wrap-text no-cursor';
  TEXT_RIGHT_CELL_WRAP_TEXT = 'text-right cell-wrap-text';
  CELL_WRAP_TEXT_NO_CURSOR = 'cell-wrap-text no-cursor';

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly parkItemListParticularService: ParkItemListParticularService,
    private readonly parcLigneService: ParcLigneService,
    private readonly datePipe: DateFormatPipeFrench,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.customerId = params.get('customerId');
    });
    this.defaultSortModel = [
      // { colId: 'status', sort: 'desc' },
      { colId: 'dateRenewal', sort: 'asc' }
    ];
  
      this.getParcLignes();
      this.setColumnRef();
    
  }
  getParcLignes() {
    let customerId = getCustomerIdFromURL(this.route);
    this.route.params.subscribe(params => {
      this.inCompleteCall = true;
      if(!isNullOrUndefined(params['customerId'])){
        customerId = params['customerId'];
      }
    
      const showDetail = Boolean(this.route.data['showDetail']);
      this.parcLigneService
      .getParcLigneEnCoursByCustomer(customerId, showDetail)
      .pipe(catchError(() => of(null)))
      .subscribe(parcLignes => {
        this.parcLignes = parcLignes;
      },
      (error)=>{
        this.inCompleteCall = false;
      },
      ()=>{
        this.isEmptyParcLignes = this.parcLignes.listParcLigne.length === 0;
        this.inCompleteCall = false;
      });
    });
  }

  setColumnRef(): void {
    this.columnDefs = [
      {
        headerName: 'TYPE',
        headerTooltip: 'TYPE',
        field: 'type',
        comparator: this.typeComparator,
        cellRenderer: params => {
          if(!isNullOrUndefined(params.data.linkedSimParkItem)) {
            return  `<span class='icon multisim' ></span>` 
          }
          return `<span class='icon ${this.getImage(
            params.data.type
          )}' ></span>`;
        },
        width: 110,
        cellClass: params => { 
          return params.data.type === this.FIXE ? this.TEXT_CENTER_NO_CURSOR : this.TEXT_CENTER
        }
      },
      {
        headerName: 'LIGNE',
        headerTooltip: 'LIGNE',
        field: 'ligne',
        cellClass: params => { 
          return params.data.type === this.FIXE ? this.CELL_WRAP_TEXT_NO_CURSOR : this.CELL_WRAP_TEXT
        },
        valueGetter: params => this.ligneFormatter(params.data.ligne),
        width: 160,
        autoHeight: true
      },
      {
        headerName: 'STATUT',
        headerTooltip: 'STATUT',
        field: 'status',
        comparator: this.typeComparator,
        cellRenderer: params =>
          `<span class='icon ${this.getImage(params.data.status)}' ></span>`,
        cellClass: params => { 
            return params.data.type === this.FIXE ? this.TEXT_CENTER_NO_CURSOR : this.TEXT_CENTER
        },
        width: 130
      },
      {
        headerName: 'FORFAIT',
        headerTooltip: 'FORFAIT',
        field: 'forfait',
        cellClass: params => { 
          return params.data.type === this.FIXE ? this.CELL_WRAP_TEXT_NO_CURSOR : this.CELL_WRAP_TEXT
        },
        valueGetter: params => formatForfait(params.data.forfait),
        width: 200,
        autoHeight: true
      },
      {
        headerName: 'STATUT RENOUV.',
        headerTooltip: 'STATUT RENOUV.',
        field: 'rangRenewal',
        colId: 'renouvStatut',
        comparator: this.parkItemListParticularService.statusRenewalComparators,
        cellRenderer: _params => {
        let val = '';
        if(!isNullOrUndefined(_params.data) && _params.data.type === 'MOBILE') {
          val = `<span class="icon ${this.parkItemListParticularService.getStatutRenouv(_params.data.rangRenewal)} "></span> `
        }
        return val;
      },
      cellClass: params => { 
        return params.data.type === this.FIXE ? `${CSS_CLASS_NAME.TEXT_CENTER} no-cursor` : CSS_CLASS_NAME.TEXT_CENTER
      },
      width: 180
      },
      {
        headerName: 'PROCHAIN RENOUV.',
        headerTooltip: 'PROCHAIN RENOUV.',
        field: 'dateRenewal',
        colId: 'dateRenouvellement',
        comparator: (d1, d2, p1, p2) => this.parkItemListParticularService.dateRenewalComparator(d1, d2, p1, p2, 'type'),
        cellRenderer: params => {
          let renewal = `-`;
          if (params.data.dateRenewal && params.data.type === 'MOBILE' && params.data.rangRenewal === 'unauthorized') {
            renewal = this.datePipe.transform(params.data.dateRenewal, this.datePattern);
          }
          return renewal;
        },
        cellClass: params => { 
          return params.data.universe === this.FIXE ? `${CSS_CLASS_NAME.CELL_WRAP_TEXT} no-cursor` : CSS_CLASS_NAME.CELL_WRAP_TEXT
        },
        headerClass: 'text-right',
        width: 200,
        autoHeight: true
      },
      {
        headerName: 'HF (€)',
        headerTooltip: 'HF (€)',
        field: 'horsF',
        valueGetter: params => getDefaultStringEmptyValue(params.data.horsF),
        cellRenderer: params => {
          let horsF = `<span class='text-right cell-wrap-text' >`;
          horsF += !isNullOrUndefined(params.data.horsF)
            ? `<strong><span class='red cell-wrap-text'>${params.data.horsF}`
            : `-`;

          horsF += `</span>`;
          return horsF;
        },
        cellClass: params => { 
          return params.data.type === this.FIXE ? this.TEXT_RIGHT_CELL_WRAP_TEXT_NO_CURSOR : 'text-right cell-wrap-text'
        },
        sortable: false,
        width: 100,
        autoHeight: true
      }
    ];
  }

  getImage(nameImage: string): string {
    const imageList = {
      inProgress: 'status-orange',
      authorized: 'status-green',
      unauthorized: 'status-red',
      notRestricted: 'status-stop',
      MOBILE: 'phone-mobile',
      FIXE: 'phone-home',
      INTERNET: 'internet',
      MULTISIM: 'multisim',
      ACTIF: 'play',
      ORANGE_VIP: 'vip',
      SUSPENDU: 'pause',
      RESILIE: 'status-red',
      HORS_CONTRAT: 'not-in-contract',
      EN_CREATION: 'in-progress-portabilit',
      DENUMEROTE: 'denumerot',
      ORANGE: 'orange',
      ORANGE_PRO: 'pro',
      ORANGE_BY_PARNASSE: 'orange_by_parnasse'
    };
    return imageList[nameImage];
  }

  getArrowImage(rangRenewal: string): string {
    return rangRenewal === 'unauthorized'
      ? 'arrow-right-black'
      : 'arrow-left-black';
  }

  typeComparator(type1: string, type2: string): number {
    return type1.localeCompare(type2) * -1;
  }

  ligneFormatter(value: string): string {
    if (!isNullOrUndefined(value) && value.length !== 0) {
      return value.replace(/(\d{2})/g, '$1 ').replace(/(^\s+|\s+$)/, '');
    }
    return '-';
  }

  selectRow(_row: any): void {
    if (_row.type === 'MOBILE' || _row.type === 'INTERNET') {
      if (this.route.snapshot.queryParams['from'] === 'all') {
        this.router.navigate([ '/customer-dashboard', this.customerId, 'park-item', _row.id], { queryParamsHandling: 'merge',
         queryParams: { from: 'all' , rangRenewal : _row.rangRenewal  } });
      } else {
        this.router.navigate([ '/customer-dashboard', this.customerId, 'park-item', _row.id], { queryParamsHandling: 'merge', 
        queryParams: { from: 'dashboard' ,   rangRenewal : _row.rangRenewal} });
      }
    } 
  }
}
