import { AuthTokenService } from './../_core/services/auth_token';
import { RedirectionService } from './../_core/services/redirection.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout-page',
  templateUrl: './logout-page.component.html',
  styleUrls: ['./logout-page.component.scss']
})
export class LogoutPageComponent implements OnInit {
  isClickOnDeconnexion: boolean;

  constructor(private readonly location: Location,
              private readonly redirectionService: RedirectionService,
              private readonly authTokenService: AuthTokenService) { }

  ngOnInit() {
    this.redirectionService.setLogout(false);
    sessionStorage.setItem('activeRole', this.authTokenService.applicationUser.activeRole.displayName);
    this.isClickOnDeconnexion = this.redirectionService.getActionOnDeconnexion();
    this.redirectionService.clickOnDeconnexion(false);
    this.redirectionService.setLogin(false);
    this.redirectionService.setLogout(true);
  }

  reconnect(){
    this.redirectionService.setLogin(true);
    this.redirectionService.setSessionTimeout(false);
    this.location.back();
  }

}
