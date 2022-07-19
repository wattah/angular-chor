import { browser, by, element, ElementFinder } from 'protractor';

export class SearchPage {

  navigateTo() {

    return browser.get('/');
  }

  getInputSearch(): ElementFinder {
    return element(by.id("typeahead-search"));
  }

  getButtonSearch(): ElementFinder {
    return element(by.className("btn btn-blue navbar-btn-search"));
  }

  getElementFromAutoComplete(n): ElementFinder {
    return element.all(by.className('like-a-href')).get(n);
  }
  getPictoFromAutoComplete(n): ElementFinder {
    return element.all(by.css("img[src*='assets/images/type-beneficiaire.png']")).get(n);
  }


}