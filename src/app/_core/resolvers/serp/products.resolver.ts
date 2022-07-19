import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ProductService } from '../../services';
import { ProductVO } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class ProductsResolver implements Resolve<Observable<ProductVO[]>> {

  constructor(private productService: ProductService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<ProductVO[]> {
    const searchPattern = route.queryParams['search_pattern'];
    return this.productService.searchProducts(searchPattern);
  }
}
