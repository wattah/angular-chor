import { EntityBase } from "./entity-base";
import { ExcelError50dVo } from "./erreur-excel-50-d-response-vo";

export interface Excel50DResponseVo extends EntityBase{
    arrow: string;
    id: number;
    fileName: string;
    addDate: string;
    nicheName: string;
    nbErreursVO: number;
    nbBillsSuccess: number;
    nbBillsErrors: number;
    excelError50dList: ExcelError50dVo[];
    httpCode: string;
    errorMessage: string;
}
