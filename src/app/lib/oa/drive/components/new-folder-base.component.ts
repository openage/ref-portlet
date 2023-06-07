import { ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output, Directive } from '@angular/core';
import { UxService } from 'src/app/core/services/ux.service';
import { Folder } from 'src/app/lib/oa/drive/models';
import { FolderService } from '../services';

@Directive()
export class NewFolderBaseComponent implements OnInit, OnChanges {

    @Input()
    parentFolder: Folder;

    newFolder: Folder;

    isProcessing: boolean;

    @Output()
    created: EventEmitter<Folder> = new EventEmitter<Folder>();

    closeDialog: (folder) => void;

    constructor(
        private service: FolderService,
        private uxService: ErrorHandler
    ) {
        this.newFolder = new Folder({});
    }

    ngOnInit() {
    }

    ngOnChanges() {
    }

    closeBox(folder) {
        if (this.closeDialog) {
            this.closeDialog(folder);
        }
    }

    create(folder: Folder) {
        if (!folder.name) { return; }

        if (folder.name.toLowerCase() === 'root') {
            this.uxService.handleError(`You can't add Root Folder`);
        }

        if (!folder.code) {
            let code = folder.name.trim();
            code = code.replace(/ /g, '').toLowerCase();
            folder.code = code;
        }

        if (this.parentFolder) {
            folder.parent = this.parentFolder;
            folder.visibility = this.parentFolder.visibility;
        }

        folder.status = 'active';
        this.isProcessing = true;

        this.service.create(folder).subscribe((data) => {
            this.isProcessing = false;
            this.newFolder = new Folder(data);
            this.created.emit(this.newFolder);
            this.closeBox(this.newFolder);
        }, (err) => {
            this.isProcessing = false;
            this.uxService.handleError(err);
        });
    }

}
