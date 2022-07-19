 import { getEncryptedValue } from '../utils/functions-utils';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { TARGET_TYPE_DOCUMENT } from '../constants/constants';

@Injectable({ providedIn: 'root' })
export class EncondingGuard implements CanActivate {
  constructor(private readonly router: Router) {}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let customerIdEncrypted;
    // if the customer id parameter is named : id , in case of calling the method documentsService.getDocumentFullBy
    if(route.params['id'] && route.params['targetType'] === TARGET_TYPE_DOCUMENT.CUSTOMER 
    && !isNaN(Number(route.params['id']))){
        customerIdEncrypted = getEncryptedValue(route.params['id']);
        const url = this.getConfiguredUrl(route).replace(":id",customerIdEncrypted);
        const arr = url.split('/');
        arr.pop();
        this.router.navigate(arr, { queryParams: route.queryParams });
    }
    // if the customer id parameter is named : customerId
    if(route.params['customerId'] && !isNaN(Number(route.params['customerId']))){
        customerIdEncrypted = getEncryptedValue(route.params['customerId']);
        const url = this.getConfiguredUrl(route).replace(":customerId",customerIdEncrypted);
        const arr = url.split('/');
        arr.pop();
        this.router.navigate(arr, { queryParams: route.queryParams });
    }
    return true;
  }

  getConfiguredUrl(route: ActivatedRouteSnapshot): string {
    return '/' + route.pathFromRoot
        .filter(v => v.routeConfig)
        .map(v => v.routeConfig.path)
        .join('/');
}
}
