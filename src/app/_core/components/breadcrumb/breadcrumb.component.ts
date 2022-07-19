import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { isNullOrUndefined } from '../../utils/string-utils';

import { Breadcrumb } from '../../../_core/models/breadcrumb';

/**
 * Composant contenant le fil d'ariane
 */
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  /**
   * élément du fil d'ariane avec lien hypertexte
   */
  breadcrumbs$: any;
  /**
   * élément du fil d'ariane sans lien hypertexte (page courante)
   */
  last: any;

  /**
   * query params
   */
  params: string;

  queryParams: any;

  /**
   * Constructeur, écoute l'évènement quand le routage est fini et lance la construction du fil d'ariane
   * @param router router de l'app
   * @param activatedRoute route active
   */
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.breadcrumbs$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)

    ).pipe(distinctUntilChanged())
    .pipe(map(event => this.buildBreadCrumb(this.activatedRoute.root)));
   // Build your breadcrumb starting with the root route of your current activated route;
  }

  /**
   * récupere les query params
   */
  ngOnInit(): void {
  
  }

  /**
   * Construit le fil d'ariane
   * @param route route de la page
   * @param url url de la page
   * @param breadcrumbs fil d'ariane à mettre à jour
   */
  buildBreadCrumb(route: ActivatedRoute, url: string = '',
                breadcrumbs: Array<Breadcrumb> = []): Array<Breadcrumb> {
    // If no routeConfig is avalailable we are on the root path
    let label = (!isNullOrUndefined(route.routeConfig) && !isNullOrUndefined(route.routeConfig.data)) ? route.routeConfig.data[ 'breadcrumb' ] : 'Page.HomeComponent.breadcrumb';
    let path = route.routeConfig ? route.routeConfig.path : '';
    
    // If the route is dynamic route such as ':customerId', remove it
    const lastRoutePart = path.split('/').pop();
    const isDynamicRoute = lastRoutePart.startsWith(':');
    
    if(isDynamicRoute && !!route.snapshot) {
      const paramName = lastRoutePart.split(':')[1];
      path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
    }
    
    // Get query params if any - always for the last segment.        
    if (path && route.snapshot.queryParamMap.keys.length > 0) {
      this.queryParams = {};
      for (let key of route.snapshot.queryParamMap.keys) {        	
        this.queryParams[key] = route.snapshot.queryParamMap.get(key);
      }
    }
    
    // In the routeConfig the complete path is not available,
    // so we rebuild it each time
    let breadcrumb = null;
    let nextUrl = null;
    nextUrl = `${url}${path}/`;
    breadcrumb = { label: label, url: nextUrl };
  
    const newBreadcrumbs = [ ...breadcrumbs, breadcrumb ];
    if ( !isNullOrUndefined(route.firstChild) && !isNullOrUndefined(route.firstChild.routeConfig) ) {
      if ( route.firstChild.routeConfig.path !== 'customer-dashboard' ) {
        return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
      } else if ( !isNullOrUndefined(route.firstChild.firstChild) ) {
        nextUrl = nextUrl + route.firstChild.routeConfig.path + '/';
        return this.buildBreadCrumb(route.firstChild.firstChild, nextUrl, newBreadcrumbs);
      }
    }

    this.last = newBreadcrumbs[newBreadcrumbs.length - 1];

    // to don't have duplicate
    //const breadcrumbNoDouble = newBreadcrumbs;
    const breadcrumbNoDouble = Array.from(new Set(newBreadcrumbs.map(br => br.label)))
    .map(lbl => {
      return newBreadcrumbs.find(br => br.label === lbl)
    }).filter(br => !isNullOrUndefined(br.label));
    
    // not visible on error 404 page
    const view = document.getElementById('breadcrumb');
    if (this.last.label === 'Page.PageNotFoundComponent.breadcrumb') {
      view.setAttribute('style', 'visibility: hidden;height: 0px');
    } else {
      view.setAttribute('style', 'visibility: visible; height:auto');
    }
    return breadcrumbNoDouble;
  }

}
