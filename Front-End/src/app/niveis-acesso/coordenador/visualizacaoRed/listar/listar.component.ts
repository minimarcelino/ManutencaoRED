import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { RedService } from 'src/app/services/red.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';
import { VisualizarREDsComponent } from '../visualizar/visualizar.component';

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
  selectedCurso = '';
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
    private snackBar: MatSnackBar,
    public dialogQuestionService: messageDialog,
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

  filterByCurso(event: MatSelectChange) {
    const selectedCurso = event.value;

    if (selectedCurso === '') {
      // Se o curso selecionado for '', remove a filtragem
      this.filteredReds = this.reds;
    } else {
      // Caso contrário, filtra os REDs por curso
      this.filteredReds = this.reds.filter(
        (a) => a.aluno.curso.sigla === selectedCurso
      );
    }

    // Atualiza o dataSource com os REDs filtrados
    this.dataSource = new MatTableDataSource<any>(this.filteredReds);
    this.dataSource.paginator = this.paginator;
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
        this.openSnackBar('RED finalizado com sucesso!!', null);
        this.findAll();
      }
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.openSnackBar('Falha ao finalizar RED', errorMessage);
      } else {
        this.openSnackBar(
          'Falha ao finalizar RED',
          'Ocorreu um erro durante a finalização do RED.'
        );
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
