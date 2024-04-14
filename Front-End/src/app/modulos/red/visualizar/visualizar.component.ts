import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { AlunoService } from 'src/app/services/alunos.service';
import { CursoService } from 'src/app/services/cursos.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { RedService } from 'src/app/services/red.service';
import { VisualizarDisciplinaComponent } from '../visualizar-disciplina/visualizar-disciplina.component';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { red } from 'src/app/modelo/red';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.component.html',
  styleUrls: ['./visualizar.component.css'],
})
export class VisualizarREDComponent implements OnInit {
  visualizarRed!: FormGroup;
  user: any;
  alunos: any[] = [];
  cursos: any[] = [];
  inputCurso: any = '';
  filtredCursos: any[] = [];
  isDisable: boolean = false;
  motivoRecusaInput: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRefVisualizarRED: MatDialogRef<VisualizarREDComponent>,
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
        curso: new FormControl({ value: this.inputCurso, disabled: true }, [Validators.required,]),
        motivoRecusa: new FormControl('', [
          Validators.required,
          Validators.maxLength(4000),
        ]),
        motivoRecusaLabel: new FormControl({ value: this.data.motivoRecusa, disabled: true }),
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

  async fetchAlunos() {
    const response = await this.alunoService.getAluno();
    this.alunos = response.data.alunos;
    this.alunos = this.alunos.filter(
      (aluno) => aluno.prontuario === this.data.aluno_prontuario
    );
    this.fetchCursos();
  }

  async updateSituacaoRED(situacao: String) {
    try {
      await this.redService.updateRed({
        idRED: this.data.idRED,
        situacao: situacao,
      });
      this.snackBarService.open('RED alterado com sucesso!!');
      this.dialogRefVisualizarRED.close();
    } catch (error: any) {
      console.log(error);

      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        console.log(errorMessage);

        this.snackBarService.open(`Falha ao alterar o RED: ${errorMessage}`);
      } else {
        this.snackBarService.open('Falha ao alterar o RED');
      }
    }
  }

  confirmarRed() {
    this.updateSituacaoRED('Em andamento');
  }

  async recusarRed() {
    if (!this.motivoRecusaInput){
      this.motivoRecusaInput = true
    } else {
      if (this.motivoRecusa.trim() === '') {
        this.snackBarService.open('Motivo da Recusa deve ser preenchido corretamente.');
        return;
      }
      try {
        await this.redService.updateRed({
          idRED: this.data.idRED,
          situacao: "Recusado",
          motivoRecusa: this.motivoRecusa,
          
        });
  
        this.snackBarService.open('RED alterado com sucesso!!');
        this.dialogRefVisualizarRED.close();
      } catch (error: any) {
        console.log(error);
  
        if (error && error.error && error.error.data) {
          const errorMessage = error.error.data;
          console.log(errorMessage);
  
          this.snackBarService.open(`Falha ao alterar o RED: ${errorMessage}`);
        } else {
          this.snackBarService.open('Falha ao alterar o RED');
        }
      }
    }
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

  voltar() {
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

  isCOORD(){
    return this.user.tiposervidor === 'coordenador';
  }

  isCRA(){
    return this.user.tiposervidor === 'cra';
  }

  isADM(){
    return this.user.tiposervidor === 'administrador';
  }

  get motivoRecusa() {
    return this.visualizarRed.get('motivoRecusa')!.value;
  }
}
