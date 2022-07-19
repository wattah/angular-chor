import { EntityBase } from './entity-base';
import { Customer } from './customer';
import { Product } from './product';

export interface SuggestionVO extends EntityBase {

  customer: Customer;

  product: Product;

  itemType: string;
}
