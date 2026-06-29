import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-message-dialog-motivo',
  templateUrl: './message-dialog-motivo.component.html'
})
export class MessageDialogMotivoComponent {

  motivo = '';

  constructor(
    public dialogRef: MatDialogRef<MessageDialogMotivoComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {}


  confirmar(){
    this.dialogRef.close(this.motivo);
  }


  cancelar(){
    this.dialogRef.close(null);
  }

}