import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { DisciplinaService } from 'src/app/services/disciplina.service';
import { EditarDisciplinaComponent } from '../editar/editar.component';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { disciplina } from 'src/app/modelo/disciplina';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { MatSelectChange } from '@angular/material/select';

export interface curso {
  idcurso: number;
  sigla: string;
}

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
  cursosFiltradas: any[] = [];
  cursos: curso[] = [];
  cursoSelecionado = 'todos';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['sigla', 'nomedisciplina', 'curso_idcurso', 'acoes'];

  constructor(
    private router: Router,
    public dialogQuestionService: messageDialog,
    private disciplinaService: DisciplinaService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService
  ) {
    this.cursosFiltradas = [];
  }

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
    console.log(this.disciplinas);

    this.mapearCursos();
  }

  private mapearCursos(){
    const uniqueCursos = new Set<string>();

    this.disciplinas.forEach((disciplina) => {
      uniqueCursos.add(disciplina.curso.idcurso);
    });

    // Converte o conjunto de IDs de curso de volta para um array de cursos
    this.cursos = Array.from(uniqueCursos).map(
      (cursoId) =>
        this.disciplinas.find((disciplina) => disciplina.curso_idcurso === cursoId)?.curso
    );

    // Filtra cursos nulos (pode ocorrer se o curso não for encontrado)
    this.cursos = this.cursos.filter((curso) => curso !== undefined);

    // Log para depuração
    console.log('Cursos:', this.cursos);
  }

  // irAssociar() {
  //   this.router.navigate([`/${this.user.tiposervidor}/associarDisciplinas`]);
  // }

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
        this.snackBarService.open('Disciplina deletada com sucesso!!');
        this.findAll();
      }
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.snackBarService.open(`Falha ao deletar disciplina: ${errorMessage}`);
      } else {
        this.snackBarService.open('Falha ao deletar disciplina');
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

  aplicarFiltros() {
    // Aplica os filtros de curso e situação simultaneamente
    this.cursosFiltradas = this.disciplinas.filter(
      (disciplina) =>
        this.cursoSelecionado === 'todos' ||
        disciplina.curso.sigla === this.cursoSelecionado
    );

    // Atualiza o dataSource com os Cursos filtrados
    this.dataSource = new MatTableDataSource<any>(this.cursosFiltradas);
    this.dataSource.paginator = this.paginator;
  }

  filroPorCurso(event: MatSelectChange) {
    // Atualiza o filtro de curso e aplica todos os filtros novamente
    this.cursoSelecionado = event.value;
    this.aplicarFiltros();
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe(() => {
      this.findAll();
    });
  }
}
