import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

import { MembrePerson , Person , ProductVO } from 'src/app/_core/models';

const SEARCH_TYPE_NUM_COMPTE_FACTURATION = "numCompteFacturation";

@Component({
  selector: 'app-serp',
  templateUrl: './serp.component.html',
  styleUrls: ['./serp.component.scss']
})
export class SerpComponent implements OnInit {

  searchPattern: String;
  searchType : String;
  searchTypeIsBillAccountNum : boolean;
  listPersonsAndProducts: MembrePerson[] = [];
  members: Person[] = [];
  nonMembers: Person[] = [];
  membersAndNonMembers: Person[] = [];
  error: Boolean = false;
  memberType: any = null;
  contacts: Person[] = [];
  prospects: Person[] = [];
  interlocutors: Person[] = [];
  resilies: Person[] = [];
  products: ProductVO[] = [];
  totalItemsLength: number = 0;
  /**
   *
   * @param http
   * @param route
   * @param router
   */
  constructor( private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      this.searchPattern = queryParams.get('search_pattern');
    });
    this.route.queryParamMap.subscribe(queryParams => {
      this.searchType = queryParams.get('searchType');
    });
    this.searchTypeIsBillAccountNum = false;
    this.remplirTableDemandee();
  }

  changeTable(typeTable: string): void {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'search_pattern': this.searchPattern }
    };
    this.router.navigate(['/serp', typeTable], navigationExtras);
  }

  private remplirTableDemandee(): void {
    if(this.searchType && this.searchType === SEARCH_TYPE_NUM_COMPTE_FACTURATION){
      this.searchTypeIsBillAccountNum = true;
      this.route.data.subscribe(resolversData => {
        this.membersAndNonMembers = resolversData['membersAndNonMembers'];
        this.totalItemsLength = this.membersAndNonMembers.length;
       });
    }else{
      this.route.data.subscribe(resolversData => {
        this.listPersonsAndProducts = resolversData['all'];
        this.members = resolversData['members'];
        this.nonMembers = resolversData['nonMembers'];
        this.contacts = resolversData['contacts'];
        this.interlocutors = resolversData['interlocutors'];
        this.resilies = resolversData['resilies'];
        this.products = resolversData['products'];
        this.prospects = resolversData['prospects'];
        this.totalItemsLength = this.members.length + this.nonMembers.length + this.products.length + this.interlocutors.length;
      });
    }
  }
}
