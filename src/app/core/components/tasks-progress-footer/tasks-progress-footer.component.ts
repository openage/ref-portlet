import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoleService } from 'src/app/lib/oa/core/services';
import { NavService, UxService } from '../../services';
import { forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';
import { Task } from '../../models/task.model'
@Component({
  selector: 'oa-core-tasks-progress-footer',
  templateUrl: './tasks-progress-footer.component.html',
  styleUrls: ['./tasks-progress-footer.component.css']
})
export class TasksProgressFooterComponent implements OnInit {

  @Input()
  items: Task[] = []

  isHidden: boolean = false
  isIntervalSet: boolean = false
  data: Subscription;
  timeOut: any;

  completeCount: number = 0
  inProgressCount: number = 0
  erroredCount: number = 0

  constructor(
    public uxService: UxService,
    public http: HttpClient,
    public auth: RoleService,
    private navService: NavService
  ) {
    this.items = this.items || []

    this.data = this.uxService.progressItem.subscribe((item: any) => {
      // console.log("1..........", this.items.length)
      item.type = item.type || 'upload';

      this.items.unshift(item);
      this.setCount()
      if (!this.isIntervalSet) { this.get() }
    });

  }

  ngOnInit(): void { }

  ngOnDestroy() {
    this.clear()
    this.data.unsubscribe();
  }

  get() {
    this.timeOut = setInterval(() => {
      this.isIntervalSet = true
      if (!this.getInProgressItems().items.length) return

      this.getCurrentProgress()
    }, 4000)
  }

  /**
   *
   * @returns --array (filter list of in-progress items)
   */
  getInProgressItems() {
    const items = this.items.filter(item => (item.status === 'new') || (item.status === 'in-progress') || (item.status === 'queued'))
    if (!items.length) {
      this.isIntervalSet = false;
      clearInterval(this.timeOut)
    }

    return { items }
  }

  /**
   *  --get current progress of each in-progess/queued items
   */
  getCurrentProgress() {
    let observables = this.getInProgressItems().items.map(item => this.http.get(item.url, { headers: this.getHeaders() }).pipe(first()))

    forkJoin(observables).subscribe((responses: any) => {
      if (!responses || !responses.length) {
        return;
      }
      this.setItems(responses)
      this.resetCount();
      this.setCount();
    }, (err) => { });
  }

  setItems(responses) {
    let downloads = []

    responses.forEach(response => {
      let item = this.items.find(item => item.id === response.data.id)
      item.progress = response.data.progress;
      item.status = response.data.status;

      if (item.type === 'download' && item.status === 'ready') {
        downloads.push(response.data)
      }
    });

    if (downloads.length) { this.download(downloads, 0) } //downloadable items
  }

  /**
   * ---set count of errored/complete/inProgress items
   */
  setCount() {
    this.erroredCount = this.items.filter(item => item.status === 'errored').length;
    this.completeCount = this.items.filter(item => item.status === 'complete' || item.status === 'ready').length;
    this.inProgressCount = this.items.filter(item => (item.status === 'new') || (item.status === 'queued') || (item.status === 'in-progress')).length;
  }

  resetCount() {
    this.completeCount = 0
    this.inProgressCount = 0
    this.erroredCount = 0
  }

  onSelect(item) {
    if (item.status !== 'complete' || !item.redirect || !item.redirect.url) return

    item.redirect.type = item.redirect.type || 'navigate'
    switch (item.redirect.type) {
      case 'navigate':
        this.navService.goto(item.redirect.url, {}, { newTab: true });
        break;
      case 'open':
        window.open(item.redirect.url, '_blank')
        break
      default:
        break
    }
  }

  /**
   * @param items --downloadable items
   * @param i --index
   */
  download(items, i) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = items[i].url;
    a.download = items[i].type.code;
    a.click();
    document.body.removeChild(a);

    if (i < items.length - 1) {
      setTimeout(() => {
        this.download(items, i + 1)
      }, 500)
    }
  }


  clear() {
    this.items = [];
    this.resetCount();
    this.isIntervalSet = false;
    clearInterval(this.timeOut);
  }

  private getHeaders() {
    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    });
    headers = headers.append('x-role-key', this.auth.currentRole().key);
    headers = headers.append('x-tenant-code', this.auth.currentTenant().code);
    return headers;
  }
}
