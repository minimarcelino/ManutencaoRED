import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AlunoService } from 'src/app/services/alunos.service';
import { CursoService } from 'src/app/services/cursos.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { RedService } from 'src/app/services/red.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';
import { VisualizarDisciplinaComponent } from '../../visualizar-disciplina/visualizar-disciplina.component';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.component.html',
  styleUrls: ['./visualizar.component.css'],
})
export class VisualizarREDsComponent implements OnInit {
  visualizarRed!: FormGroup;
  user: any;
  alunos: any[] = [];
  cursos: any[] = [];
  inputCurso: any = '';
  filtredCursos: any[] = [];
  isDisable: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRefVisualizarRED: MatDialogRef<VisualizarREDsComponent>,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    public dialogQuestionService: messageDialog,
    private snackBarService: SnackBarService,
    private dialog: MatDialog,
    private redService: RedService,
    private cursoService: CursoService,
    private alunoService: AlunoService,

  ) {}

  ngOnInit(): void {
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);
    this.visualizarRed = new FormGroup({
      prontuario: new FormControl({value: this.data.nome + ' - ' + this.data.aluno_prontuario, disabled: true,},[Validators.required]),
      curso: new FormControl({ value: this.inputCurso, disabled: true }, [Validators.required,]),
      motivoAfastamento: new FormControl({ value: this.data.motivoAfastamento, disabled: true },[Validators.required]),
      inicioAfastamento: new FormControl({ value: this.data.inicioAfastamento, disabled: true },[Validators.required]),
      previsaoTermino: new FormControl({ value: this.data.dataPrevisaoTermino, disabled: true },[Validators.required]),
      inicioProcesso: new FormControl({ value: this.data.dataInicioProcesso, disabled: true },[Validators.required]),
    });
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    this.fetchAlunos();
    console.log(this.data);
  }

  async updateRed(situacao: String) {
    try {
      await this.redService.updateRed({
        idRED: this.data.idRED,
        nome: this.data.nome,
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
        semestreOuAnoAluno: this.data.semestreOuAnoAluno,
      });
      this.snackBarService.open('RED alterado com sucesso!!');
      this.dialogRefVisualizarRED.close();
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.snackBarService.open(`Falha ao alterar o RED: ${errorMessage}`);
      } else {
        this.snackBarService.open('Falha ao alterar o RED');
      }
    }
  }

  async fetchAlunos() {
    const response = await this.alunoService.getAluno();
    this.alunos = response.data.alunos;
    this.alunos = this.alunos.filter(
      (aluno) => aluno.prontuario === this.data.aluno_prontuario
    );
    this.fetchCursos();
  }

  visualizarDisciplina(red: any) {
    const visualizar = this.dialog.open(VisualizarDisciplinaComponent, {
      data: {
        idRED: red.idRED,
        pee: red.pee,
      },
    });
    this.handleDialogConfirm(visualizar);
  }

  async fetchCursos() {
    const response = await this.cursoService.getCursos();
    this.cursos = response.data.cursos;
    if (this.alunos && this.alunos.length > 0) {
      this.filtredCursos = this.cursos.filter(
        (curso) => curso.idcurso === this.alunos[0].curso_idcurso
      );
      this.inputCurso = this.filtredCursos[0].nomeCurso;
    }
  }

  changeCurso() {
    this.fetchCursos();
    this.isDisable = true;
  }

  cancelar() {
    this.dialogRefVisualizarRED.close();
  }

  displayFn(aluno: any): string {
    let pront = aluno.prontuario;
    let nome = aluno.nome;
    let pront_aluno = pront + ' - ' + nome;
    return aluno && pront_aluno;
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe((result: string) => {});
  }

  confirmarRed() {
    this.updateRed('Em andamento');
  }

  recusarRed() {
    this.updateRed('Recusado');
  }
}
