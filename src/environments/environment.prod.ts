import * as env from './environment.commons';

export var environmentPromise: Promise<any>;
export var environment = {
  production: true,
  baseUrl: '',
  adaBannerPlateforme: '',
  adaBannerPlateformeUrl: '',
  plateFormeName: '',
  bid: '',
  accessNotAuthenticatedRedirectUrl: '',
  version: '',
  sessionExperation: 5400, // une heure plus demi
  urlApollon:'https://candidature.parnasse.fr/#/login',
  urlJira:'https://portail.agir.orange.com/servicedesk/customer/portal/29'
};

environmentPromise = env.initEnvironment('prod', ( res: any) => {
  environment = res;
});
