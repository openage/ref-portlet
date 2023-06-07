import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';

import { SendItModule } from 'src/app/lib/oa/send-it/send-it.module';
import { OaSharedModule } from 'src/app/lib/oa-ng/shared/oa-shared.module';
import { ConversationDetailComponent } from './conversation-detail/conversation-detail.component';
import { InboxComponent } from './inbox/inbox.component';
import { MessageComposerDialogComponent } from './message-composer-dialog/message-composer-dialog.component';
import { MessageComposerComponent } from './message-composer/message-composer.component';
import { MessageDetailComponent } from './message-detail/message-detail.component';
import { NewMessageComponent } from './new-message/new-message.component';
import { NewNotificationComponent } from './new-notification/new-notification.component';
import { NoteEditorComponent } from './note-editor/note-editor.component';
import { NoteListComponent } from './note-list/note-list.component';
import { NotificationDetailComponent } from './notification-detail/notification-detail.component';
import { OutboxComponent } from './outbox/outbox.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { TemplateDetailsComponent } from './template-details/template-details.component';
import { TemplateUploaderComponent } from './template-uploader/template-uploader.component';
import { SenditOrganizationDetailsComponent } from './organization-details/organization-details.component';
import { TemplatesSubscriptionComponent } from './templates-subscription/templates-subscription.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { DesktopNotificationComponent } from './desktop-notification/desktop-notification.component';
import { SendItMessageButtonComponent } from './send-it-message-button/send-it-message-button.component';

const components = [
  InboxComponent,
  OutboxComponent,
  ConversationDetailComponent,
  MessageDetailComponent,
  MessageComposerComponent,
  NewNotificationComponent,
  NewMessageComponent,
  NoteListComponent,
  NoteEditorComponent,
  NotificationDetailComponent,
  MessageComposerDialogComponent,
  TemplateListComponent,
  TemplateDetailsComponent,
  TemplateUploaderComponent,
  SenditOrganizationDetailsComponent,
  TemplatesSubscriptionComponent,
  ChatBoxComponent,
  DesktopNotificationComponent,
  SendItMessageButtonComponent
];
const thirdPartyModules = [
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatMenuModule,
  MatInputModule,
  MatListModule,
  MatExpansionModule,
  MatCheckboxModule,
  MatOptionModule,
  MatGridListModule,
  MatSelectModule,
  MatDialogModule,
  MatTableModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatChipsModule
];
const services = [];
const guards = [];
const pipes = [];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SendItModule,
    OaSharedModule,
    ...thirdPartyModules,
  ],
  declarations: [...components, ...pipes],
  exports: [...components, ...pipes],
  providers: [...services, ...guards]
})
export class OaSendItModule { }
