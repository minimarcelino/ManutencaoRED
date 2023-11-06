import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { red } from 'src/app/modelo/red';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { redService } from 'src/app/services/red.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarRedComponent implements OnInit {

  reds: red[] = [];
  filtredReds: red[] = [];
  dataSource: any;

  displayedColumns = ['prontuario', 'Início RED', 'Término RED', 'Prazo PEE', 'Situação'];

  constructor(private router: Router, public dialogQuestionService: messageDialog, private redservice: redService,
    private dialog: MatDialog, private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string) { }

  ngOnInit(): void {
    this.findAll()
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
  }

  formatData(data: Date): string {
    if (data) {
      return formatDate(data, 'dd/MM/yyyy', 'en-US', 'UTC');
    } else {
      return ''; 
    }
  }
}