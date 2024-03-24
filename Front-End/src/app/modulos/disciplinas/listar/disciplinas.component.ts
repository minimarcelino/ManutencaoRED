import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { DisciplinaService } from 'src/app/services/disciplina.service';
import { EditarDisciplinaComponent } from '../editar/editar.component';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { disciplina } from 'src/app/modelo/disciplina';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';

@Component({
  selector: 'app-disciplinas',
  templateUrl: './disciplinas.component.html',
  styleUrls: ['./disciplinas.component.css'],
})
export class ListarDisciplinasComponent implements OnInit {
  dataToImport: any;
  data: any[] = [];
  disciplinas: any[] = [];
  dataSource: any;
  user: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['sigla', 'nomedisciplina', 'curso_idcurso', 'acoes'];

  constructor(
    private router: Router,
    public dialogQuestionService: messageDialog,
    private disciplinaService: DisciplinaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.findAll();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async cadastrar() {
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    this.router.navigate([`/${this.user.tiposervidor}/cadastrarDisciplinas`]);
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  async findAll() {
    const response = await this.disciplinaService.getDisciplina();
    this.disciplinas = response.data.disciplinas;
    this.dataSource = new MatTableDataSource<disciplina>(this.disciplinas);
    this.dataSource.paginator = this.paginator;
  }

  irAssociar() {
    this.router.navigate([`/${this.user.tiposervidor}/associarDisciplinas`]);
  }

  editarDisciplina(disciplina: any) {
    const editar = this.dialog.open(EditarDisciplinaComponent, {
      data: {
        iddisciplinas: disciplina.iddisciplinas,
        nomeDisciplina: disciplina.nomeDisciplina,
        sigla: disciplina.sigla,
        curso: disciplina.curso,
      },
    });
    this.handleDialogConfirm(editar);
  }

  async deleteDisciplinaPermanent(iddisciplinas: number) {
    try {
      let response = await this.disciplinaService.deleteDisciplina(
        iddisciplinas
      );
      if (response) {
        this.openSnackBar('Disciplina deletada com sucesso!!', null);
        this.findAll();
      }
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.openSnackBar('Falha ao deletar disciplina', errorMessage);
      } else {
        this.openSnackBar(
          'Falha ao deletar disciplina',
          'Ocorreu um erro durante a remoção da disciplina.'
        );
      }
    }
  }

  async deleteDisciplina(disciplina: any) {
    let res = false;
    res = await this.dialogQuestionService.openDialogConfirmDelete(
      'disciplina'
    );
    if (res) {
      await this.deleteDisciplinaPermanent(disciplina.iddisciplinas);
    }
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe(() => {
      this.findAll();
    });
  }

  openSnackBar(message: string, error: string | Error | null) {
    let data;
    if (error === null) {
      data = { message };
    } else if (typeof error === 'string') {
      data = { message: error };
    } else if (error instanceof Error) {
      data = { message: error.message };
    }

    this.snackBar.openFromComponent(SnackBarComponent, {
      data: data,
      duration: 3000,
    });
  }
}
