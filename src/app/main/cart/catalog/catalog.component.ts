import { GassiMockLoginService } from './../../../_core/services';
import { RestrictionOnCart } from './../restriction-on-cart.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  startWith,
  map,
  tap,
  debounceTime,
  distinctUntilChanged,
  switchMap
} from 'rxjs/operators';
import { FamilyVO, ProductVO, CartVO, CartItemVO } from '../../../_core/models/models';
import { CatalogFilterVo } from '../../../_core/models/catalog-filter';
import { NomenclatureVO } from '../../../_core/models/nomenclature-vo';
import { NomenclatureService } from '../../../_core/services/nomenclature.service';
import { CatalogeService } from '../../../_core/services/http-catalog.service';
import { TVA } from '../../../_core/constants/constants';
import { isNullOrUndefined, generateRandomString, isEmpty } from '../../../_core/utils/string-utils';
import { getCartLabel, getEncryptedValue } from '../../../_core/utils/functions-utils';
import { Router, ActivatedRoute } from '@angular/router';
import { RecapCartVo } from '../../../_core/models/recap-cart-vo';
import { RecapCartItemVo } from '../../../_core/models/recap-cart-Item-vo';
import { CartStatusValue } from '../../../_core/enum/cart.enum';
import { ProductService } from '../../../_core/services';
import { getCustomerIdFromURL } from '../../../main/customer-dashboard/customer-dashboard-utils';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalculeCartPricesService } from '../../../_core/services/calcule-cart-prices.service';
import { AuthTokenService } from '../../../_core/services/auth_token';
import { ApplicationUserVO } from '../../../_core/models/application-user';
import { CatalogComponentService } from '../../../_core/services/catalog-component.service';

export interface User {
  name: string;
}

/**
 * @title Display value autocomplete
 */
@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})

export class CatalogComponent implements OnInit {

  customerId: string;
  categories: FamilyVO[] = [];
  categoriesByOrder: FamilyVO[] = [];
  defaultCategory = {} as FamilyVO;
  nomenclatures1List: NomenclatureVO[] = []; 
  nomenclatures2List: NomenclatureVO[] = []; 
  nomenclatures3List: NomenclatureVO[] = []; 
  nomenclatures4List: NomenclatureVO[] = []; 
  nomenclatures5List: NomenclatureVO[] = []; 
  defaultNomenclature = {} as NomenclatureVO;
  servicesNomenclature = {} as NomenclatureVO;
  materialsNomenclature = {} as NomenclatureVO;
  catalogFilter: CatalogFilterVo = {} as CatalogFilterVo;
  products: ProductVO[];
  total: number;
  wingsmIsDown: string;
  productLabel: string;
  isAdminCatalog = false;
  parcours: string;
  connectedUser: ApplicationUserVO = {} as ApplicationUserVO;

  // Gestion de pagination
  totalPages: number;
  currentPage = 1;
  pageSize = 9;

  // les forms controls
  textSearchControl = new FormControl('');
  categoryControl = new FormControl();
  nomenclature1 = new FormControl();
  nomenclature2 = new FormControl();
  nomenclature3 = new FormControl();
  nomenclature4 = new FormControl();
  nomenclature5 = new FormControl();
  filtre = new FormControl();

 // Gestion recapitulatif panier
  typeCustomer: string;
  cart: CartVO;
  cartRecapVo: RecapCartVo;
  cartRecapItemsVo: RecapCartItemVo[];
  statut: string;
  cartlabel: string;
  test: any;
  show = true;
  showCart = true;
  isPanier: boolean ;
  customerDashboard = '/customer-dashboard';
  
  CartStatusValue = CartStatusValue;
  numberOfArticle: number;

  filteredServiceOrMateriel: Observable<Array<ProductVO>>;
  sortedServiceOrMaterial: Observable<Array<ProductVO>>;
  catalogFilterOnSelect: CatalogFilterVo = {} as CatalogFilterVo;

  isSearchBtnClicked = false;
  filtersCreteria : CatalogFilterVo = {} as CatalogFilterVo;

  options: User[] = [
    // {name: 'Mary'},
    // {name: 'Shelley'},
    // {name: 'Igor'},
    // {name: 'Iphone 56g'},
    // {name: 'Iphone 120g'}
  ];
  filteredOptions: Observable<User[]>;

  key: string;

  cartHasBlockedItem: boolean;
  checkInitSearch = false;

  loading = false;
  visibleActionsOnArticle: boolean;
  PENDING = 'PENDING';
  cartStatus: string;
  currentRoute: string;

