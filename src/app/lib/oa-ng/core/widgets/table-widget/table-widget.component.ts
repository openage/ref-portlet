import { C } from '@angular/cdk/keycodes';
import { Component, Injector, OnInit } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService, WidgetDataService } from 'src/app/lib/oa/core/services';
import { InsightWidgetBaseComponent } from '../insight-widget.base.component';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'insight-table-widget',
  templateUrl: './table-widget.component.html',
  styleUrls: ['./table-widget.component.css']
})
export class TableWidgetComponent extends InsightWidgetBaseComponent implements OnInit {
  headArray = [];
  dataReceiving: boolean = false;
  constructor(
    injector: Injector,
    public clipboardService: Clipboard,
    private uxService: UxService
  ) {
    super(injector);

    this.afterInitialization = () => {
      this.headArray = [];
      this.dataReceiving = true;
      this.fields.map((c) => {
        if (!c.isHidden) { this.headArray.push(c.key) }
      });
    };

    this.afterProcessing = () => {
      this.dataReceiving = false;
    }
  }

  ngOnInit() {
    this.hideDetails = (this.config?.hideDetails === false) ? this.config?.hideDetails : this.hideDetails
  }

  copy() {
    this.clipboardService.copy(this.clipboard);
    this.uxService.showInfo('Copied');
  }
}
