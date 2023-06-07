import { Component, Input } from '@angular/core';
import { NavService } from 'src/app/core/services';
import { UxService } from 'src/app/core/services/ux.service';
import { FolderListBaseComponent } from 'src/app/lib/oa/drive/components/folder-list-base.component';
import { Folder } from 'src/app/lib/oa/drive/models';
import { FolderService } from 'src/app/lib/oa/drive/services';

@Component({
  selector: 'drive-folders-widget',
  templateUrl: './folders-widget.component.html',
  styleUrls: ['./folders-widget.component.css']
})
export class FoldersWidgetComponent extends FolderListBaseComponent {

  @Input()
  view: 'table' | 'list' | 'grid' = 'grid';

  @Input()
  widget: any = {};

  @Input()
  config: any;

  @Input()
  type: any;

  constructor(
    service: FolderService,
    uxService: UxService,
    private navService: NavService

  ) {
    super(service, uxService);
  }

  preInit(): void {
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

  onClick(item: Folder) {
    if (!this.config || !this.config.onClick) {
      return;
    }

    const onSelect = this.config.onClick;

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
