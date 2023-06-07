import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';
import { Organization } from 'src/app/lib/oa/directory/models';
import { FolderDetailsBaseComponent } from 'src/app/lib/oa/drive/components/folder-details-base.component';
import { Doc } from 'src/app/lib/oa/drive/models';
import { Folder } from 'src/app/lib/oa/drive/models/folder.model';
import { FolderService } from 'src/app/lib/oa/drive/services';
import { UxService } from 'src/app/core/services/ux.service';
import { LocalStorageService } from 'src/app/lib/oa/core/services/local-storage.service';
import { NewFolderComponent } from '../new-folder/new-folder.component';

@Component({
  selector: 'drive-folder-detail',
  templateUrl: './folder-detail.component.html',
  styleUrls: ['./folder-detail.component.css']
})
export class FolderDetailComponent extends FolderDetailsBaseComponent {
  isRefresh = false;

  @Input()
  fileUploadInputView: string;

  @Input()
  hideFolderName: boolean;

  @Input()
  componentName = 'drive|folder-details';

  @Input()
  fileName: string;

  @Output()
  showFileDetail: EventEmitter<Doc> = new EventEmitter();

  @Input()
  permissions: any;

  @Input()
  showRoot = false;

  @Input()
  showBack = true;

  @Input()
  showHeader = true;

  @Input()
  showSummary = true;

  org: Organization;

  summary = {
    style: {
      container: {
        class: 'widget-row'
      },
      header: {
        style: {
          "margin-left": '10px',
          "margin-right": '10px',
          "text-align": 'center'
        }
      }
    },
    fields: [
      { label: 'Pending', key: 'draft', defaultValue: 0 },
      { label: 'Active', key: 'active', defaultValue: 0 },
      { label: 'Pending Reviews', key: 'submitted', defaultValue: 0 },
      { label: 'Rework', key: 'rework', defaultValue: 0 },
    ],
    data: {
      active: 0,
      submitted: 0,
      rework: 0,
      draft: 0
    }
  };

  isProcessing: boolean;
  views = [{
    view: 'grid',
    icon: 'grid_view'
  }, {
    view: 'table',
    icon: 'format_list_bulleted'
  }, {
    view: 'grouped-by-status',
    icon: 'account_tree'
  }, {
    view: 'file-input',
    icon: 'drive_file_rename_outline'
  },
  {
    view: 'entity-type-list',
    icon: 'sort'
  }];

  constructor(
    errorHandler: UxService,
    public dialog: MatDialog,
    private service: FolderService,
    private uxService: UxService,
    public auth: RoleService,
    private cache: LocalStorageService
  ) {
    super(service, errorHandler);
  }
  ngOnInit() {
    super.ngOnInit();
    let isSet;
    if (this.view !== 'attachment') {
      isSet = this.cache.components('drive|folder-details').get('view');
    }

    if (isSet === null || isSet === undefined) {
      this.cache.components(this.componentName).set('view', this.view);
    } else {
      this.view = this.cache.components(this.componentName).get('view');
    }

    setTimeout(() => {
      this.countStatus();
    }, 5000);

  }

  countStatus() {
    if (this.properties && this.properties.files) {
      for (const file of this.properties.files) {
        if (file.status === 'active') {
          this.summary.data.active += 1;
        } else if (file.status === 'submitted') {
          this.summary.data.submitted += 1;
        } else if (file.status === 'draft') {
          this.summary.data.draft += 1;
        } else if (file.status === 'rework') {
          this.summary.data.rework += 1;
        }
      }
    }
  }

  resetSummary() {
    this.summary.data = {
      active: 0,
      submitted: 0,
      rework: 0,
      draft: 0
    }
  }

  missingFiles(tag, status) {
    return this.properties.files.filter((file) => {
      if (!file.tags || !file.tags.includes(tag)) {
        return false;
      }
      if (status.includes(file.status)) {
        return false;
      }

      return true;
    });
  }

  addFolder() {
    const dialogRef = this.uxService.openDialog(NewFolderComponent);
    const instance = dialogRef.componentInstance;
    instance.parentFolder = this.properties;
    dialogRef.afterClosed().subscribe((folder) => {
      if (folder) { this.properties.folders.push(new Folder(folder)); }
    });
  }

  onRefresh($event) {
    this.getDetail();

    setTimeout(() => {
      this.resetSummary();
      this.countStatus();
    }, 5000);
  }

  onFolderSelect(folder: Folder) {
    this.selected.emit(folder);
  }

  onFileSelect(file: Doc) {
    this.selectedDoc.emit(file);
  }

  setCode(folder: Folder) {
    this.code = folder.parent.code;
    // this.fetch();
  }

  showSelectedFileDetail(file: Doc) {
    this.showFileDetail.emit(file);
  }

  onView(view) {
    this.view = view;
    this.cache.components('drive|folder-details').set('view', this.view);
  }
}
