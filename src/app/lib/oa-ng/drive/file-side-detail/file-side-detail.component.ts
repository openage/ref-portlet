import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Doc } from 'src/app/lib/oa/drive/models';
import { DocsService } from 'src/app/lib/oa/drive/services';
import { ThumbnailSelectorComponent } from '../thumbnail-selector/thumbnail-selector.component';

@Component({
  selector: 'drive-file-summary',
  templateUrl: './file-side-detail.component.html',
  styleUrls: ['./file-side-detail.component.css']
})
export class FileSideDetailComponent implements OnInit {

  @Input()
  file: Doc;

  @Input()
  readonly: boolean;

  @Output()
  updated: EventEmitter<Doc> = new EventEmitter();

  icon: string;

  constructor(
    public dialog: MatDialog,
    private docService: DocsService
  ) { }

  ngOnInit() {
    this.icon = this.docService.getIcon(this.file);
  }

  getFileSize(file) {
    if (!file.size) {
      return '--';
    }
    const fileSize: number = Number((file.size / (1024 * 1024)).toFixed(2));
    return `${fileSize} MB`;
  }

  openThumbnailSelector() {
    const dialogRef = this.dialog.open(ThumbnailSelectorComponent, {
      width: '700px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.file.thumbnail = result;
        this.save();
      }
    });
  }

  save() {
    this.docService.update(this.file.id, this.file).subscribe((item) => {
      this.file = item;
      this.icon = this.docService.getIcon(this.file);
      this.updated.emit(this.file);
    });
  }

  onPublicChange($event) {
    this.file.visibility = $event.checked ? 1 : 0;
    this.save();
  }

  onNameChange($event) {
    this.file.name = $event.target.textContent;
    this.save();
  }
}
