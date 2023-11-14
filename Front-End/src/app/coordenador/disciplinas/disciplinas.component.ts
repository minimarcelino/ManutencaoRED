import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { servidorService } from 'src/app/services/servidor.service';
import { MatDialog } from '@angular/material/dialog';
import { disciplinaService } from 'src/app/services/disciplina.service';
import { MatPaginator } from '@angular/material/paginator';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { disciplina } from 'src/app/modelo/disciplina';
import { storageService } from 'src/app/services/storage.service';
import { EditarDisciplinaComponent } from './editar/editar.component';

@Component({
  selector: 'app-disciplinas',
  templateUrl: './disciplinas.component.html',
  styleUrls: ['./disciplinas.component.css']
})
export class DisciplinasComponent implements OnInit {
  dataToImport: any;
  data: any[] = [];
  disciplinas: any[] = [];
  dataSource: any;
  user: any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;

  displayedColumns = ['sigla', 'nomedisciplina', 'curso_idcurso', 'acoes'];

  constructor(private http: HttpClient, private router: Router, private servidorService: servidorService, public dialogQuestionService: messageDialog, private disciplinaservice: disciplinaService,
    private dialog: MatDialog, private storage: storageService) { }

  ngOnInit() {
    this.findAll();
    this.user = localStorage.getItem("user");
    this.user = JSON.parse(this.user);
  }

  async cadastrar() {
    this.user = localStorage.getItem("user");
    this.user = JSON.parse(this.user);

    if (this.user.tiposervidor == 'administrador') {
      this.router.navigate(['/admin/cadastrarDisciplina']);
    } else {
      this.router.navigate(['/coordenador/cadastrarDisciplina']);
    }
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  async findAll() {
    const response = await this.disciplinaservice.getDisciplina();
    this.disciplinas = response.data.disciplinas;
    this.dataSource = new MatTableDataSource<disciplina>(this.disciplinas);
    this.dataSource.paginator = this.paginator;
  }

  irAssociar() {
    if (this.user.tiposervidor == 'administrador') {
      this.router.navigate(['admin/associarDisciplinas']);
    }
  }

  editarDisciplina(disciplina: any) {
    const editar = this.dialog.open(EditarDisciplinaComponent, {
      data: { id: disciplina.id, nomeDisciplina: disciplina.nomeDisciplina, sigla: disciplina.sigla, curso: disciplina.curso }
    });
    this.handleDialogConfirm(editar);
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe((result: string) => {
      this.findAll();
    });
  }

}
