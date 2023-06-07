import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericApi, IApi, RoleService } from 'src/app/lib/oa/core/services';
import { UxService } from './ux.service';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  akas: IApi<any>;

  constructor(
    private uxService: UxService,
    private httpClient: HttpClient,
    private auth: RoleService
  ) {
    this.akas = new GenericApi(this.httpClient, 'discovery', {
      collection: 'akas',
      auth: this.auth,
      errorHandler: this.uxService
    });
  }


  email(config) {
    // const dialogRef = this.dialog.open(MessageComposerDialogComponent, {
    //   width: '800px'
    // });
    // dialogRef.componentInstance.to = config.to?.length ? config.to.map((to) => to.user.email) : [];
    // dialogRef.componentInstance.conversation = config.entity ? { entity: config.entity } : null;
    // dialogRef.componentInstance.modes = { sms: false, email: true, push: false, chat: false };

    // dialogRef.componentInstance.attachments = config.attachments || []
    // dialogRef.componentInstance.message.subject = config.subject
    // dialogRef.componentInstance.template = config.template;
    // dialogRef.componentInstance.data = config.data

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result && result.id) {
    //     this.uxService.showInfo('Message Sent')
    //   }
    // });
  }

  chat(config) {
    this.createAka(config)
  }

  copy(config) {
    this.createAka(config)
  }

  sms(config) {
    this.createAka(config)
  }

  private createAka(config) {
    this.akas.create(config.aka).subscribe(data => {
      if (!data) {
        this.uxService.showError('Could not genereate sharable link')
        return;
      }

      let url = data.url

      if (!config.url) {
        navigator.clipboard.writeText(url);
        this.uxService.showInfo('Link Copied')

      } else {
        setTimeout(() => {
          let redirectUrl = this.getRedirectionUrl(config, url)
          window.open(redirectUrl, '_blank')
        }, 700)
      }
    })
  }

  private getRedirectionUrl(config, text) {
    let redirectUrl = config.url
    let query

    switch (config.provider) {
      case 'whatsapp':
        query = `?text=${text}`
        if (config.phone) {

          if (!''.startsWith('+')) {
            config.phone = `+91${config.phone}`
          }
          query = `${query}&phone=${config.phone}`
        }
        break;
      default:
        break;
    }

    return query ? redirectUrl + query : redirectUrl
  }
}
