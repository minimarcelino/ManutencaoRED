import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

//
import { pee } from 'src/app/modelo/pee';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { PeeService } from 'src/app/services/pee.service';
import { RedService } from 'src/app/services/red.service';
import { formatDate } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import { AssociarProfessoresComponent } from 'src/app/modulos/associacoes/associar-professores/associar-professores.component';
import { VisualizarDisciplinaComponent } from 'src/app/modulos/red/visualizar-disciplina/visualizar-disciplina.component';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { CustomPaginatorIntlService } from 'src/app/services/customPaginatorIntl.service';

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
  selector: 'app-home-coordenador',
  templateUrl: './home-coordenador.component.html',
  styleUrls: ['./home-coordenador.component.css'],
})
export class HomeCoordenadorComponent implements OnInit {
  peesProfessor: pee[] = [];
  pees: pee[] = [];
  reds: any[] = [];
  esperandoConfirmacao: any[] = [];
  aguardandoProfessor: any[] = [];
  ativos: any[] = [];
  alunos: any[] = [];
  cursos: curso[] = [];
  user: any = '';
  dataSourceAguardando: any;
  dataSourceRed : any;
  dataSourceRedAtivos: any;
  @ViewChild('paginatorAguardando') paginatorAguardando!: MatPaginator;
  @ViewChild('paginatorEnviada') paginatorEnviada!: MatPaginator;
  @ViewChild('paginatorRed') paginatorRed!: MatPaginator;
  @ViewChild('paginatorRedAtivos') paginatorRedAtivos!: MatPaginator;

  displayedColumnsPEE = ['Disciplina', 'Nome', 'Prontuario', 'Email','Situacao' ,'Acoes'];
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

  constructor(
    public dialogQuestionService: messageDialog,
    private snackBarService: SnackBarService,
    private peeService: PeeService,
    private redService: RedService,
    private router: Router,
    private dialog: MatDialog,
    private customPaginatorIntlService: CustomPaginatorIntlService,
  ) {}

  ngOnInit(): void {
    this.findAllPEE();
    this.findAllRED();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  ngAfterViewInit() {
    this.paginatorAguardando._intl = this.customPaginatorIntlService.paginatorIntl;
  }

  async findAllRED() {
    const response = await this.redService.getRed();
    this.reds = response.data.reds;
    this.esperandoConfirmacao = this.reds.filter((red) => red.situacao === 'Esperando confirmação' );
    this.dataSourceRed = new MatTableDataSource<any>(this.esperandoConfirmacao);
    this.dataSourceRed.paginator = this.paginatorRed;
    console.log("REDs atuais\n", this.reds);

    this.ativos = this.reds.filter((red) => (red.coordenador == this.user.idservidor) && (red.situacao === 'Em andamento') || (red.situacao === 'Esperando associação de disciplina') );
    this.dataSourceRedAtivos = new MatTableDataSource<any>(this.ativos);
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

  async findAllPEE() {
    const response = await this.peeService.getPee();
    this.peesProfessor = response.data.pees;
    this.peesProfessor = this.peesProfessor.filter((pee: any) => pee.pee_servidor.some((item: any) => item.servidorId === this.user.idservidor));
    this.peesProfessor = this.peesProfessor.filter((pee) => pee.percentualabono == -1.0);
    this.peesProfessor = this.peesProfessor.filter((pee) => pee.situacao === 'Enviado para o aluno' || pee.situacao === 'Aguardando Preenchimento');

    this.pees = response.data.pees;

    this.aguardandoProfessor = this.pees.filter((pee) => pee.situacao === 'Aguardando Associação de Professor' );
    this.dataSourceAguardando = new MatTableDataSource<pee>(this.aguardandoProfessor);
    this.dataSourceAguardando.paginator = this.paginatorAguardando;
  }

  listarPEEs(){
    this.router.navigate([`/${this.user.tiposervidor}/listarPEEs`]);
  }

  preencherAvaliarPEE (){
    return this.peesProfessor.length > 0 ? true : false;
  }

  associarProfessor(pee: pee) {
    const editar = this.dialog.open(AssociarProfessoresComponent, {
      data: {
        idRED: pee.RED_idRED,
        idPEE: pee.idpee,
        servidor_idservidor: pee.servidor_idservidor,
        //disciplina: pee.pee.disciplinas,
        pee: pee,
      },
    });
    this.handleDialogConfirm(editar);
  }

  async finalizarProcessoPermanent(red: any) {
    try {
      let response = await this.redService.updateSituacaoRED({
        idRED: red.idRED,
        situacao: 'Finalizado',
      });
      if (response) {
        this.snackBarService.open('RED finalizado com sucesso!!');
        this.findAllRED();
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

  existePEEs(red: any): boolean {
    return red.pee.length > 0 ? true : false;
  }


  todosPeesPreenchidos(pee: any[]): boolean {
    return this.peeService.todosPeesPreenchidos(pee);
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

  formularioPEE(pee: any, visualizar: boolean) {
    const navigationExtras: NavigationExtras = {
      state: {
        pee: pee,
        visualizar: visualizar
      },
    };
    this.router.navigate([`/${this.user.tiposervidor}/formularioPEE`],navigationExtras);
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

  isCSP() {
    return (
      this.user.tiposervidor === 'csp' ||
      this.user.tiposervidor === 'administrador'
    );
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

  situacaoPEEs(pee: any[]): string {
    return this.peeService.situacaoPEEs(pee);
  }

  isPreencher(pee: any){
    return pee.situacao === 'Aguardando Preenchimento';
  }


  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe((result: string) => {
      this.findAllRED();
      this.findAllPEE();
    });
  }
}
