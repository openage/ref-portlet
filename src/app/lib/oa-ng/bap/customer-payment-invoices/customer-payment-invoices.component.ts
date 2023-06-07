import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavService, UxService } from 'src/app/core/services';
import { InvoiceListBaseComponent } from 'src/app/lib/oa/bap/components/invoice-list-base.component';
import { Invoice } from 'src/app/lib/oa/bap/models/invoice.model';
import { InvoiceService } from 'src/app/lib/oa/bap/services';
import { Task } from 'src/app/lib/oa/directory/models/task.model';
import { VoucherNewDialogComponent } from '../voucher-new-dialog/voucher-new-dialog.component';
import { Folder } from 'src/app/lib/oa/drive/models';
import { FileDetailComponent } from '../../drive/file-detail/file-detail.component';

@Component({
  selector: 'bap-customer-payment-invoices',
  templateUrl: './customer-payment-invoices.component.html',
  styleUrls: ['./customer-payment-invoices.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class CustomerPaymentInvoicesComponent extends InvoiceListBaseComponent {

  @ViewChildren('documents') documentComponents: QueryList<FileDetailComponent>;

  isProcessing = false;
  selectedIndex: number;
  driveOptions: any;
  validations: any = {};


  task: Task;
  elementList: any[] = [];
  actionSelectedIndex: number = 0;

  @Input() items: any[];
  @Input() searchParams: any = { code: '', isPayable: false };

  constructor(
    public api: InvoiceService,
    public uxService: UxService,
    public navService: NavService,
    private dialog: MatDialog

  ) {
    super(api, uxService);
    this.onInit()
  }

  onInit(): void {
    this.driveOptions = {
      handleError: true,
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
    if (!this.items.length) {
      this.items.push(new Invoice())
    }
  }
  ngAfterViewInit(): void {
    this.documentComponents.changes.subscribe(c => {
      this.elementList = []
      c.toArray().forEach(item => {
        this.elementList.push(item)
      })
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

  onExpand(item): void {
    if (!!item.isSelected) {
      item.isSelected = !item.isSelected;
    } else {
      this.items.forEach((i) => i.isSelected = false);
      item.isSelected = true;
    }
  }

  onSelectJob(code: string) {
    this.navService.goto(`/freight/orders/${code}`);
  }

  openDialog(custCode) {
    // const dialogRef = this.dialog.open(CustomerDialogComponent, { data: { customerCode: custCode }, width: '70%' });
  }
  actionClicked(event, index) {
    this.actionSelectedIndex = index;
  }
  addNewInvoice() {
    this.items.push(new Invoice())
  }
  onRemoveInvoice(item, index) {
    this.items.splice(index, 1)
  }
}
