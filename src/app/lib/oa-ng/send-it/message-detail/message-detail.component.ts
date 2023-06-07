import { Component } from '@angular/core';
import { MessageDetailBaseComponent } from 'src/app/lib/oa/send-it/components/message-detail.base.component';
import { NavService } from 'src/app/core/services/nav.service';
import { UxService } from 'src/app/core/services/ux.service';
import { MessageService } from 'src/app/lib/oa/send-it/services/message.service';

@Component({
  selector: 'send-it-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.css'],
})
export class MessageDetailComponent extends MessageDetailBaseComponent {
  constructor(
    api: MessageService,
    uxService: UxService,
    private navService: NavService
  ) {
    super(api, uxService);
  }
  onClick() {
    this.navService.back();
  }
  injectBody(elementId, body) {
    const el = document.getElementById(elementId);
    el.innerHTML = body;
  }
}
