import { Component, Input, OnInit } from '@angular/core';
import { Employee } from 'src/app/lib/oa/directory/models';
import { EmployeeService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-employee-selector',
  templateUrl: './employee-selector.component.html',
  styleUrls: ['./employee-selector.component.css']
})
export class EmployeeSelectorComponent implements OnInit {

  isProcessing = false;

  items: Employee[];

  constructor(private employeeService: EmployeeService) {

  }

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.isProcessing = true;
    this.employeeService.search().subscribe((page) => {
      this.items = page.items;
      this.isProcessing = false;
    }, (err) => {
      this.isProcessing = false;
    });
  }
}
