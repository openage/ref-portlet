import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { OaCoreModule } from 'src/app/lib/oa-ng/core/core.module';
import { OaDirectoryModule } from 'src/app/lib/oa-ng/directory/oa-directory.module';
import { OaDriveModule } from 'src/app/lib/oa-ng/drive/oa-drive.module';
import { OaSendItModule } from 'src/app/lib/oa-ng/send-it/oa-send-it.module';
import { CoreModule } from '../core/core.module';
import { OaSharedModule } from 'src/app/lib/oa-ng/shared/oa-shared.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FilesComponent } from './pages/files/files.component';
import { FolderComponent } from './pages/folder/folder.component';
import { OrganizationComponent } from './pages/organization/organization.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    OrganizationComponent,
    FolderComponent,
    FilesComponent
  ],
  imports: [
    CoreModule,
    CommonModule,
    OaDirectoryModule,
    OaSendItModule,
    OaSharedModule,
    SettingsRoutingModule,
    OaDriveModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    OaCoreModule
  ]
})
export class SettingsModule { }
