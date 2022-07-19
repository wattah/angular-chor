import { ElementFinder, protractor, browser } from 'protractor';
import { SearchPage } from '../page-object/searchPage.po';
import { AllResultPage } from '../page-object/all-result-page.po';

export class Helpers {
  LEFT = protractor.Key.LEFT;
  DELETE = protractor.Key.DELETE;

  searchPage = new SearchPage();
  allResultPage = new AllResultPage();
  clearDateAndWriteNewValue(element: ElementFinder, newValue: any) {

    for (var i = 0; i < 10; i++) {
      element.sendKeys(this.LEFT + this.DELETE);
    }
    element.sendKeys(newValue);
  }

  clearElementAndSetNewValue(element: ElementFinder, value: any) {

    element.clear().then(function () {
      element.sendKeys(value);
    })
  }

  searchCustomer(motCleSearch, noElement) {
    this.searchPage.getInputSearch().clear();
    this.searchPage.getInputSearch().sendKeys(motCleSearch);
    this.searchPage.getElementFromAutoComplete(noElement).click();
    browser.waitForAngular();

  }
  searchCustomerByboutton(motCleSearch, noElement) {

    this.searchPage.getInputSearch().clear();
    this.searchPage.getInputSearch().sendKeys(motCleSearch);
    this.searchPage.getButtonSearch().click();
    this.allResultPage.getElementFromTable(noElement).click();
    //browser.waitForAngular();

  }
  scrollToElement(element) {
    var scrollIntoView = function () {
      arguments[0].scrollIntoView();
    }
    browser.executeScript(scrollIntoView, element);

  }
  verifyProfilReduit(fullName,contrat,etatMembre,age,secteur,metier,entreprise,wiriterNote,dateNote,contenuNote,langue) {

  }
}