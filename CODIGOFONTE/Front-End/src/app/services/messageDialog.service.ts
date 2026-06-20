import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../utils/message-dialog/message-dialog.component';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class messageDialog {

  constructor(
  public dialog: MatDialog
) {}

  // ✅ APROVAR RED
async openDialogConfirmAprovarRED() {
  const dialogRef = this.dialog.open(MessageDialogComponent, {
    width: '400px',
    autoFocus: false,
    data: {
      title: 'Aprovar RED',
      message: 'Tem certeza que deseja aprovar este RED?',
      buttonClose: 'Cancelar',
      buttonConfirm: 'Aprovar',
    }
  });

  try {
    const result = await firstValueFrom(dialogRef.afterClosed());
    return result === 'Aprovar';
  } catch (err) {
    console.error(err);
    return false;
  }
}

// ❌ RECUSAR RED
async openDialogConfirmRecusarRED() {
  const dialogRef = this.dialog.open(MessageDialogComponent, {
    width: '400px',
    autoFocus: false,
    data: {
      title: 'Recusar RED',
      message: 'Tem certeza que deseja recusar este RED?',
      buttonClose: 'Cancelar',
      buttonConfirm: 'Recusar',
    }
  });

  try {
    const result = await firstValueFrom(dialogRef.afterClosed());
    return result === 'Recusar';
  } catch (err) {
    console.error(err);
    return false;
  }
}

  // 🔴 EXCLUIR
  async openDialogConfirmDelete(nomeTabela: string) {
    let dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '250px',
      autoFocus: false, // ✅ REMOVE FOCO AUTOMÁTICO
      data: {
        title: 'Excluir ' + nomeTabela,
        message: 'Você tem certeza que gostaria de excluir?',
        buttonClose: 'Cancelar',
        buttonConfirm: 'Confirmar',
      }
    });

    try {
      const result = await dialogRef.afterClosed().toPromise();
      return result === 'Confirmar';
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  // 🟡 FINALIZAR
  async openDialogConfirmDone(nomeTabela: string) {
    let dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '400px',
      autoFocus: false,
      data: {
        title: 'Finalizar RED?',
        message: 'Você tem certeza que gostaria de finalizar?',
        buttonClose: 'Cancelar',
        buttonConfirm: 'Confirmar',
      }
    });

    try {
      const result = await dialogRef.afterClosed().toPromise();
      return result === 'Confirmar';
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async openDialogConfirmREDDone(nomeTabela: string) {
    let dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '400px',
      autoFocus: false,
      data: {
        title: 'Finalizar RED?',
        message: 'Você tem certeza que gostaria de finalizar o RED?',
        buttonClose: 'Cancelar',
        buttonConfirm: 'Confirmar',
      }
    });

    try {
      const result = await dialogRef.afterClosed().toPromise();
      return result === 'Confirmar';
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async openDialogConfirmImportacao(tipo: string) {

    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '400px',
      data: {
        title: 'Importação',
        message: `Deseja importar ${tipo}?`,
        buttonClose: 'Cancelar',
        buttonConfirm: 'Confirmar',
      }
    });

    return await firstValueFrom(dialogRef.afterClosed());
  }

  // 🟢 IMPORTAÇÃO DOCENTES
  async openDialogConfirmDocente() {
    let dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '400px',
      autoFocus: false, // 🔥 AQUI RESOLVE SEU PROBLEMA
      panelClass: 'custom-dialog', // opcional (pra estilizar)
      data: {
        title: 'Importação de Docentes',
        message: `
          <p>Os servidores cadastrados serão atribuídos com o cargo de <strong>PROFESSORES</strong>.</p>
          <p>Deseja continuar a importação?</p>
          <p>Formatos aceitos: .XLSX e .XLS</p>
        `,
        buttonClose: 'Cancelar',
        buttonConfirm: 'Continuar',
      }
    });

    try {
      const result = await dialogRef.afterClosed().toPromise();
      return result === 'Continuar';
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  // 🟢 IMPORTAÇÃO DISCIPLINAS
  async openDialogConfirmDisciplina() {

  const dialogRef = this.dialog.open(MessageDialogComponent, {
    width: '500px',
    data: {
      title: 'Importação de Disciplinas',
      message: `
        <p>As disciplinas cadastradas serão importadas para o sistema.</p>

        <p>Deseja continuar a importação?</p>

        <p>Formatos aceitos: .XLSX e .XLS</p>`,
        buttonClose: 'Cancelar',
        buttonConfirm: 'Confirmar',
    }
  });

  return await firstValueFrom(dialogRef.afterClosed());
}

  // ⚠️ REMOVER DISCIPLINA
  async openDialogRemoveDisciplina() {
    let dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '400px',
      autoFocus: false,
      data: {
        title: 'ATENÇÃO',
        message: `
          <p><strong>ATENÇÃO:</strong> Ao remover a disciplina, o PEE será <strong>excluído permanentemente</strong>.</p>
          <p>Tem certeza que deseja continuar?</p>
        `,
        buttonClose: 'Não',
        buttonConfirm: 'Sim',
      }
    });

    try {
      const result = await dialogRef.afterClosed().toPromise();
      return result === 'Sim';
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  // ⚠️ REMOVER PROFESSOR
  async openDialogRemoveProfessor() {
    let dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '400px',
      autoFocus: false,
      data: {
        title: 'ATENÇÃO',
        message: `
          <p>Tem certeza que deseja remover o professor?</p>
        `,
        buttonClose: 'Não',
        buttonConfirm: 'Sim',
      }
    });

    try {
      const result = await dialogRef.afterClosed().toPromise();
      return result === 'Sim';
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}