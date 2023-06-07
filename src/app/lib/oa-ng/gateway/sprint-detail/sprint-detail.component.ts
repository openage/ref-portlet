import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { Project, Sprint } from 'src/app/lib/oa/gateway/models';
import { ProjectService, ProjectTypeService, SprintService } from 'src/app/lib/oa/gateway/services';

@Component({
  selector: 'gateway-sprint-detail',
  templateUrl: './sprint-detail.component.html',
  styleUrls: ['./sprint-detail.component.css']
})
export class SprintDetailComponent extends DetailBase<Sprint> implements OnInit {

  constructor(
    public dialog: MatDialogRef<SprintDetailComponent>,
    public sprintService: SprintService,
    private uxService: UxService
  ) {
    super({
      api: sprintService
    });
  }

  ngOnInit() {
    if (!this.properties && this.code) {
      this.get(this.code).subscribe();
    }
  }
  onSave() {
    const model: any = {
      id: this.properties.id,
      plan: this.properties.plan,
      name: this.properties.name,
      description: this.properties.description,
      code: this.properties.code,
    };

    if (this.properties.project) {
      model.project = {
        id: this.properties.project.id,
        code: this.properties.project.code
      };
    }

    this.save(model).subscribe((p) => {
      this.dialog.close(p);
    });
  }

  onStartDateChange($event) {
    this.properties.plan.start = $event
  }

  onFinishDateChange($event) {
    this.properties.plan.finish = $event
  }

  onStart() {
    this.update({ status: 'active' }).subscribe((p) => {
      this.dialog.close(p);
    });
  }

  onComplete() {
    this.update({ status: 'closed' }).subscribe((p) => {
      this.dialog.close(p);
    });
  }

  onDiscard() {
    this.update({ status: 'trash' }).subscribe((p) => {
      this.dialog.close(p);
    });
  }

  onCancel() {
    this.dialog.close();
  }
}
