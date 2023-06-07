
import { Component, Input, OnInit } from '@angular/core';
import { UxService } from 'src/app/core/services/ux.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { RoleService } from 'src/app/lib/oa/core/services';
import { FileUploaderBaseComponent } from 'src/app/lib/oa/drive/components/file-uploader-base.component';
import { DocsService } from 'src/app/lib/oa/drive/services';

@Component({
  selector: 'drive-file-uploader-zone',
  templateUrl: './file-uploader-zone.component.html',
  styleUrls: ['./file-uploader-zone.component.css']
})
export class FileUploaderZoneComponent extends FileUploaderBaseComponent {

  static instancesCount = 0;
  @Input()
  display: {
    line1?: string,
    line2?: string,
    icon?: string
  };

  @Input()
  view: 'container' | 'dropZone' = 'container';

  @Input()
  acceptThis: boolean;

  acceptOnly: string[];

  inputId: string;

  constructor(
    auth: RoleService,
    fileService: DocsService,
    errorHandler: UxService,
    validator: ValidationService
  ) {
    super(auth, fileService, errorHandler, validator);
    this.inputId = `file-uploader-input-${FileUploaderZoneComponent.instancesCount++}`;
    this.acceptOnly = ['image/png', 'image/jpeg', 'image/jpg'];
  }

  onClick() {
    const element = document.getElementsByClassName('file-input');
    if (element) {
      element[0]['value'] = '';
    }
  }
}
