import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UxService } from 'src/app/core/services/ux.service';
import { ReleaseListBaseComponent } from 'src/app/lib/oa/gateway/components/release-list.base.component';
import { ReleaseService } from 'src/app/lib/oa/gateway/services/release.service';
import { Project, Release } from 'src/app/lib/oa/gateway/models';

@Component({
  selector: 'gateway-release-list',
  templateUrl: './release-list.component.html',
  styleUrls: ['./release-list.component.css']
})
export class ReleaseListComponent extends ReleaseListBaseComponent {

  @Input()
  readonly = false;

  @Input()
  value: Release;

  @Input()
  searchField = 'text';

  @Input()
  label: string;

  @Output()
  changed: EventEmitter<Release> = new EventEmitter();

  constructor(
    public releaseService: ReleaseService,
    uxService: UxService
  ) {
    super(releaseService, uxService);
  }


  onSelect($event: any) {
    this.value = $event;
    this.changed.emit(this.value);
  }
}
