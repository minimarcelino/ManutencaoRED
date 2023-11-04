import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { docente } from 'src/app/modelo/docente';
import { docenteService } from 'src/app/services/docente.service';
import { messageDialog } from 'src/app/services/messageDialog.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarDocenteComponent implements OnInit{

  docentes: any[] = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator !:MatPaginator;

  displayedColumns = ['prontuario', 'nome', 'email', 'acoes'];

  constructor(private router: Router, public dialogQuestionService: messageDialog, private docenteservice: docenteService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.findAll()
  }

  async cadastrar(){
    this.router.navigate(['/coordenador/cadastrar']);
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  async findAll(){
    const response = await this.docenteservice.getDocente();
    this.docentes = response.data.servidores;
    this.dataSource = new MatTableDataSource<docente>(this.docentes);
    this.dataSource.paginator=this.paginator;
  }

  editarDocente(docente: any){

  }

  deleteDocente(docente: any){

  }
}
