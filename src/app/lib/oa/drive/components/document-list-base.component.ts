import { ErrorHandler, Directive, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Entity } from '../../core/models';
import { PagerBaseComponent } from '../../core/structures';
import { Folder } from '../models';
import { FolderService } from '../services';

@Directive()
export abstract class DocumentListBaseComponent extends PagerBaseComponent<Folder> implements OnInit, OnChanges {

  @Input()
  parent: Folder | any;

  @Input()
  folderName: string;

  @Input()
  code: string;

  @Input()
  entity: Entity;

  @Input()
  visibility: number | string;

  items: Folder[];

  isProcessing: boolean;

  selectedFolder: Folder;

  @Output()
  selected: EventEmitter<Folder> = new EventEmitter<Folder>();

  abstract preInit(): void;

  constructor(
    private folderService: FolderService,
    private errorHandler: ErrorHandler
  ) {
    super({
      api: folderService,
      errorHandler,
      filters: ['entity-id', 'entity-type', 'parent', 'visibility', 'name', 'code'],
      pageOptions: {
        limit: 50
      }
    });
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.init();
  }
  init() {
    this.filters.reset(false);

    if (this.entity) {
      this.filters.set('entity-id', this.entity.id);
      this.filters.set('entity-type', this.entity.type);
    }

    if (this.parent) {
      this.filters.set('parent', this.parent);
    }

    if (this.visibility) {
      this.filters.set('visibility', this.visibility);
    }

    if(this.folderName) {
      this.filters.set('name', this.folderName);
    }

    if(this.code) {
      this.filters.set('name', this.code);
    }

    this.fetch();
  }

  onSelect(folder: Folder) {
    this.items.forEach((item) => {
      if (item.id === folder.id) {
        item.isSelected = true;
        this.selectedFolder = item;
        this.selected.emit(this.selectedFolder);
      } else {
        item.isSelected = false;
      }
    });

  }

  autoSelect() {
    this.selectedFolder = this.selectedFolder || this.items[0];
    this.selectedFolder.isSelected = true;
    this.selected.emit(this.selectedFolder);
  }

}
