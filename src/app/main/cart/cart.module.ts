import { SavMobileComponent } from './sav-mobile/sav-mobile.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from '@ag-grid-community/angular';

import { PopupDeleteArticleComponent } from './cart/tab-article/popup-delete-article/popup-delete-article.component';
import { IconRendererComponent } from './../../dashboard/dashboard/icon-renderer/icon-renderer.component';
import { DetailArticlRenderer } from './cart/tab-article/detail-cell-render';

import { NumericEditor } from './cart/tab-article/numeric-editor/numeric-editor.component';


import { TabArticleComponent } from './cart/tab-article/tab-article.component';
import { TabDevisComponent } from './cart/tab-devis/tab-devis.component';
import { TabBillingComponent } from './cart/tab-billing/tab-billing.component';
import { TabDeliveryComponent } from './cart/tab-delivery/tab-delivery.component';
import { TabSavComponent } from './cart/tab-sav/tab-sav.component';

import { TabLogisticsProcessingComponent } from './cart/tab-logistics-processing/tab-logistics-processing.component';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { SharedModule } from '../../../app/_shared/shared.module';
import { MainSharedModule } from '../_shared/main-shared.module';
import { CartCreationComponent } from './cart-creation/cart-creation.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ReinstatementArticlePopUpComponent } from './cart/tab-logistics-processing/reinstatement-article-pop-up/reinstatement-article-pop-up.component';
import { ProductsCatalogueComponent } from './products-catalogue/products-catalogue.component';
import { ProductsCatalogAgGridComponent } from './catalog/products-catalog-ag-grid/products-catalog-ag-grid.component';
import { MasterProductModificationComponent } from './master-product-modification/master-product-modification.component';
import { MasterProductCreationComponent } from './master-product-creation/master-product-creation.component';
import { TarifDeclinationComponent } from './tarif-declination/tarif-declination.component';


const COMPONENTS = [
  TabArticleComponent,
  TabDevisComponent,
  TabBillingComponent,
  TabDeliveryComponent,
  TabSavComponent,
  TabLogisticsProcessingComponent,
  CartComponent,
  CartCreationComponent,
  CatalogComponent,
  ReinstatementArticlePopUpComponent,
  DetailArticlRenderer,
  PopupDeleteArticleComponent,
  NumericEditor,
  SavMobileComponent,
  ProductsCatalogueComponent,
  ProductsCatalogAgGridComponent,
  MasterProductModificationComponent,
  MasterProductCreationComponent,
  TarifDeclinationComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    
    SharedModule,
    MainSharedModule,
    CartRoutingModule,
    AgGridModule.withComponents([IconRendererComponent, DetailArticlRenderer,NumericEditor ])
  ]
})
export class CartModule { }
