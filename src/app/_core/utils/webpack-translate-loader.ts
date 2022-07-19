import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';
/**
 * Classe contenant le translate loader
 */
export class WebpackTranslateLoader implements TranslateLoader {
  /**
	 * renvoie les traductions
	 * @param lang nom du fichier de la langue choisie
	 */
  getTranslation(lang: string): Observable<any> {
    return from(import(`../../../assets/i18n/${lang}.json`));
  }
}
