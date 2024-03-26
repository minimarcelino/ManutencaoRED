import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Location } from '@angular/common';

import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';
import { AlunoService } from 'src/app/services/alunos.service';
import { CursoService } from 'src/app/services/cursos.service';
import { curso } from 'src/app/modelo/curso';
import { SnackBarService } from 'src/app/services/snackbar.service';

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
  destino = '';

  constructor(
    private snackBarService: SnackBarService,
    private router: Router,
    private alunoService: AlunoService,
    private cursoService: CursoService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() private dialogRef: MatDialogRef<CadastrarAlunoComponent>,
    private location: Location
  ) {}

  ngOnInit(): void {
    this._locale = 'pt-BR';
    
    this._adapter.setLocale(this._locale);
    this.cadastrarAluno = new FormGroup({
      prontuario: new FormControl('', [Validators.required]),
      nome: new FormControl('', [Validators.required]),
      data: new FormControl('', [Validators.required]),
      telefone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      curso: new FormControl('', [Validators.required]),
    });
    this.buscarCursos();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async submit() {
    console.log('Destino: ', this.destino);

    if (this.cadastrarAluno.invalid || this.isSubmitting) {
      this.snackBarService.open('Campos Obrigatórios');
      return;
    }


    if (this.data_nascimento && !this.verificarIdadeMinima(this.data_nascimento)) {
      this.snackBarService.open('O aluno deve ter pelo menos 13 anos de idade.');
      return;
    }

    // Verifica se algum campo obrigatório é apenas espaços em branco
    if (this.nome.trim() === '') {
      this.snackBarService.open('Nome deve ser preenchido corretamente.');
      return;
    }

    if (this.telefone.trim() === '') {
      this.snackBarService.open('Telefone deve ser preenchido corretamente.');
      return;
    }

    if (this.email.trim() === '') {
      this.snackBarService.open('E-mail deve ser preenchido corretamente.');
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
        this.snackBarService.open('Aluno cadastrado com sucesso!!');
        this.voltar();

        if (this.data.dialog) {
          this.dialogRef.close();
        }

      } catch (error: any) {
        const errorData = error.error.data;
        const errorPrisma = error.error.error;

        if (errorPrisma) {
          const campoErro = errorPrisma.meta['target'].split('_')[0];
          if (errorPrisma.code === 'P2002') {
            this.snackBarService.open(`Falha ao cadastrar aluno: Campo ${campoErro} já cadastrado`);
          } else {
            this.snackBarService.open(`Falha ao cadastrar aluno: Erro ${errorPrisma.code}`);
          }
        } else if (errorData) {
          this.snackBarService.open(`Falha ao cadastrar aluno: Erro ${errorData}`);
        } else {
          this.snackBarService.open('Falha ao cadastrar aluno');
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

  async buscarCursos() {
    const getCursos = await this.cursoService.getCursos();
    this.cursos = getCursos.data.cursos;
  }

  displayFn(curso: curso): string {
    return curso && curso.nomeCurso;
  }

  voltar() {
    //this.router.navigate([`/${this.user.tiposervidor}/${destino}`]);
    this.location.back();
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
