import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime, switchMap } from 'rxjs/operators';
import { UxService } from 'src/app/core/services';
import { TenantAgentBaseComponent } from 'src/app/lib/oa/directory/components/tenant-agent-base.component';
import { Role } from 'src/app/lib/oa/directory/models';
import { DirectoryRoleService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'app-agent-picker-dialog',
  templateUrl: './agent-picker-dialog.component.html',
  styleUrls: ['./agent-picker-dialog.component.css']
})
export class AgentPickerDialogComponent extends TenantAgentBaseComponent {

  @Input()
  title: string;

  @Input()
  placeholder: string;

  @Input()
  label: string;

  @Input()
  required = false;

  @ViewChild('userInput')
  userInput: ElementRef<HTMLInputElement>;

  @ViewChild('rolePicker')
  matAutocomplete: MatAutocomplete;

  control = new UntypedFormControl();

  constructor(
    public dialogRef: MatDialogRef<AgentPickerDialogComponent>,
    uxService: UxService,
    api: DirectoryRoleService
  ) {
    super(api, uxService);
    this.control.valueChanges.pipe(
      debounceTime(300),
      switchMap((value) => {
        this.name = value;
        return value;
      })
    ).subscribe(() => {
      this.search();
    });

  }

  displayRole(role?: Role): string | undefined {
    if (!role) {
      return '';
    }

    if (typeof role === 'string') {
      return role;
    }

    if (!role.profile || !role.profile.firstName || !role.profile.lastName) {
      return role.code;
    }

    return `${role.profile.firstName} ${role.profile.lastName}`;
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    this.role = event.option.value;

    this.selected.emit(this.role);

    this.userInput.nativeElement.value = this.displayRole(this.role);
    this.control.setValue(this.role);
  }

  onSubmit() {
    this.dialogRef.close(this.role);
  }

}
