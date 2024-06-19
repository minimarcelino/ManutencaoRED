import { formatDate } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-home-cra',
  templateUrl: './home-cra.component.html',
  styleUrls: ['./home-cra.component.css'],
})

export class HomeCRAComponent implements OnInit {
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
    'Esperando associação'
  ];
  associacoes = ['Concluída', 'Não Concluída'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private existeFinalizadas: boolean = false;

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

  async findAll() {
    const response = await this.redService.getRed();
    this.reds = response.data.reds;
    const finalizado = this.reds.filter((red) => red.situacao === 'Finalizado');
    this.dataSource = new MatTableDataSource<any>(finalizado);
    this.dataSource.paginator = this.paginator;

    this.existeFinalizadas = finalizado.length > 0;
  }

  get existeREDFinalizada(){
    return this.existeFinalizadas;
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
      let response = await this.redService.updateSituacaoRED({
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

  formularioRED(visualizar: boolean, red: any = null) {
    const navigationExtras: NavigationExtras = {
      state: {
        red: red,
        visualizar: visualizar
      },
    };
    this.router.navigate([`/${this.user.tiposervidor}/formularioRED`],navigationExtras);
  }

  async arquivarRED(red: any) {
    try {
      let response = await this.redService.updateSituacaoRED({
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
          prontuario: red.aluno.prontuario
        }
      }
    };
    this.router.navigate([`/${this.user.tiposervidor}/visualizarREDCSP`], navigationExtras);
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe(() => {
      this.findAll();
    });
  }

}
