import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { ModalQuestionContentComponent } from './modal-question-content/modal-question-content.component';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  declarations: [ModalQuestionContentComponent],
  exports: [ModalQuestionContentComponent],
  entryComponents: [ModalQuestionContentComponent]
})
export class ModalQuestionModule {}
