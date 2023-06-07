import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, Directive } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { Action, DetailBase, Menu } from 'src/app/lib/oa/core/structures';
import { Member, Project, Sprint, User } from 'src/app/lib/oa/gateway/models';
import { ProjectService, SprintService, TaskService } from 'src/app/lib/oa/gateway/services';
import { Category } from '../models/category.model';
import { Task } from '../models/task.model';

@Directive()
export class ProjectDetailBaseComponent extends DetailBase<Project> implements OnInit, OnChanges {

  @Input()
  code: string;

  @Input()
  readonly = false;

  @Input()
  showWeeks = true;

  @Input()
  selectedStoryId: any;

  @Input()
  selectedPriority: any;

  @Input()
  selectedSprint: Sprint;

  @Input()
  selectedCategory: Category;

  @Output()
  memberSelect: EventEmitter<Member> = new EventEmitter();

  @Output()
  storySelect: EventEmitter<Task> = new EventEmitter();

  @Output()
  sprintSelect: EventEmitter<Sprint> = new EventEmitter();

  @Output()
  categorySelect: EventEmitter<Category> = new EventEmitter();

  stories: Task[] = [];
  sprints: Sprint[] = [];
  categories: Category[] = [];
  // users: User[] = [];

  // backlog: Sprint;

  constructor(
    private service: ProjectService,
    private sprintService: SprintService,
    private storyService: TaskService,
    private uxService: UxService
  ) {
    super({
      api: service
    });
  }

  sprintSelected(item: Sprint) {
    this.selectedSprint = item;
    this.sprintSelect.emit(item);
  }

  storySelected(item: Task) {
    this.selectedStoryId = item ? item.id : 0;
    this.storySelect.emit(item);
  }

  memberSelected(user: User) {
    this.memberSelect.emit(new Member({
      user,
      project: this.properties
    }));
  }

  storyCreated(story: Task) {
    this.stories.push(story);
    this.stories = [...this.stories];
  }

  storyUpdated(story: Task) {
    this.stories = [...this.stories];
  }

  sprintCreated(item: Sprint) {
    this.sprints.push(item);
    this.sprints = [...this.sprints];
  }

  ngOnInit() {
    // this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }

  private init() {
    this.isProcessing = true;

    this.get(this.code).subscribe(() => {

      this.properties.members = this.properties.members || [];
      // this.users = [];
      // this.properties.members.forEach((member) => {
      //   if (!this.users.find((item) => item.id === user.id) && user.name && user.name !== 'undefined') {
      //     this.users.push(member.user);
      //   }
      // });

      // this.users = this.users.sort((a, b) => a.name < b.name ? -1 : 1);

      this.properties.sprints = this.properties.sprints || [];
      this.sprints = this.properties.sprints;

      this.properties.categories = this.properties.categories || [];
      this.categories = this.properties.categories;

      this.storyService.search({
        projectId: this.properties.id
      }).subscribe((page) => {
        this.stories = page.items;
        this.isProcessing = false;
      });
    });
  }
}
