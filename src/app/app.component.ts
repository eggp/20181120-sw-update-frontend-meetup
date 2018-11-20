import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { openDialog } from './modal-question/function/open-dialog.function';
import { MatDialog } from '@angular/material';
import { SwUpdate } from '@angular/service-worker';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private http: HttpClient,
    private matDialog: MatDialog,
    private swUpdate: SwUpdate,
    @Inject(DOCUMENT) private document: Document
  ) {
    console.log('SW enabled: ', swUpdate.isEnabled);
    if (swUpdate.isEnabled) {
      this.checkSwUpdate();
    }

    this.getRequest();
  }

  private checkSwUpdate(): void {
    this.swUpdate.available.subscribe(() =>
      this.swUpdate.activateUpdate().then(() => {
        console.warn('Has a new version');
        openDialog(this.matDialog, { title: 'Update', text: 'Has a new version!', okButtonText: 'OK' })
          .afterClosed()
          .subscribe(() => this.document.location.reload());
      })
    );
    this.swUpdate.checkForUpdate();
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
