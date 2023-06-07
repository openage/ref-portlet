import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { ProjectSummaryComponent } from 'src/app/lib/oa-ng/gateway/project-summary/project-summary.component';
import { SprintsComponent } from 'src/app/lib/oa-ng/gateway/sprints/sprints.component';
import { PageBaseComponent } from 'src/app/lib/oa/core/components/page-base.component';
import { LocalStorageService, RoleService } from 'src/app/lib/oa/core/services';
import { Folder } from 'src/app/lib/oa/drive/models';
import { Member, Project, Task } from 'src/app/lib/oa/gateway/models';
import { ProjectService } from 'src/app/lib/oa/gateway/services';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent extends PageBaseComponent {

  @ViewChild('detail')
  detail: ProjectSummaryComponent;

  @ViewChild('sprintList')
  sprintList: SprintsComponent

  code: string;

  project: Project;

  readonly = true;

  folder: Folder;

  roles: any[] = [];

  constructor(
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: RoleService,
    private cache: LocalStorageService,
    private projectApi: ProjectService
  ) {
    super(navService, uxService, auth, route, cache);

    this.params.subscribe(params => {
      if (!this.isCurrent) {
        return;
      }

      this.init(params);
    });

    // this.navService.register('/projects/:code', this.route, (isCurrent, params) => {
    //   this.isCurrent = isCurrent;
    //   this.code = params.get('projectCode');
    //   this.entity = new Entity({ id: this.code, type: 'project' });
    //   this.folder = new Folder({ code: `project-${this.code}`, entity: this.entity });
    //   if (this.isCurrent) {
    //     this.setContext();
    //   }
    //   this.projectApi.get(this.code).subscribe((p) => this.onFetch(p));
    // }).then((link) => this.page = link);
  }

  init(params: any) {
    if (this.isInitialized) {
      this.afterInit();
      return;
    }
    this.code = params.get('code');
    this.folder = new Folder({ code: `project-${this.code}`, entity: this.entity });
    this.isInitialized = true;
  }

  onFetch(project: Project) {
    if (project && project.code) {
      this.project = project;

      this.setTitle(this.project.name);

      if (this.project && this.project.members) {
        this.setMembersByRole();
      }
    }

    this.afterInit();
  }


  setContext(contextAction: any[]) {
    let currentSprint
    if (this.project && this.project.sprints && this.project.sprints) {
      currentSprint = this.project.sprints.find(sprint => sprint.status === 'in-progress')
    }
    contextAction.forEach((item) => {
      switch (item.code) {
        case 'share':

          item.options.forEach((i) => {
            i.config = i.config || {};
            i.config.aka = i.config.aka || {};
            switch (i.code) {
              case 'email':
                i.config.entity = {
                  type: 'sprint',
                  id: currentSprint?.code
                }
                i.config.template = i.config.template || 'gateway|current-sprint';
                i.config.data = {
                  projectCode: this.code,
                  sprintCode: currentSprint?.code
                }
                i.config.subject = i.config.subject || `Team's priorities for Sprint {{data.sprintCode}}`
                break;

              case 'chat':
                i.config.aka.template = i.config.aka.template || 'gateway|current-sprint|redirect'
                i.config.aka.query = { sprintCode: currentSprint?.code }
                i.config.aka.content = { url: window.location.href }
                break;

              case 'copy':
                i.config.aka.template = i.config.aka.template || 'gateway|current-sprint'
                i.config.aka.query = { project: this.code, sprint: currentSprint?.code }
                break;
            }
          })
          break;
        case 'types':
          item.options = this.getTypes() || []
          break;

        case 'refresh':
          item.refresh = () => {
            this.detail.refresh();
            this.sprintList.refresh();
          }
          break;
      }
    });

  }

  getTypes() {
    let items = [{
      code: 'task',
      title: "Tasks",
      style: 'md pointer',
      type: 'icon',
      icon: `oa-workflow-task`,
      event: () => {
        this.navService.goto(`work.projects.tasks`, {
          path: { code: this.code }
        });
      }
    }]
    if (!this.project?.type?.workflows) return []

    this.project.type.workflows.forEach(item => {
      let view = this.projectApi.getView(item.code)

      items.push({
        code: item.code,
        title: item.name,
        style: 'md pointer',
        type: 'icon',
        icon: `oa-workflow-${item.code}`,
        event: () => {
          this.navService.goto(`work.projects.tasks.${item.code}`, {
            path: { code: this.code }
          });
        }
      })
    })

    return items
  }

  onTaskSelect(task: Task) {
    let entity = task.entity || { type: 'task', code: task.code };
    if (task?.parent?.entity) {
      entity = task.parent.entity;
    }

    this.navService.goto(entity, {}, { newTab: true });

  }

  onSave() {
    if (!this.detail.properties.name.trim()) {
      return this.uxService.handleError('Name required');
    }
    this.readonly = !this.readonly;
    this.detail.save(this.detail.properties);
  }

  onSaveMembers(members: Member[]) {
    this.detail.properties.members = members;
    this.detail.save().subscribe((item) => {
      this.project = item
      this.setMembersByRole();
    })
  }

  setMembersByRole() {

    let roles = this.project?.type?.roles || [];
    let members = this.project?.members || [];

    this.roles = [];
    (roles).forEach((role) => {
      this.roles.push({ type: role, members: members.filter((m) => m.roles.includes(role.code)) });
    });
  }
}
