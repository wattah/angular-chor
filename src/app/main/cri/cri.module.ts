import { AutreStationComponent } from './cri/technical-information/autre-station/autre-station.component';
import { MultiMediaComponent } from './cri/technical-information/multi-media/multi-media.component';
import { WifiComponent } from './cri/technical-information/wifi/wifi.component';
import { GlobalSoundComponent } from './cri/technical-information/global-sound/global-sound.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {DocumentComponent} from './cri/document/document.component';
import {MaterialRecoveredComponent} from './cri/material-recovered/material-recovered.component'
import {OtherComponent} from './cri/other/other.component';
import {RequiredInformationComponent} from './cri/required-information/required-information.component';
import {TechnicalInformationComponent} from './cri/technical-information/technical-information.component'

import { SharedModule } from '../../../app/_shared/shared.module';
import { MainSharedModule } from '../_shared/main-shared.module';

import { CriCreationComponent } from './cri-creation/cri-creation.component';

import { CriRoutingModule } from './cri-routing.module';
import { CriComponent } from './cri.component';

import { RecoveryInformationComponent } from './recovery-information/recovery-information.component';


import { OpticalFiberComponent } from './cri/technical-information/optical-fiber/optical-fiber.component';
import { FemtocellComponent } from './cri/technical-information/femtocell/femtocell.component';
import { SoundComponent } from './cri/technical-information/sound/sound.component';
import { FixLineComponent } from './cri/technical-information/fix-line/fix-line.component';
import { LocationComponent } from './cri/technical-information/location/location.component';
import { AccessPointsComponent } from './cri/technical-information/access-points/access-points.component';
import { PortComponent } from './cri/technical-information/port/port.component';
import { UserComponent } from './cri/technical-information/user/user.component';
import { AdslVdslComponent } from './cri/technical-information/vdsl/adsl-vdsl.component';
import { BackupComponent } from './cri/technical-information/backup/backup.component';
import { MobileComponent } from './cri/technical-information/mobile/mobile.component';
import { NasComponent } from './cri/technical-information/nas/nas.component';
import { DecoderComponent } from './cri/technical-information/decoder/decoder.component';
import { TechnicianInformationComponent } from './cri/technician-information/technician-information.component';
import { AutosizeModule } from 'ngx-autosize';



const COMPONENTS = [
    DocumentComponent,
    MaterialRecoveredComponent,
    OtherComponent,
    RequiredInformationComponent,
    TechnicalInformationComponent,
      OpticalFiberComponent,
      AdslVdslComponent,
      DecoderComponent,
      FemtocellComponent,
      SoundComponent,
      FixLineComponent,
      AccessPointsComponent,
      PortComponent,
      UserComponent,
      BackupComponent,
      LocationComponent,
      MobileComponent,
      NasComponent,

      TechnicianInformationComponent,
    CriComponent,
    CriCreationComponent,
    RecoveryInformationComponent,
    GlobalSoundComponent,
    WifiComponent,
    MultiMediaComponent,
    AutreStationComponent
  ];


  @NgModule({
    declarations: COMPONENTS,
    imports: [
      AutosizeModule,
      CommonModule,
      SharedModule,
      MainSharedModule,
      CriRoutingModule,
    ]})
  export class CriModule {

  }
