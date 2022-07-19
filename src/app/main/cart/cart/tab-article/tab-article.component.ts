import { RedirectionService } from './../../../../_core/services/redirection.service';
import { CalculeCartPricesService } from './../../../../_core/services/calcule-cart-prices.service';
import { RecapCartVo } from './../../../../_core/models/recap-cart-vo';
import { isNullOrUndefined, getDefaultStringEmptyValue } from './../../../../_core/utils/string-utils';
import { CartVO } from './../../../../_core/models/models';
import {CartVO as CartToSaveVo} from './../../../../_core/models/cart-vo';
import { FormStoreManagementService } from './from-store-management.service';
import { CartItemVO } from './../../../../_core/models/cart-item-vo';
import { CartService } from './../../../../_core/services/cart.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupDeleteArticleComponent } from './popup-delete-article/popup-delete-article.component';
import { DetailArticlRenderer } from './detail-cell-render';
import { FormBuilder, FormControl, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { FORMAT_DATE_MONTH } from './../../../../_core/constants/constants';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NotificationService } from './../../../../_core/services/notification.service';
import { first } from 'rxjs/operators';

import { NumericEditor } from './numeric-editor/numeric-editor.component';
import { AuthTokenService } from '../../../../_core/services/auth_token';
import { numberComparator, sortTVA } from '../../../../_core/utils/date-utils';
import { CartCreationService } from '../cart-creation.service';
import { generateRandomString } from '../../../../_core/utils/string-utils';
import { DatePipe } from '@angular/common';
import { DateFormatPipeFrench } from '../../../../_shared/pipes';
import { fullNameFormatter } from '../../../../_core/utils/formatter-utils';

