export class PageOptions {
  public offset: number;
  public limit: number;
  public sort: any;
  query: any;
  path: any;
  skipSubjectStore: boolean;

  constructor(obj?: any) {
    if (!obj) { return; }
    if (obj.limit) {
      this.limit = obj.limit;
      this.offset = obj.offset || 0;
    }

    this.sort = obj.sort;
    this.path = obj.path;
    this.skipSubjectStore = obj.skipSubjectStore;
  }
}
