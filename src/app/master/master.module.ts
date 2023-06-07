import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { CoreModule } from '../core/core.module';
import { OaBapModule } from 'src/app/lib/oa-ng/bap/oa-bap.module';
import { OaCoreModule } from 'src/app/lib/oa-ng/core/core.module';
import { OaDirectoryModule } from 'src/app/lib/oa-ng/directory/oa-directory.module';
import { OaDriveModule } from 'src/app/lib/oa-ng/drive/oa-drive.module';
import { OaGatewayModule } from 'src/app/lib/oa-ng/gateway/oa-gateway.module';
import { OaInsightModule } from 'src/app/lib/oa-ng/insight/oa-insight.module';
import { OaSendItModule } from 'src/app/lib/oa-ng/send-it/oa-send-it.module';
import { OaSharedModule } from 'src/app/lib/oa-ng/shared/oa-shared.module';
import { EmployeeDetailsComponent } from './components/employee-details/employee-details.component';
import { EmployeeRoleDetailsComponent } from './components/employee-role-details/employee-role-details.component';
import { EmployeeUploaderComponent } from './components/employee-uploader/employee-uploader.component';
import { NewCustomerComponent } from './components/new-customer/new-customer.component';
import { MasterRoutingModule } from './master-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DepartmentNewComponent } from './pages/department-new/department-new.component';
import { DepartmentComponent } from './pages/department/department.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { DesignationNewComponent } from './pages/designation-new/designation-new.component';
import { DesignationComponent } from './pages/designation/designation.component';
import { DesignationsComponent } from './pages/designations/designations.component';
import { NewDivisionComponent } from './pages/division-new/new-division.component';
import { DivisionComponent } from './pages/division/division.component';
import { DivisionsComponent } from './pages/divisions/divisions.component';
import { EmployeeWizComponent } from './pages/employee-wiz/employee-wiz.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { EmployeesViewComponent } from './pages/employees-view/employees-view.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { RoleComponent } from './pages/role/role.component';
import { RolesComponent } from './pages/roles/roles.component';

const dialogs = [
    EmployeeUploaderComponent,
    DepartmentNewComponent,
    DesignationNewComponent,
    NewDivisionComponent,
];
@NgModule({
    declarations: [
        ...dialogs,
        EmployeeDetailsComponent,
        EmployeeRoleDetailsComponent,
        EmployeesComponent,
        EmployeeComponent,
        EmployeeWizComponent,
        DepartmentsComponent,
        DepartmentComponent,
        DepartmentNewComponent,
        DivisionsComponent,
        DivisionComponent,
        NewDivisionComponent,
        DashboardComponent,
        DesignationsComponent,
        DesignationComponent,
        DesignationNewComponent,
        RolesComponent,
        RoleComponent,
        EmployeesViewComponent,
        NewCustomerComponent,
    ],
    imports: [
        CoreModule,
        CommonModule,
        OaDirectoryModule,
        OaDriveModule,
        OaSendItModule,
        OaGatewayModule,
        OaBapModule,
        OaInsightModule,
        MatDialogModule,
        OaSharedModule,
        MasterRoutingModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatTabsModule,
        MatTableModule,
        OaCoreModule,
    ],
    exports: [
        EmployeeDetailsComponent,
        EmployeeRoleDetailsComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class MasterModule { }