  constructor(
    private readonly router: Router, 
    private readonly route: ActivatedRoute, 
    private readonly nomenclatureService: NomenclatureService,
    private readonly catalogService: CatalogeService, 
    private readonly productService: ProductService,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly _snackBar: MatSnackBar,
    private readonly calculeCartPricesService: CalculeCartPricesService,
    private readonly authTokenService: AuthTokenService,
    private readonly catalogComponentService: CatalogComponentService,
    private readonly restrictionOnCart: RestrictionOnCart,
    private readonly mockLoginService: GassiMockLoginService) { 


    }

  ngOnInit() {
    
    this.isAdminCatalog = Boolean(this.route.snapshot.data['isAdminCatalog']);
 
    this.initDefaultValues();
    this.route.parent.paramMap.subscribe(params => {
      this.customerId = params.get('customerId');
    });
    this.route.paramMap.subscribe(params => {
      this.productLabel = params.get('productLabel');
     
      if (!isNullOrUndefined(this.calculeCartPricesService.cart) && this.calculeCartPricesService.cart != null && this.calculeCartPricesService.cart.request.id === Number(params.get('idRequest'))) {
        this.cart = this.calculeCartPricesService.cart;
        this.calculeCartPricesService.cart = null;
        this.fillData();
      } else {
        this.route.data.subscribe(resolversData => {
          const carts: CartVO[] = resolversData['carts'];
          if (!isNullOrUndefined(carts) && carts.length > 0) {
            this.cart = carts[0];
            this.fillData();
          }
        });
      }

    });
    this.customerId = getCustomerIdFromURL(this.route);
    this.route.queryParamMap.subscribe(params => {
      this.typeCustomer = params.get('typeCustomer');
      this.parcours = params.get('parcours');
    });
    
    this.route.data.subscribe(resolversData => {
      this.categories = this.categories.concat(this.defaultCategory).concat(resolversData['categories']);
    });
    this.categoriesByOrder = this.categories.sort((categoryA, categoryB) => this.sortCategories(categoryA, categoryB));

    this.getProductByCategoryAndContractStatus();
    if (!isNullOrUndefined(this.cart)
      && !isNullOrUndefined(this.cart.request)
      && !isNullOrUndefined(this.cart.request.requestType)) {
      this.setValueCategorie(this.cart.request.requestType.idFamily);
    } else {
      this.categoryControl.setValue(this.defaultCategory);
    }

    this.nomenclatures1List = this.nomenclatures1List.concat(this.defaultNomenclature).concat(this.servicesNomenclature).concat(this.materialsNomenclature);
    this.nomenclature1.setValue(this.defaultNomenclature);
    this.nomenclatures2List = this.nomenclatures2List.concat(this.defaultNomenclature);
    this.nomenclature2.setValue(this.defaultNomenclature);
    this.nomenclature2.disable();
    this.nomenclatures3List = this.nomenclatures3List.concat(this.defaultNomenclature);
    this.nomenclature3.setValue(this.defaultNomenclature);
    this.nomenclature3.disable();
    this.nomenclatures4List = this.nomenclatures4List.concat(this.defaultNomenclature);
    this.nomenclature4.setValue(this.defaultNomenclature);
    this.nomenclature4.disable();
    this.nomenclatures5List = this.nomenclatures5List.concat(this.defaultNomenclature);
    this.nomenclature5.setValue(this.defaultNomenclature);
    this.nomenclature5.disable();
    this.initInputSearch();
    this.checkIfCartHasBlockedItem();
    this.cartStatus = this.cart && this.cart.status ? this.cart.status : this.PENDING;
    this.restrictionOnCart.setRestrictionByCartPhaseAndUserRole(this.mockLoginService , this.cartStatus);
    this.initRestrictions();
  }

  sortCategories(categoryA: FamilyVO, categoryB: FamilyVO): number {

    if (String(categoryA.name) > String(categoryB.name)) {
      return 1;
    }
    if (String(categoryA.name) < String(categoryB.name)) {
      return -1;
    }
    return 0;
  }

  initRestrictions() {
    this.mockLoginService.getCurrentConnectedUser().subscribe((user) => {
      this.visibleActionsOnArticle = this.restrictionOnCart.visibleActionsOnArticle;
    });
  }

  initInputSearch(): void {
    if (this.checkInitSearch === false ) {
      this.catalogComponentService.getNameDescriRef().subscribe(text => {
        this.textSearchControl.setValue(text);
      });
   
        if (!isNullOrUndefined(this.productLabel)) {
          this.textSearchControl.setValue(this.productLabel);
        }
      
     

      this.catalogComponentService.getNameClature1().subscribe(c1 => {
        if (this.checkInitSearch === false) {
          if (isNullOrUndefined(c1) || c1.id === -1) {
            this.nomenclature1.setValue(this.defaultNomenclature);
            this.search(true);
          } else {
            const nameClature1Tmp = this.nomenclatures1List.find(clature => clature.value === c1.value);
            this.nomenclature1.setValue(nameClature1Tmp);
            this.initNameClature2(c1);
          }
        }
      });
    }

  }

