import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, Input } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewMessageBaseComponent } from 'src/app/lib/oa/send-it/components/new-message.base.component';
import { User } from 'src/app/lib/oa/send-it/models';
import { MessageService, TemplateService } from 'src/app/lib/oa/send-it/services';
import { DirectoryRoleService } from 'src/app/lib/oa/directory/services';
import { UxService } from 'src/app/core/services/ux.service';
import { ConversationService } from 'src/app/lib/oa/send-it/services/conversation.service';

@Component({
  selector: 'send-it-message-composer-dialog',
  templateUrl: './message-composer-dialog.component.html',
  styleUrls: ['./message-composer-dialog.component.css']
})
export class MessageComposerDialogComponent extends NewMessageBaseComponent {

  @Input()
  hideButton: boolean;

  @Input()
  showAttahcments: boolean = false;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur = true;
  isEditing = false;
  filteredUsers: User[];

  showUsersSelection = false;
  customerUserSelector = false;
  internalUserSelector = false;

  optionUsers: any[] = [];

  constructor(
    conversationService: ConversationService,
    service: MessageService,
    private uxService: UxService,
    private templateService: TemplateService,
    private roleService: DirectoryRoleService,
    public dialogRef: MatDialogRef<MessageComposerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(conversationService, service);
    this.afterProcessing = () => {
      this.closeDialog();
    };
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.template) { this.getTemplate(); }
  }

  getTemplate() {
    this.templateService.get(this.template).subscribe(data => {
      if (data && data.body) {
        this.message.body = data.body;
        this.message.subject = data.subject;
      }
    })
  }

  closeDialog() {
    this.dialogRef.close(this.message);
  }

  validateEmail(event): any {
    if (!event.value) {
      return;
    }
    if (!this.message.to) { this.message.to = []; }

    const input = event.input;
    let value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      value = value.trim();

      const model: any = {};

      // eslint-disable-next-line max-len
      if (value.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|glass|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i)) {
        model.email = value;
        // Reset the input value
        if (input) { input.value = ''; }
        return model;
      } else if (value.match(/^\d{10}$/)) {
        model.phone = value;
        // Reset the input value
        if (input) { input.value = ''; }
        return model;

      } else if (value.match(/^(\+\d{1,3}[- ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)) {
        model.phone = value;
        // Reset the input value
        if (input) { input.value = ''; }
        return model;

      } else if (value.match(/^(\+\d{1,3}[- ]?)?\(?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/)) {
        model.phone = value;
        // Reset the input value
        if (input) { input.value = ''; }
        return model;

      } else {
        this.uxService.handleError('should be email');
      }

    }
  }

  addToMail(userData, typeOfUser?) {
    this.isProcessing = true
    const model = {
      profile: userData.profile,
      email: userData.email,
      role: {
        id: userData.id
      }
    };
    const user = new User(model);
    if (!this.toExists(user)) {
      if (typeOfUser === 'customer') {
        this.customerUserSelector = false;
        this.toCustomers.push(user);
      }
      if (typeOfUser === 'internal') {
        this.internalUserSelector = false;
        this.toInternal.push(user);
      }
      this.showUsersSelection = false;
      this.message.to.push({ user });
    }
    this.optionUsers = [];
    this.isProcessing = false
  }

  addTo(event: MatChipInputEvent, options?: any): void {
    if (!event.value) { this.isProcessing = false; return; }
    this.isProcessing = true;
    const model = this.validateEmail(event);
    const payload = {};
    if (model && model.email) {
      payload['email'] = model.email;
    }

    if (options && options.params) {
      for (const key in options?.params) {
        if (key) {
          payload[key] = options?.params[key];
        }
      }
    }
    this.roleService.search(payload).subscribe((data) => {
      if (data.items.length) {
        if (data.items.length > 1) {
          if (options.typeOfUser === 'customer') {
            this.customerUserSelector = true;
          } else if (options.typeOfUser === 'internal') {
            this.internalUserSelector = true;
          } else { this.showUsersSelection = true }

          this.optionUsers = [];
          data.items.forEach((user) => {
            this.optionUsers.push(user);
          });
          this.isProcessing = false
        } else {
          data.items.forEach((user) => {
            this.addToMail(user, options?.typeOfUser);
          });
        }
      } else {
        this.addToMail({ email: model.email }, options?.typeOfUser);
      }
    }, (err) => {
      this.addToMail({ email: model.email }, options?.typeOfUser);
    });
  }

  userClicked(user) {
    this.message.to.forEach((item) => {
      item === user ? (item as any).isSelected = !(item as any).isSelected : (item as any).isSelected = false;
    });
  }

  removeAttachment(i) {
    this.message.attachments.splice(i, 1);
  }

  openAttachment(attachment) {
    window.open(`${attachment.url}`, '_blank');
  }
}
