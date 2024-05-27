import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../utils/message-dialog/message-dialog.component';

@Injectable({
    providedIn: 'root'
  })
  export class messageDialog{
    confirmationInput: string = '';
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

    async openDialogConfirmDocente() {
      let dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '400px',
      data: {
          title: 'Importarção de Docentes',
          message: `
          <p>Os servidores cadastrados serão atribuídos com o cargo de <strong>PROFESSORES</strong>.</p>
          <p>Deseja continuar a importação?</p>
          <p>Formatos aceitos: .XLSX e . XLS</p>
        `,
          buttonClose: 'Cancelar',
          buttonConfirm: 'Continuar',
      }
      });
      try {
      const result = await dialogRef.afterClosed().toPromise();
      if (result === 'Continuar') {
          return true;
      }
      } catch (err) {
      console.error(err);
      }
      return false;
  }

  
  async openDialogRemoveDisciplina() {
    let dialogRef = this.dialog.open(MessageDialogComponent, {
        width: '400px',
        data: {
            title: 'ATENÇÃO',
            message: `
                <p><strong>ATENÇÃO:</strong> Ao remover a disciplina, o PEE correspondente será <strong>excluído permanentemente</strong> do sistema.</p>
                <p>Tem certeza que deseja remover:</p>
            `,
            buttonClose: 'Não',
            buttonConfirm: 'Sim',
        }
    });

    try {
        const result = await dialogRef.afterClosed().toPromise();
        if (result === 'Sim') {
            return true;
        }
    } catch (err) {
        console.error(err);
    }
    return false;
}

async openDialogRemoveProfessor() {
    let dialogRef = this.dialog.open(MessageDialogComponent, {
        width: '400px',
        data: {
            title: 'ATENÇÃO',
            message: `
                <p>Tem certeza que deseja remover o professor:</p>
            `,
            buttonClose: 'Não',
            buttonConfirm: 'Sim',
        }
    });

    try {
        const result = await dialogRef.afterClosed().toPromise();
        if (result === 'Sim') {
            return true;
        }
    } catch (err) {
        console.error(err);
    }
    return false;
}


}
