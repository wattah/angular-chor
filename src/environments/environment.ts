// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import * as env from "./environment.commons";

export var environmentPromise: Promise<any>;
export var environment = {
  production: false,
  baseUrl: '',
  adaBannerPlateforme: '',
  adaBannerPlateformeUrl: '',
  plateFormeName:'',
  bid: '',
  accessNotAuthenticatedRedirectUrl:'',
  version: '',
  sessionExperation: 60, // une mine
  urlApollon:'https://adhesion.revlamp102.as44099.com/#/login',
  urlJira:'https://portail.agir.orange.com/servicedesk/customer/portal/29'
};

  environmentPromise = env.initEnvironment('',(res:any) => {
  environment = res;
});