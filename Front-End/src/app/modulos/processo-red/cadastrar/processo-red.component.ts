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
      motivoAfastamento: new FormControl('', [
        Validators.required,
        Validators.maxLength(4000),
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
        Validators.max(24),
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

  async cadastrar() {
    // Verificação se o RED já existe no mesmo período
    const redsExistente = await this.redservice.getRed();
    const redExistenteNoMesmoPeriodo = redsExistente.data.reds.find((red: any) => {
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
    if (this.semestreAluno <= 0 || this.semestreAluno > 20) {
      this.openSnackBar('O semestre informado deve estar entre 1 e 24.', null);
      return;
    }
    if (redExistenteNoMesmoPeriodo) {
      this.openSnackBar('Já existe um RED para este prontuário no mesmo período! ',null);
      return;
    }

    const inicioAfastamentoValido = this.verificarDataInicioAfastamento(this.inicioAfastamento);
    if (!inicioAfastamentoValido) {
      this.openSnackBar('O início do afastamento deve ser no máximo 7 dias antes da data de hoje! ',null);
      return;
    }

    // Criação do RED
    try {
      console.log(this.filtredCursos);
      await this.servidorservice.createRED({
        motivoAfastamento: this.motivoAfastamento,
        inicioAfastamento: this.inicioAfastamento,
        dataPrevisaoTermino: this.previsaoTerminoRed(),
        dataInicioProcesso: new Date(),
        semestreOuAnoAluno: this.semestreAluno,
        tempoAfastamento: this.tempoAfastamento,
        situacao: this.situacao,
        observacao: this.observacao,
        aluno_id: this.aluno.id,
        coordenador: this.filtredCursos[0].coordenador,
      });

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
