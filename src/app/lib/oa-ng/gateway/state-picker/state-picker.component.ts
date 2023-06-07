import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavService } from 'src/app/core/services';
import { WidgetDataService } from 'src/app/lib/oa/core/services';
// import { NavService } from 'src/app/core/services';
import { State } from 'src/app/lib/oa/gateway/models/state.model';
import { Workflow } from 'src/app/lib/oa/gateway/models/workflow.model';
import { WorkflowsService } from 'src/app/lib/oa/gateway/services/workflows.service';

@Component({
  selector: 'gateway-state-picker',
  templateUrl: './state-picker.component.html',
  styleUrls: ['./state-picker.component.css']
})
export class StatePickerComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  view: 'toggler' | 'picker' = 'picker';

  @Input()
  all = true;

  @Input()
  workflow: string | Workflow;

  @Input()
  value: string | State;

  @Input()
  currentStatus: State;

  @Input()
  readonly = false;

  @Input()
  required = false;

  @Output()
  changed: EventEmitter<State> = new EventEmitter();

  @Input()
  options: {
    showCanceled?: boolean
  } = {};

  @Input()
  statCode: string;

  @Input()
  statOptions: any = {};

  statData: any = {};

  items: State[] = [];
  valueCode: any = '';

  routeSubscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private navService: NavService,
    private service: WorkflowsService,
    private statService: WidgetDataService
  ) {
    this.value = this.route.snapshot.queryParams.status;
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.workflow && this.workflow) {
      this.setWorkflow();
    }

    if (changes.value && changes.value.previousValue !== this.value) {
      this.setValue();
    }

    if (changes.statCode && changes.statCode.previousValue !== this.statCode) {
      this.getStatData();
    }
  }

  setWorkflow() {
    const code = typeof this.workflow === 'string' ? this.workflow : this.workflow.code;

    this.service.get(code).subscribe((w) => {
      this.items = w.states.map((s) => new State(s));

      if (!this.options.showCanceled) {
        this.items = this.items.filter((s) => !s.isCancelled);
      }
      if (this.currentStatus && this.currentStatus.code) {
        const index = this.items.findIndex((item) => item.code === this.currentStatus.code);
        this.items = this.items.splice(0, index);
      }
      if (this.value) {
        this.setValue();
      }
    });
  }

  setValue() {
    if (this.value) {
      if (this.value instanceof State) {
        const value = this.value as State;
        this.value = this.items.find((i) => i.code === value.code);
      } else {
        this.value = this.items.find((i) => i.code === this.value);
      }
      if (this.value) {
        this.onSelect(this.value);
      }
    } else {
      this.onSelect(null);
    }
  }

  onSelect($event: State): void {
    this.value = $event;
    this.valueCode = this.value ? this.value.code : null;
    this.navService.changeQueryParams({ status: this.valueCode }, this.route);
    this.changed.emit(this.value);
    if (!this.valueCode) {
      this.valueCode = '';
    }
  }

  onStateSelect($event: State): void {
    this.valueCode = $event ? $event.code : null;
    this.changed.emit($event);
  }

  getStatData(): void {
    this.statService.data(this.statCode, this.statOptions).subscribe((page) => {
      if (page.items && page.items.length) {
        this.statData = page.items[0];
      }
    });
  }

  ngOnDestroy(): void {
    if (!!this.routeSubscription) { this.routeSubscription.unsubscribe(); }
  }

}
