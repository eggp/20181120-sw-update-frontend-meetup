import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SwUpdatesService } from './sw-update.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SwUpdateInterceptor } from './sw-update.interceptor';
import { ModalQuestionModule } from './modal-question/modal-question.module';
import { MatButtonModule, MatDialogModule } from '@angular/material';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    ModalQuestionModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [
    SwUpdatesService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SwUpdateInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class App2Module {
  constructor(swUpdateService: SwUpdatesService) {}
}
