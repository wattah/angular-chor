import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { isNullOrUndefined, getDefaultStringEmptyValue } from '../../../../_core/utils/string-utils';
import { firstNameFormatter, getHighLightText } from '../../../../_core/utils/formatter-utils';
import { CONSTANTS } from '../../../../_core/constants/constants';
import { titleFullFormatter } from '../../../../_core/utils/formatter-utils';

@Component({
  selector: 'app-serp-interlocutors',
  templateUrl: './serp-interlocutors.component.html',
  styleUrls: ['./serp-interlocutors.component.scss']
})
export class SerpInterlocutorsComponent implements OnInit {
  
  @Input() interlocuteurs = [];

  @Input() searchPattern = '';

  paginationPageSize = 5;

  rowData: any = [];

  columnDefs;

  defaultSortModel: any[];

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.defaultSortModel = [
      { colId: 'lastName', sort: 'asc' }
    ];
    this.setColumnRef();
    this.getSearchPatternParam();
    this.getDataFromBackEndToDsiplay();
  }

  getSearchPatternParam(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      this.searchPattern = queryParams.get('search_pattern');
    });
  }

  getDataFromBackEndToDsiplay(): void {
    this.route.data.subscribe(resolversData => {
      this.interlocuteurs = resolversData['interlocuteurs'];
      this.setColumnRef();
    });
  }

  searchAction(row: any): void {
    if (row.category === 'ENTREPRISE' && isNullOrUndefined(row.companyNameParentId)) {
      this.router.navigate(['customer-dashboard/entreprise', row.idCustomer], { queryParams: { typeCustomer: CONSTANTS.TYPE_COMPANY, nicheValue: row.nicheIdentifier } });
    } else {
      this.router.navigate(['customer-dashboard/particular', row.idCustomer], { queryParams: { typeCustomer: CONSTANTS.TYPE_PARTICULAR, nicheValue: row.nicheIdentifier } });
    }
  }

  setColumnRef(): void {
    this.columnDefs = [
      {
        headerName: 'CIVILITE',
        field: 'title',
        valueGetter: params => titleFullFormatter(params.data.title),
        cellRenderer: params =>  getHighLightText(params.value, this.searchPattern),
        width: 120,
        suppressMenu: true,
        sortable: false
      },
      {
        headerName: 'PRENOM',
        field: 'firstName',
        valueGetter: params => {
          let firstName = getDefaultStringEmptyValue(params.data.firstName);
          if (firstName !== '-') {
            firstName = firstNameFormatter(firstName);
          }
          return firstName;
        },
        cellRenderer: params =>  getHighLightText(params.value, this.searchPattern),
        width: 200
      },
      {
        headerName: 'NOM',
        field: 'lastName',
        valueGetter: params => {
          let lastName = getDefaultStringEmptyValue(params.data.lastName);
          if (lastName !== '-') {
            lastName = lastName.toUpperCase();
          }
          return lastName;
        },
        cellRenderer: params =>  getHighLightText(params.value, this.searchPattern),
        sort: 'asc',
        suppressMenu: true,
        width: 200
      },
      {
        headerName: 'CONTRAT',
        valueGetter: params =>params.data.nicheIdentifier,
        cellRenderer: params =>  getHighLightText(params.value, this.searchPattern),
        width: 280
      }
    ];
  }
  
}
