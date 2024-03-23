import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { alunoService } from 'src/app/services/alunos.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { cursoService } from 'src/app/services/cursos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
//
import { servidorService } from 'src/app/services/servidor.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';
import { redService } from 'src/app/services/red.service';
import { CadastrarAlunoComponent } from 'src/app/modulos/alunos/cadastrar/cadastrar.component';
import { RedValidationService } from 'src/app/utils/red-utils/red-validation.service';

@Component({
  selector: 'app-processo-red',
  templateUrl: './processo-red.component.html',
  styleUrls: ['./processo-red.component.css'],
})
export class CadastrarProcessoREDComponent implements OnInit {
  constructor(
    private router: Router,
    private alunoservice: alunoService,
    private cursoservice: cursoService,
    private servidorservice: servidorService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private dialog: MatDialog,
    public dialogQuestionService: messageDialog,
    private snackBar: MatSnackBar,
    private redValidation: RedValidationService,
    private redservice: redService
  ) {}

  alunos: any[] = [];
  cursos: any[] = [];
  inputCurso: any = '';
  filtredCursos: any[] = [];
  cadastrarRed!: FormGroup;
  isDisable: boolean = false;
  user: any;

  ngOnInit(): void {
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);
    this.cadastrarRed = new FormGroup({
      aluno: new FormControl('', [Validators.required]),
      curso: new FormControl('', [Validators.required]),
      observacao: new FormControl('', [Validators.maxLength(4000)]),
      motivoAfastamento: new FormControl('',
        [Validators.required,
        Validators.maxLength(4000)
    ]),
      inicioAfastamento: new FormControl('', [Validators.required]),
      tempoAfastamento: new FormControl('', [
        Validators.required,
        Validators.min(15),
        Validators.max(360),
      ]),
      semestreAluno: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(24)]),
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

  /*   InputFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      const pdf = event.target.files[0];
      const formData = new FormData();
      formData.append('pdf', pdf);
    }
  } */

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

  async CadastrarAluno() {
    const cadastrarAluno = this.dialog.open(CadastrarAlunoComponent, {
      data: {},
    });
    this.handleDialogConfirm(cadastrarAluno);
  }

  private dateToString(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  async cadastrar() {
    let red = {
      motivoAfastamento: this.motivoAfastamento,
        inicioAfastamento: this.inicioAfastamento,
        dataPrevisaoTermino: this.redValidation.previsaoTerminoRed(this.inicioAfastamento, this.tempoAfastamento),
        dataInicioProcesso: new Date(),
        semestreOuAnoAluno: this.semestreAluno,
        tempoAfastamento: this.tempoAfastamento,
        situacao: this.situacao,
        observacao: this.observacao,
        aluno_id: this.aluno.id,
        coordenador: this.filtredCursos[0].coordenador,
    }
    this.redValidation.validarRED(red);

    try {
      console.log(this.filtredCursos);
      await this.servidorservice.createRED({red});
      this.retornarParaLista();
    } catch (error) {
      console.error('Erro ao cadastrar RED:', error);
    }
  }

  retornarParaLista() {
    this.router.navigate([`/${this.user.tiposervidor}/listarREDs`]);
  }

  updateCharacterCount(campoTexto: string): number {
    return 4000 - campoTexto.length;
  }

  teste() {
    this.router.navigate([`/${this.user.tiposervidor}/cadastrarAlunos`]);
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

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe((result: string) => {});
  }

  get aluno() {
    return this.cadastrarRed.get('aluno')!.value;
  }

  get curso() {
    return this.cadastrarRed.get('curso')!.value;
  }

  get semestreAluno() {
    return this.cadastrarRed.get('semestreAluno')!.value;
  }

  get tempoAfastamento() {
    return this.cadastrarRed.get('tempoAfastamento')!.value;
  }

  get inicioAfastamento() {
    return this.cadastrarRed.get('inicioAfastamento')!.value;
  }
  get motivoAfastamento() {
    return this.cadastrarRed.get('motivoAfastamento')!.value;
  }

  get situacao() {
    return 'Esperando confirmação';
  }

  get observacao() {
    return this.cadastrarRed.get('observacao')!.value;
  }
}
