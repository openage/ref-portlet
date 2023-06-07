import { AfterViewInit, ErrorHandler, EventEmitter, Input, OnInit, Output, Directive } from '@angular/core';
import Cropper from 'cropperjs';
import { Entity } from '../../core/models/entity.model';
import { Doc } from '../models';
import { DocsService } from '../services';

@Directive()
export class ImageEditorBaseComponent implements OnInit, AfterViewInit {
  @Input()
  title = 'Image Editor';

  @Input()
  body: string;

  @Input()
  file: File;

  @Input()
  uploadFile: boolean;

  @Input()
  template: any;

  @Input()
  cancelable = true;

  @Input()
  okLabel = 'Ok';

  @Input()
  cancelLabel = 'Cancel';

  @Input()
  isFixedRatio = false;

  @Input()
  isCropBoxResizable = true;

  @Input()
  ratio = 16 / 9;

  @Input()
  width: number;

  @Input()
  height: number;

  @Input()
  cropArea = 0.9;

  @Input()
  isEdit = true;

  @Input()
  isEditMandatory = true;

  @Input()
  ratioList: { name: string, w: number, h: number }[] = [];

  @Input()
  tools: string[] = [];

  @Input()
  entity: Entity;

  @Input()
  folder: string;

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() done: EventEmitter<Doc> = new EventEmitter();

  visibility = 1;
  isProcessing = false;

  cropper: Cropper;

  options = {
    crop: false,
    zoom: false,
    move: false,
    rotate: false,
    flip: false,
    ratio: false,
    reset: false
  };

  constructor(
    private api: DocsService,
    private errorHandler: ErrorHandler
  ) {
  }

  selectRatio(ratio: { name: string, w: number, h: number }) {
    this.width = ratio.w;
    this.height = ratio.h;
    this.cropper.setAspectRatio(ratio.w / ratio.h);
  }

  ngOnInit() {
    this.isProcessing = true;
  }

  ngAfterViewInit() {
    const image = document.getElementById('image') as HTMLImageElement;
    image.onload = () => {
      this.cropper = new Cropper(image, {
        dragMode: 'crop', // only in case of 'FALSE' value
        aspectRatio: this.ratio, // for free crop
        autoCropArea: 0.9,
        autoCrop: true,
        restore: true,
        guides: true,
        center: true,
        responsive: true,
        highlight: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: true,
      });
      this.isProcessing = false;
    };
    this.dataUrl(this.file, (err, base64) => {
      image.src = base64;
      // this.isProcessing = false
    });
  }

  toggleEdit(value: boolean) { }

  okClicked() {
    this.isProcessing = true;
    const result = this.cropper.getCroppedCanvas({ width: this.width, height: this.height });
    try {
      result.toBlob((blob: any) => {
        blob.name = this.file.name;
        blob.lastModifiedDate = new Date();
        if (this.uploadFile) {
          this.api.createByEntity(this.entity, blob, this.folder).subscribe((doc) => {
            this.isProcessing = false;
            this.done.emit(doc);
          }, (err) => {
            this.isProcessing = false;
            this.errorHandler.handleError(err);
          });
        } else {
          this.dataUrl(blob, (err, base64) => {
            this.done.emit(new Doc({ url: base64 }));
          });
        }
      }, 'image/jpeg', 0.8);
    } catch (err) {
      this.isProcessing = false;
      this.errorHandler.handleError(err);
    }
  }

  cancelClicked() {
    this.cancel.emit();
  }

  close() {
    this.isProcessing = false;
    this.visibility = 0;
  }

  open() {
    this.visibility = 1;
  }

  private dataUrl(file: File, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const target: any = e.target;
      callback(null, target.result);
    };
    reader.readAsDataURL(file);
  }

}
