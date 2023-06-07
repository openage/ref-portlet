import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InsightWidgetDialogComponent } from 'src/app/core/components/insight-widget-dialog/insight-widget-dialog.component';
import { NavService } from 'src/app/core/services/nav.service';
import { CalendarEvent } from 'src/app/lib/oa/insight/models/calendar-event.model';

@Component({
  selector: 'insight-calender-day-detail',
  templateUrl: './calender-day-detail.component.html',
  styleUrls: ['./calender-day-detail.component.css']
})
export class CalenderDayDetailComponent implements OnInit {

  @Input()
  events: CalendarEvent[] = [];

  @Input()
  filters: any[] = []

  @Input()
  areaCode: string

  divs = [
    {
      "code": "r-1",
      "permissions": [],
      "style": {
        "container": {
          "style": {
            "margin-top": "0px"
          }
        }
      }
    }
  ]
  constructor(
    public dialogRef: MatDialogRef<CalenderDayDetailComponent>,
    private navService: NavService,
    public dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  onStatSelect($event) {
    if ($event.dialog) {

      switch ($event.dialog) {
        case 'widget':
          this.dialog.open(InsightWidgetDialogComponent, {
            data: $event,
            width: '70%'
          });
      }

    } else if ($event.routerLink) {
      if ($event.params['route']) {
        let routerLink = $event.routerLink + "/" + $event.params['route'];
        let url = this.router.createUrlTree([routerLink]).toString();
        window.open(`${window.location.origin}/${url}`, '_blank');
      }
      else {
        this.navService.goto($event.routerLink, $event.params);
      }
    }
  }
}
