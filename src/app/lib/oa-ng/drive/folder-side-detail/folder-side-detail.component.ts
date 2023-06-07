import { Component, Input, OnInit } from '@angular/core';
import { Folder } from 'src/app/lib/oa/drive/models';

@Component({
  selector: 'drive-folder-side-detail',
  templateUrl: './folder-side-detail.component.html',
  styleUrls: ['./folder-side-detail.component.css']
})
export class FolderSideDetailComponent implements OnInit {

  @Input()
  folder: Folder;

  constructor() { }

  ngOnInit() { }

}
