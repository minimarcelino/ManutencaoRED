import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { aluno } from 'src/app/modelo/aluno';
import { AlunoService } from 'src/app/services/alunos.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { CustomPaginatorIntlService } from 'src/app/services/customPaginatorIntl.service';
import { MatDialog } from '@angular/material/dialog';
import { RedService } from 'src/app/services/red.service';
import { MessageDialogComponent } from '../../../utils/message-dialog/message-dialog.component';
import { EntityUpdateService } from 'src/app/services/entityUpdate.service';


@Component({
  selector: 'app-listar-aluno',
  templateUrl: './listar-aluno.component.html',
  styleUrls: ['./listar-aluno.component.css'],
})
export class ListarAlunoComponent implements OnInit {
  alunos: aluno[] = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  user: any;
  res: any;
  reds: any[] = [];

  displayedColumns = ['Prontuario', 'Nome', 'Telefone', 'Email', 'Acoes'];

  constructor(
    private router: Router,
    public dialogQuestionService: messageDialog,
    private alunoservice: AlunoService,
    private snackBarService: SnackBarService,
    private customPaginatorIntlService: CustomPaginatorIntlService,
    private entityUpdateService: EntityUpdateService,
    public dialog: MatDialog,
    private redService: RedService,
  ) {}

  ngOnInit(): void {
  this.user = localStorage.getItem('user');
  this.user = JSON.parse(this.user);

  this.findAll();

  this.entityUpdateService.getUpdateNotifier('aluno').subscribe(() => {
    this.findAll();
  });
}

  ngAfterViewInit() {
    this.paginator._intl = this.customPaginatorIntlService.paginatorIntl;
  }

  formularioAluno(visualizar: boolean, aluno: any = null){
    const navigationExtras: NavigationExtras = {
      state: {
        aluno: aluno,
        visualizar: visualizar
      },
    };
    this.router.navigate([`/${this.user.tiposervidor}/formularioAluno`],navigationExtras);
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  async findAll() {
  const response = await this.alunoservice.getAluno();
  this.alunos = response.data.alunos;

  // Mais recentes primeiro
  this.alunos.sort((a: any, b: any) => b.id - a.id);

  this.dataSource = new MatTableDataSource<aluno>(this.alunos);
  this.dataSource.paginator = this.paginator;
}

  formatDataNascimento(dataNascimento: Date): string {
    if (dataNascimento) {
      return formatDate(dataNascimento, 'dd/MM/yyyy', 'pt-BR', 'UTC');
    } else {
      return '';
    }
  }

  async deleteAlunoPermanent(id: number) {
    try {
      let response = await this.alunoservice.deleteAluno(id);
      if (response) {
        this.snackBarService.open('Aluno deletado com sucesso!!');
        this.findAll();
      }
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.snackBarService.open('Falha ao deletar aluno', errorMessage);
      } else {
        this.snackBarService.open(
          'Falha ao deletar aluno',
          'Ocorreu um erro durante a remoção do aluno.'
        );
      }
    }
  }

  async openDialogConfirmDelete() {
    let dialogRef = this.dialog.open(MessageDialogComponent, {
    width: '250px',
    data: {
        title: 'Erro ao excluir',
        message: 'Não é possível excluir aluno com RED cadastrada',
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


  async deleteAluno(aluno: any) {
    const response = await this.redService.getRed();
    this.reds = response.data.reds;
    this.reds.sort((a, b) => b.idRED - a.idRED);
    this.reds = this.reds.filter((red) => red.aluno_id == aluno.id );
    this.res = false;
    if(this.reds.length>0){
      this.openDialogConfirmDelete()
    } else {
      this.res = await this.dialogQuestionService.openDialogConfirmDelete('aluno');
    }
    if (this.res) {
      await this.deleteAlunoPermanent(aluno.id);
    }
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe(() => {
      this.findAll();
    });
  }
}
