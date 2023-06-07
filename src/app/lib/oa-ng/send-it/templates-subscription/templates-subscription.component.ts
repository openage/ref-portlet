import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UxService } from 'src/app/core/services';
import { TemplateListBaseComponent } from 'src/app/lib/oa/send-it/components/template-list.base.component';
import { Template } from 'src/app/lib/oa/send-it/models';
import { TemplateService } from 'src/app/lib/oa/send-it/services';

@Component({
  selector: 'oa-send-it-templates-subscription',
  templateUrl: './templates-subscription.component.html',
  styleUrls: ['./templates-subscription.component.css']
})
export class TemplatesSubscriptionComponent extends TemplateListBaseComponent {

  @Input()
  templates: Template[] = [];

  @Output()
  change: EventEmitter<Template[]> = new EventEmitter();

  selectedTemplate: Template[] = [];

  templateTypes = ['marketing', 'enquiry', 'tracking', 'miscellaneous'];
  marketingArray: Template[] = [];
  enquiryArray: Template[] = [];
  trackingArray: Template[] = [];
  miscellaneousArray: Template[] = [];

  constructor(
    api: TemplateService,
    private uxService: UxService,
  ) {
    super(api, uxService);
    this.afterProcessing = () => {
      if (this.view === 'table') {
        this.setSelectedTemplate();
      } else {
        this.mapTemplates()
      }
    };
  }

  setSelectedTemplate() {
    const refusals = this.templates.filter((t) => t.category === this.category);
    refusals.forEach((ref) => {
      for (const item of this.items) {
        if (item.code === ref.code) {
          item.isSelected = true;
          break;
        }
      }
    });
    this.selectedTemplate = refusals;
  }

  mapTemplates() {
    this.selectedTemplate = this.templates;
    this.selectedTemplate.forEach((ref) => {
      for (const item of this.items) {
        if (item.code === ref.code) {
          item.isSelected = true;
          break;
        }
      }
    })
    this.marketingArray = this.items.filter((item) => item.category === 'marketing');
    this.enquiryArray = this.items.filter((item) => item.category === 'enquiry');
    this.trackingArray = this.items.filter((item) => item.category === 'tracking');
    this.miscellaneousArray = this.items.filter((item) => item.category === 'miscellaneous');
  }

  onChange(template: Template, value: MatCheckboxChange) {
    if (value.checked) {
      if (this.selectedTemplate.find((item) => item.code === template.code)) {
        return;
      } else {
        this.selectedTemplate.push(template);
        this.change.emit(this.selectedTemplate);
      }
    } else {
      const index = this.selectedTemplate.findIndex(item => item.code === template.code);
      this.selectedTemplate.splice(index, 1);
      this.change.emit(this.selectedTemplate);
    }
  }

}
