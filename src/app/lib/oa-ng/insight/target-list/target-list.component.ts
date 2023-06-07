import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ErrorHandler, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoleService } from 'src/app/lib/oa/core/services';
import { TargetListBaseComponent } from 'src/app/lib/oa/insight/components/target-list.base.component';
import { Target } from 'src/app/lib/oa/insight/models/target.model';
import { TargetService } from 'src/app/lib/oa/insight/services/target.service';
import { TargetNewDialogComponent } from '../target-new-dialog/target-new-dialog.component';

@Component({
  selector: 'insight-target-list',
  templateUrl: './target-list.component.html',
  styleUrls: ['./target-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class TargetListComponent extends TargetListBaseComponent {

  constructor(
    public auth: RoleService,
    public dialog: MatDialog,
    api: TargetService,
    errorHandler: ErrorHandler
  ) {
    super(api, errorHandler);
  }

  addMember(target) {
    target.team.push({
      value: 0,
      achieved: 0,
      status: 'new',
      user: null
    });
  }

  removeMember(target, index) {
    target.team.splice(index, 1);
  }

  onSelect(target: Target, isSelected: boolean) {
    this.items.forEach((item) => item.isSelected = false);
    target.isSelected = isSelected;
  }

  getOwnerTarget(target: Target): number {
    const ownerTargetValue = (target.team.find((member) => member.user.id === target.user.id)).value;
    const newMembersTargetValue = target.team.filter((member) => member.status === 'new').reduce((acc, curr) => curr.value + acc, 0);
    return ownerTargetValue - newMembersTargetValue;
  }

  onSave(target: Target) {
    const ownerMember = target.team.find((member) => member.user.id === target.user.id);
    ownerMember.value = this.getOwnerTarget(target);
    this.update(target);
  }

  addPeriod() {
    const dialogRef = this.dialog.open(TargetNewDialogComponent, {
      width: '500px',
      disableClose: true
    });

    const component = dialogRef.componentInstance;
    component.title = 'Add New Period';

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.user && this.user !== 'my') {
          result.user = this.user;
        }
        this.create(result).subscribe(() => {
          this.fetch();
        });
      }
    });
  }
}
