import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavService } from 'src/app/core/services';
import { UxService } from 'src/app/core/services/ux.service';
import { GenericApi, IApi, RoleService } from 'src/app/lib/oa/core/services';
import { Doc, Folder } from 'src/app/lib/oa/drive/models';

@Component({
  selector: 'drive-file-widget',
  templateUrl: './file-widget.component.html',
  styleUrls: ['./file-widget.component.css']
})
export class FileWidgetComponent implements OnInit, OnChanges {

  @Input()
  view = 'grid';

  @Input()
  type: any;

  @Input()
  file: Doc;

  @Input()
  widget: any = {};

  @Input()
  config: any;

  isProcessing: boolean;



  service: IApi<Doc>;

  constructor(
    private uxService: UxService,
    private navService: NavService,
    auth: RoleService,
    http: HttpClient

  ) {
    this.service = new GenericApi(http, 'drive', { collection: 'files', auth, errorHandler: uxService });
  }
  ngOnInit() {
    if (this.type) {
      this.widget = this.widget || this.type.widget;
    }

    if (this.widget.view) {
      this.view = this.widget.view;
    }

    if (this.widget.file) {
      this.file = this.widget.file;
    }
    this.fetch();
  }

  ngOnChanges() {
    this.fetch();
  }

  fetch() {
    if (!this.file) {
      return;
    }

    this.service.get(`${this.file.code}`).subscribe((p) => {
      this.file = p;
      this.isProcessing = false;
    }, (err) => {
      this.isProcessing = false;
      this.uxService.handleError(err);
    });
  }

}
