import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReportType } from 'src/app/lib/oa/insight/models';
import { ReportTypeService } from 'src/app/lib/oa/insight/services/report-type.service';

@Component({
  selector: 'insight-report-type-picker',
  templateUrl: './report-type-picker.component.html',
  styleUrls: ['./report-type-picker.component.css']
})
export class ReportTypePickerComponent implements OnInit {

  @Input()
  readonly = false;

  @Input()
  value: ReportType;

  @Input()
  paramField = 'name';

  @Input()
  placeholder: string;

  @Output()
  changed: EventEmitter<ReportType> = new EventEmitter();

  constructor(public api: ReportTypeService) { }

  ngOnInit() {
    if (!this.value) { this.value = new ReportType(); }
  }

  onSelect($event: any) {
    this.value = $event;
    this.changed.emit(this.value);
    if (!this.value) { this.value = new ReportType(); }
  }

}
