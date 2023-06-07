import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NavService } from 'src/app/core/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Link } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'app-quick-links',
  templateUrl: './quick-links.component.html',
  styleUrls: ['./quick-links.component.css']
})
export class QuickLinksComponent implements OnChanges, OnInit {

  @Input()
  code: string;

  @Input()
  view: 'row' | 'grid' | 'list' | 'icon-link-row' | 'large-grid' = 'grid';

  @Input()
  type: any;

  @Input()
  config: any;

  @Input()
  items: Link[] = [];

  active: Link;

  constructor(
    public auth: RoleService,
    private navService: NavService
  ) { }

  ngOnInit() {
    this.type = this.type || {};
    const widget = this.type.widget || {};
    this.view = this.config?.view || this.view;
  }

  ngOnChanges(): void {
    if (this.code) {
      if (this.code === 'root') {
        this.items = this.navService.getNavs().filter((i) => i.items && i.items.length);
      } else {
        const nav = this.navService.getNavs().find((n) => n.code === this.code);
        if (nav) {
          this.items = nav.items;
        }
      }
    } else {
      this.items = this.items.map((i) => {
        if (i.code) {
          return this.navService.get(i.code);
        } else {
          return i;
        }
      }).filter((i) => i);
    }
  }
}