  initNameClature2(c1: NomenclatureVO): void {
    this.nomenclatureService.findByNomenclatureParentValue(c1.value).subscribe(data => {
      this.nomenclatures2List = [].concat(this.defaultNomenclature).concat(data);
      this.catalogComponentService.getNameClature2().subscribe(c2 => {
        if (this.checkInitSearch === false) {
          if (isNullOrUndefined(c2) || c2.id === -1) {
            this.nomenclature2.setValue(this.defaultNomenclature);
            if (c1.id === -1) {
              this.nomenclature2.disable();
              this.nomenclature3.disable();
              this.nomenclature4.disable();
              this.nomenclature5.disable();
            }
            this.search(true);
          } else {
            const nameClature2Tmp = this.nomenclatures2List.find(clature => clature.value === c2.value);
            this.nomenclature2.setValue(nameClature2Tmp);
            this.nomenclature2.enable();
            this.nomenclature3.enable();
            this.nomenclature4.disable();
            this.nomenclature5.disable();
            this.initNameClature3(c2);
          }
        }
      });
    });
  }

  initNameClature3(c2: NomenclatureVO): void {
    this.nomenclatureService.findByNomenclatureParentValue(c2.value).subscribe(data => {
      this.nomenclatures3List = [].concat(this.defaultNomenclature).concat(data);
      this.catalogComponentService.getNameClature3().subscribe(c3 => {
        if (this.checkInitSearch === false) {
          if (isNullOrUndefined(c3) || c3.id === -1) {
            this.nomenclature3.setValue(this.defaultNomenclature);
            if (c2.id === -1) {
              this.nomenclature3.disable();
              this.nomenclature4.disable();
              this.nomenclature5.disable();
            }
            this.search(true);
          } else {
            const nameClature3Tmp = this.nomenclatures3List.find(clature => clature.value === c3.value);
            this.nomenclature3.setValue(nameClature3Tmp);
            this.nomenclature3.enable();
            this.nomenclature4.enable();
            this.nomenclature5.disable();
            this.initNameClature4(c3);
          }
        }
      });
    });
  }

  initNameClature4(c3: NomenclatureVO): void {
    this.nomenclatureService.findByNomenclatureParentValue(c3.value).subscribe(data => {
      this.nomenclatures4List = [].concat(this.defaultNomenclature).concat(data);
      this.catalogComponentService.getNameClature4().subscribe(c4 => {
        if (this.checkInitSearch === false) {
          if (isNullOrUndefined(c4) || c4.id === -1) {
            this.nomenclature4.setValue(this.defaultNomenclature);
            if (c3.id === -1) {
              this.nomenclature4.disable();
              this.nomenclature5.disable();
            }
            this.search(true);
          } else {
            const nameClature4Tmp = this.nomenclatures4List.find(clature => clature.value === c4.value);
            this.nomenclature4.setValue(nameClature4Tmp);
            this.nomenclature4.enable();
            this.nomenclature5.enable();
            this.initNameClature5(c4);
          }
        }
      });
    });
  }

  initNameClature5(c4: NomenclatureVO): void {
    this.nomenclatureService.findByNomenclatureParentValue(c4.value).subscribe(data => {
      this.nomenclatures5List = [].concat(this.defaultNomenclature).concat(data);
      this.catalogComponentService.getNameClature5().subscribe(c5 => {
        if (this.checkInitSearch === false) {
          if (isNullOrUndefined(c5) || c5.id === -1) {
            this.nomenclature5.setValue(this.defaultNomenclature);
            if (c4.id === -1) {
              this.nomenclature5.disable();
            }
          } else {
            const nameClature5Tmp = this.nomenclatures5List.find(clature => clature.value === c5.value);
            this.nomenclature5.setValue(nameClature5Tmp);
            this.nomenclature5.enable();
          }
          this.search(true);
        }
      });
    });
  }

  checkIfCartHasBlockedItem() {
    this.cartHasBlockedItem = false;
    if (this.cart 
      && this.cart.request 
      &&  this.cart.request.cartItems 
      && this.cart.request.cartItems.length > 0) {
      this.cart.request.cartItems.forEach(item => {
        if (item.product.blocked && item.deletingDate === null) {
          this.cartHasBlockedItem = true;
        }
      });
    }
  }

  setValueCategorie(famillyId) {
    if (!isNullOrUndefined(this.categories)) {
      for (const cat of this.categories) {
        if (cat.id === famillyId) {
          this.categoryControl.setValue(cat);
          break;
        } 
        this.categoryControl.setValue(this.defaultCategory);
        
      }
    }

  }

