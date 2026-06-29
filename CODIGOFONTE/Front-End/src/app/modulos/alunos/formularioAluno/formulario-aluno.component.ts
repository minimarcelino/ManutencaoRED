import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Location } from '@angular/common';
import { Observable, startWith, map } from 'rxjs';

import { AlunoService } from 'src/app/services/alunos.service';
import { CursoService } from 'src/app/services/cursos.service';
import { curso } from 'src/app/modelo/curso';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { EntityUpdateService } from 'src/app/services/entityUpdate.service';


// ✅ VALIDATOR PRONTUÁRIO
function prontuarioValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const regex = /^[A-Za-z]{2}\d{6}[A-Za-z0-9]$/;
    return regex.test(value) ? null : { prontuarioInvalido: true };
  };
}

// ✅ VALIDATOR CURSO
function cursoValidoValidator(cursos: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const isValid = cursos.some(
      (curso) => curso.nomeCurso === control.value.nomeCurso
    );

    return isValid ? null : { cursoInvalido: true };
  };
}

@Component({
  selector: 'app-formulario-aluno',
  templateUrl: './formulario-aluno.component.html',
  styleUrls: ['./formulario-aluno.component.css'],
})
export class FormularioAlunoComponent implements OnInit {
  formularioAluno!: FormGroup;
  cursos: curso[] = [];
  isSubmitting: boolean = false;
  user: any;

  alunos: any[] = [];
  aluno: any;

  filteredCursos!: Observable<any[]>;

