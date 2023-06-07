import { Data } from './data.model';

export class Action {

  label: string; // 'Apply'
  type: string; // 'button' input methods
  operation: string; // 'httpGET,POST' 'intent',
  data: Data;
  await: boolean; // no need to wait for response

  constructor(obj?: any) {
    if (!obj) { return; }

    this.label = obj.label;
    this.type = obj.type;
    this.operation = obj.operation;
    this.data = obj.data;
    this.await = obj.await;
  }
}
