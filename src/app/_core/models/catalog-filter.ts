import { EntityBase } from './entity-base';

export interface CatalogFilterVo extends EntityBase {

  textSearch : string;
  idCategory: number;
  nomenclatureCode: string;
  productStatus: string;
  customerId: string;
  page: number;
  pageSize: number;
  sortField: string;
  sortOrder: string;
}
