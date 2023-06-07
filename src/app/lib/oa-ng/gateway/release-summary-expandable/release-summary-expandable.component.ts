import { Component, Input, OnInit } from '@angular/core';
import { Release } from 'src/app/lib/oa/gateway/models';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'release-summary-expandable',
  templateUrl: './release-summary-expandable.component.html',
  styleUrls: ['./release-summary-expandable.component.css']
})
export class ReleaseSummaryExpandableComponent implements OnInit {

  @Input()
  release: Release;

  @Input()
  isExpanded: boolean;

  constructor() { }

  ngOnInit() {
  }

}
