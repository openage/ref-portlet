import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { BillingEntity } from 'src/app/lib/oa/bap/models/billing-entity.model';
import { BillingEntityService } from 'src/app/lib/oa/bap/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { DetailBase } from 'src/app/lib/oa/core/structures';
@Component({
  selector: 'bap-billing-entity-details',
  templateUrl: './billing-entity-details.component.html',
  styleUrls: ['./billing-entity-details.component.css']
})
export class BillingEntityDetailsComponent extends DetailBase<BillingEntity> implements OnInit {

  @Input()
  view = 'detail';

  @Output()
  changed: EventEmitter<any> = new EventEmitter();

  constructor(
    api: BillingEntityService,
    public auth: RoleService,
    uxService: UxService
  ) {
    super({ api, errorHandler: uxService });
  }

  ngOnInit() {
    if (this.code) {
      this.get(this.code).subscribe((item) => {
        this.set(new BillingEntity(item));
      });
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hasOwnProperty('code')) {
      this.ngOnInit();
    }
  }
  onChange($event) {
    this.changed.emit($event);
  }

}
