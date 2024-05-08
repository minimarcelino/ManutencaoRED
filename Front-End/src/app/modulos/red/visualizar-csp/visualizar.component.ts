import { formatDate } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { messageDialog } from 'src/app/services/messageDialog.service';
import { PeeService } from 'src/app/services/pee.service';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.component.html',
  styleUrls: ['./visualizar.component.css'],
})
export class CSPVisualizarREDComponent implements OnInit {
  pee: any[] = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = [
    'Disciplina',
    'Professor',
    'Pee',
    'Comunicacao',
    'DataLimite',
    'DataEncaminhamento',
    'Cumprimento',
    'NovaProposta',
    'AtividadeAvaliativa',
    'AtividadeAvaliativaRealizadas',
    'DataAvaliacao',
  ];

  constructor(
    public dialogQuestionService: messageDialog,
    private dialog: MatDialogRef<CSPVisualizarREDComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private peeService: PeeService  ) {}

  ngOnInit() {
    this.findAll();
  }

  async findAll() {
    const pees = await this.peeService.getPee();
    this.pee = pees.data.pees;
    this.pee = this.pee.filter((pee) => pee.RED_idRED === this.data.idRED);
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

  cancelar() {
    this.dialog.close();
  }
}
