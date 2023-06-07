import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { Folder } from 'src/app/lib/oa/drive/models';
import { FolderService } from 'src/app/lib/oa/drive/services';
import { ThumbnailSelectorComponent } from '../thumbnail-selector/thumbnail-selector.component';

@Component({
  selector: 'drive-folder-edit',
  templateUrl: './folder-edit.component.html',
  styleUrls: ['./folder-edit.component.css']
})
export class FolderEditComponent implements OnInit {

  @Input()
  folder: Folder;

  @Output()
  updatedFolder: EventEmitter<Folder> = new EventEmitter();

  url: string;

  urlEnds: string[] = ['png', 'jpg', 'jpeg'];

  constructor(
    private service: FolderService,
    private uxService: UxService,
    public dialog: MatDialog
  ) { }

  ngOnInit() { }

  onCustomChange($event) {
    this.folder.visibility = $event.checked ? 1 : 0;
    this.save();
  }

  openThumbnailSelector() {
    const dialogRef = this.dialog.open(ThumbnailSelectorComponent, {
      width: '700px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.folder.thumbnail = result;
        this.save();
      }
    });
  }

  save() {
    this.service.update(this.folder.id, this.folder).subscribe((folder) => {
      this.folder = new Folder(folder);
      this.updatedFolder.emit(this.folder);
    });
  }

  onDescriptionChange($event) {
    this.folder.description = $event.target.textContent;
    this.save();
  }

  onNameChange($event) {
    this.folder.description = $event.target.textContent;
    this.save();
  }

  setUrl(event) {
    let match = false;
    this.urlEnds.forEach((item) => { if (event.target.value.endsWith(item)) { match = true; } });
    if (match) {
      this.url = event.target.value;
      this.folder.thumbnail = this.url;
    } else {
      this.folder.thumbnail = null;
      this.url = '';
      this.uxService.handleError(`Url must ends with ${this.urlEnds.join(',')}`);
    }
  }

}