@Component({
  selector: 'app-tab-article',
  templateUrl: './tab-article.component.html',
  styleUrls: ['./tab-article.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class TabArticleComponent implements OnInit, OnChanges {
  cartItems: any;
  cartItemTosave : any;
  oldCartItems: any;
  oldValuesCartItems :  any;
  compteur2 = 0;
  collapseAllRows: boolean;
  show = true;
  totalPages;
  groupDefaultExpanded;
  expandedAllRows;
  showHistrq = true;
  currentPage=1;
  detailleheight
  detailleheighthisrq

  columnDefs: any[];
  columnDefsHistrq: any[];
  defaultSortModel: any[];
  detailCellRenderer = 'detailCellRenderer';
  numericEditor= 'numericEditor';
  frameworkComponents = {
    detailCellRenderer: DetailArticlRenderer,
    numericEditor: NumericEditor
  };
  forms = [];
  rowStyle = { background: '#f6f4f4' };
  iconeDelHtml: any = '<span class="icon del"></span>';
  classStyleIconePen: any = 'text-right cell-wrap-text';
  headerHeight: any;
  compteur = 0;
  parkItems: any;
  showAllRows = false;
  showAllCounter = 0;
  showAllMessage = 'Afficher toutes les lignes';
  rowData = [];
  oldRowData;
  deletedItems: CartItemVO[];
  oldDeletedItems : CartItemVO[];
  cartStatus: any;
  cart: CartVO;
  formCatalog: string;
  newRecapCartItem: RecapCartVo[];
        whiteSpace = 'white-space';
  @Input() customerId: string;
  @Input() requestId: number;
  @Input() visibleActionsOnArticle;
  @Output() onUpdatingItems : EventEmitter<CartItemVO[]> = new EventEmitter<CartItemVO[]>();
  @Output() onInitPrelevementStock: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onUpdateRecapCartItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSendStatusToParent: EventEmitter<string> = new EventEmitter<string>();
  @Output() onCheckArticleModification: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onCheckArticleSupscriptionPeriodicity: EventEmitter<string> = new EventEmitter<string>();
  params: { force: boolean; suppressFlash: boolean };
  redrawDetailsRows: boolean;
  /** Partie Cancel article */
  cartToSave : CartToSaveVo;
  form;
  private readonly periodicities = ['MONTHLY', 'YEARLY'];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    private readonly modalService: NgbModal,
    private readonly cartService: CartService,
    private readonly notificationService: NotificationService,
    private readonly formStoreManagementService: FormStoreManagementService,
    private readonly calculeCartPricesService: CalculeCartPricesService,
    public parent: FormGroupDirective,
    private readonly redirectionService: RedirectionService,
    private readonly authTokenService: AuthTokenService,
    private readonly dateFormatPipeFrench: DateFormatPipeFrench,
    private readonly datePipe: DatePipe
  ) {
    this.form  = new   FormGroup({});
  }

  ngOnChanges(change: SimpleChanges) {
    if (change['visibleActionsOnArticle']) {
      this.formStoreManagementService.onChangeVisibleActionsOnArticle(
        this.visibleActionsOnArticle
      );
      this.params = {
        force: true,
        suppressFlash: true,
      };
    }

  }
  detailCellRendererParamsHistrq = {
    detailGridOptions: {
      columnDefs: [],
      expandAll: [],
      columnDefsHistrq: [],
      defaultColDef: { flex: 1 },
    },
    getDetailRowData: (params) => {
      // simulate delayed supply of data to the detail pane
      setTimeout(() => {
        params.successCallback([]);
      }, 1000);
    },
    template: (_params: any) => {
      return ` 
      <div style="height: 100%; padding: 20px; box-sizing: border-box; white-space: normal !important; word-wrap: break-word !important;">
      <div class="row">
          <div class="col-lg-12 col-24">
              <div><strong class="athena"> Type: </strong> ${this.formStoreManagementService.getParentLabelFromNomenclatureByLevel(
                _params.data,
                1
              )}</div>
              <div><strong class="athena"> Catégorie : </strong> ${this.formStoreManagementService.getParentLabelFromNomenclatureByLevel(
                _params.data,
                3
              )}</div>
              <div><strong class="athena"> Référence : </strong> ${
                _params.data.product.partnerProductReference
              }</div>
              <div class="d-none d-lg-block"><strong class="athena"> N ° de série / N ° IMEI / N ° de commande: </strong> ${
                _params.data.serial ? _params.data.serial : '-'
              }</div>
              <div>
                <strong class="athena"> Article supprimé le</strong>  ${this.dateFormatPipeFrench.transform(_params.data.deletingDate, FORMAT_DATE_MONTH)}
                <strong class="athena"> à </strong> ${this.datePipe.transform(_params.data.deletingDate , "HH'h'mm")} <strong class="athena"> 
                par </strong> ${getDefaultStringEmptyValue(_params.data.deletedByUserName)} 
              </div>
              

			  <div class="d-block d-sm-none d-lg-none "><strong class="athena  "> Quantité : </strong> ${_params.data.quantity ? _params.data.quantity:'-'}</div>
              <div class=" d-block d-sm-none d-lg-none"><strong class="athena  "> Prix(TTC) : </strong> ${this.calculateTTCPrice(_params)}</div>


          </div>
  
          <div class="col-lg-12 col-24 pl-1 pl-lg-4">
              <div class="row">
                  <label class="athena col-md-5 col-lg-6 col-24">
                      <strong class="athena"> Commentaire: </strong>
                  </label>
                  <div class="col-sm-17 col-lg-18 mt-1">
                      <textarea disabled style="resize: none; background: #f6f4f4;" 
                      class="form-control athena" rows="4">
                      ${_params.data.comment ? _params.data.comment : ''}
                      </textarea>
                  </div>
              </div>
          </div>
      </div>
  </div>
      `;
    },
    
  };
  
    private calculateTTCPrice(_params: any) {
        return _params.data ? this.formStoreManagementService.calculateTotalPriceTtc(_params.data) : '-';
    }

    ngOnInit() {
      this.form = this.parent.form;
      this.route.queryParamMap.subscribe(params => {
          this.formCatalog = params.get('formCatalog');
      });
      if(!isNullOrUndefined(this.formCatalog) && this.formCatalog === "yes" && !isNullOrUndefined(this.calculeCartPricesService.cart)){
          this.cart = this.calculeCartPricesService.cart;
          this.deletedItems =  this.calculeCartPricesService.deletedItems;
          this.calculeCartPricesService.deletedItems = null;
          this.fillData();
        } else {
          this.route.data.subscribe((resolve) => {
          this.cart =  resolve['carts'][0];
          this.fillData();
        });
      }
      this.form .addControl('article', new FormGroup({
          cartItems :this._formBuilder.control(this.cartItems),
          deletedItems : new FormControl(this.deletedItems)
      })) 
      this.generateUniqueIdInCreationCartItem();
      this.rowData = this.cartItems;
      this.notifyWhenArticleIsChanged();
      this.setColunmDefinition();
      this.basketHasSupscriptionPeriodicityArticle();
      this.redirectionService.getAgGridLoader().subscribe((load) => {
      if (load) {
          this.params = {
            force: true,
            suppressFlash: true,
          };
          this.redrawDetailsRows=true;
        }
      });
      this.onCheckArticleModification.emit(false);
    }
  basketHasSupscriptionPeriodicityArticle() {
    if(!this.cartItems || this.cartItems.length === 0){
      this.onCheckArticleSupscriptionPeriodicity.emit('empty');
    }else{
      const cartItemsClone = this.cartItems.slice();
      const hasArtcileWithSupscriptionPeriodicityACTE = String(cartItemsClone.filter(item=> this.periodicities.includes(item.product.masterProduct.subscriptionPeriodicity) || item.product.masterProduct.recurrent).length !== 0);
      this.onCheckArticleSupscriptionPeriodicity.emit(hasArtcileWithSupscriptionPeriodicityACTE);
    }
  }

generateUniqueIdInCreationCartItem(){
  if(this.cartItems){
    this.cartItems.forEach(item => {
     item.uniqueId = generateRandomString(5);
   });
  }
}

fillData(){
  this.cartItems = this.cart && this.cart.request ? this.cart.request.cartItems : [];
if(this.cartItems){
  this.totalPages = Math.ceil(this.cartItems.length/ 20); 
}
  this.cartItemTosave = this.cart && this.cart.request ? this.cart.request.cartItems : [];
  this.formStoreManagementService.cartItems = this.cartItems;
  this.formStoreManagementService.cart = this.cart;
  this.removeCartItemByDeletingDate();
  this.removeOldCartItemByDeletingDate();
  this.formStoreManagementService.forms.splice(0, this.formStoreManagementService.forms.length);
    this.initRowForms();
  this.addArrowsToCartItems();
  this.addArrowsToOldCartItems();
  this.cartStatus = this.cart ? this.cart.status:'';
  this.onSendStatusToParent.emit(this.cartStatus);
  if(!this.deletedItems){
    this.getDeletedCartItems(this.cart);
  }

}
   private setColunmDefinition() {
        window.addEventListener('resize', () => {
            setTimeout(() => {
                // partie responsive
                if (window.innerWidth > 991) {
                    this.detailleheight = 275;
                    this.detailleheighthisrq = 135;
                    this.setColumnDef();
                }
                else if (window.innerWidth <= 767) {
                    this.detailleheight = 550;
                    this.detailleheighthisrq = 280;
                    // mobile responsive tableau article
                    this.columnDefs = [
                        {
                            headerName: ' ',
                            headerTooltip: 'arrow',
                            cellRenderer: 'agGroupCellRenderer',
                            field: 'arrow',
                            resizable: true,
                            minWidth: 35,
                            maxWidth: 35,
                            suppressSizeToFit: true,
                             lockPosition:true,
                            cellClass: 'arrowarticle',
                        },
                        {
                            headerName: 'Article',
                            field: 'productLabel',
                            colId: 'productLabel',
                            minWidth: 200,
                            maxWidth: 200,
                            pagination: false,
                            cellRenderer: (params) => {
                                return this.isMandatoryComment(params)
                                    ? this.addAlertBadgeIfHasMandatoryComment(params.data)
                                    : params.data.productLabel;
                            },
                        },
                    ];
                    // mobile responsive tableau histourique
                    this.columnDefsHistrq = [
                        {
                            headerName: ' ',
                            headerTooltip: 'arrow',
                            cellRenderer: 'agGroupCellRenderer',
                            field: 'arrow',
                            resizable: true,
                            minWidth: 35,
                            maxWidth: 35,
                            suppressSizeToFit: true,
                            cellClass: 'arrowarticle',
                        },
                        {
                            headerName: 'Article',
                            field: 'productLabel',
                            colId: 'productLabel',
                            minWidth: 200,
                            maxWidth: 200,
                            pagination: false
                        },
                    ];
                    // tablette responsive tableau article
                }
                else if (window.innerWidth >= 768) {
                    this.detailleheight = 400;
                    this.detailleheighthisrq = 200;
                    this.columnDefs = [
                        {
                            headerName: ' ',
                            headerTooltip: 'arrow',
                            cellRenderer: 'agGroupCellRenderer',
                            field: 'arrow',
                            resizable: true,
                            minWidth: 35,
                            lockPosition:true,
                            maxWidth: 35,
                            suppressSizeToFit: true,
                            cellClass: 'arrowarticle',
                        },
                        {
                            headerName: 'Article',
                            field: 'productLabel',
                            colId: 'productLabel',
                            cellStyle: { whiteSpace: 'normal' },
                            minWidth: 360,
                            maxWidth: 360,
                            pagination: false,
                            cellRenderer: (params) => {
                                return this.isMandatoryComment(params)
                                    ? this.addAlertBadgeIfHasMandatoryComment(params.data)
                                    : params.data.productLabel;
                            },
                        },
                        {
                            headerName: 'Qté',
                            headerTooltip: 'Date statut',
                            field: 'quantity',
                            comparator: numberComparator,
                            minWidth: 100,
                            maxWidth: 100,
                            cellStyle: { whiteSpace: 'normal' },
                        },
                        {
                            headerName: 'Prix (€ ttc)',
                            headerTooltip: 'prixttc',
                            field: 'prixttc',
                            comparator: numberComparator,
                            minWidth: 120,
                            maxWidth: 120,
                            cellStyle: { whiteSpace: 'normal' },
                            valueGetter: (params) => {
                              return this.formStoreManagementService.calculateTotalPriceTtc(params.data);
                            },
                            cellRenderer: (params) => {
                                return this.formStoreManagementService.calculateTotalPriceTtc(params.data);
                            },
                        },
                        {
                            headerName: '',
                            headerTooltip: '',
                            field: 'delete',
                            // colId: 'delete',
                            cellRenderer: (params) => {
                                return this.visibleActionsOnArticle ? this.iconeDelHtml : '';
                            },
                            minWidth: 40,
                            maxWidth: 40,
                            headerClass: 'iconedelete',
                            cellClass: 'iconedelete',
                        },
                    ];
                    // tablette responsive tableau histourique
                    this.columnDefsHistrq = [
                        {
                            headerName: ' ',
                            headerTooltip: 'arrow',
                            cellRenderer: 'agGroupCellRenderer',
                            field: 'arrow',
                            resizable: true,
                            minWidth: 35,
                            maxWidth: 35,
                            suppressSizeToFit: true,
                            cellClass: 'arrowarticle',
                        },
                        {
                            headerName: 'Article',
                            field: 'productLabel',
                            colId: 'productLabel',
                            cellStyle: { whiteSpace: 'normal' },
                            minWidth: 360,
                            maxWidth: 360
                        },
                        {
                            headerName: 'Qté',
                            headerTooltip: 'Date statut',
                            field: 'quantity',
                            comparator: numberComparator,
                            minWidth: 100,
                            maxWidth: 100,
                            cellStyle: { whiteSpace: 'normal' },
                        },
                        {
                            headerName: 'Prix (€ ttc)',
                            headerTooltip: 'prixttc',
                            field: 'prixttc',
                            comparator: numberComparator,
                            minWidth: 120,
                            maxWidth: 120,
                            cellStyle: { whiteSpace: 'normal' },
                            valueGetter: (params) => {
                              return this.formStoreManagementService.calculateTotalPriceTtc(params.data);
                            },
                            cellRenderer: (params) => {
                                return this.formStoreManagementService.calculateTotalPriceTtc(params.data);
                            },
                        },
                    ];
                }
            });
        });
        if (window.innerWidth > 991) {
            this.detailleheight = 275;
            this.detailleheighthisrq = 135;
            this.setColumnDef();
        }
    }

    private isMandatoryComment(params: any) {
        return params.data.commentMandatory
            && (isNullOrUndefined(params.data.comment) || params.data.comment.length === 0);
    }

  addArrowsToCartItems() {
    if (this.cartItems) {
      this.cartItems.forEach((item) => (item.arrow = ''));
    }
  }
  addArrowsToOldCartItems() {
    if (this.oldCartItems) {
      this.oldCartItems.forEach((item) => (item.arrow = ''));
    }
  }
  removeCartItemByDeletingDate() {
    if (this.cartItems) {
      this.cartItems = this.cartItems.filter((item) =>
        isNullOrUndefined(item.deletingDate)
      );
    }
  }
  removeOldCartItemByDeletingDate() {
    if (this.oldCartItems) {
      this.oldCartItems = this.oldCartItems.filter((item) =>
        isNullOrUndefined(item.deletingDate)
      );
    }
  }
  initRowForms() {
    if (this.cartItems) {
      this.cartItems.forEach((item) => {
        this.formStoreManagementService.forms.push(
          new FormGroup({
            radio: new FormControl(''),
            comment: new FormControl(''),
            serial: new FormControl(''),
            associetedLine: new FormControl(null),
            itemObject : new FormControl(item),
            isRemoved : new FormControl(false),
            acts: new FormControl([])
          })
        );
        this.formStoreManagementService.chosenParkItems.push({});
        this.formStoreManagementService.serialFieldhasChanged.push(false);
      });
    }
  }

  //=====================Deleted cart items================
  getDeletedCartItems(cart) {
    if (this.cart && this.cart.id) {
        this.cartService.getDeletedCartItems(this.cart.id).subscribe((deletedItems) => {
        this.deletedItems = deletedItems;
        this.form.get('article').get('deletedItems').setValue(this.deletedItems);
        this.addArrowsToDeletedItems();
        });
    }
}
  addAlertBadgeIfHasMandatoryComment(product: any) {
    product.isCommentDisplayOnBill = true;
    return `<span class="icon picto-exclamation-rouge"></span> ${product.productLabel}`;
  }
  calculateAssiettePVV(item): any {
    return item.unitPriceHt - item.discount - item.acquisitionPrice;
  }
  
  setColumnDef(): void {
    
    //  desktop tableau article
    this.columnDefs = [
      {
        headerName: '',
        headerTooltip: 'arrow',
        cellRenderer: 'agGroupCellRenderer',
        field: 'arrow',
        maxWidth: 35,
        minWidth: 35,
        cellClass: 'arrowarticle',
        lockPosition:true
      },
      {
        headerName: '',
        rowDrag: true,
        cellClass: 'arrowarticle',
        field: 'rowdrag',
        minWidth: 30,
        maxWidth: 30,
        lockPosition:true
      },
      {
        headerName: 'Article',
        field: 'productLabel',
        colId: 'productLabel',
         cellStyle: {"text-decoration": "underline", whiteSpace: "normal" },
        minWidth: 190,
        cellRenderer: (params) => {
          return this.isMandatoryComment(params)
            ?  this.addAlertBadgeIfHasMandatoryComment(params.data)
            : params.data.productLabel;
        },
        autoHeight: true,
      },

      {
        headerName: 'acq (€ HT)',
        headerTooltip: '',
        field: 'acquisitionPriceReal',
        minWidth: 62,
        cellStyle: { whiteSpace: 'normal' },
        editable: (params)=> this.changementMode(),
        cellEditor: "numericEditor",
      //   cellRenderer: (params) => {
      //    return ` <input  inputmode="numeric" pattern="[-+]?[0-9]*[.,]?[0-9]+"  > </input>`
      //  },

      },

      {
        headerName: 'Marge (%)',
        headerTooltip: 'Livraison  souhaitée',
        field: 'marginReal',
        cellStyle: { whiteSpace: 'normal' },
        minWidth: 70,
        cellRenderer: (params) => {
          return this.formStoreManagementService.formatPrice(this.calculateMargeReal(params.data));
        },
      },
      {
        headerName: 'Unitaire (€ HT)',
        headerTooltip: 'N°',
        field: 'unitPriceHt',
        comparator: numberComparator,
        cellEditor: "numericEditor",
        minWidth: 75,
         editable: (params)=> this.changementMode(),
        // cellRenderer: (params) => {
        //   return ` <input type="number" size="4"> </input>`
        // },
      },
      {
        headerName: 'Remise (€ ht)',
        headerTooltip: 'N°',
        field: 'discount',
        suppressSizeToFit: true,
        minWidth: 70,
        editable: (params)=>this.changementMode(),
        cellEditor: "numericEditor",
        // cellRenderer: (params) => {
        //   return ` <input type="number" size="4"> </input>`
        // },
      },
      {
        headerName: 'Qté',
        headerTooltip: 'Date statut',
        field: 'quantity',
        comparator: numberComparator,
        minWidth: 55,
        cellStyle: { whiteSpace: 'normal' },
        cellEditor: "numericEditor",
        editable: (params)=> params.data.product.masterProduct.quantityBlocked ? false:this.changementMode(),

      },
      {
        headerName: 'Tva ',
        headerTooltip: 'N°',
        field: 'tva',
        comparator: sortTVA,
        cellClicked: 'true',
        minWidth: 55,
        suppressSizeToFit: true,
        cellStyle: { whiteSpace: 'normal' },
        valueGetter: (params) => {
          return this.formStoreManagementService.getTvaNumberValue(params.data.tauxTVA);
        },
        cellRenderer: (params) => {
          return this.formStoreManagementService.getTvaNumberValue(params.data.tauxTVA);
        },
      },

      {
        headerName: 'Dépl',
        headerTooltip: 'Date statut',
        field: 'dépl',
        comparator: numberComparator,
        minWidth: 60,
        cellStyle: { whiteSpace: 'normal' },
        valueGetter: (params) => {
          return this.formStoreManagementService.calculateTotalPriceTtc(params.data);
        },
        cellRenderer: (params) => {
          return this.formStoreManagementService.calculateTotalPriceTtc(params.data);
        },
      },

      {
        headerName: 'Prix (€ ttc)',
        headerTooltip: 'prixttc',
        field: 'prixttc',
        comparator: numberComparator,
        minWidth: 62,
        cellStyle: { whiteSpace: 'normal' },
        valueGetter: (params) => {
          return this.formStoreManagementService.calculateTotalPriceTtc(params.data);
        },
        cellRenderer: (params) => {
          return this.formStoreManagementService.calculateTotalPriceTtc(params.data);
        },
      },

      {
        headerName: '',
        headerTooltip: '',
        field: 'delete',
        // colId: 'delete',
        cellRenderer: (params) => {
          return this.visibleActionsOnArticle ? this.iconeDelHtml : '';
        },
        minWidth: 40,
      },
    ];

    //  desktop tableau histourique
    this.columnDefsHistrq = [
      {
        headerName: ' ',
        headerTooltip: 'arrow',
        cellRenderer: 'agGroupCellRenderer',
        field: 'arrow',
        minWidth: 35,
        maxWidth: 35,
        cellClass: 'arrowarticle',
      },
      {
        headerName: 'Article',
        headerTooltip: '',
        field: 'productLabel',
        colId: 'productLabel',
        cellStyle: {"text-decoration": "underline", whiteSpace: "normal" },
        minWidth: 228,
        maxWidth: 228,
        suppressSizeToFit: true
      },

      {
        headerName: 'acq (€ HT)',
        headerTooltip: '',
        field: 'acquisitionPriceReal',
        minWidth: 62,
        maxWidth: 62,
        cellStyle: { whiteSpace: 'normal' },
      },

      {
        headerName: 'Marge (%)',
        headerTooltip: 'Livraison  souhaitée',
        field: 'marginReal',
        cellStyle: { whiteSpace: 'normal' },
        minWidth: 75,
        maxWidth: 75,
        cellRenderer: (params) => {
          return this.formStoreManagementService.formatPrice(this.calculateMargeReal(params.data));
        },
      },
      {
        headerName: 'Unitaire (€ HT)',
        headerTooltip: 'N°',
        field: 'unitPriceHt',
        comparator: numberComparator,
        minWidth: 85,
        maxWidth: 85,
      },
      {
        headerName: 'Remise (€ ht)',
        headerTooltip: 'N°',
        field: 'discount',
        suppressSizeToFit: true,
        minWidth: 78,
        maxWidth: 78,
      },
      {
        headerName: 'Qté',
        headerTooltip: 'Date statut',
        field: 'quantity',
        comparator: numberComparator,
        minWidth: 65,
        maxWidth: 65,
        cellStyle: { whiteSpace: 'normal' },
      },
      {
        headerName: 'Tva ',
        headerTooltip: 'N°',
        field: 'tva',
        comparator: sortTVA,
        cellClicked: 'true',
        minWidth: 65,
        maxWidth: 65,
        suppressSizeToFit: true,
        cellStyle: { whiteSpace: 'normal' },
        valueGetter: (params) => {
          return this.formStoreManagementService.getTvaNumberValue(params.data.tauxTVA);
        },
        cellRenderer: (params) => {
          return this.formStoreManagementService.getTvaNumberValue(params.data.tauxTVA);
        },
      },

      {
        headerName: 'Dépl',
        headerTooltip: 'Date statut',
        field: 'dépl',
        comparator: numberComparator,
        minWidth: 60,
        maxWidth: 60,
        cellStyle: { whiteSpace: 'normal' },
        valueGetter: (params) => {
          return this.formStoreManagementService.calculateTotalPriceTtc(params.data);
        },
        cellRenderer: (params) => {
          return this.formStoreManagementService.calculateTotalPriceTtc(params.data);
        },
      },

      {
        headerName: 'Prix (€ ttc)',
        headerTooltip: 'prixttc',
        field: 'prixttc',
        comparator: numberComparator,
        suppressSizeToFit: true,
        minWidth: 62,
        maxWidth: 62,
        cellStyle: { whiteSpace: 'normal' },
        valueGetter: (params) => {
          return this.formStoreManagementService.calculateTotalPriceTtc(params.data);
        },
        cellRenderer: (params) => {
          return this.formStoreManagementService.calculateTotalPriceTtc(params.data);
        },
      },
    ];
  }
  changementMode() {
    switch (this.cartStatus) {
      case 'PENDING':
        return this.redirectionService.hasPermission('pending_article');
      case 'AWAITING_APPROVAL':
        return this.redirectionService.hasPermission('awaiting_approval_article');
      case 'VALIDATE':
        return this.redirectionService.hasPermission('validate_article');
      case 'ESTIMATE_SENT':
        return this.redirectionService.hasPermission('estimate_sent_article');
      case 'READY_DELIVER':
        return this.redirectionService.hasPermission('ready_deliver_article');
      case 'DELIVERED':
        return this.redirectionService.hasPermission('delivered_article');
      case 'ABANDON':
        return this.redirectionService.hasPermission('abandon_article');
      default:
        return false;
    }
  }

  // function show/hide histourique
  onHideHistrq(): void {
    this.showHistrq = true;
  }

  onShowHistrq(): void {
    this.showHistrq = false;
  }
  // function déplier le tableau
  expandedAll() {
    this.show = false;
    this.expandedAllRows = true;
    if (this.compteur % 2 === 0) {
      this.expandedAllRows = true;
    } else {
      this.expandedAllRows = false;
    }
    this.compteur++;
  }

  // function pilier le tableau
  collapseAll() {
    this.show = true;
    this.collapseAllRows = false;

    if (this.compteur2 % 2 === 0) {
      this.collapseAllRows = false;
    } else {
      this.collapseAllRows = true;
    }
    this.compteur2++;
  }

 checkEditableCartByCommandOrderStatus():boolean{
    let isShowen = true;
    if(this.cart && this.cart.commandOrders  && this.cart.commandOrders.length>0){
      this.cart.commandOrders.forEach((OC,indexForm) => {
        if (OC.status !== 'ABANDONED' && OC.status !== 'REJECTED' && OC.status !== 'CANCELED'){
          isShowen =  false;
        }
      });
    }
    return isShowen;
  }
  clickCell(params: any): void {
    if (params.column.colId === 'delete' && this.visibleActionsOnArticle) {
      this.onCheckArticleModification.emit(true);
      this.notificationService.setShowButton(false); 
     const showPopup = this.checkEditableCartByCommandOrderStatus();
      if(showPopup){
        this.removeCartItem(true, params.data.id, params.data.uniqueId, params.data.cartId);
      }
      else{
        this.modalService.open(PopupDeleteArticleComponent, {
          centered: true,
        });
        this.notificationService
        .deletingNotification()
        .pipe(first())
        .subscribe((deleting) => this.removeCartItem(deleting, params.data.id, params.data.uniqueId, params.data.cartId));
      }
     
      
    }  else if (params.column.colId === 'productLabel') {
      this.calculeCartPricesService.cart = this.cart;
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/customer-dashboard', this.customerId, 'cart', 'catalog', this.requestId, params.data.product.masterProduct.name],
          {
            queryParamsHandling: 'merge'
          }
        )
      );
      console.log(url);
      window.open(`#${url}`, '_blank');
    }
  }

  onCellValueChanged(params: any) : void {
    this.onCheckArticleModification.emit(true);
    this.notificationService.setShowButton(false); 
  }

  //=========================Remove Cart Item ===================
  removeCartItem(deleting: boolean, cartId, uniqueId, idCart): void {
    if (deleting) {
      const cartItemsClone = this.cartItems.slice();
      let itemToRemove = null;
      if(idCart === 0){
         itemToRemove = cartItemsClone.filter(
          (cartItem) => cartItem.uniqueId === uniqueId
        )[0];
      }
      else{
        itemToRemove = cartItemsClone.filter(
          (cartItem) => cartItem.id === cartId
        )[0];
      }
      if(itemToRemove){
        itemToRemove.arrow = '';  
      }
      const indexOfItemToRemove = this.cartItems.indexOf(itemToRemove);
      this.cartItems.splice(indexOfItemToRemove, 1);
      this.rowData = this.cartItems.slice();
      this.cart.request.cartItems = this.cartItems;
      this.calculeCartPricesService.cart = this.cart;
      if (this.cartStatus !== 'PENDING') {
        itemToRemove.deletingDate = new Date();
        itemToRemove.deletedById  = this.authTokenService.applicationUser.coachId;
        itemToRemove.deletedByUserName = fullNameFormatter( null , this.authTokenService.applicationUser.firstName ,this.authTokenService.applicationUser.lastName);
        this.deletedItems = [...this.deletedItems, itemToRemove];
        this.calculeCartPricesService.deletedItems = this.deletedItems;
        this.form.get('article').get('deletedItems').setValue(this.deletedItems);
        if( this.formStoreManagementService.forms[indexOfItemToRemove]){
          this.formStoreManagementService.forms[indexOfItemToRemove].get('isRemoved').setValue(false);
        }
      
      }
      else{
        this.formStoreManagementService.forms[indexOfItemToRemove].get('isRemoved').setValue(true);
      }  
      this.initPrelevementStockInDelivery(true);
	  this.onUpdatingItems.emit(this.cartItems);
      this.updateBasket();
    }
    this.basketHasSupscriptionPeriodicityArticle();

  }
