import { ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Directive } from '@angular/core';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { Doc, Folder } from 'src/app/lib/oa/drive/models';
import { FolderService } from 'src/app/lib/oa/drive/services';
import { Entity, IUser } from '../../core/models';

@Directive()
export class FolderDetailsBaseComponent extends DetailBase<Folder> implements OnInit, OnChanges {

  @Input()
  visibility: number;

  @Input()
  parent: string;

  @Input()
  owner: IUser | string;

  @Input()
  entity: Entity;

  @Input()
  readonly: boolean;

  @Input()
  disabled: boolean;

  @Input()
  config: any;

  @Input()
  tag: string;

  @Output()
  selectedDoc: EventEmitter<Doc> = new EventEmitter();

  afterProcessing: () => void;

  constructor(
    private api: FolderService,
    errorHandler: ErrorHandler
  ) {
    super({ api, errorHandler });
  }

  ngOnInit() {
    this.config = this.config || {};
    this.view = this.config.view || this.view;
    this.owner = this.owner || this.config.owner;
    // this.getDetail();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getDetail();
  }

  getDetail() {
    if (!this.code) {
      return;
    }

    let query = '';

    if (this.entity) {
      query = `entity-id=${this.entity.id}&entity-type=${this.entity.type}`;
      if (this.entity.name) {
        query = `${query}&entity-name=${this.entity.name}`;
      }
    }

    if (this.visibility !== undefined) {
      query = query ? `${query}&` : '';
      query = `${query}visibility=${this.visibility}`;
    }

    if (this.owner) {
      query = query ? `${query}&` : '';
      query = `${query}owner-code=${typeof this.owner === 'string' ? this.owner : this.owner.code}`;
    }

    this.get(`${this.code}?${query}`).subscribe(() => {
      if (this.properties && this.properties.files.length && this.properties.files.find((file) => file.tags && file.tags.length > 0)) {
        this.sortData(this.properties.files);
      }
      if (this.afterProcessing) {
        this.afterProcessing();
      }
    });
  }

  sortData(files) {
    let count = 0;
    files.forEach((file) => {
      file.meta = file.meta || {};
      file.meta.sort = 0;
      if (file.tags && file.tags.length && this.tag && file.tags.includes(this.tag)) {
        count++;
        file.meta.sort = count;
      }
    });
    files.sort((a, b) => b.meta.sort - a.meta.sort);
    this.properties.files = files;
  }

  onRemove(folder) {
    this.api.remove(folder.id).subscribe(() => this.getDetail());
  }

}
