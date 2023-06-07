import { ErrorHandler, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, Directive } from '@angular/core';
import { UxService } from 'src/app/core/services/ux.service';
import { PagerBaseComponent } from '../../core/structures';
import { BillingEntity } from '../models/billing-entity.model';
import { Organization } from '../models/organization.model';
import { BillingEntityService } from '../services';

@Directive()
export class BillingEntityListBaseComponent extends PagerBaseComponent<BillingEntity> implements OnInit, OnChanges {

  @Input() code: string;

  @Input() status: string;

  @Input() name: string;

  @Input() organization: Organization | string;

  @Input() selectedEntity: BillingEntity;

  @Output()
  onEdit: EventEmitter<BillingEntity> = new EventEmitter<BillingEntity>();

  @Input() columns: string[] = ['name', 'code', 'nav', 'gst', 'address', 'correspondenceAddress', 'banks', 'status', 'action'];

  constructor(
    api: BillingEntityService,
    errorHandler: ErrorHandler,
    public uxService: UxService
  ) {
    super({
      api,
      errorHandler,
      pageOptions: {
        limit: 10
      },
      filters: ['organization-code', 'name', 'status', 'code']
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedEntity) {
      if (changes.selectedEntity.currentValue && changes.selectedEntity.previousValue
        && changes.selectedEntity.currentValue.code &&
        changes.selectedEntity.currentValue.code
        === changes.selectedEntity.previousValue.code) {
        return;
      }
    }
    this.filters.reset(false);
    this.search();
  }

  search(): void {
    if (this.status) {
      this.filters.set('status', this.status);
    }

    if (this.name) {
      this.filters.set('name', this.name);
    }

    if (this.code) {
      this.filters.set('code', this.code);
    }

    if (this.organization) {
      this.filters.set('organization-code', typeof this.organization === 'string' ? this.organization : this.organization.code);
    }

    this.fetch();
  }

  removeEntity(entity: BillingEntity) {
    this.remove(entity).subscribe(() => {
      this.uxService.showInfo('Billing Entity Removed')
    })
  }

  onSelect(code: string) {
    this.selectedEntity = new BillingEntity(this.items.find((item) => item.code === code));
    this.selected.emit(this.selectedEntity);
  }

  refresh() {
    this.search();
  }

}
