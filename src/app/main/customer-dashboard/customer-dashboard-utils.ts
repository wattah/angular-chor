import { isNullOrUndefined } from 'src/app/_core/utils/string-utils';
import { ActivatedRoute } from '@angular/router';

export function getCustomerTypeFromURL(route: ActivatedRoute , customerType: string): boolean {
  return route.snapshot.queryParamMap.get('typeCustomer') === customerType;
}
export function getCustomerIdFromURL(route: ActivatedRoute): string {
  
  let customerId = route.snapshot.paramMap.get('customerId');
  if (isNullOrUndefined(customerId)) {
    customerId = route.parent.snapshot.paramMap.get('customerId');
  }
  return customerId;
}

export function getCustomerTypeStringFromURL(route: ActivatedRoute): string {
  return route.snapshot.queryParamMap.get('typeCustomer');
}

