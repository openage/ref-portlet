import { Component, Input } from '@angular/core';
import { UxService } from 'src/app/core/services/ux.service';
import { DocumentListBaseComponent } from 'src/app/lib/oa/drive/components/document-list-base.component';
import { FolderService } from 'src/app/lib/oa/drive/services';
import { NewFolderComponent } from '../new-folder/new-folder.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'drive-folder-list',
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.css']
})
export class FolderListComponent extends DocumentListBaseComponent {

  @Input()
  view: 'folder' | 'list' = 'folder';

  @Input()
  createFolder = false;

  newFolder: boolean;

  allDeleted: boolean;

  constructor(
    service: FolderService,
    uxService: UxService,
    public dialog: MatDialog,
  ) {
    super(service, uxService);
  }

  preInit(): void {
  }

  onFolderSelect($event, folder) {
    // folder.isDeleted = $event.checked;
    this.selected.emit(folder);
    // this.checkForSelectedAll();
  }

  onFolderCreate(folder) {
    this.newFolder = false;
  }

  checkForSelectedAll() {
    this.allDeleted = this.items.every((item) => item.isDeleted);
  }

  selectedAll(value: boolean) {
    this.items.forEach((item) => item.isDeleted = value);
    this.allDeleted = value;
  }

  delete() {
    const folders = this.items.filter((item) => item.isDeleted);

    if (!folders.length) {
      return;
    }

    // this.bulkRemove(folders);
  }

  onNew() {
    const dialogRef = this.dialog.open(NewFolderComponent, {
      width: '50%'
    })

    dialogRef.afterClosed().subscribe((result) => {

    })
  }

}
