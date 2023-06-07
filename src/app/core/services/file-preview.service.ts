import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Injectable, InjectionToken, Injector } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Doc } from 'src/app/lib/oa/drive/models';
import { DocumentPreviewComponent } from '../components/document-preview/document-preview.component';
import { FilePreview } from '../models/file-preview.model';

@Injectable({
    providedIn: 'root'
})

export class FilePreviewService {
    private _overlayRef: OverlayRef;
    private _defaultConfig: FilePreview = {
        hasBackdrop: true,
        backdropClass: 'dark-backdrop',
        panelClass: 'tm-file-preview-dialog-panel',
        doc: new Doc(),
        params: {},
        category: null,
        generateByUrls: []
    };

    private _afterClose = new Subject<any>();
    afterClose = this._afterClose.asObservable();

    componentName: string;

    constructor(
        private overlay: Overlay,
        private injector: Injector
    ) { }

    open(config: FilePreview = {}, componentName?: string) {
        this.componentName = componentName ? componentName : undefined
        // create overlay
        this._overlayRef = this.createOverlay({ ...this._defaultConfig, ...config });

        // create injector & inject data
        const injector = this.createInjector(config);

        const containerPortal = new ComponentPortal(DocumentPreviewComponent, null, injector);
        this._overlayRef.attach(containerPortal);

        this._overlayRef.backdropClick().subscribe(() => { this.close(); });

    }

    close(): void {
        this._overlayRef.dispose();
    }

    subscribedClose() {
        this._overlayRef.dispose();
        this._afterClose.next(this.componentName);
    }

    private createOverlay(config: FilePreview) {

        const overlayConfig = new OverlayConfig({
            hasBackdrop: config.hasBackdrop,
            backdropClass: config.backdropClass,
            panelClass: config.panelClass,
            scrollStrategy: this.overlay.scrollStrategies.reposition({
                autoClose: false
            }),
            positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
        });

        return this.overlay.create(overlayConfig);
    }

    private createInjector(config: FilePreview): PortalInjector {
        const injectionTokens = new WeakMap();

        injectionTokens.set(FILE_PREVIEW_DIALOG_DATA, config);
        return new PortalInjector(this.injector, injectionTokens);
    }

}

export const FILE_PREVIEW_DIALOG_DATA = new InjectionToken<FilePreview>('FILE_PREVIEW_DIALOG_DATA');
