import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { openDialog } from './modal-question/function/open-dialog.function';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private http: HttpClient, private matDialog: MatDialog) {
    this.http
      .get('http://localhost:3000/posts')
      .subscribe(
        () => openDialog(this.matDialog, { title: 'Test request', text: 'Success test request', okButtonText: 'OK' }),
        () => openDialog(this.matDialog, { title: 'Test request', text: 'Error test request', okButtonText: 'OK' })
      );
  }
}
