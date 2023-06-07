import { Organization, Service, Tenant } from '../../directory/models';
import { Link } from '../structures';
import { ModelBase } from './model-base.model';
import { Pic } from './pic.model';
import { Theme } from './theme.model';

export class Application extends ModelBase {
  env: string;
  title: string;
  host: string;
  logo: Pic;
  version: string;
  theme: Theme;
  styles: string[];
  links: any;
  navs: Link[];
  services: Service[];

  level: string;
  tenant: Tenant;
  organization: Organization;

  constructor(obj?: any) {
    super(obj)

    if (!obj) {
      return;
    }
    this.host = obj.host;

    this.title = obj.title || obj.name;
    this.version = obj.version || '1.0.0';

    if (obj.theme) {
      this.theme = new Theme(obj.theme);
    }

    this.styles = obj.styles || [];
    this.env = obj.env || 'prod';
    this.level = obj.level;

    if (obj.logo) {
      this.logo = new Pic(obj.logo)
    }

    if (obj.navs) {
      this.navs = obj.navs.map((n) => new Link(n));
    }

    if (obj.links) {
      this.links = obj.links;
    }

    if (obj.services) {
      this.services = obj.services.map((s) => new Service(s));
    }

    if (obj.tenant) {
      this.tenant = new Tenant(obj.tenant);
    }

    if (obj.organization) {
      this.organization = new Organization(obj.organization);
    }
  }
}
