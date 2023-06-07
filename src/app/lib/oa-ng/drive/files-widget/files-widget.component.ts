import { Component } from '@angular/core';
import { UxService } from 'src/app/core/services/ux.service';
import { FolderDetailsBaseComponent } from 'src/app/lib/oa/drive/components/folder-details-base.component';
import { FolderService } from 'src/app/lib/oa/drive/services';

@Component({
  selector: 'drive-files-widget',
  templateUrl: './files-widget.component.html',
  styleUrls: ['./files-widget.component.css']
})
export class FilesWidgetComponent extends FolderDetailsBaseComponent {

  constructor(
    service: FolderService,
    uxService: UxService
  ) {
    super(service, uxService);
  }

}
