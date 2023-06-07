import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Entity } from 'src/app/lib/oa/core/models/entity.model';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Doc, Folder } from 'src/app/lib/oa/drive/models';
import { Template } from 'src/app/lib/oa/drive/models/template.model';
import { FolderService, TemplateService } from 'src/app/lib/oa/drive/services';
import { DocsService, DocumentService } from 'src/app/lib/oa/drive/services';
import { FilePreview } from '../../models/file-preview.model';
import { UxService } from '../../services';
import { FilePreviewService, FILE_PREVIEW_DIALOG_DATA } from '../../services/file-preview.service';

@Component({
  selector: 'core-document-preview',
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentPreviewComponent implements OnInit {

  doc: Doc;
  type: string;
  entity: Entity;
  category: string;
  templates: Template[] = [];
  selectedTemplate: Template;
  fileTypes: string[] = [];
  params: any = {};
  generateByUrls: [] = [];
  folder: Folder;
  files: Doc[];
  selectedIndex: number;
  options: any;

  constructor(
    public filePreviewService: FilePreviewService,
    public docService: DocsService,
    public templateService: TemplateService,
    public auth: RoleService,
    public documentService: DocumentService,
    private uxService: UxService,
    public folderService: FolderService,
    @Inject(FILE_PREVIEW_DIALOG_DATA) public config: FilePreview
  ) { }

  ngOnInit() {
    this.config = this.config || {};
    this.doc = this.config.doc;
    this.entity = this.doc.entity || this.config.entity;
    this.category = this.doc.category || this.config.category;
    this.params = this.config.params || {};
    this.type = this.docService.getViewer(this.doc);
    this.generateByUrls = this.config.generateByUrls;
    this.params = this.config.params || {};
    this.folder = this.config.folder;
    this.options = this.config.options;
    if (this.folder && (this.folder.id || this.folder.code)) {
      this.getFolder();
    }
    if (this.category && !(this.folder && this.folder.id && this.folder.code)) { this.getTemplates(); }
  }

  getTemplates() {
    this.templateService.search({ category: this.category }).subscribe(data => {
      this.templates = data.items || [];
      this.selectedTemplate = this.templates.find(item => item.code === this.doc.code);
      this.setFileTypes(this.selectedTemplate);
    });
  }
  getFolder() {
    if (!this.folder.code) {
      return;
    }

    let query = '';

    if (this.folder.entity) {
      query = `entity-id=${this.folder.entity.id}&entity-type=${this.folder.entity.type}`;
      if (this.folder.entity.name) {
        query = `${query}&entity-name=${this.folder.entity.name}`;
      }
    }

    if (this.folder.visibility !== undefined) {
      query = query ? `${query}&` : '';
      query = `${query}visibility=${this.folder.visibility}`;
    }

    // if (this.owner) {
    //   query = query ? `${query}&` : '';
    //   query = `${query}owner-code=${typeof this.owner === 'string' ? this.owner : this.owner.code}`;
    // }
    this.folderService.get(`${this.folder.code}?${query}`).subscribe(data => {
      console.log(data);
      this.files = data.files;
      this.doc = this.files[0];
      this.selectedIndex = 0;
      this.type = this.docService.getViewer(this.files[0]);
    })
  }

  close() {
    this.filePreviewService.close();
  }

  download(doc) {
    this.docService.download(doc);
  }

  onTemplateChange($event) {
    if (this.doc.code === $event.value.code) {
      return;
    }

    const url = this.documentService.getDocUrl($event.value.code, this.entity, 'pdf', this.params);
    this.doc.url = url;
    this.doc.content.url = url;
    this.doc.code = $event.value.code;
    this.selectedTemplate = $event.value;
    this.setFileTypes(this.selectedTemplate);
  }

  onChangeFileType(type: string) {
    const url = this.documentService.getDocUrl(this.selectedTemplate.code, this.entity, type, this.params);
    this.download({ url })
  }

  setFileTypes(template: Template) {
    if (!template?.mimeTypes || !template?.mimeTypes?.length) {
      this.fileTypes = [];
      return;
    }

    this.fileTypes = ['pdf'];
    template.mimeTypes.forEach(mimeType => {
      if (mimeType !== 'pdf') { this.fileTypes.push(mimeType) }
    });
  }


  generateFile(file) {
    this.documentService.getDocByUrl(file.url).subscribe(doc => {
      this.uxService.showInfo('Successfully Generated')
      this.filePreviewService.subscribedClose()
    }, (err) => {
      this.uxService.handleError('Something went wrong');
    })
  }
  onFileSelect(i) {
    if (i > this.files.length - 1 || i < 0) {
      return;
    }
    this.doc = this.files[i];
    this.selectedIndex = i;
    this.type = this.docService.getViewer(this.files[i]);
  }
}
