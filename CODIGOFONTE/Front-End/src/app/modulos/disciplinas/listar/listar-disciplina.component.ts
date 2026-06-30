import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import * as XLSX from 'xlsx';

import { DisciplinaService } from 'src/app/services/disciplina.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { disciplina } from 'src/app/modelo/disciplina';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { MatSelectChange } from '@angular/material/select';
import { CustomPaginatorIntlService } from 'src/app/services/customPaginatorIntl.service';
import { EntityUpdateService } from 'src/app/services/entityUpdate.service';

export interface curso {
  idcurso: number;
  sigla: string;
}

@Component({
  selector: 'app-listar-disciplina',
  templateUrl: './listar-disciplina.component.html',
  styleUrls: ['./listar-disciplina.component.css'],
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

  displayedColumns = ['Sigla', 'Nome-Disciplina', 'Curso', 'Acoes'];

  constructor(
    private router: Router,
    public dialogQuestionService: messageDialog,
    private disciplinaService: DisciplinaService,
    private snackBarService: SnackBarService,
    private customPaginatorIntlService: CustomPaginatorIntlService,
    private entityUpdateService: EntityUpdateService,
  ) {
    this.cursosFiltradas = [];
  }

  ngOnInit() {
    this.findAll();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);

    // Assine para receber notificações de atualização de disciplinas
    this.entityUpdateService.getUpdateNotifier('disciplina').subscribe(() => {
      this.findAll();
    });
  }

  ngAfterViewInit() {
    this.paginator._intl = this.customPaginatorIntlService.paginatorIntl;
  }

  async importacaoRapidaDisciplinas(event: any) {

    let resposta = false;

    resposta = await this.dialogQuestionService.openDialogConfirmDisciplina();

    if (resposta) {

      const input = document.createElement('input');

      input.type = 'file';
      input.accept = '.xlsx,.xls';
      input.style.display = 'none';

      input.addEventListener('change', (event: any) => {

        this.cadastroDisciplinaLote(event);

      });

      document.body.appendChild(input);

      input.click();
    }
  }

  private cadastroDisciplinaLote(event: any) {

    const target: DataTransfer = <DataTransfer>event.target;

    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }

    const reader: FileReader = new FileReader();

    reader.readAsBinaryString(target.files[0]);

    reader.onload = async (e: any) => {

      const binarystr: string = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(binarystr, {
        type: 'binary',
      });

      const wsname: string = wb.SheetNames[0];

      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws);

      this.dataToImport = data;

      //console.log('Dados importados:', this.dataToImport);

      try {

        const importPromises = this.dataToImport.map(async (item: any) => {

          return await this.disciplinaService.exportDisciplina({
            sigla: item.Sigla,
            nomeDisciplina: item['Componente'],
            curso_idcurso: Number(item['CH Componente']),
          });

        });

        const responses = await Promise.all(importPromises);

        const hasError = responses.some(
          (response: any) => response?.ok === false
        );

        if (hasError) {

          this.snackBarService.open(
            'Erro na importação. Verifique os dados da planilha.'
          );

        } else {

          this.snackBarService.open(
            'Importação das disciplinas realizada com sucesso!'
          );

        }

      } catch (error: any) {

        console.log(error);

        if (error && error.error && error.error.data) {

          const errorMessage = error.error.data;

          this.snackBarService.open(
            `Erro na importação de disciplinas: ${errorMessage}`
          );

        } else {

          this.snackBarService.open(
            'Erro na importação de disciplinas'
          );

        }

      } finally {

        this.findAll();

      }
    };
  }

  formularioDisciplina(visualizar: boolean, disciplina: any = null) {
    const navigationExtras: NavigationExtras = {
      state: {
        disciplina: disciplina,
        visualizar: visualizar,
      },
    };
    this.router.navigate(
      [`/${this.user.tiposervidor}/formularioDisciplina`],
      navigationExtras
    );
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

  private mapearCursos() {
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
  dialog.afterClosed().subscribe((resultado: boolean) => {

    if (resultado) {
      this.findAll();
    }

  });
}
}
