import { Component, Input, OnInit } from '@angular/core';
import { TemplateConfig } from 'src/app/lib/oa/drive/models/template-config.model';

@Component({
  selector: 'drive-config-editor',
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.css']
})
export class ConfigEditorComponent implements OnInit {

  @Input()
  config: TemplateConfig;

  size: string;

  constructor() { }

  ngOnInit() {
    if (!this.config) {
      this.config = new TemplateConfig({});
    }
  }

  addPage() {
    if (this.config.page) { return; }
    this.config.page = {
      orientation: 'portrait',
      border: {
        left: 2,
        right: 2,
        top: 2,
        bottom: 2,
      },
      height: 10,
      width: 5,
      size: 'a4'
    };
  }

  addTo() {
    if (this.config.to && this.config.to.field) {
      return;
    } else {
      this.config.to = {
        field: ''
      };
    }
  }

  closeTo() {
    if (this.config && this.config.to && this.config.to.field) {
      return;
    } else {
      this.config.to = null;
    }
  }

  addEntity() {
    if (this.config && this.config.entity) {
      return;
    } else {
      this.config.entity = {
        name: '',
        type: '',
        id: ''
      };
    }

  }

  closeEntity() {
    if ((this.config && this.config.entity) && (this.config.entity.name || this.config.entity.type || this.config.entity.id)) {
      return;
    } else {
      this.config.entity = null;
    }
  }

  addModes() {
    if (this.config && this.config.modes) {
      return;
    } else {
      this.config.modes = {
        email: false,
        sms: false,
        push: false
      };
    }

  }
}
