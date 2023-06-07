import { ErrorHandler, EventEmitter, HostListener, Input, OnInit, Output, Directive } from '@angular/core';
import { Entity } from '../../core/models/entity.model';
import { RoleService } from '../../core/services';
import { IInputValidator } from '../../core/services/input-validator.interface';
import { Doc, Folder, Placeholder } from '../models';
import { DocsService } from '../services';

@Directive()
export class FileUploaderBaseComponent implements OnInit {

  @Input()
  entity: Entity;

  @Input()
  code: string;

  @Input()
  status: string;

  @Input()
  visibility: number;

  @Input()
  meta: any;

  @Input()
  types: string[];

  @Input()
  maxFiles: number;

  @Input()
  currentFiles: number;

  /*
      limits files to one folder only
  */
  @Input()
  folder: Folder | string;

  /*
      Set of files to show with + icon. These are just placeholder for files
  */
  @Input()
  placeholder: Placeholder; // true will shows set of files configured for that entity type

  @Input()
  multiple?: boolean; // default true

  @Input()
  disabled: boolean = false; // To disable drop zone;

  @Output()
  created: EventEmitter<Doc> = new EventEmitter();

  isProcessing: boolean;

  readyForDrop = false;
  fileDropped = false;

  constructor(
    private auth: RoleService,
    private fileService: DocsService,
    private errorHandler: ErrorHandler,
    private validator: IInputValidator
  ) {
  }

  ngOnInit(): void {
    if (!this.placeholder) {
      this.placeholder = new Placeholder();
    }
  }

  upload(file: File) {
    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = () => {
    //   if (typeof reader.result === 'string') {
    //     this.placeholder.imageUrl = reader.result;
    //   }
    // };
    // reader.onerror = (error) => {
    //   alert('Image Parse Error');
    // };

    // if (this.currentFiles >= this.maxFiles) {
    //   return this.errorHandler.handleError(`Max Files Uploads-${this.maxFiles}`);
    // }

    const fileSize: number = Number((file.size / (1024 * 1024)).toFixed(2));

    if (fileSize > 10) {
      return this.errorHandler.handleError(`File size is greater than 10 mb`);
    }

    if (this.types && this.types.length) {
      let match = false;
      if (this.types.find((i) => i === file.type)) {
        match = true;
      }
      if (!match) {
        return this.errorHandler.handleError(`Only ${this.types.join()} are supported`);
      }
    }
    this.isProcessing = true;
    if (this.code && this.entity) {
      let model = {
        code: this.code,
        entity: this.entity,
        folder: this.folder,
        meta: this.meta,
        status: this.status,
        visibility: this.visibility
      }
      this.fileService.simpleCreate(file, model).subscribe((i) => {
        this.isProcessing = false;
        this.created.emit(i);
      }, (error) => {
        this.errorHandler.handleError(error);
        this.isProcessing = false;
      });
    } else if (this.entity) {
      this.fileService.createByEntity(this.entity, file, this.folder).subscribe((i) => {
        this.isProcessing = false;
        this.created.emit(i);
      }, (error) => {
        this.errorHandler.handleError(error);
        this.isProcessing = false;
      });
    }
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      if (event.target.files.length >= this.maxFiles) {
        return this.errorHandler.handleError(`Please select ${this.maxFiles} file(s) only`);
      } else {
        for (const file of event.target.files) {
          this.upload(file);
        }
      }
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    const items = evt.dataTransfer.items;
    if ((items.length > 0) && !this.disabled) {
      this.readyForDrop = true;
    }
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.readyForDrop = false;
  }

  @HostListener('drop', ['$event'])
  public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer.files;
    this.readyForDrop = false;

    if ((files.length > 0) && !this.disabled) {
      if (files.length >= this.maxFiles) {
        return this.errorHandler.handleError(`Please select ${this.maxFiles} file(s) only`);
      } else {
        for (const file of files) {
          this.upload(file);
        }
      }
    }
  }
}
