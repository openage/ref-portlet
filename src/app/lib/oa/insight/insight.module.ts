import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { JournalService } from './services/journal.service';
import { ReportAreaService } from './services/report-area.service';
import { ReportDataService } from './services/report-data.service';
import { ReportTypeService } from './services/report-type.service';
import { ReportService } from './services/report.service';
import { StatGridService } from './services/stat-grid.service';
import { TagTypeService } from './services/tag-type.service';
import { TagService } from './services/tag.service';

const angularModules = [CommonModule];
const thirdPartyModules = [];

const services = [
  ReportService,
  ReportTypeService,
  ReportAreaService,
  StatGridService,
  JournalService,
  ReportDataService,
  TagTypeService,
  TagService
];

const guards = [];
const sharedComponents = [];
const pipes = [];

@NgModule({
  imports: [
    ...angularModules,
    ...thirdPartyModules
  ],
  exports: [
    ...angularModules,
    ...thirdPartyModules,
    ...sharedComponents,
    ...pipes
  ],
  declarations: [
    ...sharedComponents,
    ...pipes
  ],
  providers: [
    ...services,
    ...guards
  ]
})
export class InsightModule { }