  fillData() {
    if (this.cart !== null && this.cart.items !== null && this.cart.items.length > 0) {
      this.isPanier = true;
      this.cartlabel = getCartLabel(this.cart.request.cartColor, this.cart.request.cartStatus);
      this.cartRecapVo = this.calculeCartPricesService.recalculatePrices(this.cart);
      this.cartRecapItemsVo = this.cartRecapVo.items;
      if (!isNullOrUndefined(this.cartRecapItemsVo) && this.cartRecapItemsVo.length > 0) {
        this.showCart = false;
      }
      if (!isNullOrUndefined(this.cartRecapItemsVo)) {
        this.numberOfArticle = this.cartRecapItemsVo.reduce((sum, current) => sum + current.quantiteCartItem, 0);
      } else {
        this.numberOfArticle = 0;
      }
      this.cart.calculateMargePourcent = this.cartRecapVo.calculateMargePourcent;
      this.cart.calculateMargeEuro = this.cartRecapVo.calculateMargeEuro;
    }
    
  }

  // Positionner la valeur Tous sur les combos par defaut
  initDefaultValues() {
    this.defaultCategory.name = 'Tous';
    this.defaultCategory.id = 0;

    this.defaultNomenclature.label = 'Tous';
    this.defaultNomenclature.id = -1;

    this.servicesNomenclature.label = 'Services';
    this.servicesNomenclature.value = 'A';

    this.materialsNomenclature.label = 'Matériels';
    this.materialsNomenclature.value = 'B';
  }

  buildSearchFiltersOnSelect(textToSearch: string): void {
    let nomenclatureCode = this.setFilternomenClature();

    this.catalogFilterOnSelect.customerId = this.customerId;
    this.catalogFilterOnSelect.textSearch = textToSearch;
    if (this.categoryControl.value !== null) {
      this.catalogFilterOnSelect.idCategory = this.categoryControl.value.id;
    }
    this.catalogFilterOnSelect.nomenclatureCode = nomenclatureCode;
    this.catalogFilterOnSelect.productStatus = 'ACTIVE';

    this.catalogFilterOnSelect.sortField = this.filtre.value !== 'null' ? this.filtre.value : '';
    this.catalogFilterOnSelect.sortOrder = 'ASC';
    this.catalogFilterOnSelect.page = this.currentPage;
    this.catalogFilterOnSelect.pageSize = this.pageSize;
  }

  searchOnSelect(initialisePages: boolean, textToSearch: string): any {
    this.checkInitSearch = true;
    if (initialisePages) {
      this.currentPage = 1;
    } 
    this.buildSearchFiltersOnSelect(textToSearch);
    if(!this.isAdminCatalog){
      this.loading = true;
      this.catalogService.getMonitoringCatalog(this.catalogFilterOnSelect).subscribe(
        data => {
          this.total = data.total;
          this.loading = false;
          this.products = data.items;
          this.totalPages = Math.ceil(data.total / this.pageSize);
        },
        error => {
          this.loading = false;
        }
      );
    }
    else{
      this.isSearchBtnClicked = !this.isSearchBtnClicked;
      this.filtersCreteria = this.catalogFilterOnSelect;
    }
    
  }

  onSelectProduct(event: any): void {
    this.textSearchControl.setValue(event.source.value);
    this.searchOnSelect(true, event.source.value);
  }

  onChangeCategory(): void {
    this.textSearchControl.setValue('');
  }

  // Les méthodes de changements de combo de filtres
  onSelectNom(level: number) {
    let paramNomenclature;
    switch (level) {
      case 1:
        paramNomenclature = this.nomenclature1.value;
        break;
      case 2:
        paramNomenclature = this.nomenclature2.value;
        break;
      case 3:
        paramNomenclature = this.nomenclature3.value;
        break;
      case 4:
        paramNomenclature = this.nomenclature4.value;
        break;
      default:
        break;
    }
    if (paramNomenclature && paramNomenclature.id !== Number('-1')) {
      this.nomenclatureService.findByNomenclatureParentValue(paramNomenclature.value).subscribe(
        data =>  {
          if (data) {
            switch (level) {
              case 1:
                this.nomenclatures2List = [].concat(this.defaultNomenclature).concat(data);
                this.nomenclature2.setValue(this.defaultNomenclature);
                this.nomenclature2.enable();
                this.nomenclatures3List = [].concat(this.defaultNomenclature);
                this.nomenclature3.setValue(this.defaultNomenclature);
                this.nomenclature3.disable();
                this.nomenclatures4List = [].concat(this.defaultNomenclature);
                this.nomenclature4.setValue(this.defaultNomenclature);
                this.nomenclature4.disable();
                this.nomenclatures5List = [].concat(this.defaultNomenclature);
                this.nomenclature5.setValue(this.defaultNomenclature);
                this.nomenclature5.disable();
                break;
              case 2:
                this.nomenclatures3List = [].concat(this.defaultNomenclature).concat(data);
                this.nomenclature3.setValue(this.defaultNomenclature);
                this.nomenclature3.enable();
                this.nomenclatures4List = [].concat(this.defaultNomenclature);
                this.nomenclature4.setValue(this.defaultNomenclature);
                this.nomenclature4.disable();
                this.nomenclatures5List = [].concat(this.defaultNomenclature);
                this.nomenclature5.setValue(this.defaultNomenclature);
                this.nomenclature5.disable();
                break;
              case 3:
                this.nomenclatures4List = [].concat(this.defaultNomenclature).concat(data);
                this.nomenclature4.setValue(this.defaultNomenclature);
                this.nomenclature4.enable();
                this.nomenclatures5List = [].concat(this.defaultNomenclature);
                this.nomenclature5.setValue(this.defaultNomenclature);
                this.nomenclature5.disable();
                break;
              case 4:
                this.nomenclatures5List = [].concat(this.defaultNomenclature).concat(data);
                this.nomenclature5.setValue(this.defaultNomenclature);
                this.nomenclature5.enable();
                break;
              default:
                break;
            }

          }
        });
    } else {
      switch (level) {
        case 1:
          this.nomenclatures2List = [].concat(this.defaultNomenclature);
          this.nomenclature2.setValue(this.defaultNomenclature);
          this.nomenclature2.disable();
          this.nomenclatures3List = [].concat(this.defaultNomenclature);
          this.nomenclature3.setValue(this.defaultNomenclature);
          this.nomenclature3.disable();
          this.nomenclatures4List = [].concat(this.defaultNomenclature);
          this.nomenclature4.setValue(this.defaultNomenclature);
          this.nomenclature4.disable();
          this.nomenclatures5List = [].concat(this.defaultNomenclature);
          this.nomenclature5.setValue(this.defaultNomenclature);
          this.nomenclature5.disable();
          break;
        case 2:
          this.nomenclatures3List = [].concat(this.defaultNomenclature);
          this.nomenclature3.setValue(this.defaultNomenclature);
          this.nomenclature3.disable();
          this.nomenclatures4List = [].concat(this.defaultNomenclature);
          this.nomenclature4.setValue(this.defaultNomenclature);
          this.nomenclature4.disable();
          this.nomenclatures5List = [].concat(this.defaultNomenclature);
          this.nomenclature5.setValue(this.defaultNomenclature);
          this.nomenclature5.disable();
          break;
        case 3:
          this.nomenclatures4List = [].concat(this.defaultNomenclature);
          this.nomenclature4.setValue(this.defaultNomenclature);
          this.nomenclature4.disable();
          this.nomenclatures5List = [].concat(this.defaultNomenclature);
          this.nomenclature5.setValue(this.defaultNomenclature);
          this.nomenclature5.disable();
          break;
        case 4:
          this.nomenclatures5List = [].concat(this.defaultNomenclature);
          this.nomenclature5.setValue(this.defaultNomenclature);
          this.nomenclature5.disable();
          break;
        default:
          break;
      }
    }
  }

  setFilternomenClature() : string { 
    let nomenclatureCode;
    this.catalogComponentService.setNameClature5(this.nomenclature5.value);
    this.catalogComponentService.setNameClature4(this.nomenclature4.value);
    this.catalogComponentService.setNameClature3(this.nomenclature3.value);
    this.catalogComponentService.setNameClature2(this.nomenclature2.value);
    this.catalogComponentService.setNameClature1(this.nomenclature1.value);
    this.catalogComponentService.setNameDescriRef(this.textSearchControl.value);

    if (this.nomenclature5.value !== null && this.nomenclature5.value.id !== -1) {
      nomenclatureCode = this.nomenclature5.value.value;
    } else if (this.nomenclature4.value !== null && this.nomenclature4.value.id !== -1 ) {
      nomenclatureCode = this.nomenclature4.value.value;
    } else if (this.nomenclature3.value !== null && this.nomenclature3.value.id !== -1 ) {
      nomenclatureCode = this.nomenclature3.value.value;
    } else if (this.nomenclature2.value !== null && this.nomenclature2.value.id !== -1 ) {
      nomenclatureCode = this.nomenclature2.value.value;
    } else if (this.nomenclature1.value !== null && this.nomenclature1.value.id !== -1 ) {
      nomenclatureCode = this.nomenclature1.value.value;
    }
    return nomenclatureCode;
  }
  // Construire l'ensemble des filtres de recherche
  buildSearchFilters() {
    let nomenclatureCode = this.setFilternomenClature();
   
    this.catalogFilter.customerId = this.customerId;
    this.catalogFilter.textSearch = this.textSearchControl.value;
    if (this.categoryControl.value != null) {
      this.catalogFilter.idCategory = this.categoryControl.value.id;
    }
    this.catalogFilter.nomenclatureCode = nomenclatureCode;
    this.catalogFilter.productStatus = 'ACTIVE';

    this.catalogFilter.sortField = this.filtre.value !== 'null' ? this.filtre.value : '';
    this.catalogFilter.sortOrder = 'ASC';
    this.catalogFilter.page = this.currentPage;
    this.catalogFilter.pageSize = this.pageSize;
  }

