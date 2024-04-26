import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../utils/message-dialog/message-dialog.component';

@Injectable({
    providedIn: 'root'
  })
  export class messageDialog{
    constructor(public dialog: MatDialog) { }

    async openDialogConfirmDelete(nomeTabela: string) {
        let dialogRef = this.dialog.open(MessageDialogComponent, {
        width: '250px',
        data: {
            title: 'Excluir ' + nomeTabela,
            message: 'Você tem certeza que gostaria de excluir?',
            buttonClose: 'Cancelar',
            buttonConfirm: 'Confirmar',
        }
        });
        try {
        const result = await dialogRef.afterClosed().toPromise();
        if (result === 'Confirmar') {
            return true;
        } 
        } catch (err) {
        console.error(err);
        }
        return false;
    }

    async openDialogConfirmDone(nomeTabela: string) {
        let dialogRef = this.dialog.open(MessageDialogComponent, {
        width: '250px',
        data: {
            title: 'Finalizar ' + nomeTabela,
            message: 'Você tem certeza que gostaria de finalizar?',
            buttonClose: 'Cancelar',
            buttonConfirm: 'Confirmar',
        }
        });
        try {
        const result = await dialogRef.afterClosed().toPromise();
        if (result === 'Confirmar') {
            return true;
        } 
        } catch (err) {
        console.error(err);
        }
        return false;
    }
    
  }