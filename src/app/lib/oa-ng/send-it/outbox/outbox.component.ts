import { Component, OnInit } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { OutboxBaseComponent } from 'src/app/lib/oa/send-it/components/outbox.base.component';
import { MessageService } from 'src/app/lib/oa/send-it/services';

@Component({
  selector: 'send-it-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.css']
})
export class OutboxComponent extends OutboxBaseComponent {

  constructor(
    service: MessageService,
    uxService: UxService
  ) {
    super(service, uxService);
  }
}
