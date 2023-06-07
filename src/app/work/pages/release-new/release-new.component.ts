import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { ReleaseComponent } from 'src/app/lib/oa-ng/gateway/release/release.component';
import { Link } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'app-release-new',
  templateUrl: './release-new.component.html',
  styleUrls: ['./release-new.component.css']
})
export class ReleaseNewComponent implements OnInit {

  @ViewChild('detail')
  detail: ReleaseComponent

  page: Link;
  isCurrent = true;
  projectCode: string;

  constructor(
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.navService.register('/projects/:projectCode/releases/new', this.route, (isCurrent, params) => {
      this.isCurrent = isCurrent;
      this.projectCode = params.get('projectCode');
      if (this.isCurrent) {
        this.setContext();
      }
    }).then((link) => this.page = link);
  }

  ngOnDestroy(): void {
    this.uxService.reset();
  }

  onCreate($event) {
    this.navService.goto(`/projects/${this.projectCode}/releases/${$event.id}`);
  }

  setContext() {
    this.uxService.setContextMenu([{
      helpCode: this.page.meta.helpCode
    }, 'close']);
  }

}
