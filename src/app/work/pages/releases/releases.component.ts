import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { ReleaseOngoingListComponent } from 'src/app/lib/oa-ng/gateway/release-ongoing-list/release-ongoing-list.component';
import { Link } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'app-releases',
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.css']
})
export class ReleasesComponent implements OnInit, OnDestroy {

  @ViewChild('list')
  list: ReleaseOngoingListComponent;

  showFilters = false;
  params: any;
  page: Link;
  isCurrent = true;
  projectCode: string;

  constructor(
    // public dialog: MatDialog,
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.navService.register('/projects/:projectCode/releases', this.route, (isCurrent, params) => {
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

  newRelease() {
    this.navService.goto(`/projects/${this.projectCode}/releases/new`);
  }

  onSelect(release) {
    this.navService.goto(`/projects/${this.projectCode}/releases/${release.id}`);
  }

  setContext() {
    const context = this.page.meta.context || [];
    // this.navService.setLabel(this.page, this.code.toUpperCase());

    context.forEach((item) => {
      switch (item.code) {
        case 'share':
          item.type = 'share';
          item.options = ['whatsapp', 'email', 'slack', 'copy'];
          item.config = {
            entity: {
              type: 'releases',
              id: 'tenant'
            },
            members: [{
              user: {
                email: 'freight.tech.yatra.com'
              }
            }],
            options: {
              copy: {
                template: 'gateway|releases',
                query: { projectId: this.projectCode }
              },
              redirect: {
                template: 'gateway|releases|redirect',
                content: { url: window.location.href }
              },
              email: {
                template: 'gateway|releases',
                data: { projectId: this.projectCode }
              }
            }
          }
          break;
      }
    });

    // this.path = this.path.replace(':taskCode', this.code);
    // this.uxService.setContextMenu([{
    //   helpCode: this.page.meta.helpCode
    // }, 'close']);
    this.uxService.setContextMenu(context);

  }

}
