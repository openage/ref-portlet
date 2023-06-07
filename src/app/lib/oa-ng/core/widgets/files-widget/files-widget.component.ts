import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NavService } from 'src/app/core/services';
import { UxService } from 'src/app/core/services/ux.service';
import { IApi, RoleService, GenericApi } from 'src/app/lib/oa/core/services';
import { Doc, Folder } from 'src/app/lib/oa/drive/models';

@Component({
  selector: 'drive-files-widget',
  templateUrl: './files-widget.component.html',
  styleUrls: ['./files-widget.component.css']
})
export class FilesWidgetComponent implements OnInit, OnChanges {

  @Input()
  view = 'grid';

  @Input()
  type: any;

  @Input()
  widget: any = {};

  @Input()
  folder: Folder | any;

  @Input()
  config: any;

  items: Doc[];

  isProcessing: boolean;

  selectedFile: Doc;

  @Output()
  selected: EventEmitter<Doc> = new EventEmitter<Doc>();

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

    if (this.widget.folder) {
      this.folder = this.widget.folder;
    }
    this.fetch();
  }

  ngOnChanges() {
    this.fetch();
  }

  fetch() {
    if (!this.folder) {
      return;
    }

    this.service.search({
      'folder-code': this.folder.code,
    }).subscribe((p) => {
      this.items = p.items;
      this.isProcessing = false;
    }, (err) => {
      this.isProcessing = false;
      this.uxService.handleError(err);
    });
  }

}
