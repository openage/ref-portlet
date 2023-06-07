import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TargetType } from 'src/app/lib/oa/insight/models';
import { TargetTypeService } from 'src/app/lib/oa/insight/services/target-type.service';

@Component({
  selector: 'insight-target-type-picker',
  templateUrl: './target-type-picker.component.html',
  styleUrls: ['./target-type-picker.component.css']
})
export class TargetTypePickerComponent implements OnInit, OnChanges {

  @Input()
  view = 'picker';

  @Input()
  placeholder = 'Select Target Type';

  @Input()
  readonly = false;

  @Input()
  value: TargetType;

  @Input()
  options: {
    show?: {
      icon?: boolean
    }
  };

  @Output()
  changed: EventEmitter<any> = new EventEmitter();

  @ViewChild('outlet', { read: ViewContainerRef })
  outletRef: ViewContainerRef;
  @ViewChild('content', { read: TemplateRef })
  contentRef: TemplateRef<any>;

  isProcessing = false;
  items: TargetType[] = [];

  constructor(
    public api: TargetTypeService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.rerender();
  }

  ngOnInit() {
    this.options = this.options || {};
    this.options.show = this.options.show || {};
  }

  rerender() {
    this.outletRef.clear();
    this.outletRef.createEmbeddedView(this.contentRef);
  }

  onSelect($event: any) {
    if ($event) {
      this.value = $event;
      this.changed.emit(this.value);
    } else {
      this.changed.emit(null);
    }
  }

}
