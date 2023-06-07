import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { MessageComposerDialogComponent } from 'src/app/lib/oa-ng/send-it/message-composer-dialog/message-composer-dialog.component';
import { Entity, IUser } from 'src/app/lib/oa/core/models';
import { Member } from 'src/app/lib/oa/gateway/models';
// import { Conversation } from 'src/app/lib/oa/send-it/models';
// import { Aka } from 'src/app/lib/oa/discovery/models/aka.model';
import { UxService } from 'src/app/core/services';
import { HttpClient } from '@angular/common/http';
import { GenericApi, IApi, RoleService } from 'src/app/lib/oa/core/services';

@Component({
  selector: 'oa-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {

  @Input()
  modes: {
    name?: string;
    icon?: string;
    redirectTo?: string;
  }[];

  @Input()
  members: Member[] = [];

  @Input()
  entity: Entity;

  @Input()
  options: {
    phone?: string,
    copy?: {
      template: string,
      query?: any
    },
    redirect?: {
      template: string,
      content: {
        url: string
      },
      query?: any
    },
    email?: {
      template?: string,
      subject?: string,
      data?: any
      attachments?: {
        filename: string,
        url: string,
        mimeType: string
      }[]
    }
  }

  @Input()
  api: IApi<any>;

  @Input()
  url: {
    code?: string;
    addOn?: string;
  };

  showList: boolean = false;

  // aka: Aka
  defaultModes: {
    name: string;
    icon: string;
    redirectTo: string;
  }[] = [
      { name: 'Copy', icon: 'copy', redirectTo: '' },
      { name: 'Whatsapp', icon: 'whatsapp', redirectTo: 'https://api.whatsapp.com/send' },
      { name: 'Email', icon: 'email', redirectTo: '' },
      { name: 'Facebook', icon: 'fb', redirectTo: '' },
      { name: 'SMS', icon: 'sms', redirectTo: '' },
      { name: 'Slack', icon: 'slack', redirectTo: 'https://app.slack.com/client' },
      { name: 'Google Chat', icon: 'chat', redirectTo: '' },
      { name: 'MS Teams', icon: 'chat', redirectTo: '' }
    ]

  constructor(
    public dialog: MatDialog,
    public uxService: UxService,
    private auth: RoleService,
    private httpClient: HttpClient

  ) { }

  ngOnInit(): void {
    this.options = this.options || { email: {} }

    if (!this.modes || !this.modes.length) {
      this.modes = this.defaultModes
    } else {
      this.modes = (this.modes as any[]).map(m => {
        let mode = this.defaultModes.find(dm => dm.name.toLowerCase() === m)
        if (mode) { return m = mode }
      })
    }

    if (!this.api) {
      if (!this.url) {
        this.url = {
          code: 'discovery',
          addOn: 'akas'
        }
      }
      this.api = new GenericApi(this.httpClient, this.url.code, {
        collection: this.url.addOn,
        auth: this.auth,
        errorHandler: this.uxService
      });
    }
  }

  onSelect(mode) {
    switch (mode.name.toLowerCase()) {
      case 'email':
        this.sendEmail()
        break;
      case 'copy':
        this.createAka(this.options.copy, mode)
        break;
      case 'slack':
      case 'whatsapp':
        this.createAka(this.options.redirect, mode)
        break;
      default:
        break;
    }
  }

  sendEmail() {
    // const dialogRef = this.dialog.open(MessageComposerDialogComponent, {
    //   width: '800px'
    // });
    // dialogRef.componentInstance.to = this.members && this.members.length ? this.members.map((member) => member.user.email) : [];
    // dialogRef.componentInstance.conversation = this.entity ? new Conversation({ entity: this.entity }) : null;
    // dialogRef.componentInstance.modes = { sms: false, email: true, push: false, chat: false };

    // dialogRef.componentInstance.attachments = this.options.email.attachments || []
    // dialogRef.componentInstance.message.subject = this.options.email.subject
    // dialogRef.componentInstance.template = this.options.email.template;
    // dialogRef.componentInstance.data = this.options.email.data

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result && result.id) {
    //     this.uxService.showInfo('Message Sent')
    //   }
    // });
  }

  createAka(model, mode) {
    this.api.create(model).subscribe(data => {
      if (!data) {
        this.uxService.showInfo('Copy Failed')
        return;
      }

      navigator.clipboard.writeText(data.url);
      this.uxService.showInfo('Link Copied')
      if (!mode.redirectTo) { return }

      setTimeout(() => {
        let url = this.getRedirectionUrl(mode, data)
        window.open(url, '_blank')
      }, 700)
    })
  }

  getRedirectionUrl(mode, data: any) {
    let redirectUrl = mode.redirectTo
    let query

    switch (mode.name.toLowerCase()) {
      case 'whatsapp':
        query = `?text=${data.url}`
        if (this.options.phone) {
          query = `${query}&phone=+91 ${this.options.phone}`
        }
        break;
      default:
        break;
    }

    return query ? redirectUrl + query : redirectUrl
  }
}
