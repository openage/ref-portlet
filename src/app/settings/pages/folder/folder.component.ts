import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { FolderDetailComponent } from 'src/app/lib/oa-ng/drive/folder-detail/folder-detail.component';
import { Action, Link } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})
export class FolderComponent implements OnInit, OnDestroy {

  @ViewChild('details')
  details: FolderDetailComponent;

  code: string;
  isCurrent = true;
  page: Link;

  constructor(
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.navService.register(`/settings/folders/:code`, this.route, (isCurrent, params) => {
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

  }

  onRefresh() {
    this.details.refresh();
  }

  setContext() {
  }
}
