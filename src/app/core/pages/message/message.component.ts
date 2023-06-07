import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { PageBaseComponent } from 'src/app/lib/oa/core/components/page-base.component';
import { LocalStorageService, RoleService } from 'src/app/lib/oa/core/services';
import { Link } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'page-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent extends PageBaseComponent {
  @Input()
  code: any;


  serviceid: string;
  serviceCode: string;
  tabs: any[];
  selectedTab: any;

  constructor(
    private uxService: UxService,
    public navService: NavService,
    public auth: RoleService,
    private route: ActivatedRoute,
    cache: LocalStorageService
  ) {
    super(navService, uxService, auth, route, cache);
    this.params.subscribe(params => {
      if (!this.isCurrent) {
        return;
      }
      this.code = params.get('code');
    });
  }
  onSelect(item) {
    this.code = item;
  }

  setContext(): void {
    const context = this.page.meta.context || [];
    this.navService.setLabel(this.page, this.code.toUpperCase());

    context.forEach((item) => {
      switch (item.code) {
      }
    });

    this.uxService.setContextMenu(context);
  }
}
