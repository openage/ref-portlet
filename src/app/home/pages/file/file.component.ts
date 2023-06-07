import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { FileEditComponent } from 'src/app/lib/oa-ng/drive/file-edit/file-edit.component';
import { Entity } from 'src/app/lib/oa/core/models';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Link } from 'src/app/lib/oa/core/structures';
import { Doc } from 'src/app/lib/oa/drive/models';
import { DocsService } from 'src/app/lib/oa/drive/services';

@Component({
  selector: 'core-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {

  @ViewChild('fileViewer')
  editFile: FileEditComponent;

  code: string;

  isCurrent: boolean;

  page: Link;

  permissions: any;

  doc: Doc;
  path: string;

  constructor(
    private uxService: UxService,
    private route: ActivatedRoute,
    public navService: NavService,
    public docService: DocsService,
    public auth: RoleService
  ) {
    this.path = this.route.snapshot.data.path;

    this.navService.register(this.path, this.route, (isCurrent, params) => {
      this.isCurrent = isCurrent;
      this.code = params.get('fileCode');
    }).then((link) => this.page = link);
  }

  ngOnInit() { }

  setDoc(file: Doc) {
    this.doc = file;
    this.navService.pushBreadcrumb({
      title: this.doc.name
    });

    this.uxService.setContextMenu([{
      helpCode: this.page.meta.helpCode
    }, {
      code: 'close',
      event: () => { this.navService.back(); }
    }]);
  }

}
