import { Component } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { FolderDetailsBaseComponent } from 'src/app/lib/oa/drive/components/folder-details-base.component';
import { Doc } from 'src/app/lib/oa/drive/models';
import { FolderService } from 'src/app/lib/oa/drive/services';

@Component({
  selector: 'drive-folder-widget',
  templateUrl: './folder-widget.component.html',
  styleUrls: ['./folder-widget.component.css']
})
export class FolderWidgetComponent extends FolderDetailsBaseComponent {

  selectedFile: Doc;

  timeOut: any;

  constructor(
    service: FolderService,
    uxService: UxService
  ) {
    super(service, uxService);
    this.afterProcessing = () => {
      this.getDefaultSelectedFile();
    };
  }

  getDefaultSelectedFile() {
    this.selectedFile = this.properties.files[0];
    this.timeOut = setTimeout(() => this.next(), 8000);
  }

  next() {
    clearTimeout(this.timeOut);
    const index = this.properties.files.findIndex((file) => file.id === this.selectedFile.id);
    if (index > -1) {
      if (index >= this.properties.files.length - 1) {
        this.selectedFile = this.properties.files[0];
      } else {
        this.selectedFile = this.properties.files[index + 1];
      }
    }
    this.timeOut = setTimeout(() => this.next(), 8000);
  }

  previous() {
    const index = this.properties.files.findIndex((file) => file.id === this.selectedFile.id);

    if (index > -1) {
      if (index === 0) {
        const lastIndex = this.properties.files.length - 1;
        this.selectedFile = this.properties.files[lastIndex];
      } else {
        this.selectedFile = this.properties.files[index - 1];
      }
    }
  }

  onDotClick(index) {
    clearTimeout(this.timeOut);
    this.selectedFile = this.properties.files[index];
    this.timeOut = setTimeout(() => this.next(), 8000);
  }

}
