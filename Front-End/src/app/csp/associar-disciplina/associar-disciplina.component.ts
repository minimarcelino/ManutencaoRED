import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { disciplina } from 'src/app/modelo/disciplina';
import { disciplinaService } from 'src/app/services/disciplina.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { peeService } from 'src/app/services/pee.service';
import { storageService } from 'src/app/services/storage.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';

@Component({
  selector: 'app-associar-disciplina',
  templateUrl: './associar-disciplina.component.html',
  styleUrls: ['./associar-disciplina.component.css']
})
export class AssociarDisciplinaComponent implements OnInit{

  associarDisciplina!: FormGroup;
  disciplinasSelecionadas: any[] = [];
  disciplinas: any[] = [];
  dataSource: any;
  user: any;
  @ViewChild(MatPaginator) paginator !:MatPaginator;

  displayedColumns = ['sigla', 'nomedisciplina', 'acoes'];

  constructor (private http: HttpClient, private router: Router, private disciplinaservice: disciplinaService, public dialogQuestionService: messageDialog,
    private dialog: MatDialogRef<AssociarDisciplinaComponent>, private storage: storageService, @Inject(MAT_DIALOG_DATA) public data: any, private peeservice: peeService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.associarDisciplina = new FormGroup({
      sigla: new FormControl('', [Validators.required]),
      nomedisciplina: new FormControl('', [Validators.required]),
      checkbox: new FormControl('', [Validators.required]),
    });
    this.findAll();
    this.user = localStorage.getItem("user");
    this.user = JSON.parse(this.user);
    console.log(this.data);
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

  selecionarDisciplina(disciplina: any) {
    const index = this.disciplinasSelecionadas.findIndex(d => d === disciplina);

    if (index === -1) {
      this.disciplinasSelecionadas.push(disciplina);
    } else {
      this.disciplinasSelecionadas.splice(index, 1);
    }
  }

  async cadastrar() {
    try {
      for (const item of this.disciplinasSelecionadas) {
        await this.peeservice.createPee({
          conteudo: '',
          metodologia: '',
          trabalhos: '',
          bibliografia: '',
          criterios: '',
          prazofinal: new Date(),
          RED_idRED: this.data.idRED,
          disciplinas_iddisciplinas: item.iddisciplinas,
          servidor_idservidor: this.data.servidor_idservidor,
          percentualabono: 0.0,
        });
      }
      this.openSnackBar("Disciplinas associadas com sucesso!!", null);
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.openSnackBar("Falha ao cadastrar aluno", errorMessage);
      } else {
        this.openSnackBar("Falha ao cadastrar aluno", "Ocorreu um erro durante o cadastro do aluno.");
      }
    }
  }  

  openSnackBar(message: string, error: string | Error | null) {
    let data;
    if (error === null) {
      data = { message };
    } else if (typeof error === 'string') {
      data = { message: error };
    } else if (error instanceof Error) {
      data = { message: error.message };
    }
    
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: data,
      duration: 3000
    });
  }
}
