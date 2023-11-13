import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { alunoService } from 'src/app/services/alunos.service';
import { cursoService } from 'src/app/services/cursos.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { redService } from 'src/app/services/red.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.component.html',
  styleUrls: ['./visualizar.component.css']
})
export class VisualizarComponent implements OnInit{

  visualizarRed!: FormGroup;
  user:any;
  alunos: any[] = [];
  cursos: any[] = [];
  inputCurso: any = '';
  filtredCursos: any[] = [];
  isDisable: boolean = false;

  constructor (private snackBar: MatSnackBar, private router: Router, public dialogQuestionService: messageDialog, private redService: redService,
    @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialogRef<VisualizarComponent>, private _adapter: DateAdapter<any>, 
    @Inject(MAT_DATE_LOCALE) private _locale: string, private cursoService: cursoService, private alunoService: alunoService) {}

    ngOnInit(): void {
      this._locale = 'pt-BR';
      this._adapter.setLocale(this._locale);
      console.log(this.data);
      this.visualizarRed = new FormGroup({
        prontuario: new FormControl({value: this.data.nome + ' - ' + this.data.aluno_prontuario, disabled: true}, [Validators.required]),
        curso: new FormControl({value: this.inputCurso, disabled: true}, [Validators.required]),
        motivoAfastamento: new FormControl({value: this.data.motivoAfastamento, disabled: true}, [Validators.required]),
        inicioAfastamento: new FormControl({value: this.data.inicioAfastamento, disabled: true}, [Validators.required]),
        previsaoTermino: new FormControl({value: this.data.dataPrevisaoTermino, disabled: true}, [Validators.required]),
        inicioProcesso: new FormControl({value: this.data.dataInicioProcesso, disabled: true}, [Validators.required]),
      });
      this.user = localStorage.getItem("user");
      this.user = JSON.parse(this.user);
      this.fetchAlunos();
      this.fetchCursos();
    }

  async updateRed(situacao: String) {
    try {
      await this.redService.updateRed({
        idRED: this.data.idRED,
        aluno_prontuario: this.data.aluno_prontuario,
        dataInicioProcesso: this.data.dataInicioProcesso,
        dataPrevisaoTermino: this.data.dataPrevisaoTermino,
        motivoAfastamento: this.data.motivoAfastamento,
        situacao: situacao,
        coordenador: this.data.coordenador,
        aluno_id: this.data.aluno_id,
        observacao: this.data.observacao,
        inicioAfastamento: this.data.inicioAfastamento,
        tempoAfastamento: this.data.tempoAfastamento,
        semestreOuAnoAluno: this.data.semestreOuAnoAluno
      }); 
      this.openSnackBar("RED alterado com sucesso!!", null);
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.openSnackBar("Falha ao alterar o RED", errorMessage);
      } else {
        this.openSnackBar("Falha ao alterar o RED", "Ocorreu um erro durante a edição do RED.");
      }
    }
  }

  async fetchAlunos() {
    const response = await this.alunoService.getAluno();
    this.alunos = response.data.alunos;
    this.alunos = this.alunos.filter(aluno => aluno.prontuario === this.data.aluno_prontuario);
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

  async fetchCursos() {
    const response = await this.cursoService.getCursos();
    this.cursos = response.data.cursos;
    this.filtredCursos = this.cursos.filter(curso => curso.idcurso === this.alunos[0].curso_idcurso);
    this.inputCurso = this.filtredCursos[0].nomeCurso;
  }

  changeCurso() {
    this.fetchCursos();
    this.isDisable = true;
  }

  displayFn(aluno: any): string {
    let pront = aluno.prontuario;
    let nome = aluno.nome;
    let pront_aluno = pront + ' - ' + nome;
    return aluno && pront_aluno;

  }
  

  confirmarRed() {
    this.updateRed("Em andamento");
  }

  recusarRed() {
    this.updateRed("Recusado");
  }
}
