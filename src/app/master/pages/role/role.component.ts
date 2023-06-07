import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/lib/oa/directory/models';
import { UxService } from 'src/app/core/services';
import { NavService } from 'src/app/core/services/nav.service';
import { RoleTypeDetailsComponent } from 'src/app/lib/oa-ng/directory/role-type-details/role-type-details.component';
import { Link } from 'src/app/lib/oa/core/structures';
import { EmployeeUploaderComponent } from '../../components/employee-uploader/employee-uploader.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
})
export class RoleComponent implements OnInit, OnDestroy {

  @ViewChild('details')
  details: RoleTypeDetailsComponent;

  code: string;

  isCurrent = true;
  page: Link;
  constructor(
    public dialog: MatDialog,
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.navService.register('/master/roles/:code', this.route, (isCurrent, params) => {
      this.isCurrent = isCurrent;
      this.code = params.get('code');
      if (this.isCurrent) {
        this.setContext();
      }
    }).then((link) => this.page = link);
  }

  ngOnDestroy(): void {
    this.uxService.reset();
  }

  onRefresh() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EmployeeUploaderComponent, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  setContext() {
    this.uxService.setContextMenu([{
      title: 'Save',
      type: 'raised',
      event: () => this.details.save()
    }, {
      helpCode: this.page.meta.helpCode
    }, 'close']);
  }

}
