import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { disciplina } from 'src/app/modelo/disciplina';
import { DisciplinaService } from 'src/app/services/disciplina.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { PeeService } from 'src/app/services/pee.service';
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
  dataSource2:any;
  user: any;
  @ViewChild(MatPaginator) paginator !:MatPaginator;

  displayedColumns = ['sigla', 'nomedisciplina', 'acoes'];

  constructor (private http: HttpClient, private router: Router, private disciplinaservice: DisciplinaService, public dialogQuestionService: messageDialog,
    private dialog: MatDialogRef<AssociarDisciplinaComponent>, private storage: storageService, @Inject(MAT_DIALOG_DATA) public data: any, private peeservice: PeeService,
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
  }

  async findAll() {
    const response = await this.disciplinaservice.getDisciplina();
    this.disciplinas = response.data.disciplinas;

    if (this.data.red && this.data.red.pee && this.data.red.pee.length > 0) {
      const idDisciplinasRed = this.data.red.pee.map((item: any) => item.disciplinas.iddisciplinas);

      idDisciplinasRed.forEach((idDisciplinaRed: any) => {
        const disciplinaEncontrada = this.disciplinas.find(
          disciplina => disciplina.iddisciplinas === idDisciplinaRed
        );

        if (disciplinaEncontrada) {
          this.disciplinas = this.disciplinas.filter(
            disciplina => disciplina.iddisciplinas !== idDisciplinaRed
          );
        }
      });
    }

    this.dataSource = new MatTableDataSource<disciplina>(this.disciplinas);
    this.dataSource.paginator = this.paginator;
  }


  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  selecionarDisciplina(disciplina: any) {
    const disciplinaExistenteIndex = this.disciplinasSelecionadas.findIndex(
      (disciplinaSelecionada) => disciplinaSelecionada.iddisciplinas === disciplina.iddisciplinas
    );

    if (disciplinaExistenteIndex === -1) {
      this.disciplinasSelecionadas.push(disciplina);
      this.dataSource2 = new MatTableDataSource<disciplina>(this.disciplinasSelecionadas);
    } else {
      this.openSnackBar("Esta disciplina já foi associada", null);
    }
  }

  removerDisciplina(disciplina: any) {
    const index = this.disciplinasSelecionadas.findIndex((item) => item.iddisciplinas === disciplina.iddisciplinas);
    if (index >= 0) {
      this.disciplinasSelecionadas.splice(index, 1);
      this.dataSource2 = new MatTableDataSource<disciplina>(this.disciplinasSelecionadas);
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
          percentualabono: -1.0,
        });
      }
      this.openSnackBar("Disciplinas associadas com sucesso!!", null);
      this.dialog.close();
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.openSnackBar("Falha ao cadastrar aluno", errorMessage);
      } else {
        this.openSnackBar("Falha ao cadastrar aluno", "Ocorreu um erro durante o cadastro do aluno.");
      }
    }
  }

  cancelar() {
    this.dialog.close();
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
