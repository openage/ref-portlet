import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { DirectoryModule } from 'src/app/lib/oa/directory/directory.module';
import { OaSharedModule } from 'src/app/lib/oa-ng/shared/oa-shared.module';
import { OaCoreModule } from '../core/core.module';
import { AddEmployeeDialogComponent } from './add-employee-dialog/add-employee-dialog.component';
import { AgentPickerDialogComponent } from './agent-picker-dialog/agent-picker-dialog.component';
import { ContractorNewComponent } from './contractor-new/contractor-new.component';
import { ContractorsListComponent } from './contractors-list/contractors-list.component';
import { DepartmentListComponent } from './department-list/department-list.component';
import { DepartmentNewComponent } from './department-new/department-new.component';
import { DepartmentPickerComponent } from './department-picker/department-picker.component';
import { DesignationListComponent } from './designation-list/designation-list.component';
import { DesignationNewComponent } from './designation-new/designation-new.component';
import { DesignationPickerComponent } from './designation-picker/designation-picker.component';
import { DetailsEditorComponent } from './details-editor/details-editor.component';
import { DivisionListComponent } from './division-list/division-list.component';
import { DivisionNewComponent } from './division-new/division-new.component';
import { DivisionPickerComponent } from './division-picker/division-picker.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeePickerComponent } from './employee-picker/employee-picker.component';
import { EmployeeSelectorComponent } from './employee-selector/employee-selector.component';
import { EmployeeSummaryComponent } from './employee-summary/employee-summary.component';
import { EmploymentEditorComponent } from './employment-editor/employment-editor.component';
import { EmploymentViewerComponent } from './employment-viewer/employment-viewer.component';
import { OrganizationCreateComponent } from './organization-create/organization-create.component';
import { OrganizationDetailsComponent } from './organization-details/organization-details.component';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { OrganizationPickerComponent } from './organization-picker/organization-picker.component';
import { OrganizationSummaryComponent } from './organization-summary/organization-summary.component';
import { PermissionTypeListComponent } from './permission-type-list/permission-type-list.component';
import { PersonalEditorComponent } from './personal-editor/personal-editor.component';
import { ResetPasswordEditorComponent } from './reset-password-editor/reset-password-editor.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleOrganizationListComponent } from './role-organization-list/role-organization-list.component';
import { RolePermissionsDialogComponent } from './role-permissions-dialog/role-permissions-dialog.component';
import { RoleTypeDetailsComponent } from './role-type-details/role-type-details.component';
import { RoleTypePickerComponent } from './role-type-picker/role-type-picker.component';
import { SecurityEditorComponent } from './security-editor/security-editor.component';
import { TenantAgentAccountsComponent } from './tenant-agent-accounts/tenant-agent-accounts.component';
import { TenantAgentListComponent } from './tenant-agent-list/tenant-agent-list.component';
import { UserPickerComponent } from './user-picker/user-picker.component';

const components = [
  EmployeeListComponent,
  EmploymentEditorComponent,
  EmploymentViewerComponent,
  PersonalEditorComponent,
  EmployeeSelectorComponent,
  OrganizationListComponent,
  OrganizationDetailsComponent,
  OrganizationCreateComponent,
  OrganizationSummaryComponent,
  EmployeePickerComponent,
  DesignationPickerComponent,
  DepartmentPickerComponent,
  DivisionPickerComponent,
  DepartmentListComponent,
  DesignationListComponent,
  DivisionListComponent,
  DesignationNewComponent,
  DivisionNewComponent,
  DepartmentNewComponent,
  DetailsEditorComponent,
  ContractorsListComponent,
  ContractorNewComponent,
  ResetPasswordComponent,
  ResetPasswordEditorComponent,
  EmployeeSummaryComponent,
  RoleListComponent,
  RoleDetailsComponent,
  RoleTypeDetailsComponent,
  SecurityEditorComponent,
  RoleTypePickerComponent,
  RolePermissionsDialogComponent,
  PermissionTypeListComponent,

  TenantAgentListComponent,
  TenantAgentAccountsComponent,
  OrganizationPickerComponent,
  RoleOrganizationListComponent,
  AddEmployeeDialogComponent,
  AgentPickerDialogComponent,
  UserPickerComponent
];

const entryComponents = [
  ResetPasswordComponent,
  RolePermissionsDialogComponent,
  AddEmployeeDialogComponent,
  AgentPickerDialogComponent
];

const thirdPartyModules = [
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatAutocompleteModule,
  MatSelectModule,
  MatCardModule,
  MatListModule,
  MatTableModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDialogModule,
  MatTabsModule,
  MatExpansionModule
];
const services = [];
const guards = [];
const pipes = [];

@NgModule({
  imports: [
    CommonModule,
    CommonModule,
    DirectoryModule,
    OaSharedModule,
    OaCoreModule,
    ...thirdPartyModules
  ],
  declarations: [...components, ...pipes],
  exports: [...components, ...pipes],
  providers: [...services, ...guards]
})
export class OaDirectoryModule { }
