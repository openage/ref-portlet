import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { Action, DetailBase, Menu } from 'src/app/lib/oa/core/structures';
import { Member, Project, Sprint, User } from 'src/app/lib/oa/gateway/models';
import { ProjectService, UserService } from 'src/app/lib/oa/gateway/services';

export class MemberDetailBaseComponent extends DetailBase<User> implements OnInit, OnChanges {

  @Input()
  code: string;

  @Input()
  readonly = false;

  @Input()
  user: User;

  @Input()
  project: Project;

  @Input()
  sprint: Sprint;

  level: number;

  breakup = 'Velocity';

  constructor(
    private uxService: UxService,
    private userService: UserService
  ) {
    super({
      api: userService
    });
  }

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }

  private init() {
    const individual = this.user.points.velocity - this.user.points.support - this.user.points.management;

    if (individual) {
      this.breakup = `${this.breakup} Individual:${individual}`;
    }

    if (this.user.points.support) {
      this.breakup = `${this.breakup} Support:${this.user.points.support}`;
    }

    if (this.user.points.management) {
      this.breakup = `${this.breakup} Management:${this.user.points.management}`;
    }

    this.level = this.userService.calculateLevel(this.user);
  }
}
