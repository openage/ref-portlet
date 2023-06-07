import { Component, ErrorHandler, EventEmitter, OnInit, Output } from '@angular/core';
import { TagTypesListBaseComponent } from 'src/app/lib/oa/insight/components/tag-types-list.base.component';
import { TagTypeService } from 'src/app/lib/oa/insight/services/tag-type.service';

@Component({
  selector: 'insight-tag-types-selector',
  templateUrl: './tag-types-selector.component.html',
  styleUrls: ['./tag-types-selector.component.css']
})

export class TagTypesSelectorComponent extends TagTypesListBaseComponent {

  @Output()
  changed: EventEmitter<string> = new EventEmitter();

  constructor(
    api: TagTypeService,
    errorHandler: ErrorHandler
  ) {
    super(api, errorHandler);
  }

  onSelect(item) {
    if (item && item.code) {
      this.changed.emit(item.code);
    }
  }

}
