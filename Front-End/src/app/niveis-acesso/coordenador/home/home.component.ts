import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

//
import { pee } from 'src/app/modelo/pee';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { PeeService } from 'src/app/services/pee.service';
import { AbonarFaltaComponent } from '../../../modulos/pee/abonar-faltas/abonar-faltas.component';
import { RedService } from 'src/app/services/red.service';
import { formatDate } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import { AssociarProfessoresComponent } from 'src/app/modulos/associacoes/associar-professores/associar-professores.component';
import { VisualizarDisciplinaComponent } from 'src/app/modulos/red/visualizar-disciplina/visualizar-disciplina.component';
import { SnackBarService } from 'src/app/services/snackbar.service';

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
  peesProfessor: pee[] = [];
  pees: pee[] = [];
  reds: any[] = [];
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
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.findAllPEE();
    this.findAllRED();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async findAllRED() {
    const response = await this.redService.getRed();
    this.reds = response.data.reds;
    const esperaConfirmacao = this.reds.filter((red) => red.situacao === 'Esperando confirmação' );
    this.dataSourceRed = new MatTableDataSource<any>(esperaConfirmacao);
    this.dataSourceRed.paginator = this.paginatorRed;
    console.log("REDs atuais\n", this.reds);

    const ativos = this.reds.filter((red) => (red.coordenador == this.user.idservidor) && (red.situacao === 'Em andamento') || (red.situacao === 'Esperando associação de disciplina') );
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

  async findAllPEE() {
    const response = await this.peeService.getPee();
    this.peesProfessor = response.data.pees;
    this.peesProfessor = this.peesProfessor.filter((pee: any) => pee.pee_servidor.some((item: any) => item.servidorId === this.user.idservidor));
    this.peesProfessor = this.peesProfessor.filter((pee) => pee.percentualabono == -1.0);
    this.peesProfessor = this.peesProfessor.filter((pee) => pee.situacao === 'Enviado para o aluno' || pee.situacao === 'Aguardando Preenchimento');

    this.pees = response.data.pees;

    const aguardandoProfessor = this.pees.filter((pee) => pee.situacao === 'Aguardando Associação de Professor' );
    this.dataSourceAguardando = new MatTableDataSource<pee>(aguardandoProfessor);
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
      let response = await this.redService.updateRed({
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


  // visualizarRED(red: any) {
  //   console.log(red);
  //   const visualizar = this.dialog.open(VisualizarREDComponent, {
  //     data: {
  //       idRED: red.idRED,
  //       aluno_prontuario: red.aluno.prontuario,
  //       nome: red.aluno.nome,
  //       dataInicioProcesso: red.dataInicioProcesso,
  //       dataPrevisaoTermino: red.dataPrevisaoTermino,
  //       motivoAfastamento: red.motivoAfastamento,
  //       situacao: red.situacao,
  //       coordenador: red.coordenador,
  //       aluno_id: red.aluno_id,
  //       inicioAfastamento: red.inicioAfastamento,
  //       observacao: red.observacao,
  //       tempoAfastamento: red.tempoAfastamento,
  //       semestreOuAnoAluno: red.semestreOuAnoAluno,
  //       pee: red.pee,
  //       motivoRecusa: red.motivoRecusa,
  //       //arquivos: red.arquivos
  //     },
  //   });
  //   this.handleDialogConfirm(visualizar);
  // }

  isCSP() {
    return (
      this.user.tiposervidor === 'csp' ||
      this.user.tiposervidor === 'administrador'
    );
  }

  async gerarRelatorioFaltasAbonadas(red: any) {
    try {
      const redAluno = await this.peeService.getPeeByIdRED(red.idRED);

      // Extrair os dados necessários do redAluno
      const dados = redAluno.data.pees.map((item: any) => ({
        Disciplina: item.disciplinas.nomeDisciplina,
        'As atividades do aluno foram entregues ao professor?':
          item.atividades.dateEntregaAluno,
        'O aluno cumpriu com as atividades propostas no PEE?':
          item.atividades.cumpriuAtividade,
        'Se "não cumpriu", foi proposta alguma nova atividade ao aluno (e que tenha sido cumprida)?':
          item.atividades.novaAtividade,
        'Houveram atividades avaliativas no periodo de afastamento do aluno?':
          item.houveAvaliacao,
        'As atividades avaliativas necessárias já foram realizadas?':
          item.avaliacoesRealizadas,
        'Data prevista para aplicação da atividade avaliativa, caso ainda não tenha sido aplicada.':
          item.dataAvaliacao,
      }));

      // Criar uma nova planilha
      const ws = XLSX.utils.json_to_sheet(dados);

      // Definir largura de colunas (Exemplo: coluna A com largura 20, coluna B com largura 30)
      const colWidths = [
        { wch: 30 }, // Largura da coluna A
        { wch: 50 },
        { wch: 70 },
        { wch: 90 },
        { wch: 65 },
        { wch: 50 },
        { wch: 90 },
        // Adicione mais larguras de coluna conforme necessário para suas colunas
      ];
      ws['!cols'] = colWidths;

      // Criar um novo livro de trabalho e adicionar a planilha
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Relatorio_Faltas_Abonadas');

      // Salvar o arquivo XLSX
      const nomeArquivo = 'relatorio_faltas_abonadas.xlsx';
      XLSX.writeFile(wb, nomeArquivo);

      console.log(`Arquivo ${nomeArquivo} gerado com sucesso.`);
    } catch (error) {
      console.error('Erro ao gerar o arquivo XLSX:', error);
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
