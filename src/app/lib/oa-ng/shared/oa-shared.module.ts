import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'ngx-avatars';
import { DirectoryModule } from 'src/app/lib/oa/directory/directory.module';
import { GatewayModule } from 'src/app/lib/oa/gateway/gateway.module';
import { ActionComponent } from './components/action/action.component';
import { AddressEditorComponent } from './components/address-editor/address-editor.component';
import { AlertComponent } from './components/alert/alert.component';
import { AmountEditorComponent } from './components/amount-editor/amount-editor.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ContentEditorComponent } from './components/content-editor/content-editor.component';
import { CountdownClockComponent } from './components/countdown-clock/countdown-clock.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { FieldEditorComponent } from './components/field-editor/field-editor.component';
import { FileProviderComponent } from './components/file-provider/file-provider.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { GotoEntityButtonComponent } from './components/goto-entity-button/goto-entity-button.component';
import { IconTogglerComponent } from './components/icon-toggler/icon-toggler.component';
import { IconComponent } from './components/icon/icon.component';
import { ImportButtonComponent } from './components/import-button/import-button.component';
import { InputErrorComponent } from './components/input-error/input-error.component';
import { InputRangeComponent } from './components/input-range/input-range.component';
import { InputSelectorComponent } from './components/input-selector/input-selector.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { InputWithHttpComponent } from './components/input-with-http/input-with-http.component';
import { JsonEditorComponent } from './components/json-editor/json-editor.component';
import { NoDataFoundComponent } from './components/no-data-found/no-data-found.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ObjectEditorComponent } from './components/object-editor/object-editor.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { PreviousNextButtonsComponent } from './components/previous-next-buttons/previous-next-buttons.component';
import { ProcessingIndicatorComponent } from './components/processing-indicator/processing-indicator.component';
import { ProgressComponent } from './components/progress/progress.component';
import { QueryBuilderComponent } from './components/query-builder/query-builder.component';
import { RecaptchaComponent } from './components/recaptcha/recaptcha.component';
import { RuleBuilderComponent } from './components/rule-builder/rule-builder.component';
import { SearchComponent } from './components/search/search.component';
import { ShareComponent } from './components/share/share.component';
import { ShowCarouselComponent } from './components/show-carousel/show-carousel.component';
import { SlidesComponent } from './components/slides/slides.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { TableEditorComponent } from './components/table-editor/table-editor.component';
import { TabsSearchComponent } from './components/tabs-search/tabs-search.component';
import { TagsComponent } from './components/tags/tags.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { UnderConstructionComponent } from './components/under-construction/under-construction.component';
import { UnitPickerComponent } from './components/unit-picker/unit-picker.component';
import { CodeDialogComponent } from './dialogs/code-dialog/code-dialog.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { CurrencyExchangeDialogComponent } from './dialogs/currency-exchange-dialog/currency-exchange-dialog.component';
import { DisplayImageDialogComponent } from './dialogs/display-image-dialog/display-image-dialog.component';
import { DocViewDialogComponent } from './dialogs/doc-view-dialog/doc-view-dialog.component';
import { EntityNewDialogComponent } from './dialogs/entity-new-dialog/entity-new-dialog.component';
import { FiltersDialogComponent } from './dialogs/filters-dialog/filters-dialog.component';
import { GenericDialogComponent } from './dialogs/generic-dialog/generic-dialog.component';
import { ImporterComponent } from './dialogs/importer/importer.component';
import { JsonEditorDialogComponent } from './dialogs/json-editor-dialog/json-editor-dialog.component';
import { RejectMsgDialogComponent } from './dialogs/reject-msg-dialog/reject-msg-dialog.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { GooglePlacesDirective } from './directives/google-places.directive';
import { OnlynumberDirective } from './directives/numbers-only.directive';
import { TrimSpaceDirective } from './directives/trim-space.directive';
import { UppercaseInputDirective } from './directives/uppercase-input.directive';
import { NamePipe } from './pipes/name.pipe';
import { NumberPipe } from './pipes/number.pipe';
import { PluralizePipe } from './pipes/pluralize.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { TimePipe } from './pipes/time.pipe';
import { TypeofPipe } from './pipes/typeof.pipe';

const angularModules = [
  CommonModule,
  FormsModule,
  RouterModule,
  ReactiveFormsModule,
  DirectoryModule,
  GatewayModule
];

const thirdPartyModules = [
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatCheckboxModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatRadioModule,
  MatAutocompleteModule,
  MatDividerModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatMenuModule,
  MatToolbarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  AvatarModule,
  MatButtonToggleModule,
  MatListModule,
  MatDividerModule,
  MatBadgeModule,
  MatProgressBarModule
];

const dialogs = [
  CodeDialogComponent,
  ConfirmDialogComponent,
  DisplayImageDialogComponent,
  DocViewDialogComponent,
  EntityNewDialogComponent,
  ImporterComponent,
  RejectMsgDialogComponent,
  JsonEditorDialogComponent,
  CurrencyExchangeDialogComponent,
  FiltersDialogComponent
];

const sharedComponents = [
  ActionComponent,
  AddressEditorComponent,
  AlertComponent,
  AutocompleteComponent,
  AvatarComponent,
  GotoEntityButtonComponent,
  CalendarComponent,
  ContentEditorComponent,
  CountdownClockComponent,
  DatePickerComponent,
  FileUploaderComponent,
  FileProviderComponent,
  JsonEditorComponent,
  IconComponent,
  ImportButtonComponent,
  InputErrorComponent,
  InputRangeComponent,
  InputTextComponent,
  NoDataFoundComponent,
  NotFoundComponent,
  PaginatorComponent,
  PreviousNextButtonsComponent,
  ProcessingIndicatorComponent,
  QueryBuilderComponent,
  ShowCarouselComponent,
  SlidesComponent,
  ShareComponent,
  UnderConstructionComponent,
  RejectMsgDialogComponent,
  SearchComponent,
  IconTogglerComponent,
  JsonEditorDialogComponent,
  UnitPickerComponent,
  RecaptchaComponent,
  InputSelectorComponent,
  AmountEditorComponent,
  RuleBuilderComponent,
  StepperComponent,
  ProgressComponent,
  TagsComponent,
  TabsSearchComponent,
  DialogComponent,
  GenericDialogComponent,
  ObjectEditorComponent,
  FieldEditorComponent,
  TableEditorComponent,
  TimelineComponent,
  InputWithHttpComponent
];
const pipes = [
  NamePipe,
  TimePipe,
  NumberPipe,
  PluralizePipe,
  SearchPipe,
  SortPipe,
  TypeofPipe
];
const directives = [
  AutofocusDirective,
  ClickOutsideDirective,
  GooglePlacesDirective,
  OnlynumberDirective,
  TrimSpaceDirective,
  UppercaseInputDirective
];
@NgModule({
  imports: [
    ...angularModules,
    ...thirdPartyModules,
  ],
  exports: [
    ...angularModules,
    ...thirdPartyModules,
    ...sharedComponents,
    ...dialogs,
    ...pipes,
    ...directives
  ],
  declarations: [
    ...sharedComponents,
    ...dialogs,
    ...pipes,
    ...directives
  ],
  providers: []
})
export class OaSharedModule { }
