import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from "@angular/router";
import { CartComponent } from "../../main/cart/cart.component";
import { CatalogComponentService } from "../services/catalog-component.service";

@Injectable({
    providedIn: 'root'
  })
  export class DestroyServiceCatalogGuard implements CanDeactivate<CartComponent> {



    constructor(private readonly catalogComponentService: CatalogComponentService) {}
    canDeactivate(component: CartComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot):boolean | Promise<boolean> {
            this.catalogComponentService.setNameClature1(null);
            this.catalogComponentService.setNameClature2(null);
            this.catalogComponentService.setNameClature3(null);
            this.catalogComponentService.setNameClature4(null);
            this.catalogComponentService.setNameClature5(null);
            this.catalogComponentService.setNameDescriRef('');
        return true;
      }
  }
