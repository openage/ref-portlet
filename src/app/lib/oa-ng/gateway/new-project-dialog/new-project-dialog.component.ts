import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { Project } from 'src/app/lib/oa/gateway/models';
import { ProjectType } from 'src/app/lib/oa/gateway/models/project-type.model';
import { ProjectService, ProjectTypeService } from 'src/app/lib/oa/gateway/services';

@Component({
  selector: 'gateway-new-project-dialog',
  templateUrl: './new-project-dialog.component.html',
  styleUrls: ['./new-project-dialog.component.css']
})
export class NewProjectDialogComponent implements OnInit {

  project: Project;
  types: ProjectType[];

  constructor(
    public dialog: MatDialogRef<NewProjectDialogComponent>,
    public api: ProjectService,
    public typeApi: ProjectTypeService,
    private uxService: UxService
  ) {
    this.typeApi.search().subscribe((t) => this.types = t.items);
  }

  ngOnInit() {
    this.project = new Project();
  }

  onSelectType($event: ProjectType) {
    this.project.type = $event;
  }

  onNameChange() {
    this.project.code = this.project.name.toLowerCase().trim().replace(' ', '-');
  }

  proceed() {
    if (!this.project.name) {
      return this.uxService.handleError('Name is required');
    }

    if (!this.project.code) {
      return this.uxService.handleError('Code is required');
    }

    if (!this.project.type) {
      return this.uxService.handleError('Type is required');
    }

    this.api.create(this.project).subscribe((p) => this.dialog.close(p));
  }

  cancel() {
    this.dialog.close();
  }

}
