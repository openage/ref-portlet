import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Plan } from 'src/app/lib/oa/bap/models/plan.model';
import { PlanService } from 'src/app/lib/oa/bap/services/plan.service';

@Component({
  selector: 'bap-plan-picker',
  templateUrl: './plan-picker.component.html',
  styleUrls: ['./plan-picker.component.css']
})
export class PlanPickerComponent implements OnInit {

  @Input()
  value: Plan;

  @Input()
  placeholder: string;

  @Input()
  view: 'picker' | 'selector' = 'picker';

  @Input()
  label = 'Plan';

  @Input()
  usercode: string;

  @Input()
  reset = false;

  @Input()
  readonly = false;

  @Input()
  required = false;

  @Output()
  changed: EventEmitter<Plan> = new EventEmitter();

  @ViewChild('userInput')
  userInput: ElementRef<HTMLInputElement>;

  @ViewChild('planPicker')
  matAutocomplete: MatAutocomplete;

  control = new UntypedFormControl();

  isEditing = false;

  items: Plan[];

  constructor(
    public api: PlanService
  ) { }

  ngOnInit() {
    this.api.search().subscribe((page) => {
      if (!!page) {
        this.items = page.items.filter((item) => item.code !== 'default').map((item) => new Plan(item));
      }
    });
    if (!this.value) { this.value = new Plan(); }
  }

  ngOnChanges() {
    if (this.usercode === 'my') {
      this.readonly = true;
      this.required = false;
    }
    if (this.reset) {
      this.value = null;
    }
  }

  onSelect($event: any) {
    this.value = $event;
    this.changed.emit(this.value);
    if (!this.value) { this.value = new Plan(); }
  }

}