  search(initialisePages: boolean) {
    this.checkInitSearch = true;
    if (initialisePages) {
      this.currentPage = 1;
    } 
    this.buildSearchFilters();
    if(!this.isAdminCatalog){
      this.loading = true;
      this.catalogService.getMonitoringCatalog(this.catalogFilter).subscribe(
        data => {
          this.total = data.total;
          this.loading = false;
          this.products = data.items;
          this.totalPages = Math.ceil(data.total / this.pageSize);
        },
        error => {
          this.loading = false;
        }
      );
    }
    else{
      this.isSearchBtnClicked = !this.isSearchBtnClicked;
      this.filtersCreteria = this.catalogFilter;
    }
   
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    /** if "Enter" button is clicked */ 
    if (event.keyCode === 13) { 
      this.search(true);
    }
  }

  onChangeFilter() {
    this.search(true);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.search(false);
  }

  getPriceText(product: ProductVO) {
    if (product.prixSurDemande) {
      return 'Prix sur devis';
    } 
    return  `${this.getPrice(product)} € TTC`;
    
  }

  priceTtc(product: ProductVO) {
    return (this.getNumberValue(product.tva) / 100 + 1) * product.priceHt;
  }

  getPrice(product: ProductVO) {
    let price: number;
    if (product.discountIncluded) {
      price = this.priceTtc(product) - product.discountHt * (1 + (this.getNumberValue(product.tva) / 100));
    } else {
      price = this.priceTtc(product);
    }
    return Math.round(price); 
  }

  getNumberValue(tva: string) {
    if (tva === TVA.OLD_TVA_NORMALE) {
      return 19.6;
    }  
    if (tva === TVA.OLD_TVA_REDUITE) {
      return 5.5;
    } else if (tva === TVA.TVA_NORMALE) {
      return 20.0;
    } else if (tva === TVA.TVA_REDUITE) {
      return 7.0;
    } else if (tva === TVA.TVA_MOYENNE) {
      return 10.0;
    }
    return 0;
  }

  notHasDescription(product: ProductVO) {
    return isNullOrUndefined(product.productDescriptionName);
  }

  getStockAvailability(product: ProductVO, stockName: string) {
    let str = 0;
    switch (stockName) {
      case 'RASPAIL':
        str = product.stockRaspail;
        break;
      case 'PUBLIDISPATCH':
        str = product.publidispatchStockQuantity;
        break;
    }
    if (isNullOrUndefined(str)) {
      str = 0;
    }
    return str;
  }

  checkAvailability(product: ProductVO) {
    return product.available !== 'ERROR';
  }

  isWinGsmDown() {
    if (this.products != null && this.products.length > 0) {
      this.wingsmIsDown = this.products[0].available;
      return this.wingsmIsDown === 'ERROR';
    } 
    return false;
    
  }

  loadImageProduct(product: ProductVO) {
    if (!isNullOrUndefined(product) && !isNullOrUndefined(product.photo) && product.photo !== '' && product.photo.length > 0) {
      return `data:image/jpg;base64,${product.photo}`;
    } 
    return "assets/images/panier/picto-no-photo.png";
    
  }

   /**
   * telechargement fichier produit
   */
  downloadDocument(product: ProductVO): void {
    if (!isNullOrUndefined(product.productDescriptionName)) {
      this.productService.downloadDescriptionProduct(product.productDescriptionName).subscribe(
        (data) => {
          const type = data.headers.get('Content-Type');
          const file = new Blob([data.body], { type });     
          if ( type !== 'application/octet-stream') {
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
          } else {
            const element = document.createElement('a');
            element.target = '_blank';
            element.href = URL.createObjectURL(file);
            element.download = product.productDescriptionName;
            document.body.appendChild(element);
            element.click();
          }
        }
      ); 
    }

  }

