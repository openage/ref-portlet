import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavService, UxService } from 'src/app/core/services';
import { InvoiceListBaseComponent } from 'src/app/lib/oa/bap/components/invoice-list-base.component';
import { Invoice } from 'src/app/lib/oa/bap/models/invoice.model';
import { InvoiceService } from 'src/app/lib/oa/bap/services';
import { Task } from 'src/app/lib/oa/directory/models/task.model';
import { VoucherNewDialogComponent } from '../voucher-new-dialog/voucher-new-dialog.component';
import { Doc, Folder } from 'src/app/lib/oa/drive/models';
import { FileDetailComponent } from '../../drive/file-detail/file-detail.component';
import { DocumentService, FolderService } from 'src/app/lib/oa/drive/services';
import { FilePreviewService } from 'src/app/core/services/file-preview.service';
import { Entity } from 'src/app/lib/oa/core/models';
import { RoleService } from 'src/app/lib/oa/core/services';
import { InvoiceHelperService } from 'src/app/lib/oa/bap/services/invoice-helper.service';

@Component({
  selector: 'bap-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class InvoiceListComponent extends InvoiceListBaseComponent {
  @ViewChildren('documents')
  documentComponents: QueryList<FileDetailComponent>;


  isProcessing = false;
  selectedIndex: number;
  driveOptions: any;
  validations: any = {};

  task: Task;
  elementList: any[] = [];
  actionSelectedIndex: number = 0;

  maxTaxPercentage = 18.5;

  @Input() view: 'srp-enquiry' | 'srp-invoices' | 'finance' = 'finance';

  constructor(
    public auth: RoleService,
    public api: InvoiceService,
    public uxService: UxService,
    public navService: NavService,
    private dialog: MatDialog,
    public documentService: DocumentService,
    public filePreviewService: FilePreviewService,
    private validationService: InvoiceHelperService

  ) {
    super(api, uxService);
    this.onInit()
  }

  onInit(): void {
    this.driveOptions = {
      handleError: true,
      createDefault: true,
      folder: new Folder({ code: 'root|invoice-detail' }),
      labelHidden: true,
      isPlaceholder: true,
      meta: {
        description: "",
        identifier: {
          label: "Invoice Number",
          required: true
        }
      }
    }
    this.validations['documents'] = (item) => {
      // console.log("onInit", this.elementList)
      const errors = [];
      let count = 0;

      const missingFile = this.elementList[this.actionSelectedIndex].missingFile(item.config.status);
      if (missingFile) {
        errors.push(`Invoice Document is required.`)
        return errors;
      }
      return true;
    };
  }

  ngAfterViewInit(): void {
    this.documentComponents.changes.subscribe(c => {
      this.elementList = []
      c.toArray().forEach(item => {
        this.elementList.push(item)
      });
    });
  }

  onRow(item, i) {
    this.selectedIndex = i;
  }

  onDateChange($event, item, type) {
    const payload = {
      id: item.id
    }
    switch (type) {
      case 'date':
        payload['date'] = $event;
        break;
      case 'receivedDate':
        payload['receivedDate'] = $event;
        break;
      case 'dueDate':
        payload['dueDate'] = $event;
        break;
    }
    this.save(payload);
  }

  setTask($event): void {
    this.task = $event;
  }

  updatedTask($event, item: Invoice) {
    item.status = $event.status;
  }

  requestForPayment(invoice: Invoice): void {
    const dialogRef = this.dialog.open(VoucherNewDialogComponent, {
      disableClose: true
    });
    const component = dialogRef.componentInstance;
    component.invoice = invoice;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onExpand(item, i): void {
    if (!!item.isSelected) {
      item.isSelected = !item.isSelected;
      this.selectedIndex = null;
    } else {
      this.items.forEach((i) => i.isSelected = false);
      item.isSelected = true;
      this.selectedIndex = i;
    }
  }

  onSelectJob(code: string) {
    this.navService.goto(`/freight/orders/${code}`, {}, { newTab: true });
  }

  openDialog(custCode) {
    // const dialogRef = this.dialog.open(CustomerDialogComponent, { data: { customerCode: custCode }, width: '70%' });
  }

  actionClicked(event, index) {
    this.actionSelectedIndex = index;
  }

  onDownload(type, task) {
    const orderCode: any = task.entity ? task.entity.id : '';
    const code = 'billing|invoices';
    if (orderCode) {
      task.processingDownload = true
      this.documentService.downloadById(code, task.id, type, { 'orderId': orderCode }).subscribe((data) => task.processingDownload = false)
    }
  }

  onSave(invoice): void {
    if (invoice.id) {
      this.update(invoice).subscribe((data) => {
        this.uxService.showInfo(`Invoice Successfully Updated`, `Invoice Update`);
      })
    } else {
      this.create(invoice).subscribe((data) => {
        this.uxService.showInfo(`Invoice Successfully Created`, `Invoice Create`);
      })
    }
  }

  onUpload(invoice, index): void {
    this.elementList[index]?.ngOnChanges();
  }

  onPreview(invoice: Invoice) {
    const entity = new Entity({ id: invoice.code, type: 'invoice' });
    let url = "https://dev-api.y-dff.com/drive/api/files/62a0aa46913bc709525e1006/streams?role-key=e9d3b0e4-8ab9-15df-b1ef-d924175cd904"

    const doc = new Doc({
      code: invoice.id,
      category: 'invoice',
      url,
      mimeType: 'img',
      content: { name: 'Invoice', url },
      entity
    });

    this.filePreviewService.open({
      folder: new Folder({
        type: 'invoice',
        code: 'root|invoice-detail',
        entity: { id: invoice.id, type: 'invoice' },
        visibility: 1
      }),
      doc,
      entity: new Entity({ id: invoice.id, type: 'invoice' }),
      options: { task: { code: invoice.meta.taskCode } },
      params: { invoice: invoice.id },
    }, 'invoice-list');
  }
}
