import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { TenantAgentBaseComponent } from 'src/app/lib/oa/directory/components/tenant-agent-base.component';
import { DirectoryRoleService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-tenant-agent-list',
  templateUrl: './tenant-agent-list.component.html',
  styleUrls: ['./tenant-agent-list.component.css']
})
export class TenantAgentListComponent extends TenantAgentBaseComponent implements OnInit {

  @Input()
  view: 'table' | 'list' | 'grid' = 'table';

  constructor(
    private uxService: UxService,
    api: DirectoryRoleService,
    errorHandler: ErrorHandler
  ) {
    super(api, errorHandler);
  }

  ngOnInit() {
  }

  onRemove(item): void {
    this.uxService.onConfirm().subscribe(() => {
      this.remove(item);
      this.fetch();
      this.uxService.showInfo('Deleted');
    });
  }

}
