import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { aluno } from 'src/app/modelo/aluno';
import { red } from 'src/app/modelo/red';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { redService } from 'src/app/services/red.service';
import { AssociarDisciplinaComponent } from '../../associar-disciplina/associar-disciplina.component';
import { VisualizarRedComponent } from '../visualizar/visualizar.component';
import { peeService } from 'src/app/services/pee.service';
import * as fs from 'fs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarRedComponent implements OnInit {

  reds: red[] = [];
  pee: any[] = [];
  filtredReds: red[] = [];
  dataSource: any;
  mostrarBotao: boolean = false;
  user: any;

  displayedColumns = ['nomeAluno', 'inicioRed', 'terminoRed', 'prazoPee', 'Situação', 'acoes'];

  constructor(private router: Router, public dialogQuestionService: messageDialog, private redservice: redService,
    private dialog: MatDialog, private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string, private peeservice: peeService) { }

  ngOnInit(): void {
    this.findAll();
    this.user = localStorage.getItem("user");
    this.user = JSON.parse(this.user);
  }

  async findAll() {
    try {
      const response = await this.redservice.getRed();
      this.reds = response.data.reds;
      this.reds = this.reds.filter(red => red.situacao === "Em andamento");
      this.dataSource = new MatTableDataSource<red>(this.reds);   
      
    } catch (error) {
      console.error("Erro ao buscar REDs:", error);
    }
    if(this.user.tiposervidor == 'administrador'){
      this.mostrarBotao = true;
    }
  }

  formatData(data: Date): string {
    if (data) {
      return formatDate(data, 'dd/MM/yyyy', 'en-US', 'UTC');
    } else {
      return ''; 
    }
  }

  async gerarRelatorioFaltasAbonadas(red: any) {
    try {
      const redAluno = await this.peeservice.getPeeRED(red.idRED);
    
      // Extrair os dados necessários do redAluno
      const dados = redAluno.data.pees.map((item: any) => ({
        'Disciplina': item.disciplinas.nomeDisciplina,
        'As atividades do aluno foram entregues ao professor?': item.atividades.dateEntregaAluno,
        'O aluno cumpriu com as atividades propostas no PEE?': item.atividades.cumpriuAtividade,
        'Se "não cumpriu", foi proposta alguma nova atividade ao aluno (e que tenha sido cumprida)?': item.atividades.novaAtividade,
        'Houveram atividades avaliativas no periodo de afastamento do aluno?': item.houveAvaliacao,
        'As atividades avaliativas necessárias já foram realizadas?': item.avaliacoesRealizadas,
        'Data prevista para aplicação da atividade avaliativa, caso ainda não tenha sido aplicada.': item.dataAvaliacao,
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

  visualizarRed(red: any) {
    const editar =  this.dialog.open( VisualizarRedComponent ,{
      data: {idRED: red.idRED, servidor_idservidor: red.coordenador}
    });
    this.handleDialogConfirm(editar);
  }

  
  associarDisciplina(red: red){
    const editar =  this.dialog.open(AssociarDisciplinaComponent, {
      data: {idRED: red.idRED, servidor_idservidor: red.coordenador}
  });
  this.handleDialogConfirm(editar);
  }

  handleDialogConfirm(dialog: any){
    dialog.afterClosed().subscribe((result: string) => {
        this.findAll();
    });
  }

  cadastrarRed() {
    if(this.user.tiposervidor == 'administrador'){
      this.router.navigate(['/admin/cadastrarRed']);
    }
  }
}