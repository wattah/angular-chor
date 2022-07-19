 import { EntityBase } from './entity-base';
export interface ProductVO extends EntityBase {

  refrenceProduct: Number;
  designation: string;
  famille: string;
  categorie: string;
  stock: Number;
  prixTtc: Number;

}