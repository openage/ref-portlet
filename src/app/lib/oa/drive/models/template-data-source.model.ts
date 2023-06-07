export class TemplateDataSource {
  type: string; // 'http' | 'file' | 'mysql' | 'mongodb' | 'mssql';
  key: string;
  // should come from provider type
  connectionString: string;
  meta: any; // headers in case of http
  config: any;
  field: string;
  params: { key: string, value: string }[] = []; // includes dataId

  constructor(obj?: any) {

    if (!obj) {
      return;
    }

    this.type = obj.type;
    this.connectionString = obj.connectionString;
    this.meta = obj.meta;
    this.field = obj.field || 'items';
    this.params = obj.params || [];
    this.key = obj.key;
    this.config = obj.config || {};
  }

}
