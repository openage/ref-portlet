import { Endpoint } from './endpoint.model';

export class Service {
  //  apps: Apps[];
  code: string;
  logo: string;
  name: string;
  url: string;
  endpoints: {
    api?: Endpoint,
    summary?: Endpoint
  };
  apps: {
    web?: string,
    android?: string,
    ios?: string
  };

  constructor(obj?: {
    code?: string,
    logo?: string,
    name?: string,
    url?: string,
    apps?: any,
    endpoints?: any,
  }) {
    if (!obj) {
      return;
    }

    this.code = obj.code;
    this.logo = obj.logo;
    this.name = obj.name;
    this.url = obj.url;
    this.apps = {};
    this.endpoints = {};

    if (obj.apps) {
      this.apps.web = obj.apps.web;
      this.apps.android = obj.apps.android;
      this.apps.ios = obj.apps.ios;
    }

    if (obj.endpoints) {
      this.endpoints.api = new Endpoint(obj.endpoints.api);
      this.endpoints.summary = new Endpoint(obj.endpoints.summary);
    }
  }
}
