import { formatDate } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

import { messageDialog } from 'src/app/services/messageDialog.service';
import { RedService } from 'src/app/services/red.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { PeeService } from 'src/app/services/pee.service';
import { CustomPaginatorIntlService } from 'src/app/services/customPaginatorIntl.service';
import { EntityUpdateService } from 'src/app/services/entityUpdate.service';

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
  selector: 'app-home-cra',
  templateUrl: './home-cra.component.html',
  styleUrls: ['./home-cra.component.css'],
})
export class HomeCRAComponent
  implements OnInit, AfterViewInit, OnDestroy {
  user: any;

  alunos: any[] = [];
  reds: any[] = [];
  filteredReds: any[] = [];
  cursos: curso[] = [];

  dataSource = new MatTableDataSource<any>();

  selectedCurso = 'todos';
  situacaoSelecionada = 'todos';
  associacaoSelecionada = 'todos';

  situacao = [
    'Esperando confirmação',
    'Em andamento',
    'Finalizado',
    'Arquivado',
    'Esperando associação',
  ];

  associacoes = ['Concluída', 'Não Concluída'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private existeFinalizadas: boolean = false;
  private updateSubscription!: Subscription;

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
    private redService: RedService,
    private peeService: PeeService,
    private customPaginatorIntlService: CustomPaginatorIntlService,
    private entityUpdateService: EntityUpdateService
  ) { }

  ngOnInit(): void {
    this.findAll();

    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);

    this.updateSubscription =
      this.entityUpdateService
        .getUpdateNotifier('RED')
        .subscribe((updated: boolean) => {

          if (updated) {
            this.findAll();
          }

        });
  }

  ngAfterViewInit(): void {
    this.paginator._intl =
      this.customPaginatorIntlService.paginatorIntl;

    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.dataSource.filter = value.trim().toLowerCase();
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

      const finalizados = this.reds.filter(
        (red) => red.situacao === 'Finalizado'
      );

      this.dataSource.data = finalizados;

      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }

      this.existeFinalizadas = finalizados.length > 0;
    } catch (error) {
      console.error('Erro ao carregar REDs:', error);
      this.snackBarService.open('Erro ao carregar REDs');
    }
  }

  get existeREDFinalizada(): boolean {
    return this.existeFinalizadas;
  }

  formatData(data: Date): string {
    if (data) {
      return formatDate(data, 'dd/MM/yyyy', 'pt-BR', 'UTC');
    }

    return '';
  }

  async finalizarProcessoPermanent(red: any): Promise<void> {
    try {
      const response = await this.redService.updateSituacaoRED({
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
      if (error?.error?.data) {
        this.snackBarService.open(
          `Falha ao finalizar RED: ${error.error.data}`
        );
      } else {
        this.snackBarService.open(
          'Falha ao finalizar RED'
        );
      }
    }
  }

  formularioRED(
    visualizar: boolean,
    red: any = null
  ): void {
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

  async arquivarRED(red: any): Promise<void> {
    try {
      const response = await this.redService.updateSituacaoRED({
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
      if (error?.error?.data) {
        this.snackBarService.open(
          `Falha ao arquivar RED: ${error.error.data}`
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
          prontuario: red.aluno.prontuario,
        },
      },
    };

    this.router.navigate(
      [`/${this.user.tiposervidor}/visualizarREDCSP`],
      navigationExtras
    );
  }

  handleDialogConfirm(dialog: any): void {
    dialog.afterClosed().subscribe(() => {
      this.findAll();
    });
  }
}