import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { aluno } from 'src/app/modelo/aluno';
import { alunoService } from 'src/app/services/alunos.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { redService } from 'src/app/services/red.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarRedComponent implements OnInit{

  alunos: any[] = [];
  reds: any[] = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator !:MatPaginator;

  displayedColumns = ['dataInicioProcesso', 'dataInicioRed', 'dataLimitePEE', 'dataPrevisaoTermino', 'situacao', 'alunoProntuario', 'acoes'];

  constructor(private router: Router, public dialogQuestionService: messageDialog, private alunoservice: alunoService,
    private dialog: MatDialog, private redService: redService) {
  }

  ngOnInit(): void {
    this.findAll()
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  async findAll(){
    const response = await this.alunoservice.getAluno();
    const response2 = await this.redService.getRed();
    this.alunos = response.data.alunos;
    console.log(response2);
    this.reds = response2.data.reds;
    console.log(this.reds);
    this.dataSource = new MatTableDataSource<any>(this.reds);
    this.dataSource.paginator=this.paginator;
  }

  formatData(data: Date): string {
    if (data) {
      return formatDate(data, 'dd/MM/yyyy', 'en-US', 'UTC');
    } else {
      return ''; 
    }
  }

  editarRed(red : any) {

  }

  deleteRed(red : any) {

  }

}
