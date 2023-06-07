import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FolderDetailComponent } from 'src/app/lib/oa-ng/drive/folder-detail/folder-detail.component';
import { Entity } from 'src/app/lib/oa/core/models/entity.model';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Link } from 'src/app/lib/oa/core/structures';
import { NavService, UxService } from '../../services';
import { FilePreviewService } from '../../services/file-preview.service';

@Component({
  selector: 'core-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.css']
})
export class FoldersComponent implements OnInit {
  @ViewChild('details')
  details: FolderDetailComponent;

  entity: Entity;
  code: string;
  isCurrent = true;
  page: Link;
  path: string;
  view: string = 'grid';
  permissions: any;

  constructor(
    public auth: RoleService,
    public navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute,
    public filePreviewService: FilePreviewService
  ) {

    this.path = this.route.snapshot.data.path;
    this.permissions = this.route.snapshot.data.permissions;
    this.navService.register(this.path, this.route, (isCurrent, params) => {
      this.code = params.get('code');
      this.view = params.get('view') || 'grid';
      this.permissions = params.get('permissions');
      this.isCurrent = isCurrent;
      if (this.isCurrent) {
        this.setContext();
      }
    }).then((link) => this.page = link);
  }

  ngOnInit() {
    this.entity = new Entity({ id: this.auth.currentOrganization().code, type: 'customer' });
  }

  ngOnDestroy(): void {
    this.uxService.reset();
  }

  onSelect(doc) {
    // this.navService.goto(`/home/folders/${this.code}/files/${doc.id}`);
    this.filePreviewService.open({ doc });
  }

  onRefresh() {
    this.details.refresh();
  }

  setContext() {
  }

}
