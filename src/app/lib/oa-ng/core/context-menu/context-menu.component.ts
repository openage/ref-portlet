import { Component, Input, OnInit } from '@angular/core';
import { NavService, UxService } from 'src/app/core/services';
import { ConstantService } from 'src/app/core/services/constant.service';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Action, Menu } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'oa-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit {

  @Input()
  menu: Menu;

  @Input()
  items: any[];

  @Input()
  view: 'bar' | 'inline' | 'raised' | 'stroked' | 'flat' | 'icon' | 'fab' | 'mini-fab' = 'flat';

  constructor(
    private auth: RoleService,
    private uxService: UxService,
    private navService: NavService,
    private constantService: ConstantService
  ) {
    this.uxService.contextMenuChanges.subscribe(items => {
      this.items = items;
      this.init()
    });
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.items = (this.menu?.items || this.items || [])
      .filter(i => this.auth.hasPermission(i.permissions))
      .map(i => {
        i = this.constantService.actions.get(i);
        i.type = i.type || 'button';
        i.style = i.style || (i.type === 'icon' ? 'subtle' : 'primaryBackdrop');
        return i;
      });
  }

  back() {
    this.navService.back();
  }

  toggle(item: Action) {
    item.value = !item.value;
    item.event(item.value);
  }

  onSelect(item: Action, value: any) {
    item.options.forEach((i) => i.isSelected = false);
    value.isSelected = true;
    item.event(value.code);
  }

}
