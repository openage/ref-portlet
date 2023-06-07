import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BillingEntityService } from 'src/app/lib/oa/bap/services';

@Component({
  selector: 'bap-billing-entity-gst-editor',
  templateUrl: './billing-entity-gst-editor.component.html',
  styleUrls: ['./billing-entity-gst-editor.component.css']
})
export class BillingEntityGstEditorComponent implements OnInit {

  @Input()
  view: 'old' | 'new' = 'old'

  @Input()
  required = false;

  @Input()
  readonly = false;

  @Input()
  value: string;

  @Output()
  valueChange: EventEmitter<string> = new EventEmitter();

  @Output()
  errored: EventEmitter<any> = new EventEmitter();

  constructor(
    private entityService: BillingEntityService
  ) { }

  ngOnInit() {
  }

  error($event) {
    this.errored.emit($event);
  }

  checkGst = (gst: string): Observable<any> => {
    const subject = new Subject<any>();
    this.entityService.get(gst).subscribe({
      next: (entity) => {
        if (entity && entity.id) {
          subject.next('GST_EXISTS');
        } else {
          subject.next(null);
        }
      },
      error: (err) => {
        if (err.message === 'RESOURCE_NOT_FOUND') {
          subject.next(null);
        }
      }
    });

    return subject.asObservable();
  }

  onGSTChange($event) {
    this.value = $event;
    this.valueChange.emit(this.value);
  }

}
