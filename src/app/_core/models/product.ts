import { EntityBase } from './entity-base';

export interface Product extends EntityBase {

  name: string;

  stock_order: string;

  stock_quantity: string;

  manufacturer_name: string;

  nomenclature_id: string;

  nomenclature_n_code: string;

  user_id: string;

  select_number: number;

  pictoName: string;

  displayProductId: string;
}
