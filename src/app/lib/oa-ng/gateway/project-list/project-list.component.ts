import { Component, Input } from '@angular/core';
import { UxService } from 'src/app/core/services/ux.service';
import { ProjectListBaseComponent } from 'src/app/lib/oa/gateway/components/project-list.base.component';
import { ProjectService } from 'src/app/lib/oa/gateway/services/project.service';
import { Action } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'gateway-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent extends ProjectListBaseComponent {


  constructor(
    public projectService: ProjectService,
    private uxService: UxService
  ) {
    super(projectService, uxService);
  }

  // onShowTasks(item): void {
  //   this.onSelect(item);
  // }

  onRemove(item): void {
    this.uxService.onConfirm().subscribe(() => {
      this.remove(item);
      this.uxService.showInfo('Deleted');
    });
  }

  showIssues(item, type?): Action {
    if (!type) {
      type = 'task'
    }

    let action: any = {}

    if (typeof type === 'string') {
      action.code = type;
      action.title = this.projectService.getView(type);
      action.icon = `oa-workflow-${type}`;
    } else {
      action = type;
    }

    action.style = 'md pointer';
    action.type = 'icon';

    action.event = () => {
      this.selectedData.emit({
        project: item,
        view: 'tasks',
        type: action.code
      });
    }
    return new Action(action);
  }
}
