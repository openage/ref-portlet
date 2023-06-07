import { Component } from '@angular/core';
import { ImageEditorBaseComponent } from 'src/app/lib/oa/drive/components/image-editor-base.component';
import { UxService } from 'src/app/core/services/ux.service';
import { DocsService } from 'src/app/lib/oa/drive/services/docs.service';

@Component({
  selector: 'drive-image-editor',
  templateUrl: 'image-editor.component.html',
  styleUrls: ['image-editor.component.css'],
})
export class ImageEditorComponent extends ImageEditorBaseComponent {

  constructor(
    api: DocsService,
    uxService: UxService
  ) {
    super(api, uxService);
  }
}
