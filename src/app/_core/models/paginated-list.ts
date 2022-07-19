import { EntityBase } from './entity-base';

export interface PaginatedList<T> extends EntityBase {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  sortField: string;
  sortOrder: string;
}
