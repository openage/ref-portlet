import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NavService } from 'src/app/core/services';
import { UxService } from 'src/app/core/services/ux.service';
import { GenericApi, IApi, RoleService } from 'src/app/lib/oa/core/services';
import { Folder } from 'src/app/lib/oa/drive/models';

@Component({
  selector: 'drive-folders-widget',
  templateUrl: './folders-widget.component.html',
  styleUrls: ['./folders-widget.component.css']
})
export class FoldersWidgetComponent implements OnInit, OnChanges {

  @Input()
  view: 'table' | 'list' | 'grid' = 'grid';

  @Input()
  type: any;

  @Input()
  widget: any = {};

  @Input()
  parent: Folder | any;

  @Input()
  config: any;

  items: Folder[];

  isProcessing: boolean;

  selectedFolder: Folder;

  @Output()
  selected: EventEmitter<Folder> = new EventEmitter<Folder>();

  service: IApi<Folder>;

  constructor(
    private uxService: UxService,
    private navService: NavService,
    auth: RoleService,
    http: HttpClient

  ) {
    this.service = new GenericApi(http, 'drive', { collection: 'folders', auth, errorHandler: uxService });
  }

  ngOnInit() {
    this.type = this.type || {};
    this.config = this.config || this.type.config || {};

    this.widget = this.widget || this.type.widget || {};

    if (this.config.view) {
      this.view = this.config.view;
    }

    if (this.config.parent) {
      this.parent = this.config.parent;
    }
  }

  ngOnChanges() {
    this.fetch();
  }

  fetch() {
    if (!this.parent) {
      return;
    }

    this.service.get(`${this.parent.code}?owner-code=${this.parent.owner.code}`).subscribe((p) => {
      this.parent = p;
      this.items = p.folders;
      this.isProcessing = false;
    }, (err) => {
      this.isProcessing = false;
      this.uxService.handleError(err);
    });
  }

  onClick(item: Folder) {
    if (!this.widget || !this.widget.config || !this.widget.config.onClick) {
      return;
    }

    const onSelect = this.widget.config.onClick;

    let url = onSelect.url;

    if (!url) {
      return;
    }

    if (onSelect.append) {

      let append = item[onSelect.append];

      if (!append) {
        return;
      }

      const parts = append.split('|');

      append = parts[parts.length - 1];
      url = `${url}/${append}`;

    }

    this.navService.goto(url);

  }

}
