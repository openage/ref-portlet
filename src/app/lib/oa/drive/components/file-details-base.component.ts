import { ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Directive } from '@angular/core';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { Entity } from '../../core/models';
import { RoleService } from '../../core/services/role.service';
import { Doc, Folder } from '../models';
import { DocsService } from '../services';

@Directive()
export abstract class FileDetailsBaseComponent extends DetailBase<Doc> implements OnInit, OnChanges {
  @Input()
  permissions: any;

  @Input()
  code: string;

  @Input()
  entity: Entity | any;

  @Input()
  status: string;

  @Input()
  folder: Folder;

  @Input()
  readonly = false;

  @Input()
  accept: string[] = [];

  @Input()
  isEditable = true;

  @Input()
  guest: boolean;

  @Input()
  options: {
    handleError?: boolean,
    createDefault?: boolean,
    name?: string;
    folder?: Folder | string;
    meta?: any
    isPlaceholder?: boolean,
    labelHidden?: boolean
  } = {
      handleError: false,
      name: null,
      labelHidden: false
    }

  @Output()
  open: EventEmitter<Doc> = new EventEmitter();

  type: string;
  icon: string;
  content: any;

  taskStatus: any;

  user: any;

  favIcon = 'fa fa-star-o';

  isFavourite = false;

  constructor(
    public api: DocsService,
    public errorHandler: ErrorHandler,
    public auth: RoleService,
  ) {
    super({ api, errorHandler });
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.code && this.entity) {
      this.api.getByEntity(this.entity, this.code, this.options).subscribe((item) => {
        this.properties = new Doc(item);
        this.fetched.emit(this.properties);
        this.init();
      });
    } else if (this.code && this.guest) {
      this.entity = new Entity({ id: this.auth.currentTenant().code, type: 'tenant' })
      this.api.getByEntity(this.entity, this.code).subscribe((item) => {
        this.properties = new Doc(item);
        this.fetched.emit(this.properties);
        this.init();
      });
    } else if (changes.code && this.code) {
      this.get(this.code).subscribe((item) => {
        this.properties = new Doc(item);
        this.init();
      });
    } else if (changes.properties) {
      this.init();
    }
  }

  init() {
    if (!this.properties) {
      this.content = null;
      this.type = null;
      this.icon = null;
      this.readonly = false;
      return;
    }
    this.content = this.api.getContent(this.properties);
    this.type = this.api.getViewer(this.properties);
    this.icon = this.api.getIcon(this.properties);
  }

  updateContent() {
    this.isProcessing = true;
    let model: any = {};

    if (this.properties.status === 'active') {
      model = { version: ++this.properties.version };
    }
    if (this.properties.mimeType === 'html' ||
      this.properties.mimeType === 'text/html' ||
      this.properties.mimeType === 'application/html') {
      const html: any = { html: this.properties.content };
      model.content = html;
    } else if (this.properties.mimeType === 'json' ||
      this.properties.mimeType === 'application/json' ||
      this.properties.mimeType === 'text/json') {
      const json: any = { json: this.properties.content };
      model.content = json;
    }

    this.api.update(this.properties.id, model).subscribe(((newItem) => {
      this.properties = new Doc(newItem);
      this.isProcessing = false;
    }));
  }

  setContent(value) {
    this.properties.content = { body: value };
    this.save().subscribe((item) => {
      this.properties = new Doc(item);
      this.init();
    });
  }

  onOpen() {
    this.open.next(this.properties);
    //  window.open(this.properties.url, '_blank');
  }

  setLink() {
    if (this.properties.status === 'active') {
      this.properties.version = ++this.properties.version;
    }
    this.save();
  }

  getFileSize(file) {
    if (!file.size) {
      return '--';
    }
    const fileSize: number = Number((file.size / (1024 * 1024)).toFixed(2));
    return `${fileSize} MB`;
  }

  onCustomChange($event) {
    this.properties.visibility = $event.checked ? 1 : 0;
    this.save();
  }

  // onFavourite() {
  //   let data = this.properties.members.find(m => ((m.user._bsontype === 'ObjectID' ? m.user.toString() : m.user.id) === this.properties.owner.id))
  //   let model = {
  //     members: [{
  //       user: this.properties.owner.id,
  //       isFavourite: data.isFavourite ? false : true
  //     }]
  //   }
  //   this.api.update(this.properties.id, model).subscribe((item) => {
  //     let icon = item.members.find(m => ((m.user._bsontype === 'ObjectID' ? m.user.toString() : m.user.id) === this.properties.owner.id))
  //     this.favIcon = icon.isFavourite ? 'fa fa-star' : 'fa fa-star-o'
  //     this.properties.members = [item.members.find(m => ((m.user._bsontype === 'ObjectID' ? m.user.toString() : m.user.id) === this.properties.owner.id))]
  //   })
  // }

  setfiles(files: File[]) {
    this.isProcessing = true;
    for (const file of files) {
      const fileSize: number = Number((file.size / (1024 * 1024)).toFixed(2));
      if (fileSize > 10) {
        this.isProcessing = false;
        return this.errorHandler.handleError(`File size is greater than 10 mb`);
      }
      this.api.simpleCreate(file, {
        id: this.properties.id,
        code: this.properties.code,
        name: this.properties.name,
        folder: this.properties.folder
      }).subscribe((doc) => {
        this.isProcessing = false;
        this.properties = new Doc(doc);
      });
    }
  }

}
