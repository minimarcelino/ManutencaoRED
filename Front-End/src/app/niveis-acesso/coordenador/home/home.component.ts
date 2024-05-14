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
import { VisualizarPEEComponent } from '../../../modulos/pee/visualizar/visualizar.component';
import { CadastrarPEEComponent } from '../../../modulos/pee/cadastrar/cadastrar-pee.component';
import { RedService } from 'src/app/services/red.service';
import { formatDate } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import { VisualizarREDComponent } from 'src/app/modulos/red/visualizar/visualizar.component';

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
  pees: pee[] = [];
  reds: any[] = [];
  alunos: any[] = [];
  cursos: curso[] = [];
  user: any = '';
  dataSourceAguardando: any;
  dataSourceEnviada: any;
  dataSourceRed : any;
  @ViewChild('paginatorAguardando') paginatorAguardando!: MatPaginator;
  @ViewChild('paginatorEnviada') paginatorEnviada!: MatPaginator;
  @ViewChild('paginatorRed') paginatorRed!: MatPaginator;

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
    const esperaConfirmacao = this.reds.filter((red) => red.situacao === 'Esperando confirmação');
    this.dataSourceRed = new MatTableDataSource<any>(esperaConfirmacao);
    this.dataSourceRed.paginator = this.paginatorRed;
    console.log("REDs atuais\n", this.reds);

    // Cria um conjunto para armazenar cursos únicos
    

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

  async findAllPEE() {
    const response = await this.peeService.getPee();
    this.pees = response.data.pees;
    this.pees = this.pees.filter((pee) => pee.servidor_idservidor == this.user.idservidor);
    this.pees = this.pees.filter((pee) => pee.percentualabono == -1.0);
    
    // Filtrar PEEs com situação "Aguardando Preenchimento"
    const aguardandoPreenchimento = this.pees.filter((pee) => pee.situacao === 'Aguardando Preenchimento');
    this.dataSourceAguardando = new MatTableDataSource<pee>(aguardandoPreenchimento);
    this.dataSourceAguardando.paginator = this.paginatorAguardando;

    // Filtrar PEEs com situação "Enviada ao Aluno"
    const enviadaAoAluno = this.pees.filter((pee) => pee.situacao === 'Enviado para o aluno');
    this.dataSourceEnviada = new MatTableDataSource<pee>(enviadaAoAluno);
    this.dataSourceEnviada.paginator = this.paginatorEnviada;
  }

  abonarFalta(pee: any) {
    const editar = this.dialog.open(AbonarFaltaComponent, {
      data: {
        idpee: pee.idpee,
        RED_idRED: pee.RED_idRED,
        disciplinas_iddisciplinas: pee.disciplinas_iddisciplinas,
        servidor_idservidor: pee.servidor_idservidor,
        percentualabono: pee.percentualabono,
        aluno_prontuario: pee.red.aluno.prontuario,
        nome_aluno: pee.red.aluno.nome,
        prazofinal: pee.prazofinal,
        conteudo: pee.conteudo,
        metodologia: pee.metodologia,
        trabalhos: pee.trabalhos,
        bibliografia: pee.bibliografia,
        criterios: pee.criterios,
        dataEnvioProposta: pee.dataEnvioProposta,
        canalComunicacao: pee.canalComunicacao,
        houveAvaliacao: pee.houveAvaliacao,
        avaliacoesRealizadas: pee.avaliacoesRealizadas,
        dataAvaliacao: pee.dataAvaliacao,
        observacao: pee.observacao,
      },
    });
    this.handleDialogConfirm(editar);
  }

  visualizarPee(pee: any) {
    console.log(pee);
    const editar = this.dialog.open(VisualizarPEEComponent, {
      data: {
        idpee: pee.idpee,
        RED_idRED: pee.RED_idRED,
        disciplinas_iddisciplinas: pee.disciplinas_iddisciplinas,
        servidor_idservidor: pee.servidor_idservidor,
        percentualabono: pee.percentualabono,
        aluno_prontuario: pee.red.aluno.prontuario,
        nome_aluno: pee.red.aluno.nome,
        prazofinal: pee.prazofinal,
        conteudo: pee.conteudo,
        metodologia: pee.metodologia,
        trabalhos: pee.trabalhos,
        bibliografia: pee.bibliografia,
        criterios: pee.criterios,
        dataEnvioProposta: pee.dataEnvioProposta,
        canalComunicacao: pee.canalComunicacao,
        houveAvaliacao: pee.houveAvaliacao,
        avaliacoesRealizadas: pee.avaliacoesRealizadas,
        dataAvaliacao: pee.dataAvaliacao,
        observacao: pee.observacao,
        servidor: pee.servidor,
      },
    });
    this.handleDialogConfirm(editar);
  }

  visualizarRED(red: any) {
    console.log(red);
    const visualizar = this.dialog.open(VisualizarREDComponent, {
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
        motivoRecusa: red.motivoRecusa,
        //arquivos: red.arquivos
      },
    });
    this.handleDialogConfirm(visualizar);
  }

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

  adicionarPee(pee: any) {
    console.log(pee);
    const editar = this.dialog.open(CadastrarPEEComponent, {
      data: {
        idpee: pee.idpee,
        RED_idRED: pee.RED_idRED,
        disciplinas_iddisciplinas: pee.disciplinas_iddisciplinas,
        servidor_idservidor: pee.servidor_idservidor,
        percentualabono: pee.percentualabono,
        emailServidor: pee.servidor.email,
      },
    });
    this.handleDialogConfirm(editar);
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe((result: string) => {
      this.findAllRED();
      this.findAllPEE();
    });
  }
}
