import { JwtTokenService } from './jwt-token.service';
import { map, tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { TokenVO } from './../models/TokenVO';
import { HttpBaseService } from './http-base.service';
import { ApplicationUserVO } from '../models/application-user';
@Injectable({
    providedIn: 'root'
  })
export class AuthTokenService extends HttpBaseService<TokenVO>{
    tokenVO: TokenVO = {} as TokenVO;
    applicationUser: ApplicationUserVO = {} as ApplicationUserVO;
    constructor(httpClient: HttpClient ,
         private readonly jwtTokenService:JwtTokenService){
        super(httpClient,'login');
    }

    public doAuthenticate(){
        return this.httpClient.get<TokenVO>(`${environment.baseUrl}/authegassi/userconnectegassi`)
                              .pipe(
                                  map((token)=>this.tokenVO=token),
                                  tap((tokenVO)=>sessionStorage.setItem('token', tokenVO.token)),
                                  map((tokenVO)=>this.jwtTokenService.decodeToken(tokenVO)),
                                  tap((decodedToken)=>this.mappeUserApplication(decodedToken)),
                                  catchError((error)=>{ 
                                    window.location.href = `${environment.accessNotAuthenticatedRedirectUrl}`;
                                    return null;
                                  }))
                                  .toPromise();

    }
    mappeUserApplication(decodedToken: any): void {
        this.applicationUser.coachId = decodedToken.userId;
        this.applicationUser.firstName = decodedToken.userFirstName;
        this.applicationUser.lastName = decodedToken.userLastName;
        this.applicationUser.identifiantFT = decodedToken.value.sub;
        this.applicationUser.roles = decodedToken.roles.map(role=>role.roleName);
        this.sortRolesByAffectationDate(decodedToken.roles);
        this.applicationUser.activeRole = decodedToken.roles[0];
        this.applicationUser.permissions = decodedToken.roles[0].permissions;
        this.applicationUser.roleWithPermissions = decodedToken.roles;
        this.applicationUser.roleRequestTypes = this.tokenVO.roleRequestTypes
        const activeRoleRequestTypes = this.applicationUser.roleRequestTypes.slice().find(roleRequestType=>roleRequestType.roleName === this.tokenVO.selectedRole);
        if(activeRoleRequestTypes){
          this.applicationUser.activeRoleRequestTypes = activeRoleRequestTypes.requestTypes;
        }
        console.log('this.applicationUser = ' , this.applicationUser);
    }
  sortRolesByAffectationDate(roles: any) {
    roles.sort( (role1, role2) => new Date(role2.affectationDate).getTime() - new Date(role1.affectationDate).getTime());
  }

}
