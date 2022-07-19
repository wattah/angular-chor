import { catchError } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ParcLigneService } from './../../../_core/services/parc-ligne.service';
import { CustomerParkLigne } from './../../../_core/models/customer-parc-item-vo';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import {
  getDefaultStringEmptyValue,
  isNullOrUndefined
} from '../../../_core/utils/string-utils';

import {
  formatForfait,
  firstNameFormatter,
  toUpperCase
} from '../../../_core/utils/formatter-utils';
import { CONSTANTS, CSS_CLASS_NAME, TELCO_UNIVERS } from '../../../_core/constants/constants';
import { DateFormatPipeFrench } from '../../../_shared/pipes';
import { getCustomerIdFromURL } from '../customer-dashboard-utils';
import { of } from 'rxjs';
import { ParkItemListParticularService } from '../../park-item/park-item-list-particular/park-item-list-particular.service';
import { NicheContractStatus } from '../../../_core/enum/customer-park-item-statut.enum';

@Component({
  selector: 'app-beneficiaire-list',
  templateUrl: './beneficiaire.list.component.html',
  styleUrls: ['./beneficiaire.list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BeneficiaireListComponent implements OnInit {
  FIXE = 'FIXE';
  TEXT_CENTER_NO_CURSOR = 'text-center no-cursor';
  TEXT_CENTER = 'text-center';
  CELL_WRAP_TEXT = 'cell-wrap-text';
  TEXT_RIGHT_CELL_WRAP_TEXT_NO_CURSOR = 'text-right cell-wrap-text no-cursor';
  TEXT_RIGHT_CELL_WRAP_TEXT = 'text-right cell-wrap-text';
  CELL_WRAP_TEXT_NO_CURSOR = 'cell-wrap-text no-cursor';
  beneficiares: CustomerParkLigne[];
  customerId: string;
  centerCell = 'text-center' ;
  cellWrap = 'cell-wrap-text';
  actifBenefeciries: CustomerParkLigne[]= [];
  beneficiaryType = CONSTANTS.TYPE_BENEFICIARY;
  isEmptyBeneficiares: boolean = false;
  rowData: any = [];
  columnDefs: any[];
  defaultSortModel: any[];
  datePattern =  "dd MMM yyyy";
  inCompleteCall: boolean = true;
  constructor(private readonly parcLigneService: ParcLigneService,
              private readonly router: Router,
              private readonly route: ActivatedRoute,
              readonly  parkItemListParticularService: ParkItemListParticularService,
              readonly  datePipe: DateFormatPipeFrench) {
    this.setColumnRef();
  }

  ngOnInit() {
    
    this.defaultSortModel = [
      { colId: 'subscriptionDate', sort: 'asc' }
    ];
    this.getBeneficiares();
   
  }
  getBeneficiares()  {
    this.customerId = getCustomerIdFromURL(this.route);
    this.route.params.subscribe(params => {
      this.inCompleteCall = true;
      this.customerId = params['customerId'];
      this.parcLigneService.getParcLignesBeneficiaireByCustomer(this.customerId)
      .pipe(catchError(() => of([])))
      .subscribe(
        (beneficiares) => {
          this.actifBenefeciries = [];
          this.beneficiares = beneficiares;
          this.beneficiares.forEach(
              benef => {
                if (benef.status ===  NicheContractStatus.ACTIF || benef.status === NicheContractStatus.ORANGE_BY_PARNASSE  ) {
                  this.actifBenefeciries.push(benef);
                }
              }
              );
        },
        (error) => {},
        () => {
          this.isEmptyBeneficiares = this.actifBenefeciries.length === 0;
          this.inCompleteCall = false;
         
        }
      );
    });
  }

  getRangImage(rangRenewal: string): string {
    const imageList = {
      inProgress: 'status-orange',
      authorized: 'status-green',
      unauthorized: 'status-red',
      notRestricted: 'status-stop'
    };

    return imageList[rangRenewal];
  }
 
  selectRow(row: any): void {
      const CUSTOMER_DASHBOARD = '/customer-dashboard';
      if (row.type === TELCO_UNIVERS.TEL_MOBILE|| row.type === TELCO_UNIVERS.INTERNET) {
        if (this.route.snapshot.queryParams['from'] === 'all') {
          this.router.navigate([CUSTOMER_DASHBOARD , this.customerId, 'park-item', row.id], { queryParamsHandling: 'merge',
           queryParams: { from: 'all' ,  rangRenewal : row.rangRenewal } });
        } else {
          this.router.navigate([ CUSTOMER_DASHBOARD, this.customerId, 'park-item', row.id], { queryParamsHandling: 'merge', 
          queryParams: { from: 'dashboard',  rangRenewal : row.rangRenewal } });
        }
      } 
  }

  setColumnRef(): void {
    this.columnDefs = [
      {
        headerName: 'bénéficiaire',
        headerTooltip: 'bénéficiaire',
        valueGetter: params => this.getBeneficiaryName( params.data.fistName, params.data.lastName),
        colId: 'membre',
        width: 160,
        autoHeight: true,
        sort: 'asc',
        cellClass: this.cellWrap
      },
      {
        headerName: 'TYPE',
        field: 'type',
        headerTooltip: 'TYPE',
        comparator: this.typeComparator,
        cellClass: params => { 
          return params.data.type === this.FIXE ? this.TEXT_CENTER_NO_CURSOR : this.TEXT_CENTER
        },
        width: 110,
        cellRenderer: params => {
          if(!isNullOrUndefined(params.data.linkedSimParkItem)) {
            return  `<span class='icon multisim' ></span>` 
          }
          return `<span class='icon ${this.getImage(
            params.data.type
          )}' ></span>`;
        },
      },
      {
        headerName: 'LIGNE',
        headerTooltip: 'LIGNE',
        valueGetter: params => this.ligneFormatter(params.data.ligne),
        field: 'ligne',
        width: 160,
        cellClass: params => { 
          return params.data.type === this.FIXE ? this.CELL_WRAP_TEXT_NO_CURSOR : this.CELL_WRAP_TEXT
        },
        autoHeight: true
      },
      {
        headerName: 'STATUT',
        headerTooltip: 'STATUT',
        cellClass: params => { 
          return params.data.type === this.FIXE ? this.TEXT_CENTER_NO_CURSOR : this.TEXT_CENTER
        },
        width: 130,
        field: 'status',
        cellRenderer: params =>
          `<span class='icon ${this.getImage(params.data.status)}' ></span>`,
        comparator: this.typeComparator,
      },
      {
        headerName: 'FORFAIT',
        valueGetter: params => formatForfait(params.data.forfait),
        width: 200,
        headerTooltip: 'FORFAIT',
        autoHeight: true,
        field: 'forfait',
        cellClass: params => { 
          return params.data.type === this.FIXE ? this.CELL_WRAP_TEXT_NO_CURSOR : this.CELL_WRAP_TEXT
        },
      },
      {
        headerName: 'STATUT RENOUV.',
        cellRenderer: _params => {
          let val = '';
          if(!isNullOrUndefined(_params.data) && _params.data.type === 'MOBILE') {
            val = `<span class="icon ${this.parkItemListParticularService.getStatutRenouv(_params.data.rangRenewal)} "></span> `
          }
          return val;
        },
        colId: 'renouvStatut',
        comparator: this.parkItemListParticularService.statusRenewalComparators,
        cellClass: params => { 
          return params.data.type === this.FIXE ? `${CSS_CLASS_NAME.TEXT_CENTER} no-cursor` : CSS_CLASS_NAME.TEXT_CENTER
        },
        headerTooltip: 'STATUT RENOUV.',
        field: 'rangRenewal',
        width: 200
      },
      {
        headerName: 'PROCHAIN RENOUV.',
        colId: 'dateRenouvellement',
        headerTooltip: 'PROCHAIN RENOUV.',
        field: 'dateRenewal',
        comparator: (d1, d2, p1, p2) => this.parkItemListParticularService.dateRenewalComparator(d1, d2, p1, p2, 'type'),
        cellClass: params => { 
          return params.data.universe === this.FIXE ? `${CSS_CLASS_NAME.CELL_WRAP_TEXT} no-cursor` : CSS_CLASS_NAME.CELL_WRAP_TEXT
        },
        headerClass: 'text-right',
        width: 220,
        autoHeight: true,
        cellRenderer: params => {
          let renewal = `-`;
          if (params.data.dateRenewal && params.data.type === 'MOBILE' && params.data.rangRenewal === 'unauthorized') {
            renewal = this.datePipe.transform(params.data.dateRenewal, this.datePattern);
          }
          return renewal;
        },
      },
      {
        headerName: 'HF (€)',
        field: 'horsF',
        sortable: false,
        headerTooltip: 'HF (€)',
        width: 100,
        valueGetter: params => getDefaultStringEmptyValue(params.data.horsF),
        cellClass: params => { 
          return params.data.type === this.FIXE ? this.TEXT_RIGHT_CELL_WRAP_TEXT_NO_CURSOR : 'text-right cell-wrap-text'
        },
        autoHeight: true,
        cellRenderer: params => {
          let horsF = `<span class='text-right cell-wrap-text' >`;
          horsF += !isNullOrUndefined(params.data.horsF)
            ? `<strong><span class='red cell-wrap-text'>${params.data.horsF}`
            : `-`;

          horsF += `</span>`;
          return horsF;
        },
      }
    ]
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
      ORANGE_PRO: 'pro'
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

  getBeneficiaryName(firstName: string, lastName: string): string {
    let name = '-';
    if (firstName && lastName) {
      name = `${toUpperCase(lastName)} ${firstNameFormatter(firstName)} `;
    } else if (firstName && !lastName) {
      name = firstNameFormatter(firstName);
    } else if (!firstName && lastName) {
      name = toUpperCase(lastName);
    }
    return name;
  }

  getLineAndType(params: any): any {
    const MULTISIM ='multisim';
    let type = this.parkItemListParticularService.getTypeImage(params.data.type);
    const line = this.parkItemListParticularService.defaultLigne(params.data.ligne);
    if(!isNullOrUndefined(params.data.linkedSimParkItem)){
    type = MULTISIM;
    }
    return `<span class="icon ${type}"></span>${line}`;
  }

  lineComparator(t1: string, t2: string, param1: any, param2: any): number {
    
    if (t1.localeCompare(t2) === 0) {
     
      return param1.data.type.localeCompare(param2.data.type);

    }
    return t1.toLocaleString().localeCompare(t2.toLocaleString()) * -1
  }
}
