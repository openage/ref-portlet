import { Component, ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output, Directive } from '@angular/core';
import { Project } from 'src/app/lib/oa/gateway/models/project.model';
import { Release } from 'src/app/lib/oa/gateway/models/release.model';

import { PagerBaseComponent } from 'src/app/lib/oa/core/structures';

import { ReleaseService } from 'src/app/lib/oa/gateway/services/release.service';

@Directive()
export class ReleaseListBaseComponent extends PagerBaseComponent<Release> implements OnInit, OnChanges {

  @Input()
  project: Project | any;

  @Input()
  params: any = {};

  @Input()
  selectedStatus: string;

  @Input()
  isClosed: boolean;

  @Input()
  isOngoing: boolean;

  @Input()
  columns = ['name', 'code', 'duedate', 'status', 'view'];

  selectedSubject: string;

  constructor(
    api: ReleaseService,
    errorHandler: ErrorHandler
  ) {
    super({
      api,
      errorHandler,
      filters: ['projectId', 'status', 'subject', 'isClosed', 'isOngoing']
    });

    api.afterCreate.subscribe((newRelease) => {

      if (newRelease.project.id !== this.project.id) {
        return;
      }

      // if (this.selectedStatus && newRelease.status.type.code.toLowerCase() !== this.selectedStatus.toLowerCase()) {
      //   return;
      // }

      const items: Release[] = [];

      items.push(newRelease);
      items.push(...this.items);
      this.items = items;
    });
  }

  ngOnInit() {
    if (this.project) {
      this.params['project-id'] = this.project.id;
    }
    this.refresh();
  }

  ngOnChanges() {
    this.refresh();
  }

  refresh() {
    if (this.project) {
      this.filters.properties['projectId'].value = this.project.id;
    }

    if (this.selectedStatus) {
      this.filters.properties['status'].value = this.selectedStatus;
    }

    if (this.selectedSubject) {
      this.filters.properties['subject'].value = this.selectedSubject;
    }

    if (this.isClosed !== undefined) {
      this.filters.properties['isClosed'].value = this.isClosed;
    }

    if (this.isOngoing !== undefined) {
      this.filters.properties['isOngoing'].value = this.isOngoing;
    }

    this.fetch();
  }
}
