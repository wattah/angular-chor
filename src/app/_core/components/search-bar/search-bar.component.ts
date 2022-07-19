import { Component} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SearchBarService } from './search-bar.service';
import { NEW_SEARCH_BAR } from './../../../_core/constants/search-constant';
import { PenicheIsDownPopupComponent } from './peniche-is-down-popup/peniche-is-down-popup/peniche-is-down-popup.component';
import { BillingService } from './../../services/billing.service';
import { SuggestionService } from '../../../_core/services/suggestion.service';
import { CONSTANTS, UNIVERS } from '../../constants/constants';
import { toUpperCase } from '../../utils/formatter-utils';
import { getEncryptedValue } from '../../utils/functions-utils';
import { DisplaySuggestionResult } from '../../models/search/display-suggestion-result';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

listNavSelected :string = NEW_SEARCH_BAR.RECHERCHE_MULTI_CRITERE;
  term: string;
  private readonly nicheIdentifier = 'nicheIdentifier';

  model: any;
  /**
	 * flag pour la phase de recherche
	 */
  searching = false;
  /**
	 * flag pour le résultat de la recherche
	 */
  searchFailed = false;
  /**
	 * customer choisie après autocomplete
	 */
  searchChoice = null;

  /**
	 * Identifiant de l'utilisateur connecté.
	 */
  userId: string;

  /**
	 * Flag pour afficher tous les résultats
	 */
  showAll: boolean;

  /**
	 * Nombre de résultats
	 * @type {number}
	 */
  readonly resultNumber: number = 10;

  /**
	 * Mot clé pour surlignement.
	 */
  termForHighlight: string;

  /** 
   * the searched pattern used to be sent in the url for the finance-full-history
  */
  searchPattern : string;

  constructor(private suggestionService: SuggestionService,
    private readonly router: Router,
    private readonly modalService: NgbModal,
    private readonly billingService : BillingService , 
    private readonly searchBarService: SearchBarService) {}

  searchListNav(content:string){
    if(content == NEW_SEARCH_BAR.NUM_COMPTE_FACTURATION){
      this.checkIfPenicheIsConnected();
    }
    this.listNavSelected=content;
    
  }
  
  checkIfPenicheIsConnected(){
    this.billingService.checkIfPenicheIsConnected().subscribe(data => {
      if(!data){
        this.modalService.open(PenicheIsDownPopupComponent, {
          centered: true,
        });
        this.listNavSelected = NEW_SEARCH_BAR.RECHERCHE_MULTI_CRITERE;
      }
    }); 
  }
  
  openPopup(content) {
    this.modalService.open(content,{ centered: true, 
      windowClass: 'custom_popup',
      size: 'lg', backdrop : 'static', keyboard: false
      });
  }  

  /**
	 * Génère les autocomplete
	 */
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap(term => {
        this.term = term;
        if ( (term.length < 2 && 
        ( (NEW_SEARCH_BAR.RECHERCHE_MULTI_CRITERE === this.listNavSelected) || 
        (NEW_SEARCH_BAR.NUM_COMPTE_FACTURATION === this.listNavSelected) ) ||
        ( term.length < 3 && NEW_SEARCH_BAR.SEARCH_TYPE_ADRESSE_EMAIL === this.listNavSelected) ||
        ( term.length < 5 && NEW_SEARCH_BAR.SEARCH_TYPE_IMEI === this.listNavSelected ) )) {
          this.searchFailed = true;
          return of([]);
        }
        if(this.listNavSelected == NEW_SEARCH_BAR.NUM_COMPTE_FACTURATION){
          this.searchPattern = term;
          return this.suggestionService.autoCompleteSearchByBillNumber(term , false).pipe(
            tap(() => {
              this.searchFailed = false;
            }),
            map(customers => this.searchBarService.generateSuggestionDisplayItems(customers)),
            catchError((error) => {
              if(error.status && error.status === 500){
                this.modalService.open(PenicheIsDownPopupComponent, {
                  centered: true,
                });
                this.listNavSelected = NEW_SEARCH_BAR.RECHERCHE_MULTI_CRITERE;
              }
              this.searchFailed = true;
              return of([]);
            })
          );
        }
        if(NEW_SEARCH_BAR.SEARCH_TYPE_ADRESSE_EMAIL === this.listNavSelected){
          return this.suggestionService.emailCustomersSearch(btoa(term) , false).pipe(
            tap(() => this.searchFailed = false),
            map(customers => this.searchBarService.generateSuggestionDisplayItems(customers)),
            catchError((e) => {
              this.searchFailed = true;
              return of([]);
            })
          );
        }
        
        if(NEW_SEARCH_BAR.SEARCH_TYPE_IMEI === this.listNavSelected){
          return this.suggestionService.imeiNumberSerialSearch(term).pipe(
            tap(() => this.searchFailed = false),
            map(products => this.searchBarService.generateSuggestionDisplayItemsForProducts(products)),
            catchError((e) => {
              this.searchFailed = true;
              return of([]);
            })
          );
        }

        return this.suggestionService.globalCustomersSearch(term , false).pipe(
          tap(() => this.searchFailed = false),
          map(customers => this.searchBarService.generateSuggestionDisplayItems(customers)),
          catchError((e) => {
            console.log('e ' , e)
            this.searchFailed = true;
            return of([]);
          })
        );
      }),
      tap(() => (this.searching = false))
    )

  /**
	 * écrit le nom du customer dans la barre de recherche lorsque l'on choisit parmit les autocomplete
	 */
  formatter = (suggestion) => {
    this.searchChoice = suggestion;
    const customerId = suggestion.customerId;
    if(NEW_SEARCH_BAR.SEARCH_TYPE_IMEI === this.listNavSelected){
      this.goToIMEISerpPage(suggestion);
    }
    else if (suggestion.typeItem !== 'SHOW_ALL' ) {
        const nicheIdentifierWithUnivers = this.getNicheIdentifierAndUniversFromSuggestion(suggestion);
        this.toCustomerDetail(String(customerId), suggestion.typeItem,String(nicheIdentifierWithUnivers.nicheIdentifier) , nicheIdentifierWithUnivers.univers);
    }
     else {
      this.toAllResult();
    }
    
    return "";
  }

   /**
   * This function check if the user has clicked the "see all result" or a specific line of the suggestion list
   * @param suggestion 
   */

  goToIMEISerpPage(suggestion){
    let searchPattern : string = "";
    let navigationExtras: NavigationExtras;
    let serpAll = false;
      if(suggestion.typeItem && suggestion.typeItem == 'SHOW_ALL'){
        searchPattern =  this.model;
        serpAll = true;
        navigationExtras = {
          queryParams: { search_pattern: searchPattern, searchType : this.listNavSelected, serpAll : serpAll }};
      }else {
        let id : number = suggestion.id;
        let productSourceTable : string = suggestion.productSourceTable;
        navigationExtras = {
          queryParams: { search_pattern: searchPattern, searchType : this.listNavSelected, serpAll : serpAll, id : id, productSourceTable : productSourceTable  }};
      }
      this.router.navigate(['serp', 'imei'],navigationExtras);
  }

  /**
   * the main resean of this function is to check on the type of our suggestion DisplaySuggestionResult
   * because the structure of these interface is diffrent
   * @param suggestion 
   */
  getNicheIdentifierAndUniversFromSuggestion(suggestion: DisplaySuggestionResult) {
     if(this.nicheIdentifier in suggestion){
      
      return {nicheIdentifier:suggestion.nicheIdentifier , univers:suggestion.univers};
    }
    return {nicheIdentifier:suggestion.nicheIdentifier , univers: null};
  }

  /**
	 * lance une recherche
	 */
  launchSearch(): void {
    this.searching = false;
    if(this.listNavSelected === NEW_SEARCH_BAR.NUM_COMPTE_FACTURATION){
      this.toAllMembersAndNonMembersResult();
    }else{
      if (this.searchChoice && !this.searchChoice.customer) {
        this.suggestionService.updateSuggestion(this.searchChoice.customer.customer_id, this.userId).subscribe(data => {
          console.log(data);
        });
        this.searchChoice = null;
        this.model = null;
        this.router.navigate(['search/customer', this.searchChoice.customer.customer_id]);
      } else {
        if (typeof this.model !== 'string') {
          this.model = this.model.customer.last_name_customer;
        }
        if( this.model.length >= 2) {
          const navigationExtras: NavigationExtras = {
            queryParams: { search_pattern: this.model , searchType : this.listNavSelected }
          };
          this.router.navigate(['serp', 'all'], navigationExtras);
          this.model = null;
        }  
      }
    }
  }

  /**
	 * Redirect to suggestion item details.
	 * @param {string} customerId
	 */
  toItemDetails( itemType: string): void {
    if (itemType === 'SHOW_ALL') {
      this.toAllResult();
    }
  }

  /**
	 * Redirect to all results page
	 */
  toAllResult(): void {
    if(this.listNavSelected === NEW_SEARCH_BAR.NUM_COMPTE_FACTURATION){
      this.toAllMembersAndNonMembersResult();
    }else{
      const navigationExtras: NavigationExtras = {
        queryParams: { search_pattern: this.model, searchType : this.listNavSelected }
      };
      this.searchChoice = null;
      this.model = null;
      this.router.navigate(['serp', 'all'], navigationExtras);
    }
    
  }

  toAllMembersAndNonMembersResult(){
    const navigationExtras: NavigationExtras = {
      queryParams: { search_pattern: this.model, searchType : NEW_SEARCH_BAR.SEARCH_TYPE_NUM_COMPTE_FACTURATION }
    };
    this.searchChoice = null;
    this.model = null;
    this.router.navigate(['serp', 'membersAndNonMembers'], navigationExtras);
  }

  /**
	 * Se rediriger vers la fiche.
	 * @param {string} customerId
	 */
  toCustomerDetail(customerId: string, typeItem: string, nicheIdentifier : string , univers: string): void {
    
    this.searchChoice = null;
    this.model = null;
    const customerDashboard = 'customer-dashboard';
    if(this.listNavSelected === NEW_SEARCH_BAR.NUM_COMPTE_FACTURATION){
      this.router.navigate(
        [customerDashboard, getEncryptedValue(parseInt(customerId)), 'financial-detail', 'history'],
        { 
          queryParams: { typeCustomer : typeItem,
          rowSelected: 0 , mobileSelected: true, nicheIdentifier: nicheIdentifier,univers : univers ? toUpperCase(univers): toUpperCase(UNIVERS.MOBILE.value),
          fromBillAccountNumSearchType : true, searchPattern : this.searchPattern }, 
          queryParamsHandling: 'merge' 
        }
      );
    }else{
      if (CONSTANTS.TYPE_COMPANY === typeItem) {
        this.router.navigate([customerDashboard, 'entreprise', customerId], {
          queryParams: {
            typeCustomer: typeItem,
            nicheValue: nicheIdentifier
          },
          queryParamsHandling: 'merge'
        });
      } else {
        this.router.navigate([customerDashboard, 'particular', customerId], { queryParams: { typeCustomer: typeItem, nicheValue: nicheIdentifier } });
      }
    }
  }

}
