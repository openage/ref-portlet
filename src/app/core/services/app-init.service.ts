import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { EnvironmentService } from 'src/app/lib/oa/core/services/environment.service';
import { UxService } from './ux.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  constructor(
    private injector: Injector
  ) { }

  get environmentService(): EnvironmentService {
    return this.injector.get(EnvironmentService);
  }

  get router(): Router {
    return this.injector.get(Router);
  }

  get uxService(): UxService {
    return this.injector.get(UxService);
  }

  public init = async () => {
    // let application = await this.environmentService.get()
    // let theme = application.theme;

    // if (theme?.style) {
    //   this.uxService.addStyle('theme', application.theme.style);
    // }

    // if (theme?.icon) {
    //   this.uxService.addStyle('icon', application.theme.icon);
    // }

    // let styleCount = 0

    // for (const style of application.styles) {
    //   this.uxService.addStyle(`style-${styleCount++}`, style);
    // }

    // if (t.level === 'new') {
    //   this.router.navigate(['landing', 'register'], { queryParams: { code: t.code, host: t.host } });
    // }


  }
}
