import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-formulario-red',
  templateUrl: './formulario-red.component.html',
  styleUrls: ['./formulario-red.component.css'],
})
export class FormularioREDComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
  formularioRED!: FormGroup;
  isDisable: boolean = false;
  user: any;
  filteredAlunos: any[] = [];
  selectedFiles: File[] = [];
  selectedFileName: string | null = null;
  private data: any;
  private editar: boolean = false;
  private desabilitar: boolean = false;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(() => {
      if (window.history.state) {
        this.data = window.history.state.red;
        this.desabilitar = window.history.state.visualizar;
      }
    });

    if (this.data != null) {
      this.editar = true;
    }

    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);

    this.formularioRED = new FormGroup({
      aluno: new FormControl(
        {
          value: this.data ? this.data.aluno : '',
          disabled: this.desabilitar || this.editar,
        },
        [Validators.required]
      ),
      curso: new FormControl(
        {
          value: this.data ? this.data.aluno.curso.nomeCurso : '',
          disabled: true,
        },
        [Validators.required]
      ),
      observacao: new FormControl(
        {
          value: this.data ? this.data.observacao : '',
          disabled: this.desabilitar,
        },
        [Validators.maxLength(4000)]
      ),
      motivoAfastamento: new FormControl(
        {
          value: this.data ? this.data.motivoAfastamento : '',
          disabled: this.desabilitar,
        },
        [Validators.required, Validators.maxLength(4000)]
      ),
      inicioAfastamento: new FormControl(
        {
          value: this.data ? this.data.inicioAfastamento : '',
          disabled: this.desabilitar,
        },
        [Validators.required]
      ),
      tempoAfastamento: new FormControl(
        {
          value: this.data ? this.data.tempoAfastamento : '',
          disabled: this.desabilitar,
        },
        [Validators.required, Validators.min(15), Validators.max(360)]
      ),
      semestreAluno: new FormControl(
        {
          value: this.data ? this.data.semestreOuAnoAluno : '',
          disabled: this.desabilitar,
        },
        [Validators.required, Validators.min(1), Validators.max(24)]
      ),
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

  async fetchAlunos() {
    const response = await this.alunoService.getAluno();
    this.alunos = response.data.alunos;
    // Inicializar a lista de alunos filtrados
    this.filteredAlunos = this.alunos;
  }

  filterAlunos(event: any) {
    const value = event.target.value;
    const filterValue = value.toLowerCase();
    this.filteredAlunos = this.alunos.filter((aluno) => {
      const alunoString = `${aluno.prontuario} - ${aluno.nome}`.toLowerCase();
      return alunoString.includes(filterValue);
    });
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
    if (this.formularioRED.invalid) {
      this.snackBarService.open('Campos obrigatórios!!');
      const fields = Object.keys(this.formularioRED.controls);
      const firstInvalidField = fields.find(
        (field) => this.formularioRED.get(field)!.invalid
      );
      if (firstInvalidField) {
        const element = document.getElementById(firstInvalidField);
        if (element) {
          element.focus();
        }
      }
      return;
    }
    // Verifica se o motivo de afastamento não é apenas espaços em branco
    if (this.motivoAfastamento.trim() === '') {
      this.snackBarService.open(
        'Motivo do afastamento deve ser preenchido corretamente.'
      );
      const element = document.getElementById('motivo');
      if (element) {
        element.focus();
      }
      return;
    }
    if (this.tempoAfastamento < 15 || this.tempoAfastamento > 360) {
      this.snackBarService.open(
        'O período de afastamento deve ser entre 15 a 360 dias.'
      );
      return;
    }
    if (this.semestreAluno <= 0 || this.semestreAluno > 24) {
      this.snackBarService.open(
        'O semestre informado deve estar entre 1 e 24.'
      );
      return;
    }
    if ((await this.verificarConflitoPeriodoRED()) && !this.editar) {
      this.snackBarService.open(
        'Já existe um RED para este prontuário no mesmo período! '
      );
      return;
    }
    if (!this.verificarDataInicioAfastamento(this.inicioAfastamento)) {
      this.snackBarService.open(
        'O início do afastamento deve ser no máximo 7 dias anterior ou posterior a data de hoje!'
      );
      return;
    }

    try {
      if (this.editar) {
        this.updateRED();
      } else {
        this.cadastrarRED();
      }
    } catch (error) {
      console.error('Erro ao cadastrar RED:', error);
    }
  }

  private async cadastrarRED() {
    await this.redService.createRed(
      {
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
      },
      this.selectedFiles
    );
    this.retornarParaLista();
  }

  private async updateRED() {
    await this.redService.updateRed(
      {
        idRED: this.data.idRED,
        motivoAfastamento: this.motivoAfastamento,
        inicioAfastamento: this.inicioAfastamento,
        dataPrevisaoTermino: this.previsaoTerminoRed(),
        dataInicioProcesso: this.data.dataInicioProcesso,
        semestreOuAnoAluno: this.semestreAluno,
        tempoAfastamento: this.tempoAfastamento,
        situacao: this.situacao,
        observacao: this.observacao,
        aluno_id: this.aluno.id,
        coordenador: this.data.coordenador,
      }
      //this.selectedFiles
    );
    this.retornarParaLista();
  }

  private async verificarConflitoPeriodoRED() {
    // Verificação se o RED já existe no mesmo período
    const conjuntoREDs = await this.redService.getRed();
    const existe = conjuntoREDs.data.reds.find((red: any) => {
      const inicioAfastamentoRed = this.dateToString(red.inicioAfastamento);
      const previsaoTerminoRed = this.dateToString(red.dataPrevisaoTermino);
      const inicioAfastamentoThis = this.dateToString(this.inicioAfastamento);
      const previsaoTerminoThis = this.dateToString(this.previsaoTerminoRed());

      return (
        inicioAfastamentoRed === inicioAfastamentoThis &&
        previsaoTerminoRed === previsaoTerminoThis
      );
    });
    return existe;
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }
  }

  removeFile(file: File) {
    const index = this.selectedFiles.indexOf(file);
    if (index !== -1) {
      this.selectedFiles.splice(index, 1);
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
    return this.formularioRED.get('aluno')!.value;
  }

  get curso() {
    return this.formularioRED.get('curso')!.value;
  }

  get semestreAluno() {
    return this.formularioRED.get('semestreAluno')!.value;
  }

  get tempoAfastamento() {
    return this.formularioRED.get('tempoAfastamento')!.value;
  }

  get inicioAfastamento() {
    return this.formularioRED.get('inicioAfastamento')!.value;
  }
  get motivoAfastamento() {
    return this.formularioRED.get('motivoAfastamento')!.value;
  }

  get situacao() {
    return 'Esperando confirmação';
  }

  get observacao() {
    return this.formularioRED.get('observacao')!.value;
  }

  get editando() {
    return this.editar;
  }

  get desabilitado() {
    return this.desabilitar;
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

  titulo() {
    let titulo;
    if (!this.editar) {
      titulo = 'Cadastro de RED';
    } else {
      titulo = 'Edição de RED';
    }

    if (this.desabilitar) {
      titulo = 'Visualização de RED';
    }

    return titulo;
  }
}
