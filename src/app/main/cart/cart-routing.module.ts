import { NgxPermissionsGuard } from 'ngx-permissions';
import { CATALOGUE_PERMISSIONS } from './catalog/catalogue-permissions';
import { TotalsDebtResolver } from './../../_core/resolvers/customer-dashboard/totals-debt.resolver';
import { RequestAnswersResolver } from './../../_core/resolvers/customer-dashboard/request-answers.resolver';
import { AllManufacturersResolver } from './../../_core/resolvers/all-manufacturers.resolver';
import { SavMobileComponent } from './sav-mobile/sav-mobile.component';
import { InterlocutorsRequestResolver } from './../../_core/resolvers/customer-dashboard/interlocutors-request.resolver';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart.component';
import { InfoProfilResolver, GoodToKnowResolver, DateRecouvrementResolver, UserFilteredResolver, SeveralCustomersTitulaireResolver } from '../../../app/_core/resolvers';
import { CanDeactivateGuard } from '../../../app/_core/guards/can-deactivate-guard';
import { CartCreationComponent } from './cart-creation/cart-creation.component';
import { CartResolver } from '../../_core/resolvers/cart-resolvers';
import { FullCustomerResilver } from '../../_core/resolvers/full-cutomer.resolver';
import { CatalogComponent } from './catalog/catalog.component';
import { RequestDetailsResolver } from '../../_core/resolvers/customer-dashboard/request-details.resolver';
import { CartLightResolver } from '../../_core/resolvers/cart-light-resolvers';
import { LogoPopUpComponent } from '../_shared/logo-pop-up/logo-pop-up.component';
import { CartSavResolver } from '../../_core/resolvers/cart-sav.resolver';
import { FamilyResolver } from '../../_core/resolvers/family.resolver';
import { PopAddAddressComponent } from '../_shared/pop-add-address/pop-add-address.component';
import { DestroyServiceCatalogGuard } from '../../_core/guards/destroy-service-catalogue-guard';
import { ProductsCatalogueComponent } from './products-catalogue/products-catalogue.component';
import { ProductsCatalogAgGridComponent } from './catalog/products-catalog-ag-grid/products-catalog-ag-grid.component';
import { MasterProductModificationComponent } from './master-product-modification/master-product-modification.component';
import { MasterProductCreationComponent } from './master-product-creation/master-product-creation.component';
import { MasterProductResolver } from '../../_core/resolvers/master-product.resolver';
import { CategorieMasterProductResolver } from '../../_core/resolvers/categorie-master-product.resolver';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


  const routes: Routes = [
    {
      path: '',
      component: CartComponent,
      resolve: {
        infoProfil: InfoProfilResolver,
        goodToKnow: GoodToKnowResolver,
        recoveryDate: DateRecouvrementResolver,
        totalDebt: TotalsDebtResolver
      },
      canDeactivate: [DestroyServiceCatalogGuard],
      children: [
        {
          path: 'creation',
          component: CartCreationComponent,
          resolve:{
            interlocutors: InterlocutorsRequestResolver,
            detailRequest: RequestDetailsResolver
          }
        },
        {
          path: 'creation/:idRequest',
          component: CartCreationComponent,
          runGuardsAndResolvers: 'always',
          resolve: {
            users: UserFilteredResolver,
            carts: CartResolver,
            cartLight: CartLightResolver,
            fullCustomer : FullCustomerResilver,
            interlocutors: InterlocutorsRequestResolver,
            detailRequest: RequestDetailsResolver,
            cartSav: CartSavResolver,
            severalCustomerTit: SeveralCustomersTitulaireResolver  
          },
          children: [
            {
              path: 'logoPopUp',
              component: LogoPopUpComponent
            },
            {
              path: 'addAddress',
              component: PopAddAddressComponent
            }
          ]
        },
        {
          path: 'catalog/:idRequest',
          component: CatalogComponent,
          resolve:{
          categories: FamilyResolver,
          interlocutors: InterlocutorsRequestResolver,
          carts: CartResolver  
          }
        },
        {
          path: 'catalog/:idRequest/:productLabel',
          component: CatalogComponent,
          resolve:{
          categories: FamilyResolver,
          interlocutors: InterlocutorsRequestResolver,
          carts: CartResolver  
          }
        },
        {
          path: ':idRequest/sav-mobile',
          component: SavMobileComponent,
          resolve: {
            detailRequest: RequestDetailsResolver,
            manufacturers: AllManufacturersResolver,
            sav: CartSavResolver,
            requestAnswers: RequestAnswersResolver
          }
        },
      ]
    },
    {
      path: 'products-catalogue',
      component: ProductsCatalogueComponent,
      data: {
        breadcrumb: 'Page.ProductsCatalogueComponent.breadcrumb'
      }
    },
    {
      path: 'catalog-administration',
      component: CatalogComponent,
      resolve:{
      categories: FamilyResolver,
      interlocutors: InterlocutorsRequestResolver, 
      },
      data: {
        isAdminCatalog : true,
      },
    },
    {
      path: 'products-catalog-agigrid',
      component: ProductsCatalogAgGridComponent,
      data: {
        breadcrumb: 'Page.ProductsCatalogAgGridComponent.breadcrumb'
      }
     
    },
    {
      path: 'produit-maitre-modification/:idMasterPoduct',
      component: MasterProductModificationComponent,
      resolve:{
        masterProductVO: MasterProductResolver,
        categories: CategorieMasterProductResolver
      },
      canActivate: [NgxPermissionsGuard],
      canDeactivate: [ CanDeactivateGuard ],
      data: {
        breadcrumb: 'Page.MasterProductModificationComponent.breadcrumb',
        permissions: {
          only: CATALOGUE_PERMISSIONS.MODIFICATION_ADMIINISTRATION_CATALOGUE,
          redirectTo: '/'
        }
      }
    },
    {
      path: 'produit-maitre-creation',
      component: MasterProductCreationComponent,
      canActivate: [NgxPermissionsGuard],
      canDeactivate: [ CanDeactivateGuard ],
      resolve:{
        categories: CategorieMasterProductResolver
      },
      data: {
        breadcrumb: 'Page.MasterProductCreationComponent.breadcrumb',
        permissions: {
          only: CATALOGUE_PERMISSIONS.AJOUT_ADMIINISTRATION_CATALOGUE,
          redirectTo: '/'
        }
      }
    },
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ CanDeactivateGuard, NgbActiveModal ]
  })

export class CartRoutingModule { }