  familyProductPath(product: ProductVO) {
    let str = '-';
    if (!isNullOrUndefined(product.family) && !isNullOrUndefined(product.family.parent) && !isNullOrUndefined(product.family.parent.parent)) {
      str = `${product.family.parent.parent.name} > ${product.family.parent.name} > ${product.family.name}`;
    } else if (!isNullOrUndefined(product.family.parent) && product.family.parent.parent == null ) {
      str = ` ${product.family.parent.name} > ${product.family.name}`;
    }
    else if (product.family.parent == null ){
      str = ` ${product.family.name}`;
    }
    return str;
  }
  
  openConfirmationDialog(e): any {
    const title = 'Ajout article';
    const comment = 'Vous apportez une modification alors qu’un ordre est déjà transmis ' +
     'au partenaire. Merci de vous rapprocher de la logistique.';
    const btnOkText = 'Ok';
    const btnCancelText = 'Annuler';
    this.confirmationDialogService.confirm(title, comment, btnOkText, btnCancelText)
    .then((confirmed) => { if (confirmed) {
      this.addArticle(e);
    }})
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  addArticleToCart(e: any) { 
    if (!this.checkEditableCartByCommandOrderStatus()) {
      this.openConfirmationDialog(e);
    } else {
      this.addArticle(e);
    }
    sessionStorage.setItem('initStock' , 'yes');
  }
    
  checkEditableCartByCommandOrderStatus() {
    if (this.cart != null && this.cart.commandOrders != null && this.cart.commandOrders.length > 0) {
      for (const co of this.cart.commandOrders) {
        if (co.status !== 'ABANDONED' && co.status !== 'REJECTED' &&  co.status !== 'CANCELED') {
          return false;
        }
      }
    }
    return true;
  }

  openSnackBar(): boolean {
    this._snackBar.open('L’article a été ajouté au Panier.', undefined, {
      duration: 3000,
      panelClass: ['center-snackbar', 'snack-bar-container']
    });
    return true; 
  } 
  newCartItem( product: ProductVO, cart: CartVO, addedById: number): CartItemVO {
    const newCartItemVO = {} as CartItemVO;
    newCartItemVO.quantity = 1;
    newCartItemVO.discount = 0;
    newCartItemVO.addingDate = new Date();
    newCartItemVO.ordinal = 0;
    newCartItemVO.cartId = 0;
    newCartItemVO.uniqueId = generateRandomString(5);
    if (cart != null && !isNaN(cart.id) && cart.id > 0) {
      newCartItemVO.cartId = cart.id;
    }
    
    if (cart != null && cart.items.length > 0) {
      newCartItemVO.ordinal = cart.items.length;
    }
    
    if (addedById !== 0) {
      newCartItemVO.addedById = addedById;
    }
    
    if (product != null) {
      newCartItemVO.product = product;
      newCartItemVO.unitPriceHt = product.priceHt;
      newCartItemVO.tauxTVA = product.tva;
      newCartItemVO.productLabel = product.libelleFacture;
      newCartItemVO.productBillLabel = product.libelleFacture;
      if (product.family !== null && product.family.parent != null && product.family.parent.parent != null) {
        newCartItemVO.productCategory = product.family.parent.parent.name;
      } else {
        newCartItemVO.productCategory = '';
      }
      newCartItemVO.discount = product.discountHt;
      newCartItemVO.discountLabel = product.discountLabel;
      newCartItemVO.warrantyLabel = product.warrantyLabel;
      newCartItemVO.warrantyValue = product.warrantyValue;
      newCartItemVO.acquisitionPrice = product.purchasePrice;
      newCartItemVO.acquisitionPriceReal = product.purchasePriceReal;
      newCartItemVO.nomenclature = product.nomenclature;
      newCartItemVO.commentMandatory = product.commentMandatory;
      if (isNaN(product.fixedMarginRate) || product.fixedMarginRate === 0) {
        newCartItemVO.margin = this.getMarginRateFromAcquisitionPrice(product.purchasePrice, product.priceHt, product.discountHt);
      } else {
        newCartItemVO.margin = product.fixedMarginRate;
      }
      if (isNaN(product.fixedMarginRateReal) || product.fixedMarginRateReal === 0) {
        newCartItemVO.marginReal = this.getMarginRateFromAcquisitionPrice(product.purchasePriceReal, product.priceHt, product.discountHt);
      } else {
        newCartItemVO.marginReal = product.fixedMarginRateReal;
      }
      newCartItemVO.articleClassLabel = product.articleClassLabel;
      newCartItemVO.articleClassId = product.articleClassId;
      if (newCartItemVO.commentMandatory) {
        newCartItemVO.isCommentDisplayOnBill = true;
      }
    } else {
      newCartItemVO.productCategory = '';
      newCartItemVO.unitPriceHt = 0;
      newCartItemVO.acquisitionPrice = 0;
      newCartItemVO.acquisitionPriceReal = 0;
      newCartItemVO.tauxTVA = TVA.TVA_NORMALE;
      newCartItemVO.warrantyLabel = null;
      newCartItemVO.warrantyValue = NaN;
    }
    return newCartItemVO;
  }

  addArticle(e: any) {
    this.connectedUser = this.authTokenService.applicationUser;
    const newCartItem = this.newCartItem(e, this.cart, this.connectedUser.id);
    if (this.cart.request.cartItems != null && this.cart.request.cartItems.length > 0) {
      this.cart.request.cartItems.push(newCartItem);
    } else {
      this.cart.request.cartItems = [];
      this.cart.request.cartItems.push(newCartItem);
    }
    if (this.cart.items != null && this.cart.items.length > 0) {
      this.cart.items.push(newCartItem);
    } else {
      this.cart.items = [];
      this.cart.items.push(newCartItem);
    }
    this.cartRecapVo = this.calculeCartPricesService.recalculatePrices(this.cart);
    this.cartRecapItemsVo = this.cartRecapVo.items;
    if (this.cartRecapItemsVo.length > 0) {
      this.showCart = false;
      this.isPanier = true;
    }
    this.cart.calculateMargePourcent = this.cartRecapVo.calculateMargePourcent;
    this.cart.calculateMargeEuro = this.cartRecapVo.calculateMargeEuro;
    this.numberOfArticle = this.cartRecapItemsVo.reduce((sum, current) => sum + current.quantiteCartItem, 0);
    this.openSnackBar();
    this.checkIfCartHasBlockedItem();
  }
  
  OnHideCart(): void {
    this.showCart = true;
    
  }
  OnshowCart(): void {
    this.showCart = false;
  }

  interClick(): void {
    this.calculeCartPricesService.cart = this.cart;  
    this.router.navigate(
        [this.customerDashboard, this.customerId, 'cart', 'creation', this.cart.request.id],
      {
        queryParams: { 
          formCatalog: 'yes',
          typeCustomer: this.typeCustomer,
          parcours: this.parcours,
          onglet : 0
        },
        queryParamsHandling: 'merge'
      }
    );
  }
  
  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  onInputClick(): void {
      this.catalogComponentService.setNameDescriRef(this.textSearchControl.value);
  }

  private getProductByCategoryAndContractStatus() {
   
    this.filteredServiceOrMateriel = this.textSearchControl.valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((text) => {
          if (text.length < 2) {
            return of([]);
          }
          this.key = text;
          this.sortedServiceOrMaterial = this.catalogService.getProductsByCriteria(this.categoryControl.value.id, 'ACTIVE',
         text, null, this.customerId);
          return this.sortedServiceOrMaterial;
        }),
      map((products) => this.sortProduct(this.key, products))
    );
  }

