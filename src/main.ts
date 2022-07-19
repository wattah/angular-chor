import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environmentPromise } from './environments/environment';

environmentPromise.then(environment => {

  document.head.appendChild(
    scriptJs(environment['adaBannerPlateformeUrl'], '/registry/banner.js', false, ''));
  document.head.appendChild(
    scriptJs(environment['aideLignePlateformeUrl'], '/know/5/servlet/publicationList?applicationId=ATNG1R0', true, 'KNOW_TAG_ID' ));
  if (environment['production']) {
    enableProdMode();
  }

  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
});
const scriptJs = function (env: any, js: any, async: boolean, id: any): any {
  const script = document.createElement('script');
  script.src = env + js;
  if ( id !== '') {
    script.id = id;
  }
  if ( async) {
    script.async = async;
  }
  return script;
};
