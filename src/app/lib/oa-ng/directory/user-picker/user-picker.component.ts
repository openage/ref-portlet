import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { IOrganization, IUser } from 'src/app/lib/oa/core/models';
import { RoleService } from 'src/app/lib/oa/core/services';
import { DirectoryRoleService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-user-picker',
  templateUrl: './user-picker.component.html',
  styleUrls: ['./user-picker.component.css']
})
export class UserPickerComponent implements OnInit, OnChanges {

  @Input()
  view = 'picker';

  @Input()
  componentName = 'directory|user|picker';

  @Input()
  storeKeys = {
    'id': '${data.id}',
    'code': '${data.code}',
    'phone': '${data.phone}',
    'email': '${data.email}',
    'profile': {
      'firstName': '${data.profile.firstName}',
      'lastName': '${data.profile.lastName}'
    }
  };

  @Input()
  placeholder = 'Select User';

  @Input()
  label: string;

  @Input()
  required = false;

  @Input()
  disabled = false;

  @Input()
  readonly = false;

  @Input()
  preFetch = false;

  @Input()
  value: IUser;

  @Input()
  type: string;

  @Input()
  skipSubjectStore = false;

  @Input()
  autoSelect = false;

  @Input()
  organization: string | IOrganization;

  @Input()
  isAgent = false;

  @Input()
  roleTypeCode: string | string[];

  @Input()
  options: {
    show?: {
      icon?: boolean
    }
  };

  @Output()
  changed: EventEmitter<IUser> = new EventEmitter();

  @ViewChild('outlet', { read: ViewContainerRef })
  outletRef: ViewContainerRef;

  @ViewChild('content', { read: TemplateRef })
  contentRef: TemplateRef<any>;

  @ViewChild('avatar')
  inputContainer: ElementRef;

  isProcessing = false;
  isSelected = false;
  items: IUser[] = [];

  position = 'left-down';
  // searchText: string
  hoverTimeout: any;
  showAgentDialog: boolean = false;
  constructor(
    public api: DirectoryRoleService,
    private auth: RoleService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.organization && typeof this.organization !== 'string') {
      this.organization = this.organization.code;
    }
    // this.rerender();
  }

  ngOnInit() {
    this.options = this.options || {};
    this.options.show = this.options.show || {};
  }

  // rerender() {
  //   this.outletRef.clear();
  //   this.outletRef.createEmbeddedView(this.contentRef);
  // }

  onSelect($event: any) {
    if ($event) {
      this.value = $event
      let model = {
        id: $event.id,
        phone: $event.phone,
        email: $event.email,
        profile: $event.profile
      };
      this.changed.emit(model);
    } else {
      this.changed.emit(null);
    }
  }
  mouseMove(direction) {
    if (direction === 'in') {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = setTimeout(() => this.showAgentDialog = true, 2000)
    }
    if (direction === 'out') {
      clearTimeout(this.hoverTimeout);
    }
  }
  onClose() {
    clearTimeout(this.hoverTimeout);
    this.showAgentDialog = false;
  }

  onTogglePopup(show?: boolean) {

    if (show !== undefined) {
      this.isSelected = show;
    } else {
      this.isSelected = !this.isSelected;
    }

    setTimeout(() => {
      if (this.isSelected) {
        const bounds = this.inputContainer.nativeElement.getBoundingClientRect();

        // this.ddlWidth = bounds.width;

        const vertical = bounds.top / window.innerHeight > .5 ? 'up' : 'down';
        const horizontal = bounds.left / window.innerWidth > .5 ? 'left' : 'right';

        this.position = `${horizontal}-${vertical}`;
      }
    });
  }
}


