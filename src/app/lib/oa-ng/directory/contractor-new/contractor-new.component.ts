import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UxService, ValidationService } from 'src/app/core/services';
import { NewContractorBaseComponent } from 'src/app/lib/oa/directory/components/new.contractors-base.component';
import { ContractorService } from 'src/app/lib/oa/directory/services/contractor.service';

@Component({
  selector: 'directory-contractor-wiz',
  templateUrl: './contractor-new.component.html',
  styleUrls: ['./contractor-new.component.css']
})
export class ContractorNewComponent extends NewContractorBaseComponent implements OnInit {

  constructor(
    public validationService: ValidationService,
    api: ContractorService,
    uxService: UxService
  ) {
    super(api, uxService);
  }

  ngOnInit() {
  }
}
