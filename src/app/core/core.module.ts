import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
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
import { OaAuthModule } from 'src/app/lib/oa-ng/auth/oa-auth.module';
import { OaCoreModule } from 'src/app/lib/oa-ng/core/core.module';
import { OaDiscoveryModule } from 'src/app/lib/oa-ng/discovery/oa-discovery.module';
import { OaDriveModule } from 'src/app/lib/oa-ng/drive/oa-drive.module';
import { OaGatewayModule } from 'src/app/lib/oa-ng/gateway/oa-gateway.module';
import { OaInsightModule } from 'src/app/lib/oa-ng/insight/oa-insight.module';
import { OaSendItModule } from 'src/app/lib/oa-ng/send-it/oa-send-it.module';
import { OaSharedModule } from 'src/app/lib/oa-ng/shared/oa-shared.module';
import { ConnectionDialogComponent } from './components/connection-dialog/connection-dialog.component';
import { DocumentPreviewComponent } from './components/document-preview/document-preview.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { InsightWidgetDialogComponent } from './components/insight-widget-dialog/insight-widget-dialog.component';
import { InsightWidgetComponent } from './components/insight-widget/insight-widget.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { ErrorComponent } from './pages/error/error.component';
import { FileComponent } from './pages/file/file.component';
import { FoldersComponent } from './pages/folders/folders.component';
import { MessageComponent } from './pages/message/message.component';

const components = [
  FooterComponent,
  HeaderComponent,
  SideNavComponent,
  SideBarComponent,
  InsightWidgetComponent

];

const pages = [
  ErrorComponent,
  FoldersComponent,
  FileComponent,
  MessageComponent,
];
const dialogs = [
  ConnectionDialogComponent,
  DocumentPreviewComponent,
  InsightWidgetDialogComponent,
];
const services = [];
@NgModule({
  declarations: [...pages, ...components, ...dialogs],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatTooltipModule,
    MatSidenavModule,
    MatBadgeModule,
    OaCoreModule,
    OaSendItModule,
    OaAuthModule,
    OaDriveModule,
    OaGatewayModule,
    OaDiscoveryModule,
    RouterModule,
    OaInsightModule,
    PdfViewerModule,
    OaSharedModule
  ],
  exports: [...pages, ...components, ...dialogs],
  providers: [...services]
})
export class CoreModule { }
