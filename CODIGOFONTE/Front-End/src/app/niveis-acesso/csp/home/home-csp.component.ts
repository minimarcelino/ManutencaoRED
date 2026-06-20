import { formatDate } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { messageDialog } from 'src/app/services/messageDialog.service';
import { RedService } from 'src/app/services/red.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { PeeService } from 'src/app/services/pee.service';
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
  selector: 'app-home-csp',
  templateUrl: './home-csp.component.html',
  styleUrls: ['./home-csp.component.css'],
})

export class HomeCSPComponent implements OnInit, AfterViewInit {

  user: any;

  alunos: any[] = [];
  reds: any[] = [];
  filteredReds: any[] = [];
  cursos: curso[] = [];

  dataSource!: MatTableDataSource<any>;
  dataSourceRedAtivos!: MatTableDataSource<any>;

  selectedCurso = 'todos';
  situacaoSelecionada = 'todos';
  associacaoSelecionada = 'todos';

  situacao = [
    'Esperando confirmação',
    'Esperando associação de disciplina',
    'Em andamento',
    'Finalizado',
    'Arquivado',
  ];

  associacoes = [
    'Concluída',
    'Não Concluída'
  ];

  @ViewChild('paginatorAssociacao')
  paginator!: MatPaginator;

  @ViewChild('paginatorAtivos')
  paginatorRedAtivos!: MatPaginator;

  private existeREDAssociacao: boolean = false;
  private existeREDAtivas: boolean = false;

  displayedColumns = [
    'prontuario',
    'nome',
    'curso',
    'acoes',
  ];

  displayedColumnsRED = [
    'prontuarioRed',
    'nomeRed',
    'cursoRed',
    'acoesRed',
  ];

  constructor(
    private router: Router,
    public dialogQuestionService: messageDialog,
    private snackBarService: SnackBarService,
    private dialog: MatDialog,
    private redService: RedService,
    private peeService: PeeService,
    private customPaginatorIntlService: CustomPaginatorIntlService,
  ) {
    this.filteredReds = [];
  }

  async ngOnInit(): Promise<void> {

    this.user = localStorage.getItem('user');

    if (this.user) {
      this.user = JSON.parse(this.user);
    }

    await this.findAll();
  }

  ngAfterViewInit(): void {

    setTimeout(() => {

      // PAGINATOR 1
      if (this.paginator) {

        this.paginator._intl =
          this.customPaginatorIntlService.paginatorIntl;

        if (this.dataSource) {
          this.dataSource.paginator = this.paginator;
        }
      }

      // PAGINATOR 2
      if (this.paginatorRedAtivos) {

        this.paginatorRedAtivos._intl =
          this.customPaginatorIntlService.paginatorIntl;

        if (this.dataSourceRedAtivos) {
          this.dataSourceRedAtivos.paginator =
            this.paginatorRedAtivos;
        }
      }

    });

  }

  applyFilter(data: Event): void {

    const value =
      (data.target as HTMLInputElement).value;

    if (this.dataSource) {
      this.dataSource.filter =
        value.trim().toLowerCase();
    }
  }

  todosPeesPreenchidos(pee: any[]): boolean {
    return this.peeService.todosPeesPreenchidos(pee);
  }

  situacaoPEEs(pee: any[]): string {
    return this.peeService.situacaoPEEs(pee);
  }

  async findAll(): Promise<void> {

    try {

      const response = await this.redService.getRed();

      this.reds = response.data.reds;
      this.reds.sort((a, b) => b.idRED - a.idRED);

      // REDs aguardando associação
      const esperaAssociacao = this.reds.filter(
        (red) =>
          red.situacao ===
          'Esperando associação de disciplina'
      );

      this.dataSource =
        new MatTableDataSource<any>(esperaAssociacao);

      this.existeREDAssociacao =
        esperaAssociacao.length > 0;

      // REDs ativas
      const ativos = this.reds.filter(
        (red) => red.situacao === 'Em andamento'
      );

      this.dataSourceRedAtivos =
        new MatTableDataSource<any>(ativos);

      this.existeREDAtivas =
        ativos.length > 0;

      // Vincular paginator após renderização
      setTimeout(() => {

        if (this.paginator) {
          this.dataSource.paginator =
            this.paginator;
        }

        if (this.paginatorRedAtivos) {
          this.dataSourceRedAtivos.paginator =
            this.paginatorRedAtivos;
        }

      });

    } catch (error) {

      this.snackBarService.open(
        'Erro ao carregar REDs'
      );

      console.error(error);
    }
  }

