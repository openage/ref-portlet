import { ErrorHandler, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { Role } from 'src/app/lib/oa/directory/models';
import { IBreadcrumbHandler } from '../../core/services/breadcrumb-handler.interface';
import { IContextMenuHandler } from '../../core/services/context-menu-handler.interface';
import { IEntityHandler } from '../../core/services/entity-handler.interface';
import { IInputValidator } from '../../core/services/input-validator.interface';
import { ITitleHandler } from '../../core/services/title-handler.interface';
import { IWizStep } from '../../core/structures/wiz/wiz-step.interface';
import { Department, Designation, Employee } from '../models';
import { DirectoryRoleService } from '../services';

export abstract class TenantAgentDetailBaseComponent implements OnInit, OnChanges {

    constructor(
        private api: DirectoryRoleService,
        private errorHandler: ErrorHandler,
        public route: ActivatedRoute,
        public router: Router,
        private breadcrumbHandler: IBreadcrumbHandler,
        private contextMenuHandler: IContextMenuHandler,
        private titleHandler: ITitleHandler,
        private entityHandler: IEntityHandler

    ) {
    }

    @Input()
    code: string;

    @Input()
    readonly: boolean;

    role: Role = new Role({
        profile: {
            pic: {}
        }
    });

    progressValue = 0;
    progressMode = 'determinate';
    isProcessing = false;
    afterProcessing: () => void;
    afterUpdate: (item) => void;

    ngOnInit() {
        const code = this.route.snapshot.queryParams['step'];

        this.route.queryParams.subscribe((query) => {
        });

        if (code === '\'my\'') {
            this.readonly = true;
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.isProcessing = true;
        this.api.get(this.code).subscribe((data) => {
            this.role = new Role(data);
            this.isProcessing = false;
        }, (err) => {
            this.isProcessing = false;
        });
    }

}