  private sortProduct(keyword: string, products: ProductVO[]): ProductVO[] {   
    const matchedKeyWordsList = [];
    const restOfProductsList = [];
    products.forEach((produit => {
      if (produit.name.toLowerCase().startsWith(keyword.toLowerCase())) {
        matchedKeyWordsList.push(produit);
      } else {
        restOfProductsList.push(produit);
      }  
    }));
    this.sortProductList(matchedKeyWordsList);
    this.sortProductList(restOfProductsList);

    const filteredProducts = matchedKeyWordsList.filter(
      (firstProduct,index,otherProduct)=>otherProduct.findIndex(t=>(t.name === firstProduct.name))===index);

    const filteredRestOfProducts = restOfProductsList.filter(
      (firstProduct,index,otherProduct)=>otherProduct.findIndex(t=>(t.name === firstProduct.name))===index);

    if (isNullOrUndefined(keyword) || isEmpty(this.textSearchControl.value)) {
      return [ ...filteredProducts, ...filteredRestOfProducts];
    } else {
      return [ ...filteredProducts, ...filteredRestOfProducts];
    }
  }


  private sortProductList(listOfProducts: ProductVO[]): ProductVO[] {
    listOfProducts.sort((p1 , p2) => {
      return p1.name.toLowerCase() < p2.name.toLowerCase() ? -1 : 1;
    });
    return listOfProducts;
  }

  private getMarginRateFromAcquisitionPrice(purchasePrice: number, priceHt: number, discountHt: number) {
    const netPrice = priceHt - discountHt;
    if (!isNullOrUndefined(netPrice) && netPrice > 0) {
      return 100 * (priceHt - discountHt - purchasePrice) / Math.abs(netPrice);
    } else {
      return 0;
    }
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
