import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CoreModule } from '../core/core.module';
import { OaAuthModule } from 'src/app/lib/oa-ng/auth/oa-auth.module';
import { OaBapModule } from 'src/app/lib/oa-ng/bap/oa-bap.module';
import { OaCoreModule } from 'src/app/lib/oa-ng/core/core.module';
import { OaDirectoryModule } from 'src/app/lib/oa-ng/directory/oa-directory.module';
import { OaDriveModule } from 'src/app/lib/oa-ng/drive/oa-drive.module';
import { OaGatewayModule } from 'src/app/lib/oa-ng/gateway/oa-gateway.module';
import { OaInsightModule } from 'src/app/lib/oa-ng/insight/oa-insight.module';
import { OaSendItModule } from 'src/app/lib/oa-ng/send-it/oa-send-it.module';
import { OaSharedModule } from 'src/app/lib/oa-ng/shared/oa-shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FileComponent } from './pages/file/file.component';
import { FilesComponent } from './pages/files/files.component';
import { FoldersComponent } from './pages/folders/folders.component';
import { InboxComponent } from './pages/inbox/inbox.component';
import { LandingComponent } from './pages/landing/landing.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RolesComponent } from './pages/roles/roles.component';
import { TeamComponent } from './pages/team/team.component';

const pages = [
  ActivitiesComponent,
  DashboardComponent,
  FilesComponent,
  LandingComponent,
  InboxComponent,
  ProfileComponent,
  RolesComponent,
  TeamComponent,
  FoldersComponent,
  FileComponent
];
const components = [
];
const entryComponents = [

];
const services = [
];
@NgModule({
  declarations: [...pages, ...components, ...entryComponents],
  imports: [
    CoreModule,
    CommonModule,
    OaBapModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatTooltipModule,
    MatSidenavModule,
    MatBadgeModule,
    RouterModule,
    HomeRoutingModule,
    OaCoreModule,
    OaSendItModule,
    OaAuthModule,
    OaDirectoryModule,
    OaGatewayModule,
    OaInsightModule,
    OaDriveModule,
    PdfViewerModule,
    OaSharedModule,
    CoreModule
  ],
  exports: [...pages, ...components, ...entryComponents],
  providers: [...services]
})
export class HomeModule { }
