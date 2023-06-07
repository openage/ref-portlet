import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'oa-under-construction',
  templateUrl: './under-construction.component.html',
  styleUrls: ['./under-construction.component.css']
})
export class UnderConstructionComponent implements OnInit {

  @Input()
  view: 'commingSoon' | 'wip' | 'serverDown' = 'wip';

  @Input()
  title: string;

  constructor() { }

  ngOnInit() {
    this.title = this.title || 'Work In Progress';

    if (this.view === 'serverDown') {
      this.title = 'The Server is currently down'
    }

  }

}
