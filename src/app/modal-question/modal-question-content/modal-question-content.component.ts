import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ModalQuestionContentDialogModel } from '../model/modal-question-content-dialog.model';

@Component({
  selector: 'app-modal-question-content',
  templateUrl: './modal-question-content.component.html',
  styleUrls: ['./modal-question-content.component.scss']
})
export class ModalQuestionContentComponent {
  constructor(
    // public dialogRef: MatDialogRef<ModalQuestionContentComponent>,
    @Inject(MAT_DIALOG_DATA) readonly data: ModalQuestionContentDialogModel
  ) {
    if (data.hasCancel !== undefined && data.hasCancel !== null) {
      data.hasCancel = false;
    }
  }
}
