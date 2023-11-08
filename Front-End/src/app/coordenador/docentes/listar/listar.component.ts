import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { docente } from 'src/app/modelo/docente';
import { docenteService } from 'src/app/services/docente.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { EditarDocenteComponent } from '../editar/editar.component';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarDocenteComponent implements OnInit{

  docentes: any[] = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator !:MatPaginator;
  user: any;

  displayedColumns = ['prontuario', 'nome', 'email', 'acoes'];

  constructor(private router: Router, public dialogQuestionService: messageDialog, private docenteservice: docenteService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.findAll()
    this.user = localStorage.getItem("user");
    this.user = JSON.parse(this.user);
  }

  async cadastrar(){
    if(this.user.tiposervidor == 'administrador'){
      this.router.navigate(['/admin/cadastrarDocente']);
    } else {
      this.router.navigate(['/coordenador/cadastrar']);
    }
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
    const editar =  this.dialog.open(EditarDocenteComponent, {
      data: {idservidor: docente.idservidor, prontuario: docente.prontuario, nome: docente.nome, email: docente.email, 
             tiposervidor: docente.tiposervidor}
    });
    this.handleDialogConfirm(editar);
  }

  deleteDocente(docente: any){

  }

  handleDialogConfirm(dialog: any){
    dialog.afterClosed().subscribe((result: string) => {
        this.findAll();
    });
  }
}
