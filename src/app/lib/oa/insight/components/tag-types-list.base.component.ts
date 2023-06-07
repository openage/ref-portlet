import { ErrorHandler, Input, OnChanges, OnInit, Directive } from '@angular/core';
import { PagerModel } from 'src/app/lib/oa/core/structures';
import { TagType } from '../models/tag-type.model';
import { TagTypeService } from '../services/tag-type.service';

@Directive()
export class TagTypesListBaseComponent extends PagerModel<TagType> implements OnInit, OnChanges {

  @Input()
  view: 'table' | 'list' | 'grid' = 'table';

  @Input()
  type: string;

  constructor(
    api: TagTypeService,
    errorHandler: ErrorHandler
  ) {
    super({
      api,
      errorHandler,
      filters: ['entity-type']
    });
  }
  ngOnInit(): void {
    this.refresh();
  }

  ngOnChanges(): void {
    // this.refresh();
  }

  refresh() {
    if (this.type) {
      this.filters.properties['entity-type'].value = this.type;
    }
    this.fetch().subscribe();
  }

}
