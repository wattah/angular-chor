import { MasterProductService } from './../../master-product.service';
import { CATALOGUE_PERMISSIONS } from './../catalogue-permissions';
import { RedirectionService } from './../../../../_core/services/redirection.service';
import { Component, Input, OnChanges, OnInit, SimpleChanges, OnDestroy } from '@angular/core';
import { CatalogFilterVo } from '../../../../_core/models/catalog-filter';
import { CatalogeService } from '../../../../_core/services/http-catalog.service';
import { isNullOrUndefined } from '../../../../_core/utils/string-utils';
import { ProductVO } from '../../../../_core/models/models';
import { CSS_CLASS_NAME } from '../../../../_core/constants/constants';
import { ProductService } from '../../../../_core/services/product.service';
import { CatalogComponentService } from '../../../../_core/services/catalog-component.service';
import { Router } from '@angular/router';
import { getEncryptedValue } from '../../../../_core/utils/functions-utils';
import { PrixUnitaire } from '../../prix-unitaire';

const RENOUVELLEMENT_ANNUEL = 'Renouvellement Annuel';
const MATERIEL = 'Matériel';
@Component({
  selector: 'app-products-catalog-ag-grid',
  templateUrl: './products-catalog-ag-grid.component.html',
  styleUrls: ['./products-catalog-ag-grid.component.scss']
})
export class ProductsCatalogAgGridComponent implements OnInit, OnChanges, OnDestroy {
  
   /************************************** START ARGUMENTS POUR AG GRID SERVER SIDE *********************************************/
    datasource: any;
    totalItems = 0;
    rowModelType;
    gridApi;
    gridColumnApi;
    gridParams;
    rowStyle = { cursor: 'pointer' };
    params: { force: boolean; suppressFlash: boolean; };
    loadingData = false;
    rowData: any;
    totalPages: number;
    currentPage = 1; 
    paginationPageSize = 20;
    defaultSortModel: any[];
    private readonly customerDashboard = '/customer-dashboard';
    
  /****************************************END ARGUMENTS POUR AG GRID SERVER SIDE **********************************************/

  /*************************************** START INPUT AGRUMENTS ***************************************************************/
    @Input() isSearchBtnClicked ;
    @Input() filtersCreteria : CatalogFilterVo;
  /*************************************** END INPUT AGRUMENTS *************************************************************/

  /*************************************************************
   *                   CONSTANTS
   *********************************************************/
  RASPAIL = "RASPAIL";
  PUBLIDISPATCH = "PUBLIDISPATCH" ;
  BLANC = '_blank';
  CONTENT_TYPE = 'Content-Type';
  PDF = 'pdf';


  /**
   * constructor
   * @param catalogService 
   * @param productService 
   */
  constructor(
         private readonly catalogService: CatalogeService,
         private readonly productService: ProductService ,
         private readonly catalogComponentService: CatalogComponentService,
         private readonly router: Router,
         private readonly redirectionService: RedirectionService,
         private readonly masterProductService: MasterProductService)
    { }

