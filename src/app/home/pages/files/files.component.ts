import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { FolderDetailComponent } from 'src/app/lib/oa-ng/drive/folder-detail/folder-detail.component';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Link } from 'src/app/lib/oa/core/structures';
import { Folder } from 'src/app/lib/oa/drive/models';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit, OnDestroy {
  @ViewChild('details')
  details: FolderDetailComponent;

  code: string;
  isCurrent = true;
  page: Link;

  constructor(
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute,
    private auth: RoleService
  ) {
  }

  ngOnInit() {
    this.navService.register(`/home/folders/:code`, this.route, (isCurrent, params) => {
      this.code = params.get('code');
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
    this.navService.goto(`/home/folders/${$event.id}`);
  }

  onRefresh() {
    this.details.refresh();
  }

  setContext() {
  }
}
