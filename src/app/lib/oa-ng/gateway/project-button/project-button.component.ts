import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UxService } from 'src/app/core/services/ux.service';
import { Project } from 'src/app/lib/oa/gateway/models';
import { ProjectService } from 'src/app/lib/oa/gateway/services/project.service';
import { NewProjectDialogComponent } from '../new-project-dialog/new-project-dialog.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'gateway-project-button',
  templateUrl: './project-button.component.html',
  styleUrls: ['./project-button.component.css']
})
export class ProjectButtonComponent implements OnInit {

  @Output()
  created: EventEmitter<Project> = new EventEmitter();

  isProcessing = false;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private uxService: UxService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  newProject() {
    const dialogRef = this.uxService.openDialog(NewProjectDialogComponent);

    dialogRef.afterClosed().subscribe((newProject: Project) => {
      if (newProject) { this.created.emit(newProject); }
    });
  }

}