  /*************************************** END CONSTRUCTOR *************************************************************/
  ngOnChanges(changes: SimpleChanges): void {
   
    if (changes['isSearchBtnClicked']) {
      if(!isNullOrUndefined(this.filtersCreteria)){
        this.filtersCreteria.pageSize = 20;
        this.initGrid();
      }
     //
    }
  }
  /*************************************** END ngOnChanges ***************************************************************/
  ngOnInit(): void {
    this.defaultSortModel = [
      { colId: 'nom', sort: 'asc' }
    ];
  }
 /*************************************** END ngOnInit ********************************************************************/
 
/******************************************BEGIN COLUMNS DEFINITION AGI GRID***********************************************/
  columnDefs = [

    {
      headerName: 'NOM', headerTooltip: 'nom  de l’article', colId: 'name',
      cellClass:  CSS_CLASS_NAME.CELL_WRAP_TEXT ,
      valueGetter: params => (params.data) ? params.data.name : '',
       width: 250,  sortable: true, autoHeight: true, minWidth : 250
    },
    {
      headerName: 'N1', headerTooltip: 'nomenclature 1', colId: 'nomenclatureone',
      cellClass:  CSS_CLASS_NAME.CELL_WRAP_TEXT ,
      valueGetter: params => (params.data) ? this.getParentLabelAndCurrentLabelLevelFromNomenclatureByLevel(params.data,1) : '',
      width: 80,  sortable: true, autoHeight: true , minWidth : 80    },
    {
      headerName: 'Prix de vente HT',headerTooltip: 'Prix de vente HT',
      cellClass:  CSS_CLASS_NAME.CELL_WRAP_TEXT ,
      valueGetter: params => this.formatHTPrice(params),
      autoHeight: true, width: 120, minWidth : 120
    },
    {
      headerName: 'Prix de vente TTC',  headerTooltip: 'Prix de vente TTC',
      cellClass:  CSS_CLASS_NAME.CELL_WRAP_TEXT ,
      valueGetter: params => (params.data) ? this.masterProductService.getPrixUnitaireTTC(this.getProduct(params)).toFixed(2): '-',
      autoHeight: true,  width: 140,  minWidth : 140
    },
    {
      headerName: 'Supp mobile annuel (HT)', headerTooltip: 'Supp mobile annuel (HT)',
      cellClass:  CSS_CLASS_NAME.CELL_WRAP_TEXT ,
      valueGetter: params => this.calculPriceHT(this.getProductByFamilyName(params , RENOUVELLEMENT_ANNUEL)),
      autoHeight: true,  width: 180 , minWidth : 180
    },
  
    {
      headerName: 'Supp mobile annuel (TTC)', headerTooltip: 'Supp mobile annuel (TTC)',  
      cellClass:  CSS_CLASS_NAME.CELL_WRAP_TEXT ,
      valueGetter: params => this.calculePrixNetTTC(this.getProductByFamilyName(params , RENOUVELLEMENT_ANNUEL)),
      autoHeight: true,  width: 180 , minWidth : 180
    },
    {
      headerName: 'RASPAIL', headerTooltip: 'stock raspail',  field: 'raspail',
      cellClass:  CSS_CLASS_NAME.CELL_WRAP_TEXT ,
      valueGetter: params => {
        let product = this.getProduct(params);
        return product && product.stockRaspail ? product.stockRaspail : '0'
      },
      autoHeight: true, width: 60,minWidth : 60, sortable: false
    },
    {
      headerName: 'PUBLI',  headerTooltip: 'stock publidispatch', colId: 'publidispatsh',
      cellClass:  CSS_CLASS_NAME.CELL_WRAP_TEXT ,
      valueGetter: params => (params.data) && params.data.publidispatchStockQuantity ? params.data.publidispatchStockQuantity : '0',
      autoHeight: true,  width: 80, minWidth : 80 
    },
    {
      headerName: '',  headerTooltip: '',  colId: 'lien',
      cellClass:  CSS_CLASS_NAME.CELL_WRAP_TEXT ,
      cellStyle: { 'text-decoration': 'underline' }, 
      cellRenderer :  params => this.renderLien(), 
      autoHeight: true , sortable: false
    },
    {
      headerName: '',  headerTooltip: '', colId: 'pdf',
      cellClass:  CSS_CLASS_NAME.CELL_WRAP_TEXT ,
      cellStyle: { 'text-decoration': 'underline' }, 
      cellRenderer: params => this.setIconePDF(params.data),
      autoHeight: true , sortable: false
    },
    {
      headerName: '', headerTooltip: '', colId: 'bloc',
      cellClass:  CSS_CLASS_NAME.CELL_WRAP_TEXT ,
      cellRenderer: params => (params.data && this.hasBlockedProducts(params.data)) ? `<span class="icon cadenas-rouge"></span>`:'',
      sortable: false,
    },
    {
      headerName: '', headerTooltip: '', colId: 'update',
      cellClass:  CSS_CLASS_NAME.CELL_WRAP_TEXT ,
      cellRenderer:  params => this.redirectionService.hasPermission(CATALOGUE_PERMISSIONS.MODIFICATION_ADMIINISTRATION_CATALOGUE) ? this.renderPen():'',
      sortable: false,
    }
    
  ];
  private calculePrixNetTTC(product: any) {
    return (product) ? this.masterProductService.calculePrixNetTTC(
          this.masterProductService.getPrixUnitaireTTC(product),
              this.masterProductService.calculeRemiseTTC(
                                product.discountProductHt ? product.discountProductHt:0, 
                                this.masterProductService.getNumberValueTva(product.productTva))) : '-';
  }

  familyProductName(product: ProductVO) {
    if (!isNullOrUndefined(product.family)  && !isNullOrUndefined(product.family.parent) && !isNullOrUndefined(product.family.parent.parent) ) {
      return product.family.parent.parent.name;
    } else if (!isNullOrUndefined(product.family.parent) && product.family.parent.parent == null) {
      return  product.family.parent.name;
    }
    return product.family ? product.family.name : null;
  }

  private getProductByFamilyName(params , familyName){
    return params &&  params.data && params.data.productsVO &&  params.data.productsVO.length !==0 ? params.data.productsVO.find(product=> this.familyProductName(product) === familyName):null;
  }

  private formatHTPrice(params: any) {
    let product = this.getProduct(params);
    return (product && !isNullOrUndefined(product.priceHt)) ? Number(product.priceHt).toFixed(2) : '-';
  }

  private getProduct(params: any) {
    let product;
    if(params && params.data){
      product = this.getParentLabelAndCurrentLabelLevelFromNomenclatureByLevel(params.data,1) === MATERIEL 
    ? params.data.productVO:params.data.productsVO[0];
    }
    return product;
  }

  calculPriceHT(product: any) {
    if(product){
      const discountProductHt = !isNullOrUndefined(product.discountProductHt) ? product.discountProductHt:0;
      return !isNullOrUndefined(product.priceHt) ? (product.priceHt - discountProductHt).toFixed(2):'-';
    }
    return '-';
  }

