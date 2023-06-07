export class Endpoint {
  headers: Map<string, string>;
  url: string;

  constructor(obj?: any) {
    if (!obj) { return; }
    this.url = obj.url;
    this.headers = obj.headers;
  }

  example: {
    url: 'http://send-it-api.mindfulsas.com/api/summary',
    headers: [{'x-role-key': '[[X-ROLE-KEY]]'}]
  };
}
