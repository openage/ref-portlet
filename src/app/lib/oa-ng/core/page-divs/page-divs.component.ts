import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from '@angular/router';
import { NavService, UxService } from "src/app/core/services";
import { Entity, FieldEditorModel } from "src/app/lib/oa/core/models";
import { RoleService } from "src/app/lib/oa/core/services";
import { Action } from "src/app/lib/oa/core/structures";
import { ReportType } from "src/app/lib/oa/insight/models";
import { ReportTypeService } from "src/app/lib/oa/insight/services/report-type.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "core-page-divs",
  templateUrl: "./page-divs.component.html",
  styleUrls: ["./page-divs.component.scss"],
})
export class PageDivsComponent implements OnInit, OnChanges {
  isProcessing = false;

  @Input()
  reportTypeCode: string;

  @Input()
  reportTypes: ReportType[] = [];

  @Input()
  divs: any[] = [{
    code: "default"
  }];

  @Input()
  filters: any[] | FieldEditorModel[] = []

  @Input() // {code: '1002'}
  params: any = {};

  @Input()
  templates: TemplateRef<any>;

  @Input()
  columnTemplate: TemplateRef<any>;

  @Input()
  areaCode: string;

  @Input()
  entity: Entity;

  @Input()
  view = "grid";

  @Input()
  filterView = "inline";

  @Input()
  isEditing = false;

  @Output()
  selected: EventEmitter<any> = new EventEmitter();

  items = [];
  widgetArray = []

  @Input()
  text: any