  hasBlockedProducts(data: any) {
    if(data.productsVO && data.productsVO.length != 0){
      return isNullOrUndefined(data.productsVO.find(product=> !product.blocked));
    }
    return false;
  }

/*****************************************************************************************************************/
  /**
   * init Grid Fonction
   */
  initGrid(): void {
    this.createServerSideDatasource(null);
  }
/*****************************************************************************************************************/
/**
 * @author fsmail
 * createServerSideDatasource Method
 * @param _event 
 */
  createServerSideDatasource(_event: any): void {
    this.totalItems = 0;
    this.loadingData = true;
    this.datasource = {
      getRows: (params) => {      
      
        this.buildCatalogSearchCriteria(params.request);
        this.catalogService.getMonitoringCatalogAdmin(this.filtersCreteria).subscribe(
          data => {
            this.totalItems = data.total;
            this.loadingData = false;
            params.success({ rowData: data.items, rowCount: data.total });
          },
          _error => {
            this.loadingData = false;
            params.fail();
          }
        )
      }
    };    
  }
/****************************************************fin createServerSIDE method *****************************/
 
/**
 * 
 * @param item 
 * @param level 
 * @returns 
 */
  public getParentLabelAndCurrentLabelLevelFromNomenclatureByLevel(item: any, level: number) {
    if(item && item.nomenclature){
      if(item.nomenclature.level === level){
        return  item.nomenclature.nomenclatureLabel
      }
      let parent = item.nomenclature.parent;
      while (parent.level !== level) {
        parent = parent.parent;
      }
      return parent.nomenclatureLabel;
    }
    return '-'
}
/*****************************************************************************************************************/

/**
 * 
 * @param product 
 * @returns 
 */
notHasDescription(product: ProductVO) {
  return isNullOrUndefined(product.productDescriptionName);
}
/*****************************************************************************************************************/
  /**
   * telechargement fichier produit
   */
   downloadDocument(product: ProductVO): void {
    if (!isNullOrUndefined(product.productDescriptionName)) {
      this.productService.downloadDescriptionProduct(product.productDescriptionName).subscribe(
        (data) => {
          const type = data.headers.get(this.CONTENT_TYPE);
          const file = new Blob([data.body], { type });     
          if ( type !== 'application/octet-stream') {
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
          } else {
            const element = document.createElement('a');
            element.target = this.BLANC;
            element.href = URL.createObjectURL(file);
            element.download = product.productDescriptionName;
            document.body.appendChild(element);
            element.click();
          }
        }
      ); 
    }

  }

/*****************************************************************************************************************/
/**
 * 
 * @param data 
 * @returns 
 */
  setIconePDF(data): string {
    if (!isNullOrUndefined(data.productDescriptionName)) {
      return `<span >Doc</span>`;
    } 
    return '';
 }
 /*****************************************************************************************************************/
/**
 * 
 * @param data 
 * @returns 
 */
 renderPen() {
  return  `<span class='icon pen athena' ></span>` ;
}

renderLien() {
  return  `<span >Détail</span>` ;
}
/*****************************************************************************************************************/
/**
 * 
 * @param info 
 */
clickCell(info: any): void {
  if (info.column && info.column.colId === this.PDF ) {      
    this.downloadDocument(info.data);
    }


else if((info.column.colId === 'update') && this.redirectionService.hasPermission(CATALOGUE_PERMISSIONS.MODIFICATION_ADMIINISTRATION_CATALOGUE)){
  let prixUnitaire: PrixUnitaire = {} as PrixUnitaire;
  this.masterProductService.prixUnitaire$.next(prixUnitaire);
  this.router.navigate(
    [this.customerDashboard,getEncryptedValue(0),'cart','produit-maitre-modification', info.data.id],
    {
      queryParamsHandling: 'merge'
    }
  );
}




}
/*****************************************************************************************************************/
buildCatalogSearchCriteria(params: any):CatalogFilterVo {
 
  this.filtersCreteria.sortField = params && params.sortModel && !isNullOrUndefined(params.sortModel[0]) && 
                    !isNullOrUndefined(params.sortModel[0].colId) ? params.sortModel[0].colId :  'name';
  this.filtersCreteria.sortOrder =  params && params.sortModel && !isNullOrUndefined(params.sortModel[0]) &&
                !isNullOrUndefined(params.sortModel[0].sort) ? params.sortModel[0].sort : 'ASC';
  this.filtersCreteria.page =  params  &&  params.endRow > 0 ? params.endRow / this.paginationPageSize : 0,
  this.filtersCreteria.pageSize = this.paginationPageSize;

 return this.filtersCreteria;
}

/**************************************ON DESTROY*************************************** */
ngOnDestroy(): void {
  this.catalogComponentService.setNameClature1(null);
  this.catalogComponentService.setNameClature2(null);
  this.catalogComponentService.setNameClature3(null);
  this.catalogComponentService.setNameClature4(null);
  this.catalogComponentService.setNameClature5(null);
  this.catalogComponentService.setNameDescriRef('');
}


toMasterProduct(): void{
  let prixUnitaire: PrixUnitaire = {} as PrixUnitaire;
  this.masterProductService.prixUnitaire$.next(prixUnitaire);
  this.router.navigate(
    ['/customer-dashboard',getEncryptedValue(0),'cart','produit-maitre-creation']
  )
}

}
