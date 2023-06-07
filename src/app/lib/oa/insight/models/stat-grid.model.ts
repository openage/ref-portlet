import { ModelBase } from '../../core/models/model-base.model';
import { Stat } from './stat.model';

export class StatGrid extends ModelBase {

  icon: string;
  label: string;
  stats: Stat[] = [];

  constructor(obj?: any) {
    super();

    if (!obj) { return; }
    this.id = obj.id;

    this.icon = obj.icon;
    this.label = obj.label;

    if (obj.stats && obj.stats.length) {
      obj.stats.forEach((stat) => {
        this.stats.push(new Stat(stat));
      });
    }
  }
}
