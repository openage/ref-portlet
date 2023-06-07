import { ErrorHandler, Input, OnChanges, OnInit, Directive } from '@angular/core';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { Message } from '../models';
import { MessageService } from '../services';

@Directive()
export class MessageDetailBaseComponent extends DetailBase<Message> implements OnChanges {

  @Input()
  code: string;
  constructor(
    api: MessageService,
    errorHandler: ErrorHandler
  ) {
    super({ api, errorHandler });
  }

  ngOnChanges(): void {
    this.get(this.code);
  }
}
