import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { NewMessageBaseComponent } from 'src/app/lib/oa/send-it/components/new-message.base.component';
import { User } from 'src/app/lib/oa/send-it/models';
import { MessageService } from 'src/app/lib/oa/send-it/services';
import { UxService } from 'src/app/core/services/ux.service';
import { ConversationService } from 'src/app/lib/oa/send-it/services/conversation.service';

@Component({
  selector: 'send-it-message-composer',
  templateUrl: './message-composer.component.html',
  styleUrls: ['./message-composer.component.css']
})
export class MessageComposerComponent extends NewMessageBaseComponent {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur = true;
  isEditing = false;

  filteredUsers: User[];

  constructor(
    conversationService: ConversationService,
    service: MessageService,
    private uxService: UxService
  ) {
    super(conversationService, service);
  }

  addTo(event: MatChipInputEvent): void {

    if (!this.message.to) {
      this.message.to = [];
    }

    const input = event.input;
    let value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      value = value.trim();

      const model: any = {
      };

      // eslint-disable-next-line max-len
      if (value.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|glass|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i)) {
        model.email = value;
      } else if (value.match(/^\d{10}$/)) {
        model.phone = value;
      } else if (value.match(/^(\+\d{1,3}[- ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)) {
        model.phone = value;
      } else if (value.match(/^(\+\d{1,3}[- ]?)?\(?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/)) {
        model.phone = value;
      } else {
        return this.uxService.handleError('should be mobile or email');
      }

      const user = new User(model);
      if (!this.toExists(user)) {
        this.message.to.push({ user });
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  toExists(user: User) {
    return this.message.to.find((to) => {
      if (user.id) {
        return to.user.id === user.id;
      }

      if (user.role && user.role.id) {
        return to.user.role.id === user.role.id;
      }

      if (user.email) {
        return to.user.email === user.email;
      }

      if (user.phone) {
        return to.user.phone === user.phone;
      }
    });
  }

  removeTo(user: User) {
    this.isProcessing = true;
    this.message.to = this.message.to.filter((to) => {
      if (user.id) {
        return to.user.id !== user.id;
      }

      if (user.role && user.role.id) {
        return to.user.role.id !== user.role.id;
      }

      if (user.email) {
        return to.user.email !== user.email;
      }

      if (user.phone) {
        return to.user.phone !== user.phone;
      }
    });
  }
}
