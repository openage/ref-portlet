import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { NewTaskDialogComponent } from 'src/app/lib/oa-ng/gateway/new-task-dialog/new-task-dialog.component';
import { TaskDetailComponent } from 'src/app/lib/oa-ng/gateway/task-detail/task-detail.component';
import { TaskListComponent } from 'src/app/lib/oa-ng/gateway/task-list/task-list.component';
import { PageBaseComponent } from 'src/app/lib/oa/core/components/page-base.component';
import { Entity } from 'src/app/lib/oa/core/models';
import { LocalStorageService, RoleService } from 'src/app/lib/oa/core/services';
import { Action } from 'src/app/lib/oa/core/structures';
import { Folder } from 'src/app/lib/oa/drive/models';
import { Project, Task } from 'src/app/lib/oa/gateway/models';
import { TaskService } from 'src/app/lib/oa/gateway/services';
import { Conversation } from 'src/app/lib/oa/send-it/models';

@Component({
  selector: 'page-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent extends PageBaseComponent {

  @ViewChild('detail')
  details: TaskDetailComponent;

  @ViewChild('dependsOnList')
  dependsOnList: TaskListComponent;


  selectedView: string;

  tab = 'comments';
  isInitialized = false;

  code: string;

  task: Task;

  conversation: Conversation;

  readonly = true;

  folder: Folder;

  // path: string;
  // entity: Entity;

  // for: Entity;

  project: Project;
  options: any = { reset: false };
  parentOptions: any = {
    more: { extras: [] }
  }
  more: any = {
    extras: [{
      code: 'deattach',
      title: 'Deattach',
      event: (item) => { this.onUpdate(item, true) }
    }]
  }
  bulkActions: any[] = [
    { code: 'done', label: 'Mark Done All' },
    { code: 'reset', label: 'Reset All' }
  ]

  // subTaskColumns = ['icon', 'code', 'subject', 'status', 'actions', 'assignee', 'effort', 'view'];
  r// elatedTaskColumns = ['icon', 'code', 'subject', 'status', 'actions', 'assignee', 'effort', 'view'];

  // isProcessing = false;

  constructor(
    // public dialog: MatDialog,
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute,
    private taskService: TaskService,
    public auth: RoleService,
    private router: Router,
    private dialog: MatDialog,
    cache: LocalStorageService
  ) {
    super(navService, uxService, auth, route, cache);

    // this.path = this.route.snapshot.data.path;
    // if (this.route.snapshot.data.for) {
    //   this.for = new Entity(this.route.snapshot.data.for);
    // }
    this.params.subscribe(params => {
      if (!this.isCurrent) {
        return;
      }

      this.code = params.get('code');

      this.selectedView = params.get('view');

      this.entity = new Entity({ id: this.code, type: 'task' });
      this.conversation = new Conversation();
      this.conversation.entity = this.entity;
      this.folder = new Folder({ code: `task-${this.code}`, entity: this.entity });

      // if (this.for && this.for.code && this.for.code.startsWith(':')) {
      //   this.for.code = params.get(this.for.code.substring(1));
      // }

      // if (!this.isInitialized) {
      this.init();
      // }

      // if (this.isCurrent) {
      // this.setContext();
      //   this.task = undefined;
      //   this.init();
      // }
    });
  }

  init() {
    this.task = undefined;
    if (this.code && !this.task) {
      this.isProcessing = true;
      this.taskService.get(`${this.code}?exclude=assigneeJournals,children`).subscribe((t) => {
        this.task = t;
        let name = `${t.workflow.name}:${t.code.toUpperCase()}`
        this.setEntity({ code: t.code, name: name });
        this.setTitle(name);
        if (this.task.type == 'story') { this.setOptions() }
        this.afterInit();
        this.isProcessing = false;
      });
    }
  }

  setOptions() {
    this.parentOptions = {
      more: {
        extras: [{
          code: 'split',
          title: 'Split',
          event: (item) => { this.onSplit() }
        }]
      }
    }
  }

  onSplit() {
    const task = { ...this.task }

    let dialogRef = this.dialog.open(NewTaskDialogComponent, {
      width: '700px'
    });
    dialogRef.componentInstance.heading = 'Split Story';
    dialogRef.componentInstance.relatedTask = this.task;
    dialogRef.componentInstance.task = new Task({
      type: task.type,    // this.navService.register('/projects/:code', this.route, (isCurrent, params) => {
      //   this.isCurrent = isCurrent;
      //   this.code = params.get('projectCode');
      //   this.entity = new Entity({ id: this.code, type: 'project' });
      //   this.folder = new Folder({ code: `project-${this.code}`, entity: this.entity });
      //   if (this.isCurrent) {
      //     this.setContext();
      //   }
      //   this.projectApi.get(this.code).subscribe((p) => this.onFetch(p));
      // }).then((link) => this.page = link);
      subject: `Leftovers: ${task.code} (${task.subject})`,
      description: task.description,
      children: [],
      workflow: { code: task.workflow.code },
      category: task.category,
      icon: task.icon,
      project: task.project,
      dependsOn: [{ id: this.task.id }],
      organization: { code: task.organization.code }
    })

    dialogRef.afterClosed().subscribe((data) => {
      if (!data) { return }

      this.uxService.showSuccess(`${data.workflow.name} ${data.code.toUpperCase()} created`, data.subject, {
        hide: {
          confirm: true,
          cancel: true,
        },
        timer: 3000,
        actions: [new Action({
          title: 'View',
          type: 'primary',
          event: () => this.onSelect(data)
        })]
      });
    })
  }

  onSelect($event: Task) {
    // const newPath = this.path.replace(':taskCode', $event.code);
    // this.navService.goto(newPath, {}, { newTab: true });
    const entity = this.getEntity($event) || new Entity({
      type: $event.type,
      code: $event.code
    });

    this.navService.goto(entity);


    this.uxService.resetSearchParams();
  }

  gotoByCode(code) {
    const newPath = this.router.url.replace(this.code, code);
    this.navService.goto(newPath, {}, { newTab: true });

    // this.router.navigateByUrl(this.router.url.replace(this.code, code));
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

  setContext(contextAction: any[]) {
    contextAction.forEach((item) => {
      switch (item.code) {
        case 'share':
          item.options.forEach((i) => {
            i.config = i.config || {};
            i.config.aka = i.config.aka || {};
            switch (i.code) {
              case 'email':
                i.config.entity = {
                  type: 'task',
                  id: this.task?.code
                }
                i.config.template = i.config.template || 'gateway|task-details';
                i.config.data = { task: this.task?.code }
                i.config.subject = i.config.subject || `Ticket No. ${this.task?.code}: ${this.task?.subject}`
                break;

              case 'chat':
                i.config.aka.template = i.config.aka.template || 'gateway|task-details|redirect'
                i.config.aka.query = { dataId: this.task?.code }
                i.config.aka.content = { url: window.location.href }
                break;

              case 'copy':
                i.config.aka.template = i.config.aka.template || 'gateway|task-details'
                i.config.aka.query = { dataId: this.task?.code }
                break;
            }
          })
          break;

        case 'refresh':
          item.event = () => { this.details.refresh(); }
          break;
      }
    });

    // this.path = this.path.replace(':taskCode', this.code);
    // this.uxService.setContextMenu([{
    //   helpCode: this.page.meta.helpCode
    // }, 'close']);


    this.navService.setLabel(this.page, this.code.toUpperCase());

  }

  // onFetch(task: Task) {
  //   if (task && task.code) {
  //     this.task = new Task(task);
  //     // if (this.auth.currentOrganization()) {
  //     //   this.setFolder();
  //     // }
  //   }
  // }

  onFileSelect($event) {
    this.navService.goto(`${this.path}/files/${$event.id}`);
  }

  onSubtaskCreate($event) { }

  onStatusUpdate($event) {
    // this.detail.ngOnInit();
  }

  onUpdate(selectedTask: Task, remove: boolean) {
    //update current task
    if (!remove && this.task.dependsOn.find(item => item.id === selectedTask.id)) return;
    this.taskService.updateDependsOn(this.task, selectedTask, remove).subscribe(data => {
      this.task.dependsOn = data.dependsOn
      this.setList(selectedTask, remove)
    })

    //update selectedTask task
    if (!remove && selectedTask.dependsOn.find(item => item.id === this.task.id)) return;
    this.taskService.updateDependsOn(selectedTask, this.task, remove)
  }

  setList(selectedTask: Task, remove: boolean) {
    if (remove) {
      this.dependsOnList.items = (this.dependsOnList.items || []).filter(item => item.id !== selectedTask.id);
    } else {
      this.dependsOnList.items = [selectedTask, ...this.dependsOnList.items];
    }
    this.options = { reset: true }
  }

  onBulkUpdate(action: string, listType: string) {
    const model = this.taskService.getBulkUpdateModel(action);
    const query = this.taskService.getBulkUpdateQuery(this.task, listType);

    this.taskService.updateBulk(this.task, model, query).subscribe(task => {
      this.dependsOnList.onRefresh();
    })
  }

  // setFolder() {
  //   this.entity = new Entity(this.task.entity);
  //   this.folder = new Folder({ code: `task-${this.task.code}`, entity: this.entity });
  // }

  onSave() {
    // if (!this.detail.properties.name.trim()) {
    //   return this.uxService.handleError('Name required')
    // }
    // this.readonly = !this.readonly
    // this.detail.save(this.detail.properties)
  }
}