  constructor(
    private router: Router,
    public auth: RoleService,
    private uxService: UxService,
    private navService: NavService,
    private reportTypeService: ReportTypeService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.areaCode && changes.areaCode.firstChange) {
      this.getArea();
    } if (!this.areaCode && changes.reportTypeCode && changes.reportTypeCode.firstChange) {
      this.getReportType();
    } else {
      this.init();
    }
  }
  init() {
    this.items = (this.divs || []).map((d) => this.initDiv(d));
    this.activateFirst(this.items);

    // this.filters = (this.filters || []).map(f => f instanceof FieldEditorModel ? f : new FieldEditorModel(f))
    if (this.filters && this.filters.length && this.widgetArray.length) {
      this.widgetArray.forEach(w => {
        let widgetFilter = []
        if (w.params) {
          for (const key in w.params) {
            find: {
              for (const f of widgetFilter) {
                if (w.params[key] === f['value']) {
                  break find;
                }
              }
              widgetFilter.push({ 'key': key, value: w.params[key] });
            }
          }
          if (this.text) {
            w.config.text = this.text
          }
        }
        if (this.text) {
          w.config.text = this.text
        }
        widgetFilter.push(...this.filters);
        this.onApplyFilter(w, widgetFilter);
      })
    }
  }

  activateFirst(divs) {
    if (!divs || !divs.length) {
      return;
    }
    divs[0].isSelected = true;

    divs.forEach(item => {
      if (item.divs?.items) {
        let permittedDiv = [];
        item.divs?.items.forEach((item) => {
          if (this.auth.hasPermission(item.permissions)) {
            permittedDiv.push(item);
          }
        })
        if (permittedDiv.length && permittedDiv.length >= 1) {
          permittedDiv.forEach((div) => {
            div.isSelected = false;
          })
          permittedDiv[0].isSelected = true;
        }
      }
      else {
        this.activateFirst(item.divs?.items);
      }
    });
  }

  initDiv(div: any) {
    let style = div.style || {};

    if (style.container) {
      let containerStyle = style.container || {};
      div.style = div.style || containerStyle.style;
      div.class = div.class || containerStyle.class;
    }

    let title = div.title;
    if (div.title) {
      let titleStyle = style.title || {};

      if (typeof title === "string") {
        div.title = {
          text: title,
          style: titleStyle.style,
          class: titleStyle.class,
        };
      } else {
        div.title = {
          text: title.text,
          style: title.style || titleStyle.style,
          class: title.class || titleStyle.class,
        };
      }
    }

    let bodyStyle = style.body || {};
    let body = div.body || {};

    div.body = {
      style: body.style || bodyStyle.style,
      class: body.class || bodyStyle.class,
      html: body.html,
    };

    let widgets = [];
    let widgetStyle = style.widgets || {};

    if (div.widgets) {
      if (Array.isArray(div.widgets)) {
        widgets = [...div.widgets];
      } else {
        widgets = [...div.widgets.items];
        widgetStyle.class = div.widgets.class || widgetStyle.class;
        widgetStyle.style = div.widgets.style || widgetStyle.style;
      }
    }

    if (this.reportTypes && div.code) {
      widgets.push(...this.reportTypes.filter((t) =>
        t.container &&
        t.container.code === div.code &&
        !widgets.find(w => w.code === t.code)));

      this.widgetArray.push(...this.reportTypes.filter((t) =>
        t.container &&
        t.container.code === div.code &&
        !this.widgetArray.find(w => w.code === t.code)));
    }

    if (widgets.length) {
      div.widgets = {
        style: widgetStyle.style,
        class: widgetStyle.class,
        items: widgets.map((w) => this.initWidgetSection(w)),
      };
    }

    let divs = [];
    let divsStyle = style.divs || {};

    if (div.divs) {
      if (Array.isArray(div.divs)) {
        divs = div.divs;
      } else {
        divs = div.divs.items || [];
        divsStyle.class = div.divs.class || divsStyle.class;
        divsStyle.style = div.divs.style || divsStyle.style;
        divsStyle.view = div.divs.view || divsStyle.view || div.view;
      }
    }

    if (divs.length) {
      div.divs = {
        style: divsStyle.style,
        class: divsStyle.class,
        view: divsStyle.view,
        items: divs.map((d) => this.initDiv(d)),
      };
    }

    return div;
  }

  initWidgetSection(item: any) {
    const style = item.style || {};
    const widget = item.widget || {};
    const widgetStyle = widget.style || {};

    item.container = item.container || {};


    let containerStyle = widgetStyle.container || style.container || {};
    item.container.style = item.container.style || containerStyle.style;
    item.container.class = item.container.class || containerStyle.class;

    let title = widget.title || item.title || item.name;

    if (title) {
      let titleStyle = widgetStyle.title || style.title || {};

      if (typeof title === "string") {
        item.title = {
          text: title,
          style: titleStyle.style,
          class: titleStyle.class,
        };
      } else {
        item.title = {
          text: title.text,
          style: title.style || titleStyle.style,
          class: title.class || titleStyle.class,
        };
      }
    }

    let bodyStyle = widgetStyle.body || style.body || {};
    let body = item.body || {};

    item.body = {
      style: body.style || bodyStyle.style,
      class: body.class || bodyStyle.class,
      html: body.html,
    };

    return item;
  }

  onSelect(item: any) {
    this.selected.emit(item);
  }

  onTabSelect(item, divs) {
    divs.forEach((div) => {
      div.isSelected = false;
    });
    item.isSelected = true;
  }

  onItemEdit(item) {
    this.navService.goto('console.report.editor', {
      path: {
        code: item.code
      }
    });
    // window.open(`${environment.links.console}/system/report-types/${item.code}`, '_blank');
    // this.navService.goto(new Entity({ type: "report-type", code: item.code }));
  }

  onApplyFilter(item, $event) {
    item.params = { ...this.params };
    if (this.entity && this.entity?.code) {
      item.params[this.entity.type] = this.entity.code;
    }
    ($event || []).forEach(e => {
      item.params[e.key] = e.value;
    })

    // cannot override the values from the config - replace them
    item.config = item.config || {};
    if (item.config.params) {
      for (const key in item.config.params) {
        item.params[key] = item.config.params[key];
      }
    }

    item.version = new Date();
  }
  getAction(item, action: Action) {
    if (action.options) {
      for (const option of action.options) {
        switch (option.code) {
          case 'download':
            option.event = () => {
              const service = this.auth.getService('insight');
              const url = `${service.url}/reportTypes/${item.type.code}/download`;
              this.navService.goto(url, {}, { newTab: true });
            };
            break;
        }
      }
    }
    return action;
  }

  getReportType() {
    this.isProcessing = true;
    this.reportTypeService.get(this.reportTypeCode).subscribe(
      (reportType) => {
        this.reportTypes = reportType ? [reportType] : [];
        this.reportTypes.forEach(r => {
          if (r.config?.actions) {
            r.actions = [new Action(r.config.actions)]
          }
        });
        this.init();
        this.isProcessing = false;
      },
      (err) => {
        this.isProcessing = false;
        this.uxService.handleError(err);
      }
    );
  }

  getArea() {
    this.isProcessing = true;
    this.reportTypeService.search({ areaCode: this.areaCode }).subscribe(
      (page) => {
        this.reportTypes = page.items || [];
        this.reportTypes.forEach(r => {
          if (r.config?.actions) {
            r.actions = [new Action(r.config.actions)]
          }
        });
        this.init();
        this.isProcessing = false;
      },
      (err) => {
        this.isProcessing = false;
        this.uxService.handleError(err);
      }
    );
  }

  getDiv(code: string): any {
    const iteration = (div) => {
      if (div.code === code) {
        return div;
      } else if (div.divs && div.divs.length) {
        for (const childDiv of div.divs) {
          const iterator = iteration(childDiv);
          if (iterator) {
            return iterator;
          }
        }
      }
    };

    for (const div of this.divs || []) {
      const iterator = iteration(div);
      if (iterator) {
        return iterator;
      }
    }
  }
}
