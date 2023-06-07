import { EventEmitter, OnChanges, OnInit, Output, Directive, Input } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { PagerBaseComponent } from 'src/app/lib/oa/core/structures';
import { Template } from '../models/template.model';
import { TemplateService } from '../services/template.service';

@Directive()
export class TemplateListBaseComponent extends PagerBaseComponent<Template> implements OnInit, OnChanges {

  @Input()
  columns: string[] = ['name', 'code', 'action', 'view'];

  constructor(
    api: TemplateService,
    errorHandler: UxService,
    private uxService: UxService
  ) {
    super({
      api,
      errorHandler,
      pageOptions: {
        limit: 10
      },
      filters: ['status', 'code', 'name']
    });
  }

  ngOnInit() {
    this.refresh();
  }

  ngOnChanges() {
    this.refresh();
  }

  refresh() {
    this.fetch();
  }

  onRemove(item): void {
    this.uxService.onConfirm().subscribe(() => {
      this.remove(item);
      this.fetch().subscribe(() => {
        this.uxService.showInfo('Deleted');
      });
    });
  }

}
