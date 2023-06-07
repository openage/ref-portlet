import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FileWidgetComponent } from 'src/app/lib/oa-ng/drive/file-widget/file-widget.component';
import { FilesWidgetComponent } from 'src/app/lib/oa-ng/drive/files-widget/files-widget.component';
import { FolderWidgetComponent } from 'src/app/lib/oa-ng/drive/folder-widget/folder-widget.component';
import { FoldersWidgetComponent } from 'src/app/lib/oa-ng/drive/folders-widget/folders-widget.component';
import { OaSharedModule } from 'src/app/lib/oa-ng/shared/oa-shared.module';
import { DriveModule } from 'src/app/lib/oa/drive/drive.module';
import { OaCoreModule } from '../core/core.module';
import { ConfigEditorComponent } from './config-editor/config-editor.component';
import { FileDetailComponent } from './file-detail/file-detail.component';
import { FileEditComponent } from './file-edit/file-edit.component';
import { FileListUploaderComponent } from './file-list-uploader/file-list-uploader.component';
import { FileListComponent } from './file-list/file-list.component';
import { FileSideDetailComponent } from './file-side-detail/file-side-detail.component';
import { FileUploaderDialogComponent } from './file-uploader-dialog/file-uploader-dialog.component';
import { FileUploaderZoneComponent } from './file-uploader-zone/file-uploader-zone.component';
import { FileViewDialogComponent } from './file-view-dialog/file-view-dialog.component';
import { FolderDetailComponent } from './folder-detail/folder-detail.component';
import { FolderEditComponent } from './folder-edit/folder-edit.component';
import { FolderListComponent } from './folder-list/folder-list.component';
import { FolderSideDetailComponent } from './folder-side-detail/folder-side-detail.component';
import { ImageEditorComponent } from './image-editor/image-editor.component';
import { NewFileComponent } from './new-file/new-file.component';
import { NewFolderComponent } from './new-folder/new-folder.component';
import { ThumbnailSelectorComponent } from './thumbnail-selector/thumbnail-selector.component';

const components = [
  FileListComponent,
  FileUploaderZoneComponent,
  ImageEditorComponent,
  FileListUploaderComponent,
  FolderListComponent,
  FolderDetailComponent,
  FileUploaderDialogComponent,
  NewFolderComponent,
  FoldersWidgetComponent,
  FolderWidgetComponent,
  FilesWidgetComponent,
  FileWidgetComponent,
  FolderSideDetailComponent,
  FileSideDetailComponent,
  FileEditComponent,
  FileDetailComponent,
  ThumbnailSelectorComponent,
  FolderEditComponent,
  NewFileComponent,
  ConfigEditorComponent,
  FileViewDialogComponent
];
const thirdPartyModules = [
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatMenuModule,
  MatInputModule,
  MatListModule,
  MatExpansionModule,
  MatCheckboxModule,
  MatOptionModule,
  MatTabsModule,
  MatGridListModule,
  MatSelectModule,
  MatDialogModule,
  MatTableModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatChipsModule,
  PdfViewerModule
];
const services = [];
const guards = [];
const pipes = [];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DriveModule,
    OaCoreModule,
    OaSharedModule,
    ...thirdPartyModules,
  ],
  declarations: [...components, ...pipes],
  exports: [...components, ...pipes],
  providers: [...services, ...guards,
  { provide: MAT_DIALOG_DATA, useValue: {} },
  { provide: MatDialogRef, useValue: {} }]
})
export class OaDriveModule { }
