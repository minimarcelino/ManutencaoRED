import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlunoService } from 'src/app/services/alunos.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CursoService } from 'src/app/services/cursos.service';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
//
import { messageDialog } from 'src/app/services/messageDialog.service';
import { RedService } from 'src/app/services/red.service';
import { CadastrarAlunoComponent } from 'src/app/modulos/alunos/cadastrar/cadastrar.component';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-processo-red',
  templateUrl: './processo-red.component.html',
  styleUrls: ['./processo-red.component.css'],
})
export class CadastrarProcessoREDComponent implements OnInit {
  constructor(
    private router: Router,
    private alunoService: AlunoService,
    private cursoService: CursoService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private dialog: MatDialog,
    public dialogQuestionService: messageDialog,
    private snackBarService: SnackBarService,
    private redService: RedService
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
      curso: new FormControl({value: '', disabled: true}, [Validators.required]),
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

  async CadastrarAluno() {
    const cadastrarAluno = this.dialog.open(CadastrarAlunoComponent, {
      data: { dialog: true },
    });
    cadastrarAluno.componentInstance.destino = 'cadastrarREDs';
    this.handleDialogConfirm(cadastrarAluno);
  }

  async cadastrar() {
    // Verifica se o motivo de afastamento não é apenas espaços em branco
    if (this.motivoAfastamento.trim() === '') {
      this.snackBarService.open('Motivo do affastamento deve ser preenchido corretamente.');
      return;
    }
    // Verificação se o RED já existe no mesmo período
    const redsExistente = await this.redService.getRed();
    const redExistenteNoMesmoPeriodo = redsExistente.data.reds.find(
      (red: any) => {
        const inicioAfastamentoRed = this.dateToString(red.inicioAfastamento);
        const previsaoTerminoRed = this.dateToString(red.dataPrevisaoTermino);
        const inicioAfastamentoThis = this.dateToString(this.inicioAfastamento);
        const previsaoTerminoThis = this.dateToString(
          this.previsaoTerminoRed()
        );

        return (
          inicioAfastamentoRed === inicioAfastamentoThis &&
          previsaoTerminoRed === previsaoTerminoThis
        );
      }
    );
    if (this.tempoAfastamento < 15 || this.tempoAfastamento > 360) {
      this.snackBarService.open('O período de afastamento deve ser entre 15 a 360 dias.');
      return;
    }
    if (this.semestreAluno <= 0 || this.semestreAluno > 20) {
      this.snackBarService.open('O semestre informado deve estar entre 1 e 24.');
      return;
    }
    if (redExistenteNoMesmoPeriodo) {
      this.snackBarService.open('Já existe um RED para este prontuário no mesmo período! ');
      return;
    }
    if (!this.verificarDataInicioAfastamento(this.inicioAfastamento)) {
      this.snackBarService.open('O início do afastamento deve ser no máximo 7 dias anterior ou posterior a data de hoje!');
      return;
    }

    // Criação do RED
    try {
      console.log(this.filtredCursos);
      await this.redService.createRed({
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
