import { ErrorHandler, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, Directive } from '@angular/core';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Entity } from '../../core/models/entity.model';
import { IInputValidator } from '../../core/services/input-validator.interface';
import { PagerBaseComponent } from '../../core/structures';
import { Doc, Folder, Placeholder } from '../models';
import { DocsService } from '../services/docs.service';

@Directive()
export class FileListBaseComponent extends PagerBaseComponent<Doc> implements OnInit, OnChanges, OnDestroy {

  @Output()
  count: EventEmitter<number> = new EventEmitter<number>();

  @Input()
  entity: Entity;

  @Input()
  isRefresh = false;

  @Input()
  types: string[];

  @Input()
  tag: string;

  @Input()
  label: string;

  @Input()
  size: number;
  /*
      limits files to one folder only
  */

  @Input()
  folder: Folder;

  /*
      Set of files to show with + icon. These are just placeholder for files
  */
  @Input()
  placeholders: boolean | Placeholder[]; // true will shows set of files configured for that entity type

  /*
      can files be added and removed
      default: false
  */
  @Input()
  readonly: boolean;

  @Input()
  disabled: boolean;

  @Input()
  permissions: any = {};

  /*
      sort the docs by name, size, date
  */
  @Input()
  sort: string;

  @Input()
  fileName: string;

  @Input()
  status: string;

  @Input()
  visibility: number;

  @Input()
  droppable?: boolean; // default true

  // isProcessing: boolean;

  // currentPageNo: number;
  // totalPages: number;
  // total: number;

  // items: Doc[];
  // selectedFile: Doc;

  // removeSubscription: Subscription;
  // uploadSubscription: Subscription;
  entityTypeGroup: any = {};
  afterProcessing: () => void;
  constructor(
    public auth: RoleService,
    private fileService: DocsService,
    private errorHandler: ErrorHandler,
    private validator: IInputValidator
  ) {
    super({
      api: fileService,
      errorHandler,
      filters: ['status', 'entity-id', 'entity-type', 'folder-id', 'folder-code', 'owner-code', 'visibility', 'tag', 'size'],
      pageOptions: {
        limit: 15,
      },
    });
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    // if (this.items && this.items.length) {
    // }


    // this.uploadSubscription = this.fileService.afterUpload.subscribe((doc: Doc) => {
    //   let match = true;
    //   if (this.entity && (doc.entity.type !== this.entity.type || doc.entity.id !== `${this.entity.id}`)) {
    //     match = false;
    //   }

    //   if (this.types && this.types.length) {
    //     match = false;
    //     if (this.types.find((i) => i === doc.type)) {
    //       match = true;
    //     }
    //   }

    //   if (match) {
    //     this.items.push(doc);
    //   }
    // });

    // this.removeSubscription = this.fileService.afterRemove.subscribe(() => {
    //   this.fetch();
    // });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items && changes.items.firstChange) {
      this.groupByEntityType();
      return;
    }
    this.init();
  }

  groupByEntityType() {
    if (this.view === 'entity-type-list') {
      const entityTypeSorted = {};
      this.items.forEach((item) => {
        if (item.entity.type = 'rfq') {
          this.createKeyValuePair(entityTypeSorted, 'Lead', item)
        } else {
          this.createKeyValuePair(entityTypeSorted, 'miscellenous', item)
        }
      });
      this.entityTypeGroup = entityTypeSorted;
    }
  }

  createKeyValuePair(arr, key, value) {
    if (!arr.hasOwnProperty(key)) {
      arr[key] = [];
    }
    arr[key].push(value);
  }


  init() {
    this.filters.reset(false);
    if (this.status) {
      this.filters.set('status', this.status);
    }

    if (this.entity) {
      this.filters.set('entity-id', this.entity.id);
      this.filters.set('entity-type', this.entity.type);
    }

    if (this.folder) {
      if (this.folder.id) {
        this.filters.set('folder-id', this.folder.id);

      } else {
        this.filters.set('folder-code', this.folder.code);
      }
    }

    if (this.tag) {
      this.filters.set('tag', this.tag);
    }

    if (this.size) {
      this.filters.set('size', this.size);
    }

    this.fetch().subscribe(() => {
      if (this.items && this.items.length && this.items.find((item) => item.tags && item.tags.length > 0)) {
        this.sortData(this.items);
        this.groupByEntityType();

      }
      if (this.afterProcessing) {
        this.afterProcessing();
      }
    });
  }

  sortData(items) {
    let count = 0;
    items.forEach((item) => {
      item.meta = item.meta || {};
      item.meta.sort = 0;
      if (item.tags && item.tags.length && this.label && item.tags.includes(this.label)) {
        count++;
        item.meta.sort = count;
      }
    });
    items.sort((a, b) => b.meta.sort - a.meta.sort);
    this.items = items;

  }

  onRemove(file) {
    this.fileService.remove(file.id).subscribe(() => { this.init(); });
  }

  // fetch1() {
  //   if (!this.entity) {
  //     return;
  //   }
  //   this.isProcessing = true;
  //   this.fileService.searchByEntity(this.entity, this.folder, this.fileName).subscribe((i) => {

  //     this.items = [];
  //     if (this.types && this.types.length) {

  //       i.items.forEach((item) => {
  //         if (this.types.find((t) => t === item.type)) {
  //           return this.items.push(item);
  //         }
  //       });
  //     } else {
  //       this.items = i.items;
  //     }

  //     // if (this.view === 'carousel') {
  //     //   this.getDefaultSelectedFile();
  //     // }

  //     this.count.emit(this.items.length);

  //     this.isProcessing = false;
  //   }, (error) => {
  //     this.errorHandler.handleError(error);
  //     this.isProcessing = false;
  //   });
  // }

  // remove(id) {
  //   this.isProcessing = true;

  //   this.fileService.remove(id).subscribe((data) => {
  //     this.isProcessing = false;
  //     this.items = this.items.filter((item) => item.id !== id);
  //   }, (err) => {
  //     this.isProcessing = false;
  //     this.errorHandler.handleError(err);
  //   });
  // }

  // getDefaultSelectedFile() {
  //   this.selectedFile = this.items[0];
  // }
  // next() {
  //   const index = this.items.findIndex((file) => file.id === this.selectedFile.id);

  //   if (index > -1) {
  //     if (index >= this.items.length - 1) {
  //       this.selectedFile = this.items[0];
  //     } else {
  //       this.selectedFile = this.items[index + 1];
  //     }
  //   }
  // }

  // previous() {
  //   const index = this.items.findIndex((file) => file.id === this.selectedFile.id);

  //   if (index > -1) {
  //     if (index === 0) {
  //       const lastIndex = this.items.length - 1;
  //       this.selectedFile = this.items[lastIndex];
  //     } else {
  //       this.selectedFile = this.items[index - 1];
  //     }
  //   }
  // }

  // onDotClick(index) {
  //   this.selectedFile = this.items[index];
  // }

  // ngOnDestroy(): void {
  //   this.uploadSubscription.unsubscribe();
  //   this.removeSubscription.unsubscribe();
  // }
}
