import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NavService, UxService } from 'src/app/core/services';
import { RoleService, GenericApi, IApi } from 'src/app/lib/oa/core/services';
import { Doc, Folder } from 'src/app/lib/oa/drive/models';
import { FolderService } from 'src/app/lib/oa/drive/services';

@Component({
  selector: 'drive-folder-widget',
  templateUrl: './folder-widget.component.html',
  styleUrls: ['./folder-widget.component.css']
})
export class FolderWidgetComponent implements OnInit, OnChanges {

  @Input()
  view: 'banner' | 'list' | 'grid' = 'banner';

  @Input()
  type: any;

  @Input()
  widget: any = {};

  @Input()
  properties: Folder | any;

  @Input()
  config: any;


  isProcessing: boolean;

  selectedFile: Doc;


  @Output()
  selected: EventEmitter<Folder> = new EventEmitter<Folder>();

  service: IApi<Folder>;

  constructor(
    private uxService: UxService,
    private navService: NavService,
    private auth: RoleService,
    http: HttpClient

  ) {
    this.service = new GenericApi(http, 'drive', { collection: 'folders', auth, errorHandler: uxService });
  }

  initBanner() {
    this.selectedFile = this.properties.files[0];
    setTimeout(() => this.next(), 8000);
  }

  ngOnInit() {

    if (this.type) {
      this.widget = this.widget || this.type.widget;
    }

    if (this.widget.view) {
      this.view = this.widget.view;
    }

    if (this.widget.folder) {
      this.properties = this.widget.folder;
    }
    this.fetch();
  }

  ngOnChanges() {
    this.fetch();
  }

  fetch() {
    if (!this.properties) {
      return;
    }

    this.service.get(`${this.properties.code}`).subscribe((p) => {
      this.properties = p;
      if (this.view === 'banner') {
        this.initBanner();
      }
      this.isProcessing = false;
    }, (err) => {
      this.isProcessing = false;
      this.uxService.handleError(err);
    });
  }


  next() {
    const index = this.properties.files.findIndex((file) => file.id === this.selectedFile.id);

    if (index > -1) {
      if (index >= this.properties.files.length - 1) {
        this.selectedFile = this.properties.files[0];
      } else {
        this.selectedFile = this.properties.files[index + 1];
      }
    }
    setTimeout(() => this.next(), 8000);
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
    this.selectedFile = this.properties.files[index];
  }
}