  private data: any;
  private editar: boolean = false;
  private desabilitar: boolean = false;
  private retornoRED: boolean = false;
  private cadastrar: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBarService: SnackBarService,
    private alunoService: AlunoService,
    private cursoService: CursoService,
    private entityUpdateService: EntityUpdateService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private location: Location
  ) { }

  ngOnInit(): void {
    this._adapter.setLocale('pt-BR');

    this.user = JSON.parse(localStorage.getItem('user')!);

    this.activatedRoute.paramMap.subscribe(() => {
      if (window.history.state) {
        this.data = window.history.state.aluno;
        this.desabilitar = window.history.state.visualizar;
        this.retornoRED = window.history.state.retornoRED;
      }
    });

    this.editar = !!this.data;
    this.cadastrar = !this.data;

    const desabilitarControle = this.desabilitar || this.editar;

    // ✅ FORMULÁRIO
    this.formularioAluno = new FormGroup({
      prontuario: new FormControl(
        {
          value: this.data?.prontuario || '',
          disabled: desabilitarControle,
        },
        [Validators.required, prontuarioValidator()]
      ),
      nome: new FormControl(
        {
          value: this.data?.nome || '',
          disabled: this.desabilitar,
        },
        [Validators.required]
      ),
      data: new FormControl(
        {
          value: this.data?.dataNascimento || '',
          disabled: this.desabilitar,
        },
        [Validators.required]
      ),
      telefone: new FormControl(
        {
          value: this.data?.telefone || '',
          disabled: this.desabilitar,
        },
        [Validators.required]
      ),
      email: new FormControl(
        {
          value: this.data?.email || '',
          disabled: this.desabilitar,
        },
        [Validators.required, Validators.email]
      ),
      curso: new FormControl(
        {
          value: this.data?.curso || '',
          disabled: desabilitarControle,
        },
        [Validators.required]
      ),
    });

    // ✅ UPPERCASE AUTOMÁTICO
    this.formularioAluno.get('prontuario')!.valueChanges.subscribe((value) => {
      if (value) {
        this.formularioAluno
          .get('prontuario')!
          .setValue(value.toUpperCase(), { emitEvent: false });
      }
    });

    // ✅ BUSCAS
    this.buscarCursos();

    if (this.cadastrar) {
      this.buscarAlunos();
      this.verificarProntuario();
    }
  }

  private mostrarErrosFormulario() {

  const campos = this.formularioAluno.controls;


  // PRONTUÁRIO
  if (campos['prontuario']?.hasError('required')) {
    this.snackBarService.open(
      'O prontuário é obrigatório.'
    );
    return;
  }

  if (campos['prontuario']?.hasError('pattern')) {
    this.snackBarService.open(
      'O prontuário deve conter apenas letras e números.'
    );
    return;
  }


  // NOME
  if (campos['nome']?.hasError('required')) {
    this.snackBarService.open(
      'O nome do aluno é obrigatório.'
    );
    return;
  }

  if (campos['nome']?.hasError('minlength')) {
    this.snackBarService.open(
      'O nome deve possuir pelo menos 3 caracteres.'
    );
    return;
  }

  if (campos['nome']?.hasError('pattern')) {
    this.snackBarService.open(
      'O nome deve conter apenas letras e espaços.'
    );
    return;
  }


  // DATA DE NASCIMENTO
  if (campos['data']?.hasError('required')) {
    this.snackBarService.open(
      'A data de nascimento é obrigatória.'
    );
    return;
  }

  if (campos['data']?.hasError('pattern')) {
    this.snackBarService.open(
      'Data inválida. Utilize o formato DD/MM/AAAA.'
    );
    return;
  }


  // TELEFONE
  if (campos['telefone']?.hasError('required')) {
    this.snackBarService.open(
      'O telefone é obrigatório.'
    );
    return;
  }

  if (campos['telefone']?.hasError('pattern')) {
    this.snackBarService.open(
      'Telefone inválido. Utilize o formato (XX) XXXXX-XXXX.'
    );
    return;
  }


  // EMAIL
  if (campos['email']?.hasError('required')) {
    this.snackBarService.open(
      'O e-mail é obrigatório.'
    );
    return;
  }

  if (campos['email']?.hasError('email')) {
    this.snackBarService.open(
      'Digite um endereço de e-mail válido.'
    );
    return;
  }


  // CURSO (AUTOCOMPLETE / SELECT)
  if (campos['curso']?.hasError('required')) {
    this.snackBarService.open(
      'O curso é obrigatório.'
    );
    return;
  }

  if (campos['curso']?.hasError('cursoInvalido')) {
    this.snackBarService.open(
      'Curso inválido. Selecione um curso da lista.'
    );
    return;
  }


  // CASO NÃO TENHA TRATADO ALGUM ERRO
  this.snackBarService.open(
    'Verifique os campos preenchidos.'
  );
}

  async submit() {

  if (this.formularioAluno.invalid || this.isSubmitting) {

    // marca todos os campos como tocados para aparecer o mat-error
    this.formularioAluno.markAllAsTouched();

    // mostra a mensagem específica no snackbar
    this.mostrarErrosFormulario();

    const firstInvalidField = Object.keys(this.formularioAluno.controls)
      .find((field) => this.formularioAluno.get(field)!.invalid);

    if (firstInvalidField) {
      document.getElementById(firstInvalidField)?.focus();
    }

    return;
  }


  try {

    this.isSubmitting = true;


    if (this.editar) {
      await this.updateAluno();
    } else {
      await this.createAluno();
    }


    this.retornarParaLista();


  } catch (error: any) {


    this.isSubmitting = false;


    const errorPrisma = error?.error?.error;
    const errorData = error?.error?.data;


    if (errorPrisma?.code === 'P2002') {


      const campoErro = errorPrisma.meta['target'][0];


      const mensagensDuplicadas: any = {

        email: 'Este e-mail já está cadastrado.',
        cpf: 'Este CPF já está cadastrado.',
        matricula: 'Esta matrícula já está cadastrada.'

      };


      this.snackBarService.open(
        mensagensDuplicadas[campoErro] 
        || `O campo ${campoErro} já está cadastrado.`
      );


    } else if (errorData) {


      this.snackBarService.open(`Erro: ${errorData}`);


    } else {


      this.snackBarService.open('Erro ao cadastrar aluno');


    }
  }
}

  CadastrarCurso() {
    const navigationExtras: NavigationExtras = {
      state: {
        visualizar: false,
        retornoRED: true,
      },
    };

    this.router.navigate(
      [`/${this.user.tiposervidor}/formularioCurso`],
      navigationExtras
    );
  }

  private async createAluno() {

  const alunoEnviar = {
    prontuario: this.prontuario.toUpperCase(),
    nome: this.nome.trim(),
    dataNascimento: this.converterData(this.data_nascimento),
    telefone: this.telefone,
    email: this.email.trim(),
    curso_idcurso: this.idcurso,
  };

  console.log("ENVIANDO PARA API:", alunoEnviar);

  await this.alunoService.createAluno(alunoEnviar);

  localStorage.setItem(
    'ultimoAlunoCadastrado',
    this.prontuario.toUpperCase()
  );

  this.snackBarService.open('Aluno cadastrado com sucesso!');
}

  private converterData(data: string): string {

  if (!data) return '';

  let dataFormatada = '';

  // caso venha 20022000
  if (data.length === 8 && !data.includes('/')) {
    dataFormatada = `${data.substring(4,8)}-${data.substring(2,4)}-${data.substring(0,2)}`;
  }

  // caso venha 20/02/2000
  else if (data.includes('/')) {
    const partes = data.split('/');

    dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;
  }

  else {
    dataFormatada = data;
  }


  return `${dataFormatada}T00:00:00.000Z`;
}

  private async updateAluno() {

    if (!this.idcurso) {
      this.snackBarService.open('Selecione um curso válido');
      return;
    }

    const idAluno = this.data?.id;

    await this.alunoService.updateAluno({
      id: idAluno,
      prontuario: this.prontuario.toUpperCase(),
      nome: this.nome.trim(),
      dataNascimento: this.converterData(this.data_nascimento),
      telefone: this.telefone,
      email: this.email.trim(),
      curso_idcurso: this.idcurso,
    });

    this.snackBarService.open('Aluno atualizado com sucesso!');
  }

  async buscarCursos() {
    const response = await this.cursoService.getCursos();
    this.cursos = response.data.cursos;

    this.formularioAluno
      .get('curso')!
      .setValidators([Validators.required, cursoValidoValidator(this.cursos)]);

    this.formularioAluno.get('curso')!.updateValueAndValidity();

    this.filterCurso();
  }

  filterCurso() {
    this.filteredCursos = this.formularioAluno.get('curso')!.valueChanges.pipe(
      startWith(''),
      map((value) => typeof value === 'string' ? value : value?.nomeCurso),
      map((nome) => nome ? this._filterCursos(nome) : this.cursos.slice())
    );
  }

  private _filterCursos(nome: string): any[] {
    const filterValue = nome.toLowerCase();
    return this.cursos.filter(c =>
      c.nomeCurso.toLowerCase().includes(filterValue)
    );
  }

  displayFn(curso: curso): string {
    return curso?.nomeCurso || '';
  }

  retornarParaLista() {
    this.entityUpdateService.notifyUpdate('aluno');

    if (this.retornoRED) {
      this.router.navigate([`/${this.user.tiposervidor}/formularioRED`]);
    }

    this.location.back();
  }

  async buscarAlunos() {
    const response = await this.alunoService.getAluno();
    this.alunos = Object.values(response);
  }

  preencherFormulario(alunoData: any) {
    this.formularioAluno.patchValue({
      nome: alunoData.nome,
      data: alunoData.dataNascimento,
      telefone: alunoData.telefone,
      email: alunoData.email,
      curso: alunoData.curso,
    });
  }

  esvaziarFormulario() {
    this.formularioAluno.patchValue({
      nome: '',
      data: '',
      telefone: '',
      email: '',
      curso: '',
    });
  }

  async verificarProntuarioCadastrada(prontuario: string) {
    const lista = this.alunos[1]?.alunos || [];
    return lista.some((a: any) => a.prontuario === prontuario);
  }

  async verificarProntuario() {
    this.formularioAluno.get('prontuario')!.valueChanges.subscribe(async (value) => {
      if (!value) return;

      const existe = await this.verificarProntuarioCadastrada(value);

      if (existe) {
        this.editar = true;

        const lista = this.alunos[1]?.alunos || [];
        this.aluno = lista.find((a: any) => a.prontuario === value);

        this.preencherFormulario(this.aluno);
      } else if (this.editar) {
        this.editar = false;
        this.aluno = null;
        this.esvaziarFormulario();
      }
    });
  }

  

  // GETTERS
  get prontuario() { return this.formularioAluno.get('prontuario')!.value; }
  get nome() { return this.formularioAluno.get('nome')!.value; }
  get data_nascimento() { return this.formularioAluno.get('data')!.value; }
  get telefone() { return this.formularioAluno.get('telefone')!.value; }
  get email() { return this.formularioAluno.get('email')!.value; }

  get idcurso() {

    const cursoSelecionado = this.formularioAluno.get('curso')!.value;

    if (!cursoSelecionado) {
      return null;
    }

    return cursoSelecionado.idcurso ?? null;
  }

  get editando() { return this.editar; }
  get desabilitado() { return this.desabilitar; }

  titulo() {
    if (this.desabilitar) return 'Visualização de Aluno';
    return this.editar ? 'Edição de Aluno' : 'Cadastro de Aluno';
  }
}