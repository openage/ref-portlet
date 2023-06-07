import { Input, OnChanges, OnInit, SimpleChanges, Directive } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { Project, Release, Workflow } from '../models';
import { TimeLine } from '../models/timeline.model';
import { ReleaseService } from '../services';

@Directive()
export class ReleaseDetailBaseComponent extends DetailBase<Release> implements OnInit {

  @Input()
  code: string;

  @Input()
  project: string;

  constructor(
    public uxService: UxService,
    public api: ReleaseService
  ) {
    super({
      api
    });
  }

  ngOnInit() {
    if (this.code) {
      this.get(this.code).subscribe((r) => {
        this.properties = new Release(r);
      })
    } else {
      this.set(new Release({ project: new Project({ code: this.project }) }))
    }
  }

  setPlanDate(date) {
    this.properties.plan = new TimeLine({ finish: date })
  }

  setWorkflow() {
    switch (this.properties.type) {
      case "major":
        this.properties.workflow = new Workflow({ code: 'release|major' })
        break;
      case "minor":
        this.properties.workflow = new Workflow({ code: 'release|minor' })
        break;
      case "patch":
        this.properties.workflow = new Workflow({ code: 'release|patch' })
        break
      default:
        this.properties.workflow = new Workflow({ code: 'release|major' })
        break;
    }
  }

}
