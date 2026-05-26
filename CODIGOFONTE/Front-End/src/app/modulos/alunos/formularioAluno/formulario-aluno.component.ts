import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import {
  ActivatedRoute,
  NavigationExtras,
  Router,
  NavigationEnd
} from '@angular/router';

import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

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

    return regex.test(value)
      ? null
      : { prontuarioInvalido: true };
  };
}

// ✅ VALIDATOR CURSO
function cursoValidoValidator(cursos: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) return null;

    const isValid = cursos.some(
      (curso) => curso.nomeCurso === control.value.nomeCurso
    );

    return isValid
      ? null
      : { cursoInvalido: true };
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
  ) {

    // 🔥 Atualiza cursos automaticamente
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {

        if (event.url.includes('formularioAluno')) {

          if (this.formularioAluno) {

            this.buscarCursos();

          }

        }

      }

    });

  }

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

    // ✅ BUSCAR CURSOS
    this.buscarCursos();

    // 🔥 Atualiza ao voltar da tela de curso
    if (window.history.state?.atualizarCursos) {

      this.buscarCursos();

    }

    if (this.cadastrar) {

      this.buscarAlunos();

      this.verificarProntuario();

    }

  }

  async submit() {

    if (this.formularioAluno.invalid || this.isSubmitting) {

      this.snackBarService.open('Campos obrigatórios');

      const firstInvalidField = Object.keys(this.formularioAluno.controls)
        .find((field) => this.formularioAluno.get(field)!.invalid);

      if (firstInvalidField) {

        document.getElementById(firstInvalidField)?.focus();

      }

      return;
    }

    if (this.nome.trim() === '' || this.email.trim() === '') {

      this.snackBarService.open('Preencha os campos corretamente');

      return;
    }

    try {

      this.isSubmitting = true;

      if (this.editar) {

        await this.updateAluno();

        this.snackBarService.open('Aluno atualizado com sucesso');

      } else {

        await this.createAluno();

        this.snackBarService.open('Aluno cadastrado com sucesso');

      }

      this.retornarParaLista();

    } catch (error: any) {

      this.isSubmitting = false;

      const errorData = error?.error?.data;

      const errorPrisma = error?.error?.error;

      if (errorPrisma?.code === 'P2002') {

        const campoErro = errorPrisma.meta['target'][0];

        this.snackBarService.open(`Campo ${campoErro} já cadastrado`);

      } else if (errorData) {

        this.snackBarService.open(`Erro: ${errorData}`);

      } else {

        this.snackBarService.open('Erro ao cadastrar aluno');

      }

    }

  }

  // 🔥 ABRIR FORMULÁRIO CURSO
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

    await this.alunoService.createAluno({

      prontuario: this.prontuario.toUpperCase(),

      nome: this.nome.trim(),

      dataNascimento: this.data_nascimento,

      telefone: this.telefone,

      email: this.email.trim(),

      curso_idcurso: this.idcurso,

    });

    this.snackBarService.open('Aluno cadastrado com sucesso!');

  }

  private async updateAluno() {

    const idAluno = this.cadastrar
      ? this.aluno?.id
      : this.data?.id;

    await this.alunoService.updateAluno({

      id: idAluno,

      prontuario: this.prontuario.toUpperCase(),

      nome: this.nome,

      dataNascimento: this.data_nascimento,

      telefone: this.telefone,

      email: this.email,

      curso_idcurso: this.idcurso,

    });

    this.snackBarService.open('Aluno atualizado com sucesso!');

  }

  // 🔥 BUSCAR CURSOS
  async buscarCursos() {

    const response = await this.cursoService.getCursos();

    this.cursos = response.data.cursos;

    this.formularioAluno
      .get('curso')!
      .setValidators([
        Validators.required,
        cursoValidoValidator(this.cursos)
      ]);

    this.formularioAluno
      .get('curso')!
      .updateValueAndValidity();

    this.filterCurso();

  }

  // 🔥 AUTOCOMPLETE
  filterCurso() {

    this.filteredCursos =
      this.formularioAluno.get('curso')!.valueChanges.pipe(

        startWith(''),

        map((value) =>
          typeof value === 'string'
            ? value
            : value?.nomeCurso
        ),

        map((nome) =>
          nome
            ? this._filterCursos(nome)
            : this.cursos.slice()
        )

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

  // 🔥 RETORNAR PARA TELA COM ATUALIZAÇÃO
  retornarParaLista() {

    this.entityUpdateService.notifyUpdate('aluno');

    // 🔥 se veio do RED
    if (this.retornoRED) {

      this.router.navigate(
        [`/${this.user.tiposervidor}/formularioRED`],
        {
          state: {
            atualizarCursos: true
          }
        }
      );

      return;
    }

    // 🔥 volta para listagem normal
    this.router.navigate(
      [`/${this.user.tiposervidor}/listarAlunos`]
    );

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

    return lista.some((a: any) =>
      a.prontuario === prontuario
    );

  }

  async verificarProntuario() {

    this.formularioAluno.get('prontuario')!
      .valueChanges.subscribe(async (value) => {

        if (!value) return;

        const existe =
          await this.verificarProntuarioCadastrada(value);

        if (existe) {

          this.editar = true;

          const lista = this.alunos[1]?.alunos || [];

          this.aluno = lista.find(
            (a: any) => a.prontuario === value
          );

          this.preencherFormulario(this.aluno);

        } else if (this.editar) {

          this.editar = false;

          this.aluno = null;

          this.esvaziarFormulario();

        }

      });

  }

  // ✅ GETTERS
  get prontuario() {
    return this.formularioAluno.get('prontuario')!.value;
  }

  get nome() {
    return this.formularioAluno.get('nome')!.value;
  }

  get data_nascimento() {
    return this.formularioAluno.get('data')!.value;
  }

  get telefone() {
    return this.formularioAluno.get('telefone')!.value;
  }

  get email() {
    return this.formularioAluno.get('email')!.value;
  }

  get idcurso() {

    const curso = this.formularioAluno.get('curso')!.value;

    return curso?.idcurso || null;

  }

  get editando() {
    return this.editar;
  }

  get desabilitado() {
    return this.desabilitar;
  }

  titulo() {

    if (this.desabilitar) {
      return 'Visualização de Aluno';
    }

    return this.editar
      ? 'Edição de Aluno'
      : 'Cadastro de Aluno';

  }

}