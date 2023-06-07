import { ColumnModel } from "../../core/models";

export class ReportColumn extends ColumnModel {
  isEmit?: boolean;
  dbKey: string;

  keys?: string[];
  values?: string[];

  constructor(obj?: any) {
    super(obj);
    if (!obj) { return; }
    this.keys = obj.keys || [];
    this.values = obj.values || [];
    this.dbKey = obj.dbKey;
  }
}
