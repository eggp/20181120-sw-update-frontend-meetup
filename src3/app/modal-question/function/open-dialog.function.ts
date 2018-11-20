import { ModalQuestionContentComponent } from '../modal-question-content/modal-question-content.component';
import { ModalQuestionContentDialogModel } from '../model/modal-question-content-dialog.model';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

export function openDialog(
  dialog: MatDialog,
  data: ModalQuestionContentDialogModel,
  config?: MatDialogConfig
): MatDialogRef<ModalQuestionContentComponent> {
  if (dialog.openDialogs.length === 0) {
    const defaultConfig: MatDialogConfig = {
      closeOnNavigation: false,
      disableClose: true,
      width: '250px',
      data
    };
    return dialog.open(ModalQuestionContentComponent, config ? { ...defaultConfig, ...config } : defaultConfig);
  } else {
    return dialog.openDialogs[0];
  }
}

export function openOKDialog(
  redirectRoute: string,
  router: Router,
  dialog: MatDialog,
  data: ModalQuestionContentDialogModel,
  config?: MatDialogConfig
): MatDialogRef<ModalQuestionContentComponent> {
  const dialogRef = openDialog(dialog, data, config);
  dialogRef.afterClosed().subscribe(() => router.navigate([redirectRoute]));
  return dialogRef;
}
