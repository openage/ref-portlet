import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Workflow } from 'src/app/lib/oa/gateway/models/workflow.model';
import { WorkflowsService } from 'src/app/lib/oa/gateway/services/workflows.service';

@Component({
  selector: 'gateway-workflow-list',
  templateUrl: './workflow-selector.component.html',
  styleUrls: ['./workflow-selector.component.css']
})
export class WorkflowSelectorComponent implements OnInit {

  @Input()
  readonly = false;

  @Input()
  value: Workflow;

  @Input()
  label: string;

  @Input()
  icon: string;

  @Input()
  searchField = 'name';

  @Input()
  params: any = {};

  @Output()
  changed: EventEmitter<Workflow> = new EventEmitter();

  @Input()
  items: Workflow[];

  constructor(public api: WorkflowsService) { }

  ngOnInit() {
    if (!this.value) { this.value = new Workflow(); }
  }

  ngOnChange() {
    if (!this.value) { this.value = new Workflow(); }

    if (this.items && this.items.length) {
      this.items.forEach((w) => {
        w.icon = w.icon || `oa-workflow-${w.code}`;

        let icon: any = {};
        if (typeof w.icon === 'string') {
          if (w.icon.startsWith('http')) {
            icon.url = w.icon;
          } else if (w.icon.startsWith('fa-')) {
            icon.fa = w.icon.substring(3);
          } else if (w.icon.startsWith('oa-')) {
            icon.oa = w.icon.substring(3);
          } else if (w.icon.startsWith('mat-')) {
            icon.mat = w.icon.substring(4);
          } else {
            icon.mat = w.icon;
          }
        } else {
          icon = w.icon;
        }
        w.icon = icon;
      });
    }
  }

  onSelect($event: any) {
    this.value = $event;
    this.changed.emit(this.value);
    if (!this.value) { this.value = new Workflow(); }
  }
}
