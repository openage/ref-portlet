import { ClipboardModule } from '@angular/cdk/clipboard';
import { OverlayModule } from '@angular/cdk/overlay';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OaCoreModule } from 'src/app/lib/oa-ng/core/core.module';
import { OaSendItModule } from 'src/app/lib/oa-ng/send-it/oa-send-it.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { OaSharedModule } from 'src/app/lib/oa-ng/shared/oa-shared.module';
import { EnvironmentService } from './lib/oa/core/services/environment.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    OaCoreModule,
    OverlayModule,
    ClipboardModule,
    OaSharedModule,
    OaSendItModule,
    HttpClientModule,
    AppRoutingModule,
    MatSidenavModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    Title,
    DatePipe,
    EnvironmentService,
    {
      provide: APP_INITIALIZER,
      useFactory: (service: EnvironmentService) => () => service.init(),
      deps: [EnvironmentService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
