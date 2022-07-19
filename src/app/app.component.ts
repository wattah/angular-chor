import { RedirectionService } from './_core/services/redirection.service';
import { isNullOrUndefined } from './_core/utils/string-utils';
import { AuthTokenService } from './_core/services/auth_token';
import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Idle } from '@ng-idle/core';
import { Subscription } from 'rxjs';
import { ProgressBarModalComponent } from './progressbar-modal.component';
import { ApplicationUserVO } from './_core/models/application-user';

import { GassiMockLoginService } from './_core/services/gassi-mock-login.service';

import { UserService } from './_core/services/user-service';
import { environment } from '../environments/environment';
import { filter } from 'rxjs/operators';
import { NgxPermissionsService } from 'ngx-permissions';
import { NotificationService } from './_core/services/notification.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { ADA_PERMISSIONS  } from './_core/constants/constants';

/**
 * Composant contenant toute l'applicaton
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit , OnDestroy {
  user: ApplicationUserVO;
  role: string;
  ftUid: string;
  // Used to show or hide the Spinner
  showLoadingSpinner = false;
  idleState = 'NOT_STARTED';
  timedOut = false;
  lastPing?: Date = null;
  progressBarPopup: NgbModalRef;
  routerEventSubscription: Subscription;
  version: string;
  subscription: Subscription ;
  isLivePage = false;
  jiraUrl: string;
  isLogout = false;
  watchUserActivitySubscription: Subscription;
  _router: Router;
  mockLoginService: GassiMockLoginService;
  idle: Idle;
  ngbModal: NgbModal;
  userService: UserService;
  authTokenService: AuthTokenService;
  permissionsService: NgxPermissionsService;
  notificationService: NotificationService;
  redirectionService: RedirectionService;
  bnIdle: BnNgIdleService;
  constructor(
    private readonly injector : Injector
  ) {
    this.injectServices();

    this.notificationService.notifyIsLivePage().subscribe((data) => {
      console.log('data in app comp', data);
      this.isLivePage = data;
    });

    // Subscribe to the router events observable
    this._router.events.subscribe((routerEvent: Event) => {
      //On NavigationStart, set showLoadingSpinner to ture
      if (routerEvent instanceof NavigationStart) {
        this.showLoadingSpinner = true;
      }

      // On NavigationEnd or NavigationError or NavigationCancel
      // set showLoadingSpinner to false
      if (
        routerEvent instanceof NavigationEnd ||
        routerEvent instanceof NavigationError ||
        routerEvent instanceof NavigationCancel
      ) {
        this.showLoadingSpinner = false;
      }
    });
  }
  injectServices() {
    this._router = this.injector.get<Router>(Router);
    this.mockLoginService = this.injector.get<GassiMockLoginService>(GassiMockLoginService);
    this.ngbModal = this.injector.get<NgbModal>(NgbModal);
    this.userService = this.injector.get<UserService>(UserService);
    this.authTokenService = this.injector.get<AuthTokenService>(AuthTokenService);
    this.permissionsService = this.injector.get<NgxPermissionsService>(NgxPermissionsService);
    this.notificationService = this.injector.get<NotificationService>(NotificationService);
    this.redirectionService = this.injector.get<RedirectionService>(RedirectionService);
    this.bnIdle = this.injector.get<BnNgIdleService>(BnNgIdleService);
  }

  ngOnInit(): void {
    this.user = this.authTokenService.applicationUser;
    if (!isNullOrUndefined(this.user)) {
      this.redirectionService.permissions = this.user.permissions;
      this.permissionsService.loadPermissions(this.user.permissions);
      this.mockLoginService.setCurrentConnectedUserId(this.user);
      if (this.user !== null && this.user.roles !== null) {
        this.role = this.user.roles[0];
      }
      this.mockLoginService.setCurrentCUID(this.user.identifiantFT);
      this.mockLoginService.setCurrentUserId(this.user.coachId);
    }

    this.version = `${environment.version}`;
    this.jiraUrl = `${environment.urlJira}`;
    this.mockLoginService.setJiraUrl(this.jiraUrl);
    
    // FIXME Suite a la suppression de internal.properties userService.getBuildVersion() ne retourne plus la valeur de la version
    /* this.userService.getBuildVersion().subscribe((data) => {
      this.version = data;
    }); */

    
    // racuperer le trigram de l'utilisateur connecté
    this.userService.getNicheByUserId(this.user.coachId).subscribe(
      (userNiche)=>{
        if(userNiche){
          this.authTokenService.applicationUser.trigram = userNiche[0].trigram;
        }
      }
    );
    //traitement pour implementer le besoin ATHENA-775
    this.subscription = this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => window.scrollTo(0, 0));
      //traitement pour implementer le besoin ATHENA-775
      this.subscription = this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => window.scrollTo(0,0));
      this.watchUserActivity();
      this.redirectionService.getLogin().subscribe(
        (isLogin)=> this.isLogout = !isLogin
      );
    }

  watchUserActivity() {
    this.watchUserActivitySubscription = this.bnIdle.startWatching(environment.sessionExperation).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        //this.isLogout = true;
        //this.redirectionService.setLogout(true);
        //this.redirectionService.setSessionTimeout(true);
        //this._router.navigate(['logout']);
      }
    });
  }
    
  ngOnDestroy() {
    this.subscription.unsubscribe();
      //traitement pour implementer le besoin ATHENA-775
      this.subscription = this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => window.scrollTo(0,0));
    }
  closeProgressForm(): void {
    this.progressBarPopup.close();
    window.location.href = `${environment.accessNotAuthenticatedRedirectUrl}`;
  }

  openProgressForm(count: number): void {
    this.progressBarPopup = this.ngbModal.open(ProgressBarModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });
    this.progressBarPopup.componentInstance.count = count;
    this.progressBarPopup.result.then((result: any) => {
      if (result !== '' && 'logout' === result) {
        this.logout();
      } else {
        this.reset();
      }
    });
  }

  reverseNumber(countdown: number): any {
    return 300 - (countdown - 1);
  }

  logout(): void {
    this.resetTimeOut();
  }

  resetTimeOut(): void {
    this.idle.stop();
    this.idle.onIdleStart.unsubscribe();
    this.idle.onTimeoutWarning.unsubscribe();
    this.idle.onIdleEnd.unsubscribe();
    this.idle.onIdleEnd.unsubscribe();
    window.location.href = `${environment.accessNotAuthenticatedRedirectUrl}`;
  }

  reset(): void {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  userChangeRoleEvent(event){
     if(event && this.watchUserActivitySubscription){
      this.watchUserActivitySubscription.unsubscribe();
      this.watchUserActivity();
     }

  }
}
