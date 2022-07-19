import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SearchBarService } from './../../../../_core/components/search-bar/search-bar.service';
import { MembrePerson } from '../../../../_core/models';
import { getDefaultStringEmptyValue } from '../../../../_core/utils/string-utils';
import { firstNameFormatter, toUpperCase } from '../../../../_core/utils/formatter-utils';
import { CustomerDashboardService } from '../../../../main/customer-dashboard/customer-dashboard.service';
import { CONSTANTS, UNIVERS } from '../../../../_core/constants/constants';
import { TitleServices } from '../../../../_core/services/title-services.service';
import { getEncryptedValue } from '../../../../_core/utils/functions-utils';
import { NEW_SEARCH_BAR } from './../../../../_core/constants/search-constant';
import { CustomerSearchVO } from '../../../../_core/models/search/customer-search-vo';

const CUSTOMER_DASHBOARD = 'customer-dashboard';
const TYPE = 'TYPE';
const REFERENCE = 'REFERENCE';
const EMAIL = 'EMAIL';
const LIBELLE = 'LIBELLE';
const STATUT = 'STATUT';
const COMPTE_FACTURATION = 'N° Compte de facturation';
@Component({
  selector: 'app-serp-all-table',
  templateUrl: './serp.all.component.html',
  styleUrls: ['./serp.all.component.scss']
})
export class SerpAllComponent implements OnInit {
  
  rowData: CustomerSearchVO[] = [];
  columnDefs;
  persons = [];
  searchPattern = '';
  searchType : String;
  error = false;

  paginationPageSize = 30;
  defaultSortModel: any[];
  picto = 'picto';
  libelle = 'libelle';
  status = 'status';
  nicheIdentifier = 'nicheIdentifier';
  email = 'email';
  billAccountNumber = 'billAccountNumber';
  sortASC = 'asc';

  constructor(private router: Router, private route: ActivatedRoute, private customerDashboardService: CustomerDashboardService, 
    private titleServices: TitleServices  , private readonly searchBarService: SearchBarService) {}

  ngOnInit(): void {
    this.getSearchPatternParam();
    this.getSearchTypeParam();
    this.getCustomersSuggestionResult();
    this.titleServices.setTitle('Athena');
  }