  get existeAssociacao(): boolean {
    return this.existeREDAssociacao;
  }

  get existeAtivas(): boolean {
    return this.existeREDAtivas;
  }

  formatData(data: Date): string {

    if (data) {
      return formatDate(
        data,
        'dd/MM/yyyy',
        'pt-BR',
        'UTC'
      );
    }

    return '';
  }

  async finalizarProcessoPermanent(red: any) {

    try {

      let response =
        await this.redService.updateSituacaoRED({
          idRED: red.idRED,
          situacao: 'Finalizado',
        });

      if (response) {

        this.snackBarService.open(
          'RED finalizado com sucesso!!'
        );

        this.findAll();
      }

    } catch (error: any) {

      if (
        error &&
        error.error &&
        error.error.data
      ) {

        const errorMessage =
          error.error.data;

        this.snackBarService.open(
          `Falha ao finalizar RED: ${errorMessage}`
        );

      } else {

        this.snackBarService.open(
          'Falha ao finalizar RED'
        );
      }
    }
  }

  async finalizarRED(red: any) {

    let res = false;

    res =
      await this.dialogQuestionService
        .openDialogConfirmDone('red');

    if (res) {
      await this.finalizarProcessoPermanent(red);
    }
  }

  formularioRED(
    visualizar: boolean,
    red: any = null
  ) {

    const navigationExtras: NavigationExtras = {
      state: {
        red: red,
        visualizar: visualizar
      },
    };

    this.router.navigate(
      [`/${this.user.tiposervidor}/formularioRED`],
      navigationExtras
    );
  }

  async arquivarRED(red: any) {

    try {

      let response =
        await this.redService.updateSituacaoRED({
          idRED: red.idRED,
          situacao: 'Arquivado',
        });

      if (response) {

        this.snackBarService.open(
          'RED arquivada com sucesso!'
        );

        this.findAll();
      }

    } catch (error: any) {

      if (
        error &&
        error.error &&
        error.error.data
      ) {

        const errorMessage =
          error.error.data;

        this.snackBarService.open(
          `Falha ao arquivar RED: ${errorMessage}`
        );

      } else {

        this.snackBarService.open(
          'Falha ao arquivar RED'
        );
      }
    }
  }

  VisualizarRED_CSP(red: any): void {

    const navigationExtras: NavigationExtras = {
      state: {
        idRED: red.idRED,
        aluno: {
          nome: red.aluno.nome,
          prontuario: red.aluno.prontuario
        }
      }
    };

    this.router.navigate(
      [`/${this.user.tiposervidor}/visualizarREDCSP`],
      navigationExtras
    );
  }

  associarDisciplina(red: red): void {

    this.router.navigate(
      ['/administrador/associarDisciplinas'],
      {
        state: {
          idRED: red.idRED,
          servidor_idservidor: red.coordenador,
          red: red,
        }
      }
    );
  }

  async afterAssociarDisciplina(red: any) {

    try {

      let response =
        await this.redService.updateSituacaoRED({
          idRED: red.idRED,
          situacao: 'Aguardando professores',
        });

      if (response) {

        this.snackBarService.open(
          'Associação de professores concluída'
        );

        this.findAll();
      }

    } catch (error: any) {

      if (
        error &&
        error.error &&
        error.error.data
      ) {

        const errorMessage =
          error.error.data;

        this.snackBarService.open(
          `Falha ao atualizar RED: ${errorMessage}`
        );

      } else {

        this.snackBarService.open(
          'Falha ao atualizar RED'
        );
      }
    }
  }

  handleDialogConfirm(dialog: any): void {

    dialog.afterClosed().subscribe(() => {
      this.findAll();
    });
  }

  isCOORD(): boolean {

    return (
      this.user.tiposervidor === 'coordenador' ||
      this.user.tiposervidor === 'administrador'
    );
  }

  isCRA(): boolean {

    return (
      this.user.tiposervidor === 'cra' ||
      this.user.tiposervidor === 'administrador'
    );
  }

  isCSP(): boolean {

    return (
      this.user.tiposervidor === 'csp' ||
      this.user.tiposervidor === 'administrador'
    );
  }

  existePEEs(red: any): boolean {

    return red.pee &&
      red.pee.length > 0;
  }
}