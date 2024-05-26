import { formatDate } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';

import { messageDialog } from 'src/app/services/messageDialog.service';
import { RedService } from 'src/app/services/red.service';
import { VisualizarDisciplinaComponent } from '../visualizar-disciplina/visualizar-disciplina.component';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { PeeService } from 'src/app/services/pee.service';
import { AssociarDisciplinaComponent } from '../../associacoes/associar-disciplina/associar-disciplina.component';
import { CustomPaginatorIntlService } from 'src/app/services/customPaginatorIntl.service';

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
export class ListarREDComponent implements OnInit {
  user: any;
  alunos: any[] = [];
  reds: any[] = [];
  filteredReds: any[] = [];
  cursos: curso[] = [];
  dataSource: any;
  selectedCurso = 'todos';
  situacaoSelecionada = 'todos';
  associacaoSelecionada = 'todos';
  situacao = [
    'Esperando confirmação',
    'Em andamento',
    'Finalizado',
    'Arquivado',
    'Esperando associação de disciplina',
  ];
  associacoes = ['Concluída', 'Não Concluída'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = [
    'Prontuario',
    'Nome',
    'Curso',
    'Inicio-RED',
    'Tempo-Afastamento',
    'Termino',
    'Situacao-RED',
    'Situacao-PEE',
    'Acoes',
  ];

  constructor(
    private router: Router,
    public dialogQuestionService: messageDialog,
    private snackBarService: SnackBarService,
    private customPaginatorIntlService: CustomPaginatorIntlService,
    private dialog: MatDialog,
    private redService: RedService,
    private peeService: PeeService
  ) {
    this.filteredReds = [];
  }

  ngOnInit(): void {
    this.findAll();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  ngAfterViewInit() {
    this.paginator._intl = this.customPaginatorIntlService.paginatorIntl;
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  todosPeesPreenchidos(pee: any[]): boolean {
    return this.peeService.todosPeesPreenchidos(pee);
  }

  situacaoPEEs(pee: any[]): string {
    return this.peeService.situacaoPEEs(pee);
  }

  disciplinas(red: any){
    return (this.situacaoPEEs(red.pee) !== 'Em Associação de Disciplina');
  }

  existePEEs(red: any): boolean {
    return red.pee.length > 0 ? true : false;
  }

  async findAll() {
    const response = await this.redService.getRed();
    this.reds = response.data.reds;
    this.dataSource = new MatTableDataSource<any>(this.reds);
    this.dataSource.paginator = this.paginator;
    console.log('REDs atuais\n', this.reds);

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
    //console.log('Cursos:', this.cursos);
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

  async visualizarDisciplina(red: any) {
    const visualizar = this.dialog.open(VisualizarDisciplinaComponent, {
      data: {
        idRED: red.idRED,
        pee: red.pee,
      },
    });
    this.handleDialogConfirm(visualizar);
  }

  async finalizarRED(red: any) {
    let res = false;
    res = await this.dialogQuestionService.openDialogConfirmDone('red');
    if (res) {
      await this.finalizarProcessoPermanent(red);
    }
  }

  formularioRED(visualizar: boolean, red: any = null) {
    const navigationExtras: NavigationExtras = {
      state: {
        red: red,
        visualizar: visualizar,
      },
    };
    this.router.navigate(
      [`/${this.user.tiposervidor}/formularioRED`],
      navigationExtras
    );
  }

  async arquivarRED(red: any) {
    try {
      let response = await this.redService.updateRed({
        idRED: red.idRED,
        situacao: 'Arquivado',
      });
      if (response) {
        this.snackBarService.open('RED arquivada com sucesso!');
        this.findAll();
      }
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.snackBarService.open(`Falha ao aquivar RED: ${errorMessage}`);
      } else {
        this.snackBarService.open('Falha ao arquivar RED');
      }
    }
  }

  VisualizarRED_CSP(red: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        idRED: red.idRED,
        aluno: {
          nome: red.aluno.nome,
          prontuario: red.aluno.prontuario,
        },
      },
    };
    this.router.navigate(
      [`/${this.user.tiposervidor}/visualizarREDCSP`],
      navigationExtras
    );
  }

  associarDisciplina(red: red) {
    const editar = this.dialog.open(AssociarDisciplinaComponent, {
      minWidth: '1200px',
      minHeight: '800px',
      data: {
        idRED: red.idRED,
        situacao: red.situacao,
        servidor_idservidor: red.coordenador,
        red: red,
      },
    });
    this.handleDialogConfirm(editar);
    // Atualizar red para "Aguardando professor"
  }

  async afterAssociarDisciplina(red: any) {
    try {
      let response = await this.redService.updateRed({
        idRED: red.idRED,
        situacao: 'Aguardando professores',
      });
      if (response) {
        this.snackBarService.open('Associação de professores concluida');
        this.findAll();
      }
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.snackBarService.open(`Falha ao aquivar RED: ${errorMessage}`);
      } else {
        this.snackBarService.open('Falha ao arquivar RED');
      }
    }
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

  isCOORD() {
    return (
      this.user.tiposervidor === 'coordenador' ||
      this.user.tiposervidor === 'administrador'
    );
  }

  isCRA() {
    return (
      this.user.tiposervidor === 'cra' ||
      this.user.tiposervidor === 'administrador'
    );
  }

  isCSP() {
    return (
      this.user.tiposervidor === 'csp' ||
      this.user.tiposervidor === 'administrador'
    );
  }
}
