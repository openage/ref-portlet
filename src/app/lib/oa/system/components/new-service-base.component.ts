import { Directive, ErrorHandler, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DetailBase } from '../../core/structures';
import { Organization, Service, Tenant } from '../../directory/models';
import { Application } from '../../core/models';
import { ApplicationService } from '../services/application.service';

@Directive()
export class NewServiceBaseComponent extends DetailBase<Application> implements OnInit, OnChanges {

  @Input()
  application: Application;

  @Input()
  tenant: Tenant;

  @Input()
  org: Organization;

  service = new Service({});

  constructor(
    private api: ApplicationService,
    private errorHandler: ErrorHandler
  ) {
    super({ api, errorHandler });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() { }

  serviceCreate() {

    let validated = true;

    if (!this.service.name) {
      validated = false;
      this.errorHandler.handleError('Enter name');
    }

    if (!this.service.code) {
      validated = false;
      this.errorHandler.handleError('Enter code');
    }

    if (!this.service.url) {
      validated = false;
      this.errorHandler.handleError('Enter URL');
    }

    if (validated) {
      this.application.services.push(new Service(this.service));
      this.api.update(this.application.id, {
        services: this.application.services
      }).subscribe();
    }
  }
}
