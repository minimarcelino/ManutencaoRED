import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import * as XLSX from 'xlsx';

import { messageDialog } from 'src/app/services/messageDialog.service';
import { RedService } from 'src/app/services/red.service';
import { VisualizarREDComponent } from '../visualizar/visualizar.component';
import { VisualizarDisciplinaComponent } from '../visualizar-disciplina/visualizar-disciplina.component';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { EditarREDComponent } from '../editar/editar.component';
import { PeeService } from 'src/app/services/pee.service';

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
  situacao = [
    'Esperando confirmação',
    'Em andamento',
    'Finalizado',
    'Arquivado',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = [
    'Prontuário',
    'Nome',
    'Curso',
    'Início RED',
    'Tempo Afastamento',
    'Término',
    'Situação',
    'Ações',
  ];

  constructor(
    private router: Router,
    public dialogQuestionService: messageDialog,
    private snackBarService: SnackBarService,
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

  async cadastrarRed() {
    this.router.navigate([`/${this.user.tiposervidor}/cadastrarREDs`]);
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

  async visualizarDisciplina(red: any){
    const visualizar = this.dialog.open(VisualizarDisciplinaComponent, {
      data: {
        idRED: red.idRED,
        pee: red.pee,
      },
    });
    this.handleDialogConfirm(visualizar);
  }

  async finalizarRed(red: any) {
    let res = false;
    res = await this.dialogQuestionService.openDialogConfirmDone('red');
    if (res) {
      await this.finalizarProcessoPermanent(red);
    }
  }

  editarRed(red: any) {
    if (red.situacao === 'Finalizado' || red.situacao === 'Recusado') {
      // Exibir uma mensagem ao usuário informando que a edição não é permitida
      this.snackBarService.open('Não é possível editar uma RED que está Finalizada ou Recusada.');
      return;
    }
    console.log(red);
    console.log(red.idRED);
    const editar = this.dialog.open(EditarREDComponent, {
      data: {
        id: red.idRED,
        motivoAfastamento: red.motivoAfastamento,
        inicioAfastamento: red.inicioAfastamento,
        dataPrevisaoTermino: red.dataPrevisaoTermino,
        situacao: red.situacao,
        observacao: red.observacao,
        dataInicioProcesso: red.dataInicioProcesso,
        semestreAluno: red.semestreOuAnoAluno,
        tempoAfastamento: red.tempoAfastamento,
        aluno_id: red.aluno_id,
        coordenador: red.coordenador,
        aluno: red.aluno,
      },
    });
    this.handleDialogConfirm(editar);
  }

  visualizarRed(red: any) {
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

  async gerarRelatorioFaltasAbonadas(red: any) {
    try {
      const redAluno = await this.peeService.getPeeRED(red.idRED);

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

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe(() => {
      this.findAll();
    });
  }

  isCOORD() {
    return this.user.tiposervidor === 'coordenador';
  }

  isADM() {
    return (
      this.user.tiposervidor === 'administrador' ||
      this.user.tiposervidor === 'cra'
    );
  }
}
