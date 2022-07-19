import { AuthTokenService } from './../../services/auth_token';
import { UserService } from './../../services/user-service';
import { TitleServices } from './../../services/title-services.service';
import { RedirectionService } from './../../services/redirection.service';
import { GassiMockLoginService } from './../../services/gassi-mock-login.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { RoleVO } from './../../models/RoleVO';
import { isNullOrUndefined } from '../../utils/string-utils';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';

import { ApplicationUserVO } from '../../models/application-user';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from '../../../_shared/components/confirmation-dialog/confirmation-dialog.service';
import { ACTIVE_ROLE, STORED_ACTIVE_ROLE_NAME, STORED_ACTIVE_ROLE_PERMISSIONS } from '../../constants/constants';

/**
 * Composant contenant l'entête
 */
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnChanges {
  @Input()
  user: ApplicationUserVO;
  @Output()
  userChangeRole = new EventEmitter<boolean>();
  role: string;
  roles = [];
  chosenRole;
  nameOfEnvironment = `${environment.plateFormeName}`;
  showRoles = false;
  counter = 0;
  permissions;
  activeRoleName: string;
  roleName: string;

  private readonly change = 'Change';

  private readonly changeRoleMessage = 'Êtes-vous sûr de vouloir changer de rôle? Tout travail en cours non enregistré sera définitivement perdu';

  private readonly oui = 'Oui';

  private readonly non = 'Non';

  private readonly lgSize = 'lg';

  private readonly disconnect = 'Déconnexion';

  private readonly disconnectMessage = 'Souhaitez-vous vous déconnecter?';

  constructor(
    private readonly permissionsService: NgxPermissionsService,
    private readonly gassiMockLoginService: GassiMockLoginService,
    private readonly redirectionService: RedirectionService, readonly router: Router,
    private readonly titleServices : TitleServices,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly authToken: AuthTokenService,
    private readonly userService: UserService
  ) {this.titleServices.setTitle("Athena");}

  ngOnChanges() {
    if (!isNullOrUndefined(this.user)) {
      this.roles = this.user.roleWithPermissions;
      const selectedRoleName = this.authToken.tokenVO.selectedRole;
      let currentRole: RoleVO = null;
      const activatedRole = sessionStorage.getItem(ACTIVE_ROLE);
      currentRole = this.getCurrentRole(selectedRoleName);
      if(activatedRole){
        this.role = activatedRole ? activatedRole:this.user.roleWithPermissions[0].displayName;
        const activeRoleName = sessionStorage.getItem(STORED_ACTIVE_ROLE_NAME);
        this.roleName = activeRoleName ? activeRoleName:this.user.roleWithPermissions[0].roleName;
      }else{
        currentRole = this.getCurrentRole(selectedRoleName);
        this.role = currentRole.displayName;
        this.roleName = currentRole.roleName;
      }
      this.chosenRole = this.role;
      this.permissions = this.getPermissionsByRoleName(this.role);
      this.permissionsService.loadPermissions(this.permissions);
      this.redirectionService.permissions = this.permissions;
      this.redirectionService.setCurrentPermissions(this.permissions);
      this.getRoleRequestTypes(this.roleName);
      sessionStorage.setItem(STORED_ACTIVE_ROLE_NAME, this.roleName);
      sessionStorage.setItem(ACTIVE_ROLE, this.role);
      sessionStorage.setItem(STORED_ACTIVE_ROLE_PERMISSIONS, JSON.stringify(this.permissions));
    }
  }
  getCurrentRole(selectedRoleName: string) {
    return this.roles.slice().filter( (role: RoleVO) => role.roleName === selectedRoleName)[0];
  }

  ngOnInit(): void {
    
  }

  choseRole(role: RoleVO) {
    this.showRoles = false;
    if (this.role !== role.displayName) {
      this.changeRolePopUp(role)
    }
  }
  private changeRole(role: RoleVO) {
    this.getRoleRequestTypes(role.roleName);
    sessionStorage.setItem(ACTIVE_ROLE, role.displayName);
    sessionStorage.setItem(STORED_ACTIVE_ROLE_NAME, role.roleName);
    this.permissions = this.getPermissionsByRoleName(role.displayName);
    this.permissionsService.loadPermissions(this.permissions);
    sessionStorage.setItem(STORED_ACTIVE_ROLE_PERMISSIONS, JSON.stringify(this.permissions));
    this.userService.changeCurrentRole(role.roleId, this.authToken.applicationUser.coachId).subscribe();
    this.redirectionService.permissions = this.permissions;
    this.redirectionService.setCurrentPermissions(this.permissions);
    this.redirectionService.activeRights();
    this.role = role.displayName;
    this.chosenRole = role.roleName;
    this.redirectionService.setAgGridLoader(true);
  }

  private getRoleRequestTypes(roleName: string) {
    const activeRoleRequestTypes = this.user.roleRequestTypes.slice().find(roleRequestType=>roleRequestType.roleName === roleName);
    if(activeRoleRequestTypes){
      this.user.activeRoleRequestTypes = activeRoleRequestTypes.requestTypes;
    }
  }

  getPermissionsByRoleName(roleName: string) {
    const chosenRole = this.roles.filter(
      (role) => role.displayName === roleName
    )[0];
    if (chosenRole && chosenRole.permissions) {
      this.user.activeRole = chosenRole;
      this.gassiMockLoginService.setCurrentConnectedUserId(this.user);
      chosenRole.permissions.push('affichage_authentification');
      return chosenRole.permissions;
    }
    return [];
  }
  /**
   * to simulate toggel fonctionality
   */
  onShowRoles() {
    if (this.counter % 2 === 0) {
      this.showRoles = true;
    } else {
      this.showRoles = false;
    }
    this.counter++;
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    this.redirectionService.getAllowSwitchingRole().subscribe( canOpenMenu => {
      if (canOpenMenu && event.target.classList.contains('show-menu-switch-role')) {
          this.onShowRoles();
        } else {
          this.showRoles = false;
          this.counter++;
        }
    });
  }
  
  addClick(): void {
    this.router.navigate(
      ['/add-absence'], { queryParams: { name: 'add' } });
  }

  openPopUpLogout() {
    this.confirmationDialogService
     .confirm( this.disconnect,this.disconnectMessage, this.oui, this.non, this.lgSize, true)
     .then((logout)=>{
       if(logout){
        this.redirectionService.setLogout(true);
        this.redirectionService.clickOnDeconnexion(true);
        this.redirectionService.setSessionTimeout(false);
        this.router.navigate(['logout']);
       }
     });
     
  }

  changeRolePopUp(role){
    this.confirmationDialogService
     .confirm( this.change,this.changeRoleMessage, this.oui, this.non, this.lgSize, true)
     .then((chose)=>{
       if(chose){
        this.userChangeRole.emit(true);
        this.router.navigate(['/']);
        this.changeRole(role);
       }
     });
  }
}
