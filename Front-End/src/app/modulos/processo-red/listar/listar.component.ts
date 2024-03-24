import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

import { curso } from 'src/app/modelo/curso';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { RedService } from 'src/app/services/red.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';
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
  reds: red[] = [];
  alunos: aluno[] = [];
  dataSource: any;
  user: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = [
    'Prontuário',
    'Nome',
    'Curso',
    'Início RED',
    'Tempo Afastamento',
    'Previsão Término',
    'Situação',
    'Ações',
  ];

  constructor(
    private router: Router,
    private redService: RedService,
    public dialogQuestionService: messageDialog,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private peeService: PeeService
  ) {}

  ngOnInit(): void {
    this.findAll();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async findAll() {
    const response = await this.redService.getRed();
    this.reds = response.data.reds;

    this.dataSource = new MatTableDataSource<any>(this.reds);
    this.dataSource.paginator = this.paginator;

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      // Altere 'nome' para a propriedade que contém o nome no seu objeto de dados
      return data.aluno.nome.toLowerCase().includes(filter.toLowerCase());
    };
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value;
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

  editarRed(red: any) {
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

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe(() => {
      this.findAll();
    });
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
}
