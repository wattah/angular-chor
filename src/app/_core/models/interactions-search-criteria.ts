export interface InteractionsSearchCriteria {

  company: boolean;
  customerId: number;
  automatic: boolean;
  medias: number[];
  createdById: number[];
  startDate: Date;
  endDate: Date;

  page: number;
  pageSize: number;
  sortField: string;
  sortOrder: string;
}
