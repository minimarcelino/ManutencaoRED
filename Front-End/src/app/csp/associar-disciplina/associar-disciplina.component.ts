import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { disciplina } from 'src/app/modelo/disciplina';
import { disciplinaService } from 'src/app/services/disciplina.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { storageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-associar-disciplina',
  templateUrl: './associar-disciplina.component.html',
  styleUrls: ['./associar-disciplina.component.css']
})
export class AssociarDisciplinaComponent implements OnInit{

  associarDisciplina!: FormGroup;
  disciplinas: any[] = [];
  dataSource: any;
  user: any;
  @ViewChild(MatPaginator) paginator !:MatPaginator;

  displayedColumns = ['sigla', 'nomedisciplina', 'acoes'];

  constructor (private http: HttpClient, private router: Router, private disciplinaservice: disciplinaService, public dialogQuestionService: messageDialog,
    private dialog: MatDialogRef<AssociarDisciplinaComponent>, private storage: storageService, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.associarDisciplina = new FormGroup({
      sigla: new FormControl('', [Validators.required]),
      nomedisciplina: new FormControl('', [Validators.required]),
    });
    this.findAll();
    this.user = localStorage.getItem("user");
    this.user = JSON.parse(this.user);
  }

  async findAll(){
    const response = await this.disciplinaservice.getDisciplina();
    this.disciplinas = response.data.disciplinas;
    this.dataSource = new MatTableDataSource<disciplina>(this.disciplinas);
    this.dataSource.paginator=this.paginator;
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  async cadastrar(){
    this.user = localStorage.getItem("user");
    this.user = JSON.parse(this.user);

    if (this.user.tiposervidor == 'administrador') {
      this.router.navigate(['/admin/cadastrarDisciplina']);
    } else {
      this.router.navigate(['/coordenador/cadastrarDisciplina']);
    }
  }

}
