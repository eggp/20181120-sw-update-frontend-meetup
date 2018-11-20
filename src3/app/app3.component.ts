import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwUpdatesService } from './sw-update.service';
import { environment } from '../environments/environment';
import { openDialog } from './modal-question/function/open-dialog.function';
import { MatDialog } from '@angular/material';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app3.component.html'
})
export class App3Component {
  constructor(
    private http: HttpClient,
    private swUpdatesService: SwUpdatesService,
    private matDialog: MatDialog,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.detectRemoteOnlineVersion();

    this.getRequest();
  }

  private detectRemoteOnlineVersion(): void {
    if (this.swUpdatesService.swu.isEnabled === false) {
      return;
    }
    try {
      let first = true;
      const source = new EventSource('https://frontendmeetup.firebaseio.com/versions/prod.json');
      source.addEventListener(
        'put',
        (e: any) => {
          if (first === true) {
            first = false;
            return;
          }
          const data = JSON.parse(e.data);
          if (data['path'] === '/' && data['data'] !== null && environment.VERSION !== data['data']) {
            console.warn('New version avaiable: ', data['data']);
            this.swUpdatesService.swu.checkForUpdate().then(() => {
              openDialog(this.matDialog, { title: 'Update', text: 'Has a new version', okButtonText: 'OK' })
                .afterClosed()
                .subscribe(() => this.document.location.reload());
            });
          } else {
            console.warn('Wrong eventSource data: ', data, 'current version: ', environment.VERSION);
          }
        },
        false
      );
    } catch (ex) {
      console.warn('EventSource error: ', ex);
    }
  }

  private getRequest(): void {
    this.http
      .get('http://localhost:3000/posts')
      .subscribe(
        () => openDialog(this.matDialog, { title: 'Test request', text: 'Success test request', okButtonText: 'OK' }),
        () => openDialog(this.matDialog, { title: 'Test request', text: 'Error test request', okButtonText: 'OK' })
      );
  }
}
