import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { disciplinaService } from 'src/app/services/disciplina.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { peeService } from 'src/app/services/pee.service';
import { servidorService } from 'src/app/services/servidor.service';
import { storageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.component.html',
  styleUrls: ['./visualizar.component.css']
})
export class VisualizarRedComponent implements OnInit {

  pee: any[] = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;

  displayedColumns = ['Disciplina', 'Professor', 'Pee', 'Comunicacao', 'DataLimite', 'DataEncaminhamento', 'Cumprimento', 'NovaProposta', 'AtividadeAvaliativa',
    'AtividadeAvaliativaRealizadas', 'DataAvaliacao'];

  constructor(private http: HttpClient, private router: Router, public dialogQuestionService: messageDialog,
    private dialog: MatDialogRef<VisualizarRedComponent>, private storage: storageService, @Inject(MAT_DIALOG_DATA) public data: any,
    private peeservice: peeService, private snackBar: MatSnackBar, private disciplinaservice: disciplinaService, private servidorservice: servidorService) { }

  ngOnInit() {
    this.findAll();
  }

  async findAll() {
    const pees = await this.peeservice.getPee();
    this.pee = pees.data.pees;
    this.pee = this.pee.filter(pee => pee.RED_idRED === this.data.idRED);
    this.dataSource = new MatTableDataSource<any>(this.pee);
    this.dataSource.paginator = this.paginator;
    console.log(this.pee);
  }

  formatData(Data: Date): string {
    if (Data) {
      return formatDate(Data, 'dd/MM/yyyy', 'en-US', 'UTC');
    } else {
      return '';
    }
  }
}