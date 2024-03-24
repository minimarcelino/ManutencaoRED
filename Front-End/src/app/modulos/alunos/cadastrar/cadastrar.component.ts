import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';
import { alunoService } from 'src/app/services/alunos.service';
import { cursoService } from 'src/app/services/cursos.service';
import { curso } from 'src/app/modelo/curso';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css'],
})
export class CadastrarAlunoComponent implements OnInit {
  cadastrarAluno!: FormGroup;
  cursos: curso[] = [];
  isSubmitting: boolean = false;
  error: Error | null = null;
  user: any;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private alunoService: alunoService,
    private cursoService: cursoService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {}

  ngOnInit(): void {
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);
    this.cadastrarAluno = new FormGroup({
      prontuario: new FormControl('', [Validators.required]),
      nome: new FormControl('', [Validators.required]),
      data: new FormControl('', [Validators.required]),
      telefone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      curso: new FormControl('', [Validators.required]),
    });
    this.fetchCurso();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async submit() {
    if (this.cadastrarAluno.invalid || this.isSubmitting) {
      this.openSnackBar('Campos Obrigatórios', null);
      return;
    }
  
    if (this.data_nascimento && !this.verificarIdadeMinima(this.data_nascimento)) {
      this.openSnackBar('O aluno deve ter pelo menos 13 anos de idade.', null);
      return;
    }
  
    // Verifica se algum campo obrigatório é apenas espaços em branco
    if (this.nome.trim() === '') {
      this.openSnackBar('Nome deve ser preenchido corretamente.', null);
      return;
    }

    if (this.telefone.trim() === '') {
      this.openSnackBar('Telefone deve ser preenchido corretamente.', null);
      return;
    }

    if (this.email.trim() === '') {
      this.openSnackBar('E-mail deve ser preenchido corretamente.', null);
      return;
    }

    this.isSubmitting = true;
    try {
      await this.alunoService.createAluno({
        prontuario: this.prontuario.toUpperCase(),
        nome: this.nome,
        dataNascimento: this.data_nascimento,
        telefone: this.telefone,
        email: this.email,
        curso_idcurso: this.idcurso,
      });
      this.openSnackBar('Aluno cadastrado com sucesso!!', null);
      this.voltar();
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.openSnackBar('Falha ao cadastrar aluno', errorMessage);
      } else {
        this.openSnackBar(
          'Falha ao cadastrar aluno',
          'Ocorreu um erro durante o cadastro do aluno.'
        );
      }
    }
  }
  
  verificarIdadeMinima(dataNascimento: Date): boolean {
    const hoje = new Date();
    const dataNasc = new Date(dataNascimento);
    const diff = Math.abs(hoje.getTime() - dataNasc.getTime());
    const idade = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    return idade >= 13;
  }

  async fetchCurso() {
    const getCursos = await this.cursoService.getCursos();
    this.cursos = getCursos.data.cursos;
  }

  displayFn(curso: curso): string {
    return curso && curso.nomeCurso;
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

  voltar() {
    this.router.navigate([`/${this.user.tiposervidor}/listarAlunos`]);
  }

  get prontuario() {
    return this.cadastrarAluno.get('prontuario')!.value;
  }

  get nome() {
    return this.cadastrarAluno.get('nome')!.value;
  }

  get data_nascimento() {
    return this.cadastrarAluno.get('data')!.value;
  }

  get telefone() {
    return this.cadastrarAluno.get('telefone')!.value;
  }

  get email() {
    return this.cadastrarAluno.get('email')!.value;
  }

  get idcurso() {
    return this.cadastrarAluno.get('curso')!.value.idcurso;
  }
}
