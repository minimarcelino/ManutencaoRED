import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlunoService } from 'src/app/services/alunos.service';
import { AbstractControl, FormControl, FormGroup, Validators, ValidationErrors } from '@angular/forms'; import { CursoService } from 'src/app/services/cursos.service';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { environment } from 'src/app/environments/environment.development';
//
import { messageDialog } from 'src/app/services/messageDialog.service';
import { RedService } from 'src/app/services/red.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { VisualizarDisciplinaComponent } from '../visualizar-disciplina/visualizar-disciplina.component';
import { CoordenadorService } from 'src/app/services/coordenador.service';
import { EntityUpdateService } from 'src/app/services/entityUpdate.service';
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
    private redService: RedService,
    private coordenadorService: CoordenadorService,
    private entityUpdateService: EntityUpdateService,
    private location: Location
  ) { }

  alunos: any[] = [];
  cursos: any[] = [];
  attachedFiles: any[] = [];
  inputCurso: any = '';
  filtredCursos: any[] = [];
  formularioRED!: FormGroup;
  motivoRecusaInput: boolean = false;
  isDisable: boolean = false;
  user: any;
  filteredAlunos: any[] = [];
  selectedFiles: File[] = [];
  selectedFileName: string | null = null;
  private data: any;
  private editar: boolean = false;
  private desabilitar: boolean = false;
  private coordenador: any;
  private readonly STORAGE_KEY = 'rascunhoRED';

  private validarDataRED(control: AbstractControl): ValidationErrors | null {

    if (!control.value) {
      return null;
    }


    try {

      const dataInformada = this.parseData(control.value);

      const hoje = new Date();

      hoje.setHours(0, 0, 0, 0);
      dataInformada.setHours(0, 0, 0, 0);



      const minimo = new Date(hoje);
      minimo.setDate(hoje.getDate() - 7);



      const maximo = new Date(hoje);
      maximo.setDate(hoje.getDate() + 7);



      if (
        dataInformada < minimo ||
        dataInformada > maximo
      ) {

        return {
          dataForaPeriodo: true
        };

      }


      return null;


    } catch {

      return {
        dataInvalida: true
      };

    }

  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(() => {
      if (window.history.state) {
        this.data = window.history.state.red;
        this.desabilitar = window.history.state.visualizar;
      }
    });

    if (this.data != null) {
      this.editar = true;
      this.loadAttachedFiles(this.data.idRED);
    }
    if (this.desabilitar == true || this.editar == true) {
      this.obterNomeCoordenador();
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
          value: this.data
            ? this.formatarData(this.data.inicioAfastamento)
            : '',
          disabled: this.desabilitar,
        },
        [
          Validators.required,
          this.validarDataRED.bind(this)
        ]
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
        [
          Validators.required,
          Validators.min(1),
          Validators.max(24),
          Validators.pattern('^[0-9]+$')
        ]
      ),
      motivoRecusa: new FormControl('', [
        //Validators.required,
        Validators.maxLength(4000),
      ]),
      motivoRecusaLabel: new FormControl({
        value: this.data ? this.data.motivoRecusa : '',
        disabled: this.recusado,
      }),
    });
    this.fetchAlunos();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    this.recuperarRascunho();
    this.iniciarAutoSave();
  }

  private recuperarRascunho(): void {
    if (this.editar || this.desabilitar) {
      return;
    }

    const rascunho = localStorage.getItem(this.STORAGE_KEY);

    if (!rascunho) {
      return;
    }

    try {
      const dados = JSON.parse(rascunho);

      this.formularioRED.patchValue({
        motivoAfastamento: dados.motivoAfastamento || '',
        inicioAfastamento: dados.inicioAfastamento || '',
        tempoAfastamento: dados.tempoAfastamento || '',
        semestreAluno: dados.semestreAluno || '',
        observacao: dados.observacao || '',
        motivoRecusa: dados.motivoRecusa || ''
      });

    } catch (error) {
      console.error('Erro ao recuperar rascunho:', error);
    }
  }

  private iniciarAutoSave(): void {
    this.formularioRED.valueChanges.subscribe(() => {

      if (this.editar || this.desabilitar) {
        return;
      }

      const dados = this.formularioRED.getRawValue();

      if (
        dados.inicioAfastamento &&
        dados.inicioAfastamento.replace(/\D/g, '').length !== 8
      ) {
        return;
      }

      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(dados)
      );
    });
  }

  private limparRascunho(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  bloquearCaracteresInvalidos(event: KeyboardEvent): void {
    const teclasBloqueadas = ['e', 'E', '+', '-', '.', ','];

    if (teclasBloqueadas.includes(event.key)) {
      event.preventDefault();
    }
  }

  async loadAttachedFiles(idRED: number) {
    try {
      const response = await this.redService.getAttachedFiles(idRED);
      this.attachedFiles = response;
      // console.log(this.attachedFiles);
    } catch (error) {
      console.error('Erro ao carregar arquivos anexados:', error);
    }
  }

  displayFn(aluno: any): string {
    let pront = aluno.prontuario;
    let nome = aluno.nome;
    let pront_aluno = pront + ' - ' + nome;
    return aluno && pront_aluno;
  }

  async fetchAlunos() {

    const response = await this.alunoService.getAluno();


    this.alunos = [...response.data.alunos];


    this.filteredAlunos = [...this.alunos];


    const ultimoProntuario = localStorage.getItem(
      'ultimoAlunoCadastrado'
    );


    if (ultimoProntuario) {


      const alunoEncontrado = this.alunos.find(
        (a) => String(a.prontuario) === String(ultimoProntuario)
      );


      if (alunoEncontrado) {


        this.formularioRED.patchValue({

          aluno: alunoEncontrado

        });


        this.changeCurso();


      }


      localStorage.removeItem(
        'ultimoAlunoCadastrado'
      );

    }

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

  private parseData(data: string): Date {

    if (!data) {
      return new Date();
    }

    const limpa = data.replace(/\D/g, '');

    if (limpa.length !== 8) {
      throw new Error(`Data inválida: ${data}`);
    }

    const dia = Number(limpa.substring(0, 2));
    const mes = Number(limpa.substring(2, 4)) - 1;
    const ano = Number(limpa.substring(4, 8));

    return new Date(ano, mes, dia);
  }

  CadastrarAluno() {

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.formularioRED.getRawValue())
    );

    const navigationExtras: NavigationExtras = {
      state: {
        visualizar: false,
        retornoRED: true,
      },
    };

    this.router.navigate(
      [`/${this.user.tiposervidor}/formularioAluno`],
      navigationExtras
    );
  }

  async cadastrar() {

    if (this.formularioRED.invalid) {

      this.mostrarErrosFormulario();

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


    if (this.motivoAfastamento.trim() === '') {

      this.snackBarService.open(
        'O motivo do afastamento deve ser preenchido corretamente.'
      );

      document.getElementById('motivo')?.focus();

      return;
    }


    if (this.tempoAfastamento < 15 || this.tempoAfastamento > 360) {

      this.snackBarService.open(
        'O período de afastamento deve estar entre 15 e 360 dias.'
      );

      document.getElementById('tempoAfastamento')?.focus();

      return;
    }


    if (this.semestreAluno <= 0 || this.semestreAluno > 24) {

      this.snackBarService.open(
        'O semestre informado deve estar entre 1 e 24.'
      );

      document.getElementById('semestreAluno')?.focus();

      return;
    }


    if ((await this.verificarConflitoPeriodoRED()) && !this.editar) {

      this.snackBarService.open(
        'Já existe um RED para este prontuário no mesmo período!'
      );

      return;
    }

    try {


      if (this.editar) {

        await this.updateRED();

      } else {

        await this.cadastrarRED();

      }


    } catch (error: any) {


      console.error('Erro ao cadastrar RED:', error);


      const errorData = error?.error?.data;


      if (errorData) {

        this.snackBarService.open(
          `Falha ao cadastrar RED: ${errorData}`
        );

      } else {

        this.snackBarService.open(
          'Falha ao cadastrar RED'
        );

      }

    }

  }

  private mostrarErrosFormulario() {

    const campos = this.formularioRED.controls;



    // ALUNO
    if (campos['aluno']?.hasError('required')) {

      this.snackBarService.open(
        'O aluno é obrigatório. Selecione um aluno da lista.'
      );

      return;
    }




    // MOTIVO DO AFASTAMENTO
    if (campos['motivoAfastamento']?.hasError('required')) {

      this.snackBarService.open(
        'O motivo do afastamento é obrigatório.'
      );

      return;
    }


    if (campos['motivoAfastamento']?.hasError('maxlength')) {

      this.snackBarService.open(
        'O motivo do afastamento ultrapassou o limite máximo de caracteres.'
      );

      return;
    }




    // INÍCIO DO AFASTAMENTO
    if (campos['inicioAfastamento']?.hasError('required')) {

      this.snackBarService.open(
        'A data de início do afastamento é obrigatória.'
      );

      return;
    }

    if (campos['inicioAfastamento']?.hasError('dataForaPeriodo')) {

      this.snackBarService.open(
        'A data deve estar entre 7 dias antes e 7 dias depois da data atual.'
      );

      return;
    }


    if (campos['inicioAfastamento']?.hasError('pattern')) {

      this.snackBarService.open(
        'Data inválida. Utilize o formato DD/MM/AAAA.'
      );

      return;
    }




    // TEMPO DE AFASTAMENTO
    if (campos['tempoAfastamento']?.hasError('min')) {

      this.snackBarService.open(
        'O afastamento deve ter no mínimo 15 dias para abrir um RED.'
      );

      return;
    }


    if (campos['tempoAfastamento']?.hasError('min')) {

      this.snackBarService.open(
        'O tempo de afastamento deve ser maior que zero.'
      );

      return;
    }




    // SEMESTRE DO ALUNO
    if (campos['semestreAluno']?.hasError('required')) {

      this.snackBarService.open(
        'O semestre do aluno é obrigatório.'
      );

      return;
    }


    if (campos['semestreAluno']?.hasError('min')) {

      this.snackBarService.open(
        'O semestre deve ser maior ou igual a 1.'
      );

      return;
    }


    if (campos['semestreAluno']?.hasError('max')) {

      this.snackBarService.open(
        'O semestre deve ser menor ou igual a 24.'
      );

      return;
    }




    // OBSERVAÇÃO
    if (campos['observacao']?.hasError('maxlength')) {

      this.snackBarService.open(
        'A observação ultrapassou o limite máximo de caracteres.'
      );

      return;
    }




    // MOTIVO DA RECUSA (quando coordenador precisa preencher)
    if (campos['motivoRecusa']?.hasError('required')) {

      this.snackBarService.open(
        'O motivo da recusa é obrigatório.'
      );

      return;
    }


    if (campos['motivoRecusa']?.hasError('maxlength')) {

      this.snackBarService.open(
        'O motivo da recusa ultrapassou o limite máximo de caracteres.'
      );

      return;
    }




    this.snackBarService.open(
      'Verifique os campos preenchidos.'
    );

  }

  private async cadastrarRED() {
    await this.redService.createRed(
      {
        motivoAfastamento: this.motivoAfastamento,
        inicioAfastamento: this.parseData(this.inicioAfastamento),
        dataPrevisaoTermino: this.previsaoTerminoRed(),
        dataInicioProcesso: new Date(),
        semestreOuAnoAluno: this.semestreAluno,
        tempoAfastamento: this.tempoAfastamento,
        situacao: 'Esperando confirmação',
        observacao: this.observacao,
        aluno_id: this.aluno.id,
        coordenador: this.filtredCursos[0].coordenador,
      },
      this.selectedFiles
    );

    this.limparRascunho();

    this.retornarParaLista();
  }


  private async updateRED() {
    await this.redService.updateRed(
      {
        idRED: this.data.idRED,
        motivoAfastamento: this.motivoAfastamento,
        inicioAfastamento: this.parseData(this.inicioAfastamento),
        dataPrevisaoTermino: this.previsaoTerminoRed(),
        dataInicioProcesso: this.data.dataInicioProcesso,
        semestreOuAnoAluno: this.semestreAluno,
        tempoAfastamento: this.tempoAfastamento,
        situacao: this.situacao,
        observacao: this.observacao,
        aluno_id: this.aluno.id,
        coordenador: this.data.coordenador,
      },
      this.selectedFiles
    );
    this.limparRascunho();
    this.retornarParaLista();
  }

  confirmarRED() {
    this.updateSituacaoRED('Esperando associação de disciplina');
    this.snackBarService.open(
      `Processo RED do aluno ${this.aluno.nome} aceita`
    );
    this.retornarParaLista();
  }

  async recusarRED() {
    if (!this.motivoRecusaInput) {
      this.motivoRecusaInput = true;
    } else {
      if (this.motivoRecusa.trim() === '') {
        this.snackBarService.open(
          'Motivo da Recusa deve ser preenchido corretamente.'
        );
        return;
      }
      this.updateSituacaoRED('Recusado');
      this.retornarParaLista();
    }
  }

  private async updateSituacaoRED(situacao: String) {
    try {
      await this.redService.updateRed(
        {
          idRED: this.data.idRED,
          situacao: situacao,
          motivoRecusa: this.motivoRecusa,
        },
        this.selectedFiles
      );
      this.snackBarService.open('RED alterado com sucesso!!');
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.snackBarService.open(`Falha ao alterar o RED: ${errorMessage}`);
      } else {
        this.snackBarService.open('Falha ao alterar o RED');
      }
    }
  }

  private async verificarConflitoPeriodoRED() {
    // Verificação se o RED já existe no mesmo período
    const conjuntoREDs = await this.redService.getRed();
    const existe = conjuntoREDs.data.reds.find((red: any) => {
      const inicioAfastamentoRed = this.dateToString(red.inicioAfastamento);
      const previsaoTerminoRed = this.dateToString(red.dataPrevisaoTermino);
      const inicioAfastamentoThis = this.dateToString(this.inicioAfastamento);
      const previsaoTerminoThis = this.dateToString(this.previsaoTerminoRed());
      const idAluno = red.aluno_id;
      return (
        inicioAfastamentoRed === inicioAfastamentoThis &&
        idAluno === this.aluno.id
      );
    });
    return existe;
  }

  async visualizarDisciplina() {
    const visualizar = this.dialog.open(VisualizarDisciplinaComponent, {
      data: {
        idRED: this.data.idRED,
        pee: this.data.pee,
        red: this.data.red
      },
    });

    this.handleDialogConfirm(visualizar);
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
    this.entityUpdateService.notifyUpdate('RED');
    this.location.back();
  }

  updateCharacterCount(campoTexto: string): number {
    return 4000 - campoTexto.length;
  }

  teste() {
    this.router.navigate([`/${this.user.tiposervidor}/cadastrarAlunos`]);
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe(() => { });
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

  situacao() {
    // console.log(this.data.situacao);
    return this.data.situacao;
  }

  get observacao() {
    return this.formularioRED.get('observacao')!.value;
  }

  get motivoRecusa() {
    return this.formularioRED.get('motivoRecusa')!.value;
  }

  get editando() {
    return this.editar;
  }

  get desabilitado() {
    return this.desabilitar;
  }

  get recusado() {
    return this.data ? this.data.situacao === 'Recusado' : false;
  }

  get esperandoConfirmacao() {
    return this.data ? this.data.situacao === 'Esperando confirmação' : false;
  }

  private verificarDataInicioAfastamento(dataInicioAfastamento: any): boolean {
    const hoje = new Date();
    const dataInicio = this.parseData(dataInicioAfastamento as any);
    const diff = Math.abs(hoje.getTime() - dataInicio.getTime());
    const diffEmDias = Math.floor(diff / (1000 * 60 * 60 * 24));
    return diffEmDias <= 7;
  }

  private formatarData(data: any): string {

    const d = new Date(data);

    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }

  private dateToString(date: any): string {

    if (!date) {
      return '';
    }

    // Trata datas vindas do ngx-mask (DDMMYYYY)
    if (typeof date === 'string' && date.length === 8) {

      const dia = date.substring(0, 2);
      const mes = date.substring(2, 4);
      const ano = date.substring(4, 8);

      return `${ano}-${mes}-${dia}`;
    }

    const data = new Date(date);

    if (isNaN(data.getTime())) {
      console.error('Data inválida encontrada:', date);
      return '';
    }

    return data.toISOString().split('T')[0];
  }

  private previsaoTerminoRed(): Date {
    const dataTerminoRed = this.parseData(this.inicioAfastamento);
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

  isCOORD() {
    return (
      this.user.tiposervidor === 'coordenador' ||
      this.user.tiposervidor === 'administrador'
    );
  }

  isCRA() {
    return (
      this.user.tiposervidor === 'cra' ||
      this.user.tiposervidor === 'administrador'
    );
  }

  getCoordenador() {
    return this.coordenador;
  }

  async obterNomeCoordenador() {
    try {
      this.coordenador = await this.coordenadorService.getCoordenadorById(
        this.data.coordenador
      );
      this.coordenador = this.coordenador.data.nome;
    } catch (error) {
      console.error('Erro ao obter o coordenador:', error);
    }
  }

  async deleteFile(file: any) {
    let res = false;
    res = await this.dialogQuestionService.openDialogConfirmDelete('arquivo');
    if (res) {
      this.deleteFilePermanent(file);
    }
  }

  get caminhoArquivo() {
    return `${environment.API}arquivos/`; // Necessário alterar manualmente no servidor, ele não reconheceu o caminho da API
  }

  deleteFilePermanent(file: any) {
    console.log(file.idArquivo);

    this.redService.deleteFile(file.idArquivo).subscribe(
      () => {
        // Atualize a lista de arquivos após a exclusão
        this.attachedFiles = this.attachedFiles.filter((f) => f !== file);
        this.snackBarService.open('Arquivo excluído!');
      },
      (error) => {
        console.error(error);
        this.snackBarService.open('Erro ao excluir arquivo!');
      }
    );
  }


}
