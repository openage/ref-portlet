import { Component, ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output, Directive } from '@angular/core';
import { Project } from 'src/app/lib/oa/gateway/models/project.model';

import { ProjectService } from 'src/app/lib/oa/gateway/services/project.service';
import { PagerModel } from 'src/app/lib/oa/core/structures';
import { Member } from '../models';

@Directive()
export class ProjectListBaseComponent extends PagerModel<Project> implements OnInit, OnChanges {

  @Input()
  options: any = {};

  @Input()
  view = 'table';

  @Input()
  selectedStatus: string;

  @Input()
  my: boolean;

  @Output()
  selected: EventEmitter<Project> = new EventEmitter();

  @Output()
  count: EventEmitter<number> = new EventEmitter();

  @Output()
  selectedData: EventEmitter<any> = new EventEmitter();

  project: Project;

  selectedCode: string;
  selectedName: string;

  constructor(
    api: ProjectService,
    errorHandler: ErrorHandler
  ) {
    super({
      api, errorHandler,
      filters: ['status', 'code', 'name', 'my']
    });
  }

  ngOnInit() {
    this.refresh();
  }

  ngOnChanges() {
    this.view = this.view || this.options?.view || 'table';
    this.refresh();
  }

  onSelect(project: Project) {
    this.project = project;
    this.selected.emit(this.project);
  }

  refresh() {
    this.filters.reset(false);

    if (this.selectedStatus) {
      this.filters.set('status', this.selectedStatus);
    }

    if (this.selectedCode) {
      this.filters.set('code', this.selectedCode);
    }

    if (this.selectedName) {
      this.filters.set('name', this.selectedName);
    }

    if (this.my !== undefined || this.my !== null) {
      this.filters.set('my', this.my);
    }

    this.fetch();
  }

  onDataSelect(project: Project, member?: Member, view?: string) {
    let obj = {}
    obj['project'] = project;
    obj['member'] = member;
    obj['view'] = view;
    this.selectedData.emit(obj)
  }

}
