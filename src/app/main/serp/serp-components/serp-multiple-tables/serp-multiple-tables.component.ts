import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Person } from '../../../../_core/models/person';
import { isNullOrUndefined, getDefaultStringEmptyValue } from '../../../../_core/utils/string-utils';
import { SerpService } from '../../serp.service';
import { firstNameFormatter, getHighLightText } from '../../../../_core/utils/formatter-utils';
import { CONSTANTS } from '../../../../_core/constants/constants';
import { titleFullFormatter } from '../../../../_core/utils/formatter-utils';

@Component({
  selector: 'app-serp-multiple-tables',
  templateUrl: './serp-multiple-tables.component.html',
  styleUrls: ['./serp-multiple-tables.component.scss'],
  styles: [
    `
			a:hover {
				cursor: pointer;
			}
		`
  ]
})
export class SerpMultipleTablesComponent implements OnInit {
  
  gridData: Person[] = [];

  memberType: any;

  searchPattern = '';
 
  dataSourcePrivate: Person[];

  dataSourceEntreprise: Person[];

  columnDefsPrivate;

  columnDefsEntreprise;

  paginationPageSize = 5;
 
  defaultSortModel: any[];

  defaultSortModelEntreprise: any[];

  constructor(private router: Router, private route: ActivatedRoute, private serpService: SerpService) {
  }

  ngOnInit(): void {
    this.getSearchPatternParam();
    this.memberType = this.route.snapshot.data['memberType'];
    this.getDataFromBackEndToDsiplay();
  }

  getSearchPatternParam(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      this.searchPattern = queryParams.get('search_pattern');
    });
  }

  getDataFromBackEndToDsiplay(): void {
    this.route.data.subscribe(resolversData => {
      this.gridData = resolversData['gridData'];
      this.filterPersonByCategory(this.getData(this.gridData));
      this.setColumnDefsPrivate();
      this.setColumnDefsEntreprise();
    });
  }


  /**
	 * Transformateur de l'identifiant niche.
	 * @param {string} nicheIdentifier
	 * @returns {string}
	 */
  nicheIdentifierTransformer(nicheIdentifier: string): string {
    let nicheIdTransformed = '';
    if (!isNullOrUndefined(nicheIdentifier) && nicheIdentifier.length === 9) {
      nicheIdTransformed = nicheIdentifier
        .substr(0, 6)
        .replace(/(\d{2})/g, '$1 ')
        .replace(/(^\s+|\s+$)/, '');
      nicheIdTransformed += ' ' + nicheIdentifier.substr(6);
    }
    return nicheIdTransformed;
  }

  /**
	 * Transformateur du siret.
	 * @param siret
	 */
  siretTransformer(siret: string): string {
    let siretTransformed = '';
    if (!isNullOrUndefined(siret) && siret.length >= 9) {
      siretTransformed = siret
        .substr(0, 9)
        .replace(/(\d{3})/g, '$1 ')
        .replace(/(^\s+|\s+$)/, '');
      siretTransformed += ' ' + siret.substr(9);
    } else {
      return getDefaultStringEmptyValue('');
    }
    return siretTransformed;
  }

  /**
	 * Initialisation des colonnes du tableau des particuliers
	 * @param rowCount
	 */
  private setColumnDefsPrivate(): void {
    this.defaultSortModel = [
      { colId: 'lastName', sort: 'asc' }
    ];
    this.columnDefsPrivate = [
      {
        headerName: 'TYPE',
        field: 'typeImage',
        comparator: (t1, t2) => t1.localeCompare(t2) * -1,
        hide: !this.memberType.isMember,
        cellRenderer: params => {
          const scrImage = this.serpService.getPersonImage(params.data);
          return `<img src="assets/svg/${scrImage}" style="margin-bottom: 5px" />`;
        },
        width: 120
      },
      {
        headerName: 'CIVILITE',
        field: 'title',
        valueGetter: params => titleFullFormatter(params.data.title),
        cellRenderer: params =>  getHighLightText(params.value, this.searchPattern),
        sortable: false,
        width: 120
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
        width: 200
      },
      {
        headerName: 'CONTRAT',
        valueGetter: params =>params.data.nicheIdentifier,
        cellRenderer: params =>  getHighLightText(params.value, this.searchPattern),
        width: 200
      }
    ];
  }

  /**
	 * Initialisation des colonnes du tableau des entreprises
	 * @param rowCount
	 */
  private setColumnDefsEntreprise(): void {
    this.defaultSortModelEntreprise = [
      { colId: 'companyName', sort: 'asc' }
    ];
    this.columnDefsEntreprise = [
      {
        headerName: 'RAISON SOCIALE',
        field: 'companyName',
        valueGetter: params => {
          return getDefaultStringEmptyValue(params.data.companyName);
        },
        cellRenderer: params =>  getHighLightText(params.value, this.searchPattern),
        sort: 'asc',
        width: 320
      },
      {
        headerName: 'IMMATRICULATION',
        valueGetter: params => this.siretTransformer(params.data.siret),
        cellRenderer: params =>  getHighLightText(params.value, this.searchPattern),
        width: 230
      },
      {
        headerName: 'CONTRAT',
        valueGetter: params =>params.data.nicheIdentifier,
        cellRenderer: params =>  getHighLightText(params.value, this.searchPattern),
        width: 230
      }
    ];
  }

  /**
	 * Filtrer par type de client
	 * @param persons
	 */
  private filterPersonByCategory(persons: Person[]): void {
    this.dataSourcePrivate = persons.filter(person => person.category === 'PARTICULIER');
    this.dataSourceEntreprise = persons.filter(person => person.category === 'ENTREPRISE');
  }
  /**
	 * Action sur une ligne du tableau
	 * @param row
	 */
  private rowAction(row: any): void {
    if (row.idCustomer) {
      this.toCustomerDetail(row.idCustomer, row.typeImage,  row.nicheIdentifier);
    } else {
      // console.log(row);
    }
  }

  /**
	 * Redirection vers la fiche 360
	 * @param customerId
	 */
  private toCustomerDetail(customerId: number, typeImage: string, nicheIdentifier: string): void {
    const customerDashboard = 'customer-dashboard';
    if ( typeImage === 'entreprise.svg') {
      this.router.navigate([customerDashboard, 'entreprise', customerId], { queryParams: { typeCustomer: CONSTANTS.TYPE_COMPANY, nicheValue: nicheIdentifier } });
    } else if ( typeImage === 'beneficiaire.svg') {
      this.router.navigate([customerDashboard, 'particular', customerId], { queryParams: { typeCustomer: CONSTANTS.TYPE_BENEFICIARY, nicheValue: nicheIdentifier } });
    } else if ( typeImage === 'particulier.svg') {
      this.router.navigate([customerDashboard, 'particular', customerId], { queryParams: { typeCustomer: CONSTANTS.TYPE_PARTICULAR, nicheValue: nicheIdentifier } });
    }  else {
      this.router.navigate(['search/customer', customerId]);
    }
  }

  private getData(persons: Person[]): any {
    const data = [];
    persons.forEach(mp => {
      const row: any = mp;
      row.typeImage = this.serpService.getPersonImage(mp);
      data.push(row);
    });
    return data;
  }

  
}
