import { ErrorHandler, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { Employee } from '../models';
import { EmployeeService } from '../services';

@Directive()
export abstract class EmployeeViewerBaseComponent extends DetailBase<Employee> implements OnInit, OnChanges {

  @Input()
  code: string;

  @Input()
  readonly: boolean;

  employee: Employee;

  complete: EventEmitter<any> = new EventEmitter();

  constructor(
    api: EmployeeService,
    private errorHandler: ErrorHandler,
    public route: ActivatedRoute,
    public router: Router

  ) {
    super({ api, errorHandler });
  }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.get(this.code).subscribe((data) => {
      this.employee = new Employee(data);
    });
  }
}
