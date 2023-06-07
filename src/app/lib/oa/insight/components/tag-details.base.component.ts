import { ErrorHandler, Input, OnChanges, OnInit, Directive } from '@angular/core';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { Entity } from '../../core/models';
import { Tag } from '../models/tag.model';
import { TagService } from '../services/tag.service';

@Directive()
export class TagDetailsBaseComponent extends DetailBase<Tag> implements OnInit, OnChanges {
  @Input()
  view: 'chips' = 'chips';

  @Input()
  code: string;

  @Input()
  entity: Entity;

  @Input()
  readonly: boolean;

  constructor(
    api: TagService,
    errorHandler: ErrorHandler
  ) {
    super({
      api,
      errorHandler
    });
  }
  ngOnInit(): void {
    if (this.code) {
      this.get(this.code);
    } else if (this.entity && this.entity.id && this.entity.type) {
      this.get(`${this.entity.type}:${this.entity.id}`);
    }
  }

  ngOnChanges(): void {
    // this.refresh();
  }

  removeValue(index) {
    this.properties.values.splice(index, 1);
    this.save();
  }

}
