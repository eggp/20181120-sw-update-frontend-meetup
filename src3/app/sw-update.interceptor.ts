import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { SwUpdatesService } from './sw-update.service';
import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

@Injectable()
export class SwUpdateInterceptor implements HttpInterceptor {
  constructor(private swUpdatesService: SwUpdatesService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith('./assets/') || this.swUpdatesService.hasNewVersion$.getValue() === false) {
      return next.handle(req);
    } else {
      return this.swUpdatesService.hasNewVersion$.pipe(
        filter(hasNewVersion => hasNewVersion !== undefined && hasNewVersion === false),
        switchMap(() => next.handle(req))
      );
    }
  }
}
