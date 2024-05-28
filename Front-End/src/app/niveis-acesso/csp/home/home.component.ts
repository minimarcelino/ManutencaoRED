import { formatDate } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { messageDialog } from 'src/app/services/messageDialog.service';
import { RedService } from 'src/app/services/red.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { PeeService } from 'src/app/services/pee.service';
import { AssociarDisciplinaComponent } from '../../../modulos/associacoes/associar-disciplina/associar-disciplina.component';
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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
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
    'Esperando associação de disciplina',
    'Em andamento',
    'Finalizado',
    'Arquivado',
  ];
  associacoes = ['Concluída', 'Não Concluída'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) paginatorRedAtivos!: MatPaginator;

  displayedColumnsRED = [
    'ProntuarioRED',
    'NomeRED',
    'CursoRED',
    'Inicio-RED',
    'Tempo-AfastamentoRED',
    'TerminoRED',
    'Situacao-RED',
    'Situacao-PEE',
    'AcoesRED',
  ];

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
  dataSourceRedAtivos: any;

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
    const esperaAssociacao = this.reds.filter((red) => red.situacao === 'Esperando associação de disciplina');
    this.dataSource = new MatTableDataSource<any>(esperaAssociacao);
    this.dataSource.paginator = this.paginator;
    console.log("REDs atuais\n", this.reds);

    const ativos = this.reds.filter((red) => (red.situacao === 'Em andamento') );
    this.dataSourceRedAtivos = new MatTableDataSource<any>(ativos);
    this.dataSourceRedAtivos.paginator = this.paginatorRedAtivos;
    console.log("REDs atuais\n", this.reds);
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
        visualizar: visualizar
      },
    };
    this.router.navigate([`/${this.user.tiposervidor}/formularioRED`],navigationExtras);
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
          prontuario: red.aluno.prontuario
        }
      }
    };
    this.router.navigate([`/${this.user.tiposervidor}/visualizarREDCSP`], navigationExtras);
  }

  associarDisciplina(red: red) {
    const editar = this.dialog.open(AssociarDisciplinaComponent, {
      data: {
        idRED: red.idRED,
        servidor_idservidor: red.coordenador,
        red: red,
      },
    });
    this.handleDialogConfirm(editar);
  }

  async afterAssociarDisciplina(red: any){
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

  existePEEs(red: any): boolean{
    return red.pee.length > 0 ? true : false;
  }
}
