import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';

import { messageDialog } from 'src/app/services/messageDialog.service';
import { RedService } from 'src/app/services/red.service';
import { VisualizarREDsComponent } from '../visualizar/visualizar.component';
import { SnackBarService } from 'src/app/services/snackbar.service';

export interface aluno {
  id: number;
  prontuario: String;
  nome: String;
  data_nascimento: Date;
  endereco: String;
  email: String;
  curso: curso;
}

export interface curso {
  idcurso: number;
  sigla: string;
}

export interface red {
  idRED: number;
  dataInicioProcesso: Date;
  dataPrevisaoTermino: Date;
  motivoAfastamento: String;
  situacao: String;
  coordenador: number;
  aluno_id: number;
  observacao: String;
  inicioAfastamento: Date;
  tempoAfastamento: number;
  semestreOuAnoAluno: number;
}

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarREDsComponent implements OnInit {
  alunos: any[] = [];
  reds: any[] = [];
  filteredReds: any[] = [];
  cursos: curso[] = [];
  dataSource: any;
  selectedCurso = 'todos';
  situacaoSelecionada = 'todos';
  situacao = ['Esperando confirmação', 'Em andamento', 'Finalizado', 'Arquivado'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = [
    //Prontuário
    'Nome',
    'Curso',
    'Início RED',
    'Tempo Afastamento',
    'Previsão Término',
    'Situação',
    'Ações',
  ];

  constructor(
    public dialogQuestionService: messageDialog,
    private snackBarService: SnackBarService,
    private dialog: MatDialog,
    private redService: RedService
  ) {
    this.filteredReds = [];
  }

  ngOnInit(): void {
    this.findAll();
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  todosPeesPreenchidos(pee: any[]): boolean {
    return pee.every((item) => item.conteudo !== '');
  }

  async findAll() {
    const response = await this.redService.getRed();
    this.reds = response.data.reds;
    this.dataSource = new MatTableDataSource<any>(this.reds);
    this.dataSource.paginator = this.paginator;
    console.log(this.reds);

    // Cria um conjunto para armazenar cursos únicos
    const uniqueCursos = new Set<number>();

    this.reds.forEach((red) => {
      uniqueCursos.add(red.aluno.curso.idcurso);
    });

    // Converte o conjunto de IDs de curso de volta para um array de cursos
    this.cursos = Array.from(uniqueCursos).map(
      (cursoId) =>
        this.reds.find((red) => red.aluno.curso.idcurso === cursoId)?.aluno
          .curso
    );

    // Filtra cursos nulos (pode ocorrer se o curso não for encontrado)
    this.cursos = this.cursos.filter((curso) => curso !== undefined);

    // Log para depuração
    console.log('Cursos:', this.cursos);
  }

  formatData(data: Date): string {
    if (data) {
      return formatDate(data, 'dd/MM/yyyy', 'en-US', 'UTC');
    } else {
      return '';
    }
  }

  async finalizarProcessoPermanent(red: any) {
    try {
      let response = await this.redService.updateRed({
        idRED: red.idRED,
        situacao: 'Finalizado',
      });
      if (response) {
        this.snackBarService.open('RED finalizado com sucesso!!');
        this.findAll();
      }
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.snackBarService.open(`Falha ao finalizar RED: ${errorMessage}`);
      } else {
        this.snackBarService.open('Falha ao finalizar RED');
      }
    }
  }

  async finalizarRed(red: any) {
    let res = false;
    res = await this.dialogQuestionService.openDialogConfirmDone('red');
    if (res) {
      await this.finalizarProcessoPermanent(red);
    }
  }

  visualizarRed(red: any) {
    console.log(red);
    const visualizar = this.dialog.open(VisualizarREDsComponent, {
      data: {
        idRED: red.idRED,
        aluno_prontuario: red.aluno.prontuario,
        nome: red.aluno.nome,
        dataInicioProcesso: red.dataInicioProcesso,
        dataPrevisaoTermino: red.dataPrevisaoTermino,
        motivoAfastamento: red.motivoAfastamento,
        situacao: red.situacao,
        coordenador: red.coordenador,
        aluno_id: red.aluno_id,
        inicioAfastamento: red.inicioAfastamento,
        observacao: red.observacao,
        tempoAfastamento: red.tempoAfastamento,
        semestreOuAnoAluno: red.semestreOuAnoAluno,
        pee: red.pee,
      },
    });
    this.handleDialogConfirm(visualizar);
  }

  aplicarFiltros() {
    // Aplica os filtros de curso e situação simultaneamente
    this.filteredReds = this.reds.filter(
      (red) =>
        (this.selectedCurso === 'todos' ||
          red.aluno.curso.sigla === this.selectedCurso) &&
        (this.situacaoSelecionada === 'todos' ||
          red.situacao === this.situacaoSelecionada)
    );

    // Atualiza o dataSource com os REDs filtrados
    this.dataSource = new MatTableDataSource<any>(this.filteredReds);
    this.dataSource.paginator = this.paginator;
  }

  filroPorCurso(event: MatSelectChange) {
    // Atualiza o filtro de curso e aplica todos os filtros novamente
    this.selectedCurso = event.value;
    this.aplicarFiltros();
  }

  filtroPorSituacao(event: MatSelectChange) {
    // Atualiza o filtro de situação e aplica todos os filtros novamente
    this.situacaoSelecionada = event.value;
    this.aplicarFiltros();
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe(() => {
      this.findAll();
    });
  }
}
