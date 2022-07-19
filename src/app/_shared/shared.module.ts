import { ParametrizePopupComponent } from './../main/bill-management/parametrize-popup/parametrize-popup.component';
import { IconRendererComponent } from './../dashboard/dashboard/icon-renderer/icon-renderer.component';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AgGridModule } from '@ag-grid-community/angular';
import {ModuleRegistry} from '@ag-grid-community/core';
import {ClientSideRowModelModule} from "@ag-grid-community/client-side-row-model";
import {MasterDetailModule} from "@ag-grid-enterprise/master-detail";
import { RouterModule } from '@angular/router';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { NgxPermissionsModule } from 'ngx-permissions';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { MaterialModule } from './material/material.module';
import { LignePipe, CivilityPipe, FirstNamePipe, FormatForfaitPipe, IsNullPipe,
  ReplaceurPipe, DateFormatPipeFrench, AbsNumberFormatterPipe , ReplacePipe, ResolutionRequestPipe } from './pipes';
import { StatusRequestFrPipe } from './pipes/status-request-fr/status-request-fr.pipe';

import { HighlightDirective } from './directives/highlight.directive';

import { ConfirmationDialogRelookingComponent } from './confirmation-dialog-relooking/confirmation-dialog-relooking.component'

import { 
  FlagComponent , InfoBullComponent , CancelConfirmationPopUpComponent , InfoBullRendererAgGridComponent,
  AthenaAgGridComponent , LinkRendererAgGridComponent , SearchBtnRendererAgGridComponent , AthenaEditorComponent,
  AthenaTimerComponent , AthenaPaginationComponent , AthenaPaginatedAgGridComponent, CheckboxCellRendererAgGridComponent,
  AthenaNestedDropDownComponent , AthenaNestedDropDownItemComponent , AthenaTableLoaderComponent,
  DatePickerComponent, RadioButtonRendererComponent
} from './components';
import { AthenaBlockLoaderComponent } from './components/athena-block-loader/athena-block-loader.component';
import { AthenaProfilLoaderComponent } from './components/athena-profil-loader/athena-profil-loader.component';

import { AthenaAgGrid2Component } from './components/athena-ag-grid2/athena-ag-grid2.component';
import { ClipboardModule } from 'ngx-clipboard';
import { CartConfirmationDialogComponent } from '../main/cart/cart-confirmation-dialog/cart-confirmation-dialog.component';
import { InterventionComponent } from '../main/cri/cri/technical-information/intervention/intervention.component';
import { FullNameFormatterPipe } from './pipes/full-name-formatter.pipe';
import { CustomDateAdapter } from '../_core/services/costum-date-adapter';
import { RelookingPopupConfirmationComponent } from './components/relooking/relooking-popup-confirmation/relooking-popup-confirmation.component';

import { AthenaInputTextComponent } from './components/athena-input-text/athena-input-text.component';
import { AthenaSelectSimpleComponent } from './components/athena-select-simple/athena-select-simple.component';
import { AthenaSelectAutocompleteComponent } from './components/athena-select-autocomplete/athena-select-autocomplete.component';
import { AthenaTextareaComponent } from './components/athena-textarea/athena-textarea.component';
import { AthenaRadioButtonComponent } from './components/athena-radio-button/athena-radio-button.component';
import { AthenaCheckboxButtonComponent } from './components/athena-checkbox-button/athena-checkbox-button.component';
import { AthenaDatepickerComponent } from './components/athena-datepicker/athena-datepicker.component';
import { AthenaNavTabsComponent } from './components/athena-nav-tabs/athena-nav-tabs.component';
import { AthenaChipsComponent } from './components/athena-chips/athena-chips.component';
import { AthenaCheckUncheckOptionComponent } from './components/athena-check-uncheck-option/athena-check-uncheck-option.component';
import { DropzoneComponent } from './components/dropzone/dropzone.component';
import { BasketInformationComponent } from './components/basket-information/basket-information.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */
const PIPES = [ LignePipe, CivilityPipe, FirstNamePipe, FormatForfaitPipe, ReplaceurPipe, 
  DateFormatPipeFrench, AbsNumberFormatterPipe, StatusRequestFrPipe, IsNullPipe , FullNameFormatterPipe ,
  ReplacePipe, ResolutionRequestPipe ];

const COMPONENTS = [ 
  FlagComponent, InfoBullComponent, CancelConfirmationPopUpComponent, AthenaAgGridComponent,
  LinkRendererAgGridComponent, SearchBtnRendererAgGridComponent, InfoBullRendererAgGridComponent,
  AthenaTimerComponent, AthenaPaginationComponent, AthenaPaginatedAgGridComponent ,
  AthenaEditorComponent, CheckboxCellRendererAgGridComponent,
  AthenaNestedDropDownComponent , AthenaNestedDropDownItemComponent , AthenaTableLoaderComponent , AthenaBlockLoaderComponent , 
  AthenaProfilLoaderComponent, ConfirmationDialogComponent, AthenaAgGrid2Component, 
  CartConfirmationDialogComponent, IconRendererComponent,
  DatePickerComponent,
  RadioButtonRendererComponent,
  InterventionComponent,
  ConfirmationDialogRelookingComponent,
  RelookingPopupConfirmationComponent,
  AthenaInputTextComponent,
  AthenaSelectSimpleComponent,
  AthenaSelectAutocompleteComponent,
  AthenaTextareaComponent,
  AthenaRadioButtonComponent,
  AthenaCheckboxButtonComponent,
  AthenaDatepickerComponent,
  AthenaNavTabsComponent,
  AthenaChipsComponent,
  AthenaCheckUncheckOptionComponent,
  DropzoneComponent,
  ParametrizePopupComponent,
  BasketInformationComponent
];

const DIRECTIVES = [ HighlightDirective ];

@NgModule({
  imports: [CommonModule, TranslateModule, NgbModule, MaterialModule, EditorModule, FormsModule,
    FlexLayoutModule, AgGridModule.withComponents([]), ReactiveFormsModule, RouterModule, NgxDropzoneModule,
    AngularEditorModule , ContentLoaderModule, InternationalPhoneNumberModule, NgxMaterialTimepickerModule
  ],
  declarations: [ ...COMPONENTS, ...PIPES, ...DIRECTIVES, FullNameFormatterPipe, BasketInformationComponent, ResolutionRequestPipe ],
  exports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NgbModule,
    MaterialModule,
    FlexLayoutModule,
    AgGridModule,
    EditorModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    AngularEditorModule,
    NgxPermissionsModule,
    InternationalPhoneNumberModule,
    ClipboardModule,
    NgxMaterialTimepickerModule,
    ...COMPONENTS,
    ...PIPES,
    ...DIRECTIVES
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ]
})
export class SharedModule {
  constructor() {
    ModuleRegistry.registerModules([
      ClientSideRowModelModule,
      MasterDetailModule,
      RowGroupingModule
    ]);
  }
}