//=========================================================

  updateBasket() {
    this.onUpdateRecapCartItem.emit(this.calculeCartPricesService.recalculatePrices(this.cart));
  }
  initPrelevementStockInDelivery(isDeleted) {
    this.onInitPrelevementStock.emit(isDeleted);
  }

  showAllArticles() {
    if (this.showAllCounter % 2 === 0) {
      this.showAllMessage = 'Masquer les autres lignes';
      this.showAllRows = true;
    } else {
      this.showAllMessage = 'Afficher toutes les lignes';
      this.showAllRows = false;
    }
    this.showAllCounter++;
  }

  //======================= detect change in article Forms ==============
 private notifyWhenArticleIsChanged() {
  if(this.formStoreManagementService.forms){
    this.formStoreManagementService.forms.forEach((form,index) => {
      if(this.formStoreManagementService.forms[index]){
        this.formStoreManagementService.forms[index].valueChanges.subscribe((data) => {
          if(this.formStoreManagementService.forms[index].dirty){
            this.cartItems[index].comment = this.formStoreManagementService.forms[index].get('comment').value;
            this.cartItems[index].isCommentDisplayOnBill = this.formStoreManagementService.forms[index].get('radio').value;
            this.cartItems[index].serial = this.formStoreManagementService.forms[index].get('serial').value;
            this.cartItems[index].customerParkItemId = this.formStoreManagementService.forms[index].get('associetedLine').value;
            this.cartItems[index].acts = this.formStoreManagementService.forms[index].get('acts').value;
            this.notificationService.setShowButton(false);
            this.onCheckArticleModification.emit(true);
          }
        });
      }
  });
 
}
}
//=============================================================================

  private calculateMargeReal(item){
    const netPrice = item.unitPriceHt - item.discount;
    if(!isNullOrUndefined(netPrice) && netPrice > 0){
        return 100 * this.calculateMargeReelleHT(item) / netPrice;
    }else{
        return item.acquisitionPriceReal === 0 ? 0:-100;
    }
}

private calculateMargeReelleHT(item){
    return item.unitPriceHt - item.discount - item.acquisitionPriceReal;
}

addArticles(){
  this.calculeCartPricesService.cart = this.cart;
  this.router.navigate(
    ['/customer-dashboard', this.customerId, 'cart', 'catalog', this.requestId],
    { queryParamsHandling: 'merge' }
  );
}

addArrowsToDeletedItems(){
  this.deletedItems.forEach((item) => {
    item.arrow = '';
});
}
 goToPage(page: number): void {
      this.currentPage = page;
    }

  onRowDragEnd(event: any): void {
    const rowData = [];
    event.api.forEachNode(node => {
      const data = { ...node.data, ordinal: node.rowIndex };
      rowData.push(data);
    });
    this.form.get('article').get('cartItems').setValue(rowData);
  }



}
