import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { Link } from 'src/app/lib/oa/core/structures';
import { ReleaseComponent as GatewayReleaseComponent } from 'src/app/lib/oa-ng/gateway/release/release.component';
import { Release } from 'src/app/lib/oa/gateway/models';
import { ReleaseActionsComponent } from 'src/app/lib/oa-ng/gateway/release-actions/release-actions.component';

@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.css']
})
export class ReleaseComponent implements OnInit {

  @ViewChild('detail')
  detail: GatewayReleaseComponent

  @ViewChild('gatewayStates')
  gatewayStates: ReleaseActionsComponent

  page: Link;
  isCurrent = true;
  projectCode: string;
  releaseCode: string;
  release: Release

  constructor(
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.navService.register('/projects/:projectCode/releases/:releaseCode', this.route, (isCurrent, params) => {
      this.isCurrent = isCurrent;
      this.projectCode = params.get('projectCode');
      this.releaseCode = params.get('releaseCode');
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

  // setContext() {
  //   this.uxService.setContextMenu([{
  //     helpCode: this.page.meta.helpCode
  //   }, 'close']);
  // }

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
              type: 'release',
              id: this.releaseCode
            },
            members: [{
              user: {
                email: 'freight.tech.yatra.com'
              }
            }],
            options: {
              copy: {
                template: 'gateway|release',
                query: { dataId: this.releaseCode }
              },
              redirect: {
                template: 'gateway|release|redirect',
                query: { dataId: this.releaseCode },
                content: { url: window.location.href }
              },
              email: {
                template: 'gateway|release',
                data: { releaseId: this.releaseCode }
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

  setRelease(release) {
    this.release = release;
  }

  onStatusUpdate(release) {
    this.release = new Release(release);
    this.detail.properties = this.release;
  }

}
