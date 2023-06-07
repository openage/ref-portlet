import { ReportParam, ReportType } from '.';

export class Report {
  id: string;
  type: ReportType;
  params: ReportParam[] = [];

  requestedAt: string;
  startedAt: string;
  completedAt: string;

  filePath: string;
  url: string;
  config: any;

  error: string;
  status: string;
}
