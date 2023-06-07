import { Component, OnInit } from '@angular/core';
import { NavService } from 'src/app/core/services';
import { Link } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'oa-core-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  breadcrumb: Link[] = [];

  constructor(
    public navService: NavService
  ) {
    this.navService.breadcrumbChanges.subscribe((links) => {

      setTimeout(() => {
        this.breadcrumb = links || [];

        if (this.breadcrumb.length > 0) {
          this.breadcrumb.forEach((i) => i.isActive = false);
          const current = this.breadcrumb[this.breadcrumb.length - 1];
          current.isActive = true;
          this.navService.setTitle(current.title);
        }
      });
    });
  }

  back() {
    this.navService.back();
  }

  ngOnInit(): void {
  }

}
