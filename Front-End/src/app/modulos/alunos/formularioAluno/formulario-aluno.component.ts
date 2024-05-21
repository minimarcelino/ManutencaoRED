import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Location } from '@angular/common';

import { AlunoService } from 'src/app/services/alunos.service';
import { CursoService } from 'src/app/services/cursos.service';
import { curso } from 'src/app/modelo/curso';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-formulario-aluno',
  templateUrl: './formulario-aluno.component.html',
  styleUrls: ['./formulario-aluno.component.css'],
})
export class FormularioAlunoComponent implements OnInit {
  formularioAluno!: FormGroup;
  cursos: curso[] = [];
  isSubmitting: boolean = false;
  error: Error | null = null;
  user: any;
  destino = '';
  private data: any;
  private editar: boolean = false;
  private desabilitar: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private snackBarService: SnackBarService,
    private alunoService: AlunoService,
    private cursoService: CursoService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private location: Location
  ) {}

  ngOnInit(): void {
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);

    this.activatedRoute.paramMap.subscribe(() => {
      if (window.history.state) {
        this.data = window.history.state.aluno;
        this.desabilitar = window.history.state.visualizar;
      }
    });

    if (this.data != null) {
      this.editar = true;
    }

    this.formularioAluno = new FormGroup({
      prontuario: new FormControl(
        {
          value: this.data ? this.data.prontuario : '',
          disabled: this.desabilitar,
        },
        [Validators.required]
      ),
      nome: new FormControl(
        {
          value: this.data ? this.data.nome : '',
          disabled: this.desabilitar,
        },
        [Validators.required]
      ),
      data: new FormControl(
        {
          value: this.data ? this.data.dataNascimento : '',
          disabled: this.desabilitar,
        },
        [Validators.required]
      ),
      telefone: new FormControl(
        {
          value: this.data ? this.data.telefone : '',
          disabled: this.desabilitar,
        },
        [Validators.required]
      ),
      email: new FormControl(
        {
          value: this.data ? this.data.email : '',
          disabled: this.desabilitar,
        },
        [Validators.required, Validators.email]
      ),
      curso: new FormControl(
        {
          value: this.data ? this.data.curso : '',
          disabled: this.desabilitar,
        },
        [Validators.required]
      ),
    });
    this.buscarCursos();
  }

  async submit() {
    if (this.formularioAluno.invalid || this.isSubmitting) {
      this.snackBarService.open('Campos Obrigatórios');
      // Encontra o primeiro campo inválido e coloca o foco nele
      const fields = Object.keys(this.formularioAluno.controls);
      const firstInvalidField = fields.find(
        (field) => this.formularioAluno.get(field)!.invalid
      );
      if (firstInvalidField) {
        const element = document.getElementById(firstInvalidField);
        if (element) {
          element.focus();
        }
      }
      return;
    }

    // Verifica se algum campo obrigatório é apenas espaços em branco
    if (this.nome.trim() === '') {
      this.snackBarService.open('Nome deve ser preenchido corretamente.');
      const element = document.getElementById('nome');
      if (element) {
        element.focus();
      }
      return;
    }

    if (this.email.trim() === '') {
      this.snackBarService.open('E-mail deve ser preenchido corretamente.');
      const element = document.getElementById('email');
      if (element) {
        element.focus();
      }
      return;
    }

    try {
      if (this.editar) {
        this.updateAluno();
      } else {
        this.createAluno();
      }
      this.retornarParaLista();
      this.isSubmitting = true;
    } catch (error: any) {
      this.isSubmitting = false;
      const errorData = error.error.data;
      const errorPrisma = error.error.error;

      if (errorPrisma) {
        const campoErro = errorPrisma.meta['target'].split('_')[0];
        if (errorPrisma.code === 'P2002') {
          this.snackBarService.open(
            `Falha ao cadastrar aluno: Campo ${campoErro} já cadastrado`
          );
        } else {
          this.snackBarService.open(
            `Falha ao cadastrar aluno: Erro ${errorPrisma.code}`
          );
        }
      } else if (errorData) {
        this.snackBarService.open(
          `Falha ao cadastrar aluno: Erro ${errorData}`
        );
      } else {
        this.snackBarService.open('Falha ao cadastrar aluno');
      }
    }
  }

  private async createAluno() {
    await this.alunoService.createAluno({
      prontuario: this.prontuario.toUpperCase(),
      nome: this.nome,
      dataNascimento: this.data_nascimento,
      telefone: this.telefone,
      email: this.email,
      curso_idcurso: this.idcurso,
    });
    this.snackBarService.open('Aluno cadastrado com sucesso!!');
  }

  private async updateAluno() {
    await this.alunoService.updateAluno({
      id: this.data.id,
      prontuario: this.prontuario.toUpperCase(),
      nome: this.nome,
      dataNascimento: this.data_nascimento,
      telefone: this.telefone,
      email: this.email,
      curso_idcurso: this.idcurso,
    });
    this.snackBarService.open('Aluno editado com sucesso!!');
  }

  verificarIdadeMinima(dataNascimento: Date): boolean {
    const hoje = new Date();
    const dataNasc = new Date(dataNascimento);
    const diff = Math.abs(hoje.getTime() - dataNasc.getTime());
    const idade = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    return idade >= 13;
  }

  async buscarCursos() {
    const getCursos = await this.cursoService.getCursos();
    this.cursos = getCursos.data.cursos;
  }

  displayFn(curso: curso): string {
    return curso && curso.nomeCurso;
  }

  retornarParaLista() {
    this.location.back();
  }

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
    return this.formularioAluno.get('curso')!.value.idcurso;
  }

  get editando() {
    return this.editar;
  }

  get desabilitado() {
    return this.desabilitar;
  }

  titulo() {
    let titulo;
    if (!this.editar) {
      titulo = 'Cadastro de Aluno';
    } else {
      titulo = 'Edição de Aluno';
    }

    if (this.desabilitar) {
      titulo = 'Visualização de Aluno';
    }

    return titulo;
  }
}
