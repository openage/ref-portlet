import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { PageBaseComponent } from 'src/app/lib/oa/core/components/page-base.component';
import { LocalStorageService, RoleService } from 'src/app/lib/oa/core/services';
import { TaskService } from 'src/app/lib/oa/directory/services';
import { Project, Task } from 'src/app/lib/oa/gateway/models';
import { ProjectService } from 'src/app/lib/oa/gateway/services';
import { NewTaskComponent } from 'src/app/lib/oa-ng/gateway/task-new/task-new.component';

@Component({
  selector: 'page-task-new',
  templateUrl: './task-new.component.html',
  styleUrls: ['./task-new.component.css']
})
export class TaskNewComponent extends PageBaseComponent {

  @ViewChild('details')
  details: NewTaskComponent

  task: Task = new Task({});
  selectedProject: Project;


  constructor(
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute,
    public auth: RoleService,
    private router: Router,
    cache: LocalStorageService,
    private projectService: ProjectService
  ) {
    super(navService, uxService, auth, route, cache);

    this.params.subscribe(params => {
      if (!this.isCurrent) {
        return;
      }
      if (!this.isInitialized) {
        this.beforeInit();
        this.init();
        this.afterInit();
      }
      this.view = 'expanded'
    });
  }

  ngOnInit(): void {
  }

  setContext(context) {
    context.forEach((item) => {
      switch (item.code) {
        case 'editor':
          item.options.forEach((i) => {
            i.event = () => { this.view = i.code };
          })
          break;
      }
    });

    return context;
  }

  init() {
    if (this.entity && this.entity.type) {
      switch (this.entity.type) {
        case 'project':
          this.isProcessing = true;
          this.projectService.get(this.entity.code).subscribe((p) => {
            this.selectedProject = p;
            this.task.project = this.selectedProject;
            this.task.organization = null;
            this.isProcessing = false;
            this.isInitialized = true;
          });
          return;
      }
    } else {
      this.isInitialized = true;
    }
  }


  onCreate(): void {
    this.details.create(this.task).subscribe((task) => {
      this.router.navigate([task.code], { relativeTo: this.route.parent });
    })
  }
}
