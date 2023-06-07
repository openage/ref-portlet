import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { FolderDetailComponent } from 'src/app/lib/oa-ng/drive/folder-detail/folder-detail.component';
import { IUser } from 'src/app/lib/oa/core/models';
import { Action, Link } from 'src/app/lib/oa/core/structures';
import { Folder } from 'src/app/lib/oa/drive/models';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit, OnDestroy {

  @ViewChild('details')
  details: FolderDetailComponent;

  user: IUser;

  folder: Folder;
  type: string;
  isCurrent = true;
  page: Link;

  constructor(
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.navService.register(`/settings/files/:type`, this.route, (isCurrent, params) => {
      this.type = params.get('type');
      this.isCurrent = isCurrent;
      if (this.isCurrent) {
        this.setContext();
      }
    }).then((link) => this.page = link);
  }

  ngOnDestroy(): void {
    this.uxService.reset();
  }

  onSelect($event) {
  }

  employeeSelect($event) {
    this.user = $event;
    this.folder = new Folder({
      name: this.type,
      entity: {
        id: this.user.code,
        type: this.type
      }
    });
  }

  onRefresh() {
    this.details.refresh();
  }

  setContext() {
  }
}
