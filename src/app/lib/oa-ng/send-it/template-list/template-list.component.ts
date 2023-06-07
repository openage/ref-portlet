import { Component, Input, OnInit } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { TemplateListBaseComponent } from 'src/app/lib/oa/send-it/components/template-list.base.component';
import { TemplateService } from 'src/app/lib/oa/send-it/services/template.service';

@Component({
  selector: 'oa-send-it-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.css']
})
export class TemplateListComponent extends TemplateListBaseComponent {

  @Input()
  columns: string[] = ['name', 'code', 'status', 'action', 'view'];

  constructor(
    api: TemplateService,
    private uxService: UxService
  ) {
    super(api, uxService);
  }

  onRemove(item): void {
    this.uxService.onConfirm().subscribe(() => {
      this.remove(item);
      this.fetch().subscribe(() => {
        this.uxService.showInfo('Deleted');
      });
    });
  }

}
