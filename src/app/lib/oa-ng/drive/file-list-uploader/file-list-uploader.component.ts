import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IWizStep } from 'src/app/lib/oa/core/structures/wiz/wiz-step.interface';

@Component({
  selector: 'drive-file-list-uploader',
  templateUrl: './file-list-uploader.component.html',
  styleUrls: ['./file-list-uploader.component.css']
})
export class FileListUploaderComponent implements OnInit, IWizStep {
  code: string;
  title: string;
  isSelected: boolean;
  isOpen: boolean;
  isComplete: boolean;
  required: boolean;
  isValid: boolean;
  isDisabled: boolean;
  icon: string;

  constructor() { }

  ngOnInit() {
  }

  validate(): boolean {
    return true;
  }
  complete(): boolean | Observable<any> {
    return true;
  }
}
