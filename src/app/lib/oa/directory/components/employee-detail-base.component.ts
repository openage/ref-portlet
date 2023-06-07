import { ErrorHandler, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, Directive } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { IBreadcrumbHandler } from '../../core/services/breadcrumb-handler.interface';
import { IContextMenuHandler } from '../../core/services/context-menu-handler.interface';
import { IEntityHandler } from '../../core/services/entity-handler.interface';
import { IInputValidator } from '../../core/services/input-validator.interface';
import { ITitleHandler } from '../../core/services/title-handler.interface';
import { IWizStep } from '../../core/structures/wiz/wiz-step.interface';
import { Department, Designation, Employee } from '../models';
import { DepartmentService, DesignationService, EmployeeService } from '../services';

@Directive()
export abstract class EmployeeDetailBaseComponent extends DetailBase<Employee> implements OnInit, OnChanges {

  constructor(
    api: EmployeeService,
    private errorHandler: ErrorHandler,
    public route: ActivatedRoute,
    public router: Router,
    private breadcrumbHandler: IBreadcrumbHandler,
    private contextMenuHandler: IContextMenuHandler,
    private titleHandler: ITitleHandler,
    private entityHandler: IEntityHandler

  ) {
    super({ api, errorHandler });
  }

  @Input()
  code: string;

  @Input()
  readonly: boolean;

  employee: Employee;

  steps: IWizStep[] = [];
  complete: EventEmitter<any> = new EventEmitter();
  current: IWizStep;

  progressValue = 0;
  progressMode = 'determinate';
  isProcessing = false;
  afterProcessing: () => void;
  afterUpdate: (item) => void;

  abstract onSave(): Observable<any> | boolean;
  abstract wizInit(): void;

  ngOnInit() {
    this.wizInit();
    const code = this.route.snapshot.queryParams['step'];
    if (code) {
      this.selectStep(code);
    }

    this.route.queryParams.subscribe((query) => {
      if (query['step']) {
        this.selectStep(query['step']);
      }
    });

    if (code === '\'my\'') {
      this.readonly = true;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.get(this.code).subscribe((data) => {
      this.employee = new Employee(data);
      this.init();
    });
  }

  private init() {
    if (!this.properties.profile.lastName) {
      this.properties.profile.lastName = '';
    }
  }

  getStepIndex(code: string) {

    if (!code) {
      return 0;
    }
    const index = this.steps.findIndex((i) => i.code === code.toLowerCase().trim());
    if (index < 0) {
      return 0;
    }
    return index;
  }

  selectStep(code: string) {
    window.scroll(0, 0);
    if (code && this.current && this.current.code !== code && !this.current.validate() && this.current.required) {
      this.errorHandler.handleError(`invalid ${this.current.title}`);
      return;
    }

    this.steps.forEach((i) => i.isSelected = false);

    const index = this.getStepIndex(code);

    this.current = this.steps[index];

    this.current.isOpen = true;
    this.current.isSelected = true;

    this.titleHandler.setTitle(this.current.title);

    this.breadcrumbHandler.replaceBreadcrumb({
      title: this.current.title
    });

    const contextMenu = [];

    if (index > 0) {
      const previousStep = this.steps[index - 1];
      contextMenu.push({
        type: 'raised',
        title: 'Previous',
        event: () => this.selectStep(previousStep.code)
      });
    }

    if (index < this.steps.length - 1) {
      const nextStep = this.steps[index + 1];
      contextMenu.push({
        type: 'primary',
        title: 'Next',
        event: () => {
          if (this.current.validate() !== true && this.current.required) {
            this.errorHandler.handleError(`invalid ${this.current.title} : ${this.current.validate()}`);
            return;
          }
          const retVal = this.current.complete();

          if (typeof retVal === 'boolean') {
            if (retVal) {
              this.selectStep(nextStep.code);
            }
          } else {
            retVal.subscribe((item) => {
              this.afterUpdate(item);
              this.selectStep(nextStep.code);
            });
          }

        }
      });
    } else {
      contextMenu.push({
        type: 'primary',
        title: 'Complete',
        event: () => {
          if (this.current.validate() !== true && this.current.required) {
            this.errorHandler.handleError(`invalid ${this.current.title} : ${this.current.validate()}`);
            return;
          }
          const retVal = this.current.complete();
          if (typeof retVal === 'boolean') {
            if (retVal) {
              const finalValue = this.onSave();
              if (typeof finalValue === 'boolean') {
                if (finalValue) {
                  this.complete.emit();
                }
              } else {
                finalValue.subscribe(() => {
                  this.complete.emit();
                });
              }
            }
          } else {
            retVal.subscribe(() => {
              const finalValue = this.onSave();
              if (typeof finalValue === 'boolean') {
                if (finalValue) {
                  this.complete.emit();
                }
              } else {
                finalValue.subscribe(() => {
                  this.complete.emit();
                });
              }
            });
          }
        }
      });
    }

    this.contextMenuHandler.resetContextMenu();
    this.contextMenuHandler.setContextMenu(contextMenu);
    this.progressCalculator();

  }
  progressCalculator() {
    const completed = this.steps.filter((s) => s.isComplete).length;
    this.progressValue = completed / this.steps.length;
  }
}
