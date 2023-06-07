import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { IApi } from 'src/app/lib/oa/core/services';
import { Employee } from 'src/app/lib/oa/directory/models';
import { EmployeeService } from 'src/app/lib/oa/directory/services';
import { FileUploaderComponent } from 'src/app/lib/oa-ng/shared/components/file-uploader/file-uploader.component';

@Component({
  selector: 'directory-employee-uploader',
  templateUrl: './employee-uploader.component.html',
  styleUrls: ['./employee-uploader.component.css']
})
export class EmployeeUploaderComponent implements OnInit {

  uploader: IApi<Employee>;

  @ViewChild('fileUploader')
  fileUploaderComponent: FileUploaderComponent;

  samples = [
    {
      name: 'Add Employee',
      mapper: 'default',
      url: 'assets/formats/add-new-employee.xlsx'
    }, {
      name: 'Update Employee',
      mapper: 'default',
      url: 'assets/formats/update-employee.xlsx'
    },
    {
      name: 'Update Biometric',
      mapper: 'default',
      url: 'assets/formats/update-employee-biometricId.xlsx'
    },
    {
      name: 'Update Status',
      mapper: 'default',
      url: 'assets/formats/update-employee-status.xlsx'
    }, {
      name: 'Update Code',
      mapper: 'default',
      url: 'assets/formats/update-employee-code.xlsx'

    }];

  constructor(
    public dialog: MatDialogRef<EmployeeUploaderComponent>,
    private employeeService: EmployeeService,
    private uxService: UxService
  ) { }

  ngOnInit() {
    this.uploader = this.employeeService;
  }

  onCancel() {
    this.dialog.close();
  }

  onUpload() {
    this.fileUploaderComponent.upload().subscribe((message) => {
      message = message || 'Done';
      this.uxService.showInfo(message);
      this.dialog.close();
    }, (err) => {
      this.uxService.handleError(err);
    });
  }

}
