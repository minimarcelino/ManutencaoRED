import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { alunoService } from 'src/app/services/alunos.service';
import { cursoService } from 'src/app/services/cursos.service';
import { redService } from 'src/app/services/red.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
})
export class EditarREDComponent implements OnInit {
  constructor(
    private router: Router,
    private alunoservice: alunoService,
    private cursoservice: cursoService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private dialog: MatDialogRef<EditarREDComponent>,
    private redservice: redService
  ) {}

  alunos: any[] = [];
  cursos: any[] = [];
  inputCurso: any = '';
  filtredCursos: any[] = [];
  editarRed!: FormGroup;
  isDisable: boolean = false;
  user: any;

  ngOnInit(): void {
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);
    var date = new Date(this.data.inicioAfastamento);
    var utcYear = date.getUTCFullYear();
    var utcMonth = date.getUTCMonth();
    var utcDay = date.getUTCDate();
    var utcDate = new Date(utcYear, utcMonth, utcDay);
    console.log(this.data);
    this.displayFn(this.data.aluno);
    this.editarRed = new FormGroup({
      aluno: new FormControl(this.data.aluno, [Validators.required]),
      curso: new FormControl(this.data.aluno.curso.nomeCurso, [Validators.required,]),
      observacao: new FormControl(this.data.observacao),
      motivoAfastamento: new FormControl(this.data.motivoAfastamento, [Validators.required,]),
      inicioAfastamento: new FormControl(utcDate, [Validators.required]),
      tempoAfastamento: new FormControl(this.data.tempoAfastamento, [Validators.required]),
      semestreAluno: new FormControl(this.data.semestreAluno, [Validators.required]),
    });
    this.fetchAlunos();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  displayFn(aluno: any): string {
    let pront = aluno.prontuario;
    let nome = aluno.nome;
    let pront_aluno = pront + ' - ' + nome;
    return aluno && pront_aluno;
  }

  InputFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      const pdf = event.target.files[0];
      const formData = new FormData();
      formData.append('pdf', pdf);
    }
  }

  cancelar() {
    this.dialog.close();
  }

  async fetchAlunos() {
    const response = await this.alunoservice.getAluno();
    this.alunos = response.data.alunos;
  }

  async fetchCursos() {
    const response = await this.cursoservice.getCursos();
    this.cursos = response.data.cursos;
    this.filtredCursos = this.cursos.filter(
      (curso) => curso.idcurso === this.aluno.curso_idcurso
    );
    this.inputCurso = this.filtredCursos[0].nomeCurso;
  }

  changeCurso() {
    this.fetchCursos();
    this.isDisable = true;
  }

  async editar() {
    try {
      await this.redservice.updateRed({
        idRED: this.data.id,
        motivoAfastamento: this.motivoAfastamento,
        inicioAfastamento: this.inicioAfastamento,
        dataPrevisaoTermino: this.previsaoTerminoRed(),
        dataInicioProcesso: this.data.dataInicioProcesso,
        semestreOuAnoAluno: this.data.semestreAluno,
        tempoAfastamento: this.tempoAfastamento,
        situacao: this.data.situacao,
        observacao: this.observacao,
        aluno_id: this.data.aluno_id,
        coordenador: this.data.coordenador,
      });
      const redsExistente = await this.redservice.getRed();
      const redExistenteNoMesmoPeriodo = redsExistente.data.reds.find(
        (red: any) => {
          if (red.idRED === this.data.id) {
            return false;
          }

          const inicioAfastamentoRed = new Date(red.inicioAfastamento)
            .toISOString()
            .split('T')[0];
          const previsaoTerminoRed = new Date(red.dataPrevisaoTermino)
            .toISOString()
            .split('T')[0];
          const inicioAfastamentoThis = new Date(
            this.editarRed.value.inicioAfastamento
          )
            .toISOString()
            .split('T')[0];
          const previsaoTerminoThis = new Date(this.previsaoTerminoRed())
            .toISOString()
            .split('T')[0];

          return (
            inicioAfastamentoRed === inicioAfastamentoThis &&
            previsaoTerminoRed === previsaoTerminoThis
          );
        }
      );

      if (redExistenteNoMesmoPeriodo) {
        this.openSnackBar(
          'Já existe um RED para este prontuário no mesmo período! ',
          null
        );
        return;
      }
      if (this.user.tiposervidor == 'administrador') {
        this.router.navigate(['admin/listarReds']);
        this.dialog.close();
      } else {
        this.router.navigate(['cra/listarRED']);
        this.dialog.close();
      }
    } catch (error) {
      console.error('Error submitting ProcessoRED:', error);
    }
  }

  previsaoTerminoRed(): Date {
    const dataTerminoRed = new Date(this.inicioAfastamento);
    dataTerminoRed.setDate(dataTerminoRed.getDate() + this.tempoAfastamento);

    // Adiciona mais 30 dias ao resultado anterior
    const dataFinal = new Date(dataTerminoRed);
    dataFinal.setDate(dataFinal.getDate() + 30);
    return dataFinal;
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
      duration: 3000,
    });
  }

  get aluno() {
    return this.editarRed.get('aluno')!.value;
  }

  get curso() {
    return this.editarRed.get('curso')!.value;
  }

  get semestreAluno() {
    return this.editarRed.get('semestreAluno')!.value;
  }

  get tempoAfastamento() {
    return this.editarRed.get('tempoAfastamento')!.value;
  }

  get inicioAfastamento() {
    return this.editarRed.get('inicioAfastamento')!.value;
  }
  get motivoAfastamento() {
    return this.editarRed.get('motivoAfastamento')!.value;
  }

  get observacao() {
    return this.editarRed.get('observacao')!.value;
  }
}
