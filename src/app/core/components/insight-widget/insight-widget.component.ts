import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FieldEditorModel } from 'src/app/lib/oa/core/models';
import { OrganizationService } from 'src/app/lib/oa/directory/services';
import { ReportType } from 'src/app/lib/oa/insight/models';
import { ReportTypeService } from 'src/app/lib/oa/insight/services/report-type.service';
import { UxService, NavService } from '../../services';
import { InsightWidgetDialogComponent } from '../insight-widget-dialog/insight-widget-dialog.component';

@Component({
  selector: 'core-insight-widget',
  templateUrl: './insight-widget.component.html',
  styleUrls: ['./insight-widget.component.css']
})
export class InsightWidgetComponent implements OnInit {

  isProcessing = false;

  @Input()
  code: string;

  @Input()
  config: any = {};

  @Input()
  params = [];

  @Output()
  selected: EventEmitter<any> = new EventEmitter();

  reportTypes: ReportType[] = [];
  divs: any = [
    {
      code: 'default'
    }
  ];

  filters = [];


  constructor(
    private reportTypeService: ReportTypeService
  ) {

  }

  ngOnInit(): void {
    this.isProcessing = true;
    this.config = this.config || {};
    this.config.reportType = this.config.reportType || {};
    this.params = this.params || this.config.filters;

    this.code = this.code || this.config.reportType.code;

    this.reportTypeService.get(this.code).subscribe((t) => {
      t.container = t.container || {};
      t.container.code = 'default';
      for (let key in this.params) {
        t.filters.push(new FieldEditorModel({
          'key': key,
          'label': key,
          'value': this.params[key],
          'valueLabel': key
        }));
      }
      this.reportTypes = [t];
      this.filters = t.filters;
      this.isProcessing = false;
    });
  }
}
