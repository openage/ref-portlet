import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { TemplateDetailBaseComponent } from 'src/app/lib/oa/send-it/components/template-detail.base.component';
import { TemplateConfig } from 'src/app/lib/oa/send-it/models';
import { TemplateService } from 'src/app/lib/oa/send-it/services/template.service';
import { TemplateUploaderComponent } from '../template-uploader/template-uploader.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'oa-send-it-template-details',
  templateUrl: './template-details.component.html',
  styleUrls: ['./template-details.component.css']
})
export class TemplateDetailsComponent extends TemplateDetailBaseComponent {

  @Input()
  readonly = false;

  modes: any[] = [];
  status = true;
  selectedMode: any = {};
  none = true;

  constructor(
    api: TemplateService,
    private uxService: UxService,
    public dialog: MatDialog,
    public sanitizer: DomSanitizer
  ) {
    super(api, uxService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.modes = [
      { key: 'email', value: false }, { key: 'sms', value: false },
      { key: 'push', value: false }, { key: 'none', value: this.none }
    ];
    this.selectedMode = this.modes.find((mode) => mode.key === 'none');
  }

  onSaveBody($event) {
    this.properties.body = $event;
  }

  setDataSource($event) {
    this.properties.dataSource = { ...$event };
  }

  onChange($event) {
    this.properties.config = this.properties.config || new TemplateConfig({ modes: {} });
    this.properties.config.modes = this.properties.config.modes || {
      email: false,
      sms: false,
      push: false
    };

    switch ($event.value.key) {
      case 'email':
        this.properties.config.modes.email = true;
        this.properties.config.modes.sms = false;
        this.properties.config.modes.push = false;
        this.none = false;
        break;
      case 'sms':
        this.properties.config.modes.email = false;
        this.properties.config.modes.sms = true;
        this.properties.config.modes.push = false;
        this.none = false;
        break;
      case 'push':
        this.properties.config.modes.email = false;
        this.properties.config.modes.sms = false;
        this.properties.config.modes.push = true;
        this.none = false;
        break;
      case 'none':
        this.properties.config.modes.email = false;
        this.properties.config.modes.sms = false;
        this.properties.config.modes.push = false;
        this.none = true;
        break;
    }

  }

  setStatusValue($event) {
    this.properties.status = $event.checked === true ? 'active' : 'inactive';
  }

  getValue(config) {
    if (config && config.modes) {
      if (config.modes.email) {
        this.selectedMode = this.modes.find((mode) => mode.key === 'email');
      }
      if (config.modes.sms) {
        this.selectedMode = this.modes.find((mode) => mode.key === 'sms');
      }
      if (config.modes.push) {
        this.selectedMode = this.modes.find((mode) => mode.key === 'push');
      }
    }
    return this.selectedMode;
  }

  validate() {
    const errors = [];
    if (!this.properties.code) {
      errors.push('Code is required');
    }
    if (!this.properties.name) {
      errors.push('Name is required');
    }
    if (!this.properties.body) {
      errors.push('Body is required');
    }
    return errors;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TemplateUploaderComponent, {
      width: '550px',
    });
    dialogRef.componentInstance.path = `${this.properties.code}/dataSource`;

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  onFromChange($event) {
    this.properties.from.email = $event.target.value ? $event.target.value : null;
  }

  onToChange($event) {
    this.properties.config = this.properties.config || new TemplateConfig({ to: {} });
    let to: any = { field: null };
    if ($event.target.value) {
      to.field = $event.target.value;
    } else {
      to = {};
    }
    this.properties.config.to = { ...to };
  }
}