  getSearchPatternParam(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      this.searchPattern = queryParams.get('search_pattern');
    });
  }

  getSearchTypeParam(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      this.searchType = queryParams.get('searchType');
    });
  }

  getCustomersSuggestionResult(): void {
    this.route.data.subscribe(resolversData => {
      this.rowData = resolversData['all'];
      this.setPictoAndLibelle();
      if(this.searchType && this.searchType === NEW_SEARCH_BAR.SEARCH_TYPE_ADRESSE_EMAIL){
        this.defaultSortModel = [
          { colId: this.email, sort: this.sortASC }
        ];
        this.setColumnRef();
      }else{
        if(this.searchType && this.searchType === NEW_SEARCH_BAR.SEARCH_TYPE_NUM_COMPTE_FACTURATION){
          this.paginationPageSize = 5;
          this.setBillColumnRef();
        }else{
          this.defaultSortModel = [
            { colId: this.nicheIdentifier, sort: this.sortASC }
          ];
          this.setGlobalColumnRef();
        }
      }
    });
  }

  setPictoAndLibelle() {
    if(this.rowData){
      this.rowData.map(row=> {
        row.picto = this.getPersonImage(row);
        row.libelle = this.getLibelle(row);
        return row;
      });
    }
  }

  nicheIdentifierTransformer(nicheIdentifier: string): string {
    let nicheIdTransformed = '';
    if (nicheIdentifier !== null && nicheIdentifier.length === 9) {
      nicheIdTransformed = nicheIdentifier
        .substr(0, 6)
        .replace(/(^\s+|\s+$)/, '');
      nicheIdTransformed += '' + nicheIdentifier.substr(6);
    }
    return nicheIdTransformed;
  }

  idProductMasterTransformer(idMasterProduct: string): string {
    let idMasterProductTransformed = '';
    if (idMasterProduct !== null && idMasterProduct.length >= 6) {
      idMasterProductTransformed = idMasterProduct
        .substr(0, 6)
        .replace(/(\d{3})/g, '$1 ')
        .replace(/(^\s+|\s+$)/, '');
      idMasterProductTransformed += ' ' + idMasterProduct.substr(6);
    }
    return idMasterProductTransformed;
  }

  private navigateToCustomerDetail(customerId: number, typeImage: string, nicheIdentifier: string, univers : string): void {
    if(this.searchType && this.searchType === NEW_SEARCH_BAR.SEARCH_TYPE_NUM_COMPTE_FACTURATION){
      this.router.navigate(
        [CUSTOMER_DASHBOARD, getEncryptedValue(customerId), 'financial-detail', 'history'],
        { 
          queryParams: { typeCustomer : typeImage ===  'beneficiaire.svg' ? CONSTANTS.TYPE_BENEFICIARY:typeImage === 'entreprise.svg' ? CONSTANTS.TYPE_COMPANY : CONSTANTS.TYPE_PARTICULAR,
          rowSelected: 0 , mobileSelected: true, nicheIdentifier: nicheIdentifier,univers : univers ? toUpperCase(univers): toUpperCase(UNIVERS.MOBILE.value) }, 
          queryParamsHandling: 'merge' 
        }
      );
    }else{
      if (typeImage === 'beneficiaire.svg') {
        this.router.navigate(['customer-dashboard', 'particular', customerId], { queryParams: { typeCustomer: CONSTANTS.TYPE_BENEFICIARY , nicheValue: nicheIdentifier} });
      } else if (typeImage === 'entreprise.svg') {
        this.router.navigate(['customer-dashboard', 'entreprise', customerId], { queryParams: { typeCustomer: CONSTANTS.TYPE_COMPANY, nicheValue: nicheIdentifier} });
      } else {
        this.router.navigate(['customer-dashboard', 'particular', customerId], { queryParams: { typeCustomer: CONSTANTS.TYPE_PARTICULAR, nicheValue: nicheIdentifier } });
      }
    }
  }

  // afficher la fiche 360 si la ligne selectionnée / cliquée appartient à un client ou ....
  private searchAction(row: any): void {
    if (row.customerId) {
      this.navigateToCustomerDetail(row.customerId, row.picto,row.nicheIdentifier, row.univers);
    } else {
       console.log(row);
    }
  }

  private getLibelle(customerSearchVO: CustomerSearchVO): any {
    let libelle = '';
    if (customerSearchVO.categoryCustomer === NEW_SEARCH_BAR.CATEGORY_CUSTOMER.COMPANY) {
      libelle = customerSearchVO.crmName;
    } else {
      const crmName = customerSearchVO.crmName? customerSearchVO.crmName.toUpperCase():'';
      const firstName: string = customerSearchVO.firstName ? firstNameFormatter(customerSearchVO.firstName) : '';
      libelle = `${crmName} ${firstName}`;
    }
    return libelle;
  }

  private getBillLibelle(mp: MembrePerson): any {
    let libelle = '';
    if (mp.idProduct) {
      libelle = mp.nameProduct;
    } else if (mp.category === 'ENTREPRISE') {
      libelle = mp.companyName;
    } else {
      const firstName: string = mp.firstName ? mp.firstName.charAt(0).toUpperCase() + mp.firstName.slice(1) : '';
      const lastName: string = mp.lastName ? toUpperCase(mp.lastName) : '';
      libelle = lastName + ' ' + firstName;
    }
    return libelle;
  }

  private setColumnRef(): void {
    this.columnDefs = [
      {
        headerName: TYPE,
        width: 140,
        field: this.picto,
        sortable: true,
        comparator: (p1, p2) => this.typeComparator(p1, p2),
        cellRenderer: params => this.getPathPicto(params)
      },
      {
        headerName: REFERENCE,
        field: this.nicheIdentifier,
        comparator: (p1, p2) => this.typeComparator(p1, p2),
        cellRenderer: params => this.getHighLightText(params.data.nicheIdentifier),
        sortable: true,
        width: 200
      },
      {
        headerName: LIBELLE,
        field: this.libelle,
        comparator: (p1, p2) => this.typeComparator(p1, p2),
        cellRenderer: params => this.getHighLightText(getDefaultStringEmptyValue(params.data.libelle)),
        sortable: true,
        width: 220
      },
      {
        headerName: EMAIL,
        field: this.email,
        sort: 'asc'
      },
      {
        headerName: STATUT,
        field: this.status,
        cellClass: 'd-flex justify-content-left',
        sortable: true,
        comparator: (p1, p2) => this.typeComparator(String(p1), String(p2)),
        valueFormatter: params => params.data.status ? this.searchBarService.getStatus(params.data.status):'-',
      }
    ];
  }
  getPathPicto(params: any) {
    return params && params.data ? `<img src='assets/svg/${params.data.picto}' style="margin-bottom: 5px"  
            alt='${params.data.picto}' title='${params.data.picto}' />`:'-';
  }

  private setGlobalColumnRef(): void {
    this.columnDefs = [
      {
        headerName: TYPE,
        width: 140,
        field: this.picto,
        sortable: true,
        comparator: (p1, p2) => this.typeComparator(p1, p2),
        cellRenderer: params => this.getPathPicto(params)
      },
      {
        headerName: REFERENCE,
        field: this.nicheIdentifier,
        comparator: (p1, p2) => this.typeComparator(p1, p2),
        cellRenderer: params => this.getHighLightText(params.data.nicheIdentifier),
        sortable: true,
        width: 200
      },
      {
        headerName: LIBELLE,
        field: this.libelle,
        comparator: (p1, p2) => this.typeComparator(p1, p2),
        cellRenderer: params => this.getHighLightText(getDefaultStringEmptyValue(params.data.libelle)),
        sortable: true,
        width: 220
      },
      {
        headerName: STATUT,
        field: this.status,
        cellClass: 'd-flex justify-content-left',
        sortable: true,
        comparator: (p1, p2) => this.typeComparator(String(p1), String(p2)),
        valueFormatter: params => params.data.status ? this.searchBarService.getStatus(params.data.status):'-',
      }
    ];
  }


  private setBillColumnRef(){
  this.columnDefs = [
    {
      headerName: TYPE,
      width: 140,
      field: this.picto,
      sortable: true,
      comparator: (p1, p2) => this.typeComparator(p1, p2),
      cellRenderer: params => this.getPathPicto(params)
    },
    {
      headerName: COMPTE_FACTURATION,
      field: this.billAccountNumber,
      comparator: (p1, p2) => this.typeComparator(p1, p2),
      cellRenderer: params => this.getHighLightText(params.data.billAccountNum),
      sortable: true,
      width: 200
    },
    {
      headerName: LIBELLE,
      field: this.libelle,
      comparator: (p1, p2) => this.typeComparator(p1, p2),
      cellRenderer: params => this.getHighLightText(getDefaultStringEmptyValue(params.data.libelle)),
      sortable: true,
      width: 220
    }
  ];
}

  private getData(persons: MembrePerson[]): any {
    const data = [];
    persons.forEach(mp => {
      const row: any = mp;
      row.picto = this.getPersonPicto(mp);
      row.libelle = this.getBillLibelle(mp);
      row.univers = mp.univers;
      row.customerId = mp.idCustomer;
      data.push(row);
    });
    return data;
  }

  private getPersonPicto(mp: MembrePerson): string {
    let pictoName: string;
    if (mp.idCustomer !== null) {
      if (mp.category === 'ENTREPRISE') {
        pictoName = 'entreprise.svg';
      } else if (mp.companyNameParentId !== null) {
        pictoName = 'beneficiaire.svg';
      } else {
        pictoName = 'particulier.svg';
      }
    } else if (mp.nomenclature !== null && mp.nomenclature.toString().startsWith('1')) {
      pictoName = 'type-services.svg';
    } else {
      pictoName = 'type-materiel.svg';
    }
    return pictoName;
  }

  private typeComparator(typePerson1: string, typePerson2: string): number {
    return typePerson1.localeCompare(typePerson2) * -1;
  }

  private getHighLightText(text: string) {
    const re = new RegExp(`(${ this.searchPattern })`, 'ig');
    return text.replace(re, `<span class="highLightedText" >$&</span>`);
  }

  private getPersonImage(customer: CustomerSearchVO): string {
    if (!customer.companyCustomerId) {
      if(NEW_SEARCH_BAR.CATEGORY_CUSTOMER.PARTICULAR === customer.categoryCustomer) {
        return 'particulier.svg';
      } else {
        return 'entreprise.svg';;
      }
    } else {
      return 'beneficiaire.svg';
    }
  }

}
