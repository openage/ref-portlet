import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NavService } from 'src/app/core/services';
import { ConstantService } from 'src/app/core/services/constant.service';
import { ShareService } from 'src/app/core/services/share.service';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Action } from 'src/app/lib/oa/core/structures';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'oa-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit, OnChanges {

  @Input()
  item: Action | any;

  @Input()
  value: any;

  @Input()
  class: string;

  @Input()
  style: any;

  @Input()
  event: (obj?: any) => void;

  @Input()
  items: any[];

  @Input()
  disabled = false;

  @Input()
  type;

  @Input()
  icon: any;

  @Input()
  view: string; // raised, stroked, flat, icon, fab, mini-fab

  @Output()
  selected: EventEmitter<any> = new EventEmitter();

  showList: boolean

  constructor(
    private constantService: ConstantService,
    private navService: NavService,
    private shareService: ShareService,
    private auth: RoleService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {

    if (typeof this.item === 'string') {
      this.item = { code: this.item }
    }

    this.event = this.event || this.item.event;

    if (this.item.style) {
      if (typeof this.item.style === 'string') {
        this.class = this.item.style;
      } else {
        this.style = this.item.style
      }
    }

    if (!(this.item instanceof Action)) {
      this.item = new Action(this.item);
    }

    this.items = (this.item?.config?.items || this.item?.items || this.item?.options || []
    ).filter((i) => this.auth.hasPermission(i.permissions)
    ).map((i) => {
      i = i instanceof Action ? i : new Action(i);
      let item = this.constantService.actions.get(i.code);
      if (item) {
        i.icon = i.icon || item.icon;
        i.title = i.title || item.title;
        i.provider = i.provider || item.provider;
        i.config = { ...i.config, ...item.config }
        this.setEvent(i);
      }

      // i.event = i.event || (() => this.item.event(i.value));
      return i;
    });

    if (this.items?.length) {
      this.item = this.item || new Action({
        code: 'more'
      });
    }

    if (!this.item) { return; }

    if (this.item.isDisabled && this.item.display === 'disabled') {
      this.disabled = true;
    }

    this.item = this.constantService.actions.get(this.item);

    this.setEvent(this.item);

    if (this.items?.length) {
      this.items[0].isSelected = true;
    }

    this.type = this.type || this.item.type;

    if (!this.type) {
      this.type = this.item.icon ? 'icon' : 'button'
    }

    this.icon = this.item.icon || this.item.code;
    this.value = this.value || this.item.value;
  }

  ngOnInit() {
  }

  setEvent(item) {
    switch (item.code) {

      // case 'more':
      // case 'more-icons':

      //   item.type = item.type || 'more';

      //   break;

      case 'email':
        item.event = () => {
          this.shareService.email(item.config);
        }
        break;

      case 'chat':
        item.event = () => {
          this.shareService.chat(item.config);
        }
        break;

      case 'copy':
        item.event = () => {
          this.shareService.copy(item.config);
        }
        break;

      case 'back':
      case 'clear':
      case 'close':
        item.event = item.event || (() => this.navService.back());
        break;

      case 'help':
        item.event = item.event || (() => this.navService.goto('help.sections.details', { path: { code: this.value } }))

        // this.navService.goto(`${environment.links.help}/${this.value}`));
        break;

      // case 'view':
      //   item.type = item.type || 'select';
      // this.item.options = this.item.options.map((v) => {
      //   if (typeof v === 'string') {
      //     v = {
      //       code: v
      //     };
      //   }
      //   switch (v.code) {
      //     case 'table':
      //       v.label = v.label || 'Table';
      //       v.icon = v.icon || 'format_list_bulleted';
      //       break;

      //     case 'grid':
      //       v.label = v.label || 'Grid';
      //       v.icon = v.icon || 'grid_view';
      //       break;

      //     case 'column':
      //       v.label = v.label || 'Column';
      //       v.icon = v.icon || 'view_column';
      //       break;

      //     case 'list':
      //       v.label = v.label || 'List';
      //       v.icon = v.icon || 'view_list';
      //       break;
      //   }

      //   v.isSelected = false;
      //   return v;
      // });

      // this.item.options[0].isSelected = true;
      // break;
    }

    item.event = item.event || (() => this.item.event(item.value));
  }

  onToggle() {
    this.item.event(this.value);
  }

  onSelect(value: any) {
    this.items.forEach((i) => i.isSelected = false);
    value.isSelected = true;
    this.item.event(value.code);
  }

  onClick() {
    if (this.item.event) {
      this.item.event(this.value);
    }
    this.selected.emit(this.value);
  }

}
