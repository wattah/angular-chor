export interface MouvementPaginationCriteria {
    numberBillAccount: string;
    page: number;
    pageSize: number;
    sortfield: string;
    sortOrder: string;
    withoutSoldeZero: boolean;
    univers: string;
}