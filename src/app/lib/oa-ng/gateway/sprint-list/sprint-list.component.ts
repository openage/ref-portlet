import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project, Sprint } from 'src/app/lib/oa/gateway/models';
import { SprintService } from 'src/app/lib/oa/gateway/services';

@Component({
  selector: 'gateway-sprint-list',
  templateUrl: './sprint-list.component.html',
  styleUrls: ['./sprint-list.component.css']
})
export class SprintListComponent implements OnInit {

  @Input()
  readonly = false;

  @Input()
  value: Sprint;

  @Input()
  project: Project;

  @Input()
  searchField = 'name';

  @Input()
  label: string;

  @Input()
  params: any = {};

  @Output()
  changed: EventEmitter<Sprint> = new EventEmitter();

  @Input()
  items: Sprint[];

  constructor(
    public api: SprintService
  ) { }

  ngOnInit() {

    this.params = this.params || {};

    // if (!this.value) { this.value = new Project(); }

    if (this.project) {
      this.params['project-id'] = this.project.id;
    }
  }

  onSelect($event: any) {
    this.value = $event;
    this.changed.emit(this.value);
  }

}
