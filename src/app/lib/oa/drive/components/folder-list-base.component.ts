import { ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output, Directive } from '@angular/core';
import { Folder } from '../models';
import { FolderService } from '../services';

@Directive()
export abstract class FolderListBaseComponent implements OnInit, OnChanges {
  @Input()
  parent: Folder | any;

  @Input()
  folderName: string;

  items: Folder[];

  isProcessing: boolean;

  selectedFolder: Folder;

  @Output()
  selected: EventEmitter<Folder> = new EventEmitter<Folder>();

  abstract preInit(): void;

  constructor(
    private service: FolderService,
    private uxService: ErrorHandler
  ) { }

  ngOnInit() {
    if (this.preInit) {
      this.preInit();
    }
    this.fetch();
    this.service.afterCreate.subscribe((data: Folder) => {
      const folder = this.items.find((item) => item.id === data.id);
      if (!folder) {
        this.items.push(data);
        this.onSelect(data);
      }
    });
  }

  ngOnChanges() {
    this.fetch();
  }

  fetch() {
    if (this.folderName) {
      this.fetchByName();
    } else if (this.parent) {
      this.fetchByParent();
    }
  }

  fetchByName() {
    this.isProcessing = true;
    this.service.search({
      name: this.folderName
    }).subscribe((page) => {
      this.items = page.items;
      if (this.items && this.items.length) {
        this.autoSelect();
      }
      this.isProcessing = false;
    }, (err) => {
      this.isProcessing = false;
      this.uxService.handleError(err);
    });
  }

  fetchByParent() {
    this.service.get(`${this.parent.code}?owner-code=${this.parent.owner.code}`).subscribe((p) => {
      this.parent = p;
      this.items = p.folders;
      this.isProcessing = false;
    }, (err) => {
      this.isProcessing = false;
      this.uxService.handleError(err);
    });
  }

  remove(id: string | number) {
    this.isProcessing = true;

    this.service.remove(id).subscribe(() => this.isProcessing = false, (err) => {
      this.isProcessing = false;
      this.uxService.handleError(err);
    });
  }

  bulkRemove(folders: Folder[]) {
    const rootFolder = folders.find((folder) => folder.name === 'root');
    if (rootFolder) {
      this.uxService.handleError(`You can't remove root folder`);
      return;
    }

    this.service.post(folders, 'deletes').subscribe((data) => {
      if (this.selectedFolder.isDeleted) { this.selectedFolder = null; }
      this.fetch();
      this.isProcessing = false;
    }, (err) => {
      this.isProcessing = true;
      this.uxService.handleError(err);
    });
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
