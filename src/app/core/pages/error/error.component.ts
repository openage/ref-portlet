import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';

@Component({
  selector: 'core-page-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit, OnDestroy {

  code: string;

  error: {
    code: string,
    title: string,
    image: string,
    description: string
  };

  errors = [{
    code: 'unknown',
    title: 'Something went wrong',
    image: 'error',
    description: 'We have notified the admin'
  }, {
    code: 'access-denied',
    title: 'Access Denied',
    image: 'error',
    description: 'You do not have access to this page'
  }, {
    code: 'not-found',
    title: 'Not Found',
    image: 'error',
    description: 'The page you are looking for does not exist'
  }];

  constructor(
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.code = this.route.snapshot.paramMap.get('code') || 'unknown';

    this.error = this.errors.find((e) => e.code.toLowerCase() === this.code.toLowerCase());

    this.setContext();
  }
  setContext() {
    this.uxService.setContextMenu(['close']);

  }

  ngOnDestroy() {
    this.uxService.reset();
  }

}
