import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

/**
 * Composant contenant le changement de langue
 */
@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  providers: [NgbDropdownConfig]
})
export class LanguageComponent implements OnInit {
  /**
	 * flag pour connaitre la langue de l'application
	 */
  isFrench = true;

  /**
	 * Constructeur
	 * @param translate service de traduction
	 * @param config configuration du menu déroulant pour ngBootstrap
	 */
  constructor(private translate: TranslateService, private config: NgbDropdownConfig) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('fr');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('fr');

    config.placement = 'bottom-right';
    config.autoClose = true;
  }

  ngOnInit(): void {}

  /**
	 * Traduit le site
	 * @param lang langue de traduction
	 */
  setLanguage(lang: string): void {
    this.translate.use(lang);
    this.isFrench = lang === 'en' ? false : true;
  }
}
