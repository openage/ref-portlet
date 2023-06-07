import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { Organization } from '../models/organization.model';
import { OrganizationService } from '../services/organization.service';

@Directive()
export class OrganizationDetailBaseComponent extends DetailBase<Organization> implements OnChanges {

  @Input()
  code: string;

  afterProcessing: () => void;

  constructor(
    public uxService: UxService,
    public api: OrganizationService
  ) {
    super({
      api
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.code) {
      this.get(this.code).subscribe((item) => {
        if (this.afterProcessing) { this.afterProcessing(); }
      });
    }
  }


}
