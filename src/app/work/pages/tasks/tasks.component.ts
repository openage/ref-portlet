import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { TaskListComponent } from 'src/app/lib/oa-ng/gateway/task-list/task-list.component';
import { PageBaseComponent } from 'src/app/lib/oa/core/components/page-base.component';
import { Entity } from 'src/app/lib/oa/core/models';
import { LocalStorageService, RoleService } from 'src/app/lib/oa/core/services';
import { Action } from 'src/app/lib/oa/core/structures';
import { Project, Sprint, State, Task } from 'src/app/lib/oa/gateway/models';
import { ProjectService, ReleaseService, SprintService } from 'src/app/lib/oa/gateway/services';
import { WidgetDataService } from 'src/app/lib/oa/core/services/widget-data.service';
import { DataService } from 'src/app/lib/oa/connect/services/data.service';
import { SprintDetailComponent } from 'src/app/lib/oa-ng/gateway/sprint-detail/sprint-detail.component';
import { ImporterComponent } from 'src/app/lib/oa-ng/shared/dialogs/importer/importer.component';

@Component({
  selector: 'page-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent extends PageBaseComponent {

  @ViewChild('list')
  list: TaskListComponent;

  selectedView = 'rows';
  selectedGroupBy = 'due-date';

  selectedState: State;
  selectedAssignee: any;
  selectedRole: any;
  selectedParent: any = null;
  selectedStatus: string;
  selectedType: string;
  selectedOwner: string;

  selectedDate: Date = new Date();

  selectedSubject: string;
  selectedProject: Project;

  sort: any;
  showSprints: boolean;
  showMembers: boolean;
  showTimeLogs: boolean;
  showClosed: boolean;
  showDraft: boolean;
  showDiscarded: boolean;
  endless: boolean;
  selectedTag: string;
  projectCode: string;

  showTaskFilters: boolean;

  query: any;

  //  'priority-view' |
  //  'type-view' |
  //  'sprint-view' |
  //  'category-view' |
  //  'status-view';

  groups: any[] = [];
  groupActions: Action[] = [];

  constructor(
    public dialog: MatDialog,
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: RoleService,
    public projectService: ProjectService,
    public sprintService: SprintService,
    public releaseService: ReleaseService,
    private statDataService: WidgetDataService,
    private dataService: DataService,
    cache: LocalStorageService
  ) {

    super(navService, uxService, auth, route, cache);

    this.params.subscribe(params => {
      if (!this.isCurrent) {
        return;
      }

      if (this.isInitialized) {
        this.afterInit();
        return;
      }

      this.showFilters = params.get('showFilters') || this.showFilters;
      this.showMembers = params.get('showMembers') || this.showMembers;
      this.showSprints = params.get('showSprints') || this.showSprints;
      this.showTimeLogs = params.get('showTimeLogs') || this.showTimeLogs;

      this.showClosed = params.get('closed');
      this.showDraft = params.get('draft');
      this.showDiscarded = params.get('discarded');

      this.selectedAssignee = params.get('assignee') || params.get('email');
      this.selectedRole = params.get('role-id')
      this.selectedType = params.get('type');
      this.selectedOwner = params.get('owner');
      this.selectedStatus = params.get('status-code');
      this.selectedTag = params.get('tag');
      this.projectCode = params.get('code');
      this.endless = params.get('endless')

      this.sort = params.get('sort') || { priority: 'asc' };

      this.selectedView = params.get('view') || 'rows';
      this.selectedGroupBy = params.get('groupBy') || 'due-date';

      if (params.get('parent') !== undefined) {
        this.selectedParent = params.get('parent');
      }

      if (this.selectedAssignee) {
        if (this.selectedAssignee === 'my') {
          let role = this.auth.currentRole();
          this.onMemberSelect({
            user: {
              email: role.email,
              role: { id: role.id }
            }
          })
        } else {
          this.onMemberSelect({
            user: {
              email: this.selectedAssignee,
              role: { id: params.get('role-id') }
            }
          })
        }

      }

      if (!this.isInitialized) {
        this.beforeInit();
        this.init();
      }
    });

    this.uxService.onSearch.subscribe((query) => {
      this.onSearch(query);
    });
  }

  getGroupStats(type: string) {
    if (type === 'due-date') return;

    let requestQuery = {};

    if (this.selectedAssignee) {
      let currentUser = JSON.parse(localStorage.getItem('user'))
      requestQuery['assignee'] = currentUser.email;
    }

    this.statDataService.data(`home|tasks|${type}`, requestQuery).subscribe((result) => {
      this.groups = result.items.map(item => {
        item.isSelected = false
        return item;
      });

      switch (type) {
        case 'sprint':
          if (!this.groups.find(g => g.code === 'backlog' || !g.code)) {
            this.groups.push({
              name: 'Backlog',
              code: null,
              count: ''
            })
          }
          break;
      }
      if (this.groups.length) {
        this.onGroupToggle(this.groups[0])
      }

      this.setGroupActions(type);
    });
  }

  setGroupActions(type: string) {
    this.groupActions = [];

    switch (type) {
      case 'sprint':
        this.groupActions.push(new Action({
          code: 'edit',
          type: 'button',
          event: () => this.onEditSprint()
        }), new Action({
          code: 'add',
          type: 'button',
          event: () => this.onNewSprint()
        }))
        break;
    }
  }

  onGroupToggle(group: any) {

    let isSelected = !group.isSelected;
    this.groups.forEach((g) => g.isSelected = false)

    group.isSelected = isSelected;

    if (!group.isSelected) return;

    switch (this.selectedGroupBy) {
      case 'type':
        this.query['type'] = group.code;
        break;
      case 'category':
        this.query['category-code'] = group.code;
        break;
      case 'sprint':
        this.query['sprint-code'] = group.code;
        break;
      case 'status':
        this.query['status-code'] = group.code;
        break;
    }
  }

  onSort(sort: any) {
    this.sort = sort;
  }

  onDateSelect($event) {
    this.selectedDate = $event;
  }

  onMemberSelect($event) {
    if (!$event) {
      // this.onSearch({});
      this.selectedAssignee = undefined;
      this.selectedParent = 'none';
      return;
    }

    this.selectedParent = undefined;

    this.selectedAssignee = $event.user.email;

    // this.onSearch({
    //   'assignee': $event.user.email
    // });
    // this.selectedAssignee = $event.user.email;


    this.selectedRole = $event.user.role.id

    this.page.meta.stats = this.page.meta.stats || {};
    this.page.meta.stats.params = this.page.meta.stats.params || [];

    let params = this.page.meta.stats.params

    let roleId = params.find(p => p.key === 'roleId')
    if (!roleId) {
      roleId = {
        key: 'roleId',
        value: this.selectedRole
      }
      this.page.meta.stats.params.push(roleId)
    } else {
      roleId.value = this.selectedRole
    }

    let projectCode = params.find(p => p.key === 'projectCode')
    if (!projectCode) {
      projectCode = {
        key: 'projectCode',
        value: this.projectCode
      }
      this.page.meta.stats.params.push(projectCode)
    } else {
      projectCode.value = this.projectCode
    }
    this.page.meta.stats.params = [...this.page.meta.stats.params]

    // for (const param in params) {
    //   this.ite
    //   if (this.selectedRole) {
    //     this.params['roleId'] = this.selectedRole;
    //   }
    //   this.params['projectCode'] = this.projectCode;
    // }



    // this.params = {
    //   'primary-stats': {
    //     roleId: this.roleId,
    //     projectCode: this.projectCode
    //   },
    //   'time-log-total': {
    //     roleId: this.roleId,
    //     projectCode: this.projectCode
    //   }
    // }

    // if (this.view === 'monthly') {
    //   this.from = moment(new Date()).subtract(1, "months").format('MM/DD/YYYY') as any;
    //   this.params['primary-stats'].period = 30;
    //   this.params['time-log-total'].period = 30;
    // } else {
    //   this.from = moment(new Date()).subtract(1, "days").format('MM/DD/YYYY') as any;
    //   this.params['primary-stats'].period = 2;
    //   this.params['time-log-total'].period = 2;
    // }
    // let user = $event.user;
    // if (!this.selectedAssignee) {
    //   this.selectedAssignee = user;
    //   return;
    // }

    // let code = typeof this.selectedAssignee === 'string' ? this.selectedAssignee : this.selectedAssignee.code;

    // if (code !== user.code) {
    //   this.selectedAssignee = user;
    //   return;
    // }

    // this.selectedAssignee = undefined;
  }

  onTagSelect(value: string) {
    this.selectedTag = value;
  }

  onSearch($event: any) {

    if ($event.view) {

      this.selectedView = 'rows'

      switch ($event.view) {
        case 'type-view':
          this.selectedGroupBy = 'type'
          break;
        case 'category-view':
          this.selectedGroupBy = 'category'
          break;
        case 'sprint-view':
          this.selectedGroupBy = 'sprint'
          break;
        case 'status-view':
          this.selectedGroupBy = 'status'
          break;
        case 'priority-view':
          this.selectedGroupBy = 'due-date'
          break;
      }

      this.getGroupStats(this.selectedGroupBy);
    }



    const query = this.getQuery($event);
    this.query = {};
    // Object.getOwnPropertyNames($event || {}).forEach((k) => query[k] = $event[k]);
    // const selected = this.page.meta.selected || {};
    // this.query.assignee =  selected.assignee || query.assignee;
    // query.type = selected.type || query.type;

    // query.owner = query.owner || selected.owner;
    // query.status = query.status || query['status-code'] || selected.status;

    if (query.priority) {
      query.priority = parseInt(query.priority, 10);
    }

    if (query.text) {
      query.subject = query.text;
      query.text = undefined;
    }

    if (!query.status) {
      query['include-closed'] = false;
    }

    if (query.group) {
      switch (query.group) {
        case 'pending':
          query['status-isPaused'] = false;
          break;
        case 'resolved':
          query['status-isPaused'] = undefined;
          break;
        case 'all':
          query['include-closed'] = true;
          break;
      }
    }

    // if (query.assignee) {
    //   this.selectedAssignee = selected.assignee || query.assignee;
    // } else {
    //   this.selectedAssignee = selected.assignee;
    // }

    // if (query.type) {
    //   this.selectedType = selected.type || query.type;
    // } else {
    //   this.selectedType = selected.type;
    // }

    // this.selectedOwner = query.owner || selected.owner;
    // this.selectedStatus = query.status || query['status-code'] || selected.status;
    // this.selectedSubject = query.text;

    // if (query.order) {
    //   this.sort = query.order;
    // }

    this.query = query;

  }

  // onFilterSelect(item) {
  //   this.params = {};
  //   if (item.params && item.params.length) {
  //     item.params.forEach((param) => { this.params[param.key] = param.value; });
  //   }
  // }

  init() {

    if (this.projectCode && !this.selectedProject) {
      this.isProcessing = true;
      this.projectService.get(this.projectCode).subscribe((p) => {
        this.selectedProject = p;
        this.isProcessing = false;
        this.afterInit();
        this.isInitialized = true;
      });
    } else {
      this.afterInit();
      this.isInitialized = true;
    }
    // if (this.entity && this.entity.type) {
    //   switch (this.entity.type) {
    //     case 'assignee':
    //       this.selectedAssignee = this.entity.code;
    //       this.isInitialized = true;
    //       return;

    //     case 'project':
    //       if ((this.entity.code || this.projectCode) &&
    //         (!this.selectedProject || (this.entity.code !== this.selectedProject.code))) {
    //         this.isProcessing = true;
    //         this.projectService.get(this.entity.code).subscribe((p) => {
    //           this.selectedProject = p;
    //           this.isProcessing = false;
    //           this.isInitialized = true;
    //         });
    //       } else {
    //         this.isInitialized = true;
    //       }
    //       return;
    //   }
    // } else {
    //   this.isInitialized = true;
    // }
  }

  onSelect($event: Task) {
    const entity = this.getEntity($event) || new Entity({
      type: $event.type,
      code: $event.code
    });

    this.navService.goto(entity);

    // if (taskEntity) {
    //   this.navService.goto(new Entity(taskEntity), { fragment: $event.type });
    // } else {
    //   this.navService.goto(new Entity({
    //     type: $event.type,
    //     code: $event.code
    //   }), { fragment: $event.type });

    //   // const url = this.router.createUrlTree(['/items', $event.code])
    //   // window.open(url.toString(), '_blank')
    //   // this.router.navigate([$event.code], { relativeTo: this.route });
    // }
    this.uxService.resetSearchParams();
  }


  onCreate(task: Task): void {
    this.uxService.showSuccess(`${task.workflow.name} ${task.code.toUpperCase()} created`, task.subject, {
      hide: {
        confirm: true,
        cancel: true,
      },
      timer: 3000,
      actions: [new Action({
        title: 'View',
        type: 'primary',
        event: () => this.onSelect(task)
      })]
    });
  }

  setContext(context) {
    context.forEach((item) => {

      switch (item.code) {

        case 'team':
          item.event = (a) => { this.showMembers = !this.showMembers }
          break;

        case 'time-logs':
          item.event = () => this.showTimeLogs = !this.showTimeLogs;
          break;

        case 'view':
          item.event = (value) => {
            this.selectedView = value;
            value = value || {};
            value._refresh = true;
            this.onSearch(value);
          };
          break;

        case 'rows':
        case 'lists':
          item.event = (value) => {
            this.selectedView = 'rows';
            value = value || {};
            value._refresh = true;
            this.onSearch(value);
          };
          break;

        case 'columns':
        case 'kanban':
          item.event = (value) => {
            this.selectedView = 'columns';
            value = value || {};
            value._refresh = true;
            this.onSearch(value);
          };
          break;

        case 'sprints':
          item.event = () => this.showSprints = !this.showSprints;
          break;

        case 'refresh':
          item.event = () => this.onRefresh();
          break;

        case 'done':
          item.event = () => this.showClosed = !this.showClosed;
          break;

        case 'draft':
          item.event = () => this.showDraft = !this.showDraft;
          break;

        case 'discarded':
          item.event = () => this.showDiscarded = !this.showDiscarded;
          break;

        case 'upload':
          item.event = (event: any) => this.invokeUploader(event);
          break;

        case 'new':
          item.event = (a) => this.router.navigate(['new'], { relativeTo: this.route });
          break;
      }

    });

    return context;
  }

  invokeUploader(key: string) {

    let options = {
      title: 'Import',
      path: `upload/openage/${key}.csv`,
      queryParams: {},
      config: {}
    }

    const dialogRef = this.dialog.open(ImporterComponent, {
      width: '50%'
    });

    dialogRef.componentInstance.options = options;
    dialogRef.componentInstance.uploader = this.dataService;
    dialogRef.componentInstance.selectedMapper = {};

  }

  getEntity(item: Task) {
    if (!item || !item.entity || !item.entity.type) {
      return;
    }

    let entity = item.entity;
    if (item.parent && item.parent.entity) {
      entity = item.parent.entity;
    }

    if (item.entity && item.entity.type === 'task') {
      return;
    }
    return entity;

  }

  onRefresh() {
    this.list.onRefresh();
  }

  // createTask(): void {
  //   const dialogRef = this.dialog.open(NewTaskDialogComponent, {
  //     width: '550px',
  //   });

  //   const instance = dialogRef.componentInstance;
  //   instance.project = new Project({ id: this.projectId });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.onRefresh();
  //     }
  //   });
  // }


  onEditSprint() {

    let selected = this.groups.find(i => i.isSelected)
    if (!selected) {
      return this.uxService.showError('Select a sprint first');
    }
    if (selected.code === 'backlog') {
      return this.uxService.showError('You cannot edit backlog');
    }

    const dialogRef = this.uxService.openDialog(SprintDetailComponent);
    dialogRef.componentInstance.code = selected.code;
  }

  onNewSprint() {

    const dialogRef = this.uxService.openDialog(SprintDetailComponent);

    dialogRef.componentInstance.properties = new Sprint({
      project: {
        id: this.selectedProject.id,
        code: this.selectedProject.code
      }
    });

    dialogRef.afterClosed().subscribe((sprint: Sprint) => {
      if (!sprint) {
        return;
      }

      const groups = this.groups.filter((s) => s.code !== 'backlog');

      groups.push({
        name: sprint.name, code: sprint.code, count: 0
      });

      groups.push(this.groups.find((s) => s.code === 'backlog'));
      this.groups = groups;
    });
  }
}
