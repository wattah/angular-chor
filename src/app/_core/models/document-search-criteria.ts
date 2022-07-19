
export interface DocumentSearchCriteria {
  targetType: string;
  targetId: number;
  showRequestsDoc: boolean;
  startDate: Date;
  endDate: Date;
  typeDocId: number;
  titles: string[];
  page: number;
  pageSize: number;
  sortField: string;
  sortOrder: string;
}
