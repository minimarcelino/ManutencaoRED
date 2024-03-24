import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AlunoService } from 'src/app/services/alunos.service';
import { CursoService } from 'src/app/services/cursos.service';
import { RedService } from 'src/app/services/red.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
})
export class EditarREDComponent implements OnInit {
  constructor(
    private router: Router,
    private alunoService: AlunoService,
    private cursoService: CursoService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private dialog: MatDialogRef<EditarREDComponent>,
    private redService: RedService
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
      observacao: new FormControl(this.data.observacao, [Validators.maxLength(40000)]),
      motivoAfastamento: new FormControl(this.data.motivoAfastamento, [
        Validators.required,
        Validators.maxLength(4000)
      ]),
      inicioAfastamento: new FormControl(utcDate, [Validators.required]),
      tempoAfastamento: new FormControl(this.data.tempoAfastamento, [
        Validators.required,
        Validators.min(15),
        Validators.max(360)
      ]),
      semestreAluno: new FormControl(this.data.semestreAluno, [
        Validators.required,
        Validators.min(1),
        Validators.max(24)
      ]),
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
    const response = await this.alunoService.getAluno();
    this.alunos = response.data.alunos;
  }

  async fetchCursos() {
    const response = await this.cursoService.getCursos();
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
    const inicioAfastamentoValido = this.verificarDataInicioAfastamento(
      this.inicioAfastamento
    );
    const redsExistente = await this.redService.getRed();
    const redExistenteNoMesmoPeriodo = redsExistente.data.reds.find(
      (red: any) => {
        const inicioAfastamentoRed = this.dateToString(red.inicioAfastamento);
        const previsaoTerminoRed = this.dateToString(red.dataPrevisaoTermino);
        const inicioAfastamentoThis = this.dateToString(this.inicioAfastamento);
        const previsaoTerminoThis = this.dateToString(this.previsaoTerminoRed());

        return (
          inicioAfastamentoRed === inicioAfastamentoThis &&
          previsaoTerminoRed === previsaoTerminoThis
        );
      }
    );
    if (this.tempoAfastamento < 15 || this.tempoAfastamento > 360) {
      this.openSnackBar(
        'O período de afastamento deve ser entre 15 a 360 dias.',null);
      return;
    }
    if (this.data.semestreAluno <= 0 || this.data.semestreAluno > 20) {
      this.openSnackBar('O semestre informado deve estar entre 1 e 24.', null);
      return;
    }
    if (redExistenteNoMesmoPeriodo) {
      this.openSnackBar('Já existe um RED para este prontuário no mesmo período! ',null);
      return;
    }
    if (!inicioAfastamentoValido) {
      this.openSnackBar('O início do afastamento deve ser no máximo 7 dias antes da data de hoje! ',null);
      return;
    }


    try {
      await this.redService.updateRed({
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
      this.router.navigate([`/${this.user.tiposervidor}/listarREDs`]);
      this.dialog.close();
    } catch (error) {
      console.error('Error submitting ProcessoRED:', error);
    }
  }


  updateCharacterCount(campoTexto: string): number {
    return 4000 - campoTexto.length;
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

  private verificarDataInicioAfastamento(dataInicioAfastamento: Date): boolean {
    const hoje = new Date();
    const dataInicio = new Date(dataInicioAfastamento);
    const diff = Math.abs(hoje.getTime() - dataInicio.getTime());
    const diffEmDias = Math.floor(diff / (1000 * 60 * 60 * 24));
    return diffEmDias <= 7;
  }

  private dateToString(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  private previsaoTerminoRed(): Date {
    const dataTerminoRed = new Date(this.inicioAfastamento);
    dataTerminoRed.setDate(dataTerminoRed.getDate() + this.tempoAfastamento);

    // Adiciona mais 30 dias ao resultado anterior
    const dataFinal = new Date(dataTerminoRed);
    dataFinal.setDate(dataFinal.getDate() + 30);
    return dataFinal;
  }
}
