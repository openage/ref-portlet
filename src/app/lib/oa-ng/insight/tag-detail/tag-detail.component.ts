import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { TagDetailsBaseComponent } from 'src/app/lib/oa/insight/components/tag-details.base.component';
import { TagService } from 'src/app/lib/oa/insight/services/tag.service';

@Component({
  selector: 'insight-tag-detail',
  templateUrl: './tag-detail.component.html',
  styleUrls: ['./tag-detail.component.css']
})

export class TagDetailComponent extends TagDetailsBaseComponent {

  @Output()
  showSelecter: EventEmitter<boolean> = new EventEmitter();

  @Input()
  addTag = false;

  constructor(
    api: TagService,
    uxService: UxService
  ) {
    super(api, uxService);
  }

}
