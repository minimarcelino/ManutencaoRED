import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { messageDialog } from 'src/app/services/messageDialog.service';
import { PeeService } from 'src/app/services/pee.service';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.component.html',
  styleUrls: ['./visualizar.component.css'],
})
export class CSPVisualizarREDComponent implements OnInit {
  user: any;
  pee: any[] = [];
  dataSource: any;
  private idRED: any;
  private aluno: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = [
    'Disciplina',
    'Professor',
    'Comunicacao',
    'DataEnvio',
    'DataLimite',
    'DataEntrega',
    'Cumprimento',
    'AtividadeAvaliativa',
    'AtividadeAvaliativaRealizadas',
    'DataAvaliacao',
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialogQuestionService: messageDialog,
    private peeService: PeeService
  ) {}

  ngOnInit(): void {
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    this.activatedRoute.paramMap.subscribe((params) => {
      if (window.history.state) {
        this.idRED = window.history.state.idRED;
        this.aluno = window.history.state.aluno;
      }
    });
    this.findAll();
  }

  async findAll() {
    const pees = await this.peeService.getPeeByIdRED(this.idRED);
    this.pee = pees.data.pees;
    console.log(this.pee);
    this.dataSource = new MatTableDataSource<any>(this.pee);
    this.dataSource.paginator = this.paginator;
  }

  formatData(Data: Date): string {
    if (Data) {
      return formatDate(Data, 'dd/MM/yyyy', 'en-US', 'UTC');
    } else {
      return '';
    }
  }

  apresentarAluno() {
    return `Aluno ${this.aluno.nome} - ${this.aluno.prontuario}`;
  }

  voltar() {
    this.router.navigate([`/${this.user.tiposervidor}/listarREDs`]);
  }

  imprimir() {
    const printableContent = document.querySelector('.corpo')!.innerHTML;
    const printWindow = window.open('Acompanhamento RED', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
        <link rel="stylesheet" type="text/css" href="./impressao.css">
          <title>Impressão</title>
          <style> .corpo {height: 100%;width: 100%;margin: 20px;}h1, h2 {color: black;padding-top: 10px;}mat-dialog-container {min-width: 85%;min-height: 85%;}.listagem {margin: 15px;}.corpo {margin: 5px;width: 100%;height: 100%;padding-bottom: 5px;}.button, #imprimir {margin: 15px;padding: 10px; max-height: 40px; max-width:75px}.table {margin-right: 10px;border-collapse: separate;border-spacing: 10px;}td, th {border: 10px;padding: 10px;border: 1px solid black }</style>
        </head>
        <body>${printableContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error('Falha ao abrir a janela de impressão');
    }
  }

}
