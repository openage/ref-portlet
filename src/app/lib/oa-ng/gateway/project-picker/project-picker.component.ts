import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project } from 'src/app/lib/oa/gateway/models';
import { ProjectService } from 'src/app/lib/oa/gateway/services';

@Component({
  selector: 'gateway-project-picker',
  templateUrl: './project-picker.component.html',
  styleUrls: ['./project-picker.component.css']
})
export class ProjectPickerComponent implements OnInit {

  @Input()
  readonly = false;

  @Input()
  value: Project = new Project();

  @Input()
  searchField = 'text';

  @Input()
  label: string;

  @Input()
  params: any = {};

  @Output()
  changed: EventEmitter<Project> = new EventEmitter();

  constructor(
    public projectApi: ProjectService
  ) { }

  ngOnInit() {
    if (!this.value) { this.value = new Project(); }
  }

  onSelect($event: any) {
    this.value = $event;
    this.changed.emit(this.value);
  }
}
