import { by, element, ElementFinder } from 'protractor';

export class AllResultPage {
  
  getElementFromTable(rowId): ElementFinder {
    return element.all(by.css(`div[row-id="${rowId}"] div.ag-cell-value`)).last();
  }
}