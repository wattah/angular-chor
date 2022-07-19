import { AuthTokenService } from './../../../_core/services/auth_token';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RequestTypeVO } from './../../../_core/models/request-type-vo';
import { ProcessDefinitionVO } from '../../../_core/models/ProcessDefinitionVO';
import { GassiMockLoginService } from './../../../_core/services/gassi-mock-login.service';
import { UserVo } from '../../../_core/models/user-vo';
import { ApplicationUserVO } from '../../../_core/models/application-user';

@Component({
  selector: 'app-parcours-list',
  templateUrl: './parcours-list.component.html',
  styleUrls: ['./parcours-list.component.scss']
})
export class ParcoursListComponent implements OnInit {

  customerId: string;
  userConnected: ApplicationUserVO;
  roleUser: string;
  listUsers: UserVo[] = [];
  currentUserCuid: string;
  typesRequest: RequestTypeVO[];
  listParcours: ProcessDefinitionVO[];
  filteredParcours: ProcessDefinitionVO[] = [];

  constructor(private readonly route: ActivatedRoute,
     private readonly gassiMockLoginService: GassiMockLoginService,
    private readonly authTokenService: AuthTokenService ) {

  }

  ngOnInit() {
    this.customerId = this.route.parent.snapshot.paramMap.get('customerId');
    this.route.data.subscribe(resolversData => {
      this.listUsers = resolversData['listUsers'];
      this.currentUserCuid = this.gassiMockLoginService.getCurrentCUID().getValue();
      this.gassiMockLoginService.getCurrentConnectedUser().subscribe(
        (userApplication) => {
          this.userConnected = userApplication;
          this.roleUser = this.userConnected.activeRole.roleName;
          this.filteredParcours = [];
          this.onChangeListParcours(this.roleUser);
        });
    });
  }

  onChangeListParcours(role): void {
    this.route.data.subscribe(resolversData => {
      this.listParcours = resolversData['listParcours'];
      this.listParcours.sort((a, b) => a.name.localeCompare(b.name));
      this.listParcours.forEach(parcour => {
        if(this.authTokenService.applicationUser.activeRoleRequestTypes.includes(parcour.key)){
          this.filteredParcours.push(parcour);
        }
      });
    });
  }
}
