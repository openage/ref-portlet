import { Component, Input } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { OrganizationDetailBaseComponent } from 'src/app/lib/oa/send-it/components/organization-detail.base.component';
import { Template } from 'src/app/lib/oa/send-it/models';
import { OrganizationService } from 'src/app/lib/oa/send-it/services/organization.service';
import { TemplateService } from 'src/app/lib/oa/send-it/services/template.service';

@Component({
  selector: 'send-it-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.css']
})
export class SenditOrganizationDetailsComponent extends OrganizationDetailBaseComponent {
  @Input()
  code: string;

  templates: Template[] = [];

  notifications: any;

  val = true;

  constructor(
    uxService: UxService,
    orgService: OrganizationService,
    private templateService: TemplateService
  ) {
    super(uxService, orgService);
    this.afterProcessing = () => {
    };
  }

  ngOnInit() {
    this.get(this.code).subscribe(organization => {
      this.notifications = organization.notifications || {};
      this.templateService.search().subscribe((template) => {
        for (const item of template.items) {
          const str = item.code;
          if (str) {
            const splitted = str.split('|');
            if (splitted[0] === 'marketing') {

              for (const refusal of this.notifications.refusals) {
                if (refusal !== null) {
                  if (refusal.toString() === item.id.toString()) {
                    item.isSelectedEmailTemplate = false;
                  }
                }

              }
              this.templates.push(item);
            }
          }
        }
      });
    });

  }
  setTemplateValue(template, event) {
    const item = this.notifications.refusals.find(item => item === template.id);
    if (item) {
      if (event.checked === true) {
        const index = this.notifications.refusals.indexOf(item);
        this.notifications.refusals.splice(index, 1);
      }
    } else {
      if (event.checked === false) {
        this.properties.notifications.refusals.push(template.id);
      }
    }

    this.properties.notifications = this.notifications;
  }
  onSave() {
    this.save();

  }
}


