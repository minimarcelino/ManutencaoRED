import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter } from '@angular/material/core';

import { AlunoService } from 'src/app/services/alunos.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';
import { CursoService } from '../../../services/cursos.service';

import { curso } from 'src/app/modelo/curso';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
})
export class EditarAlunosComponent implements OnInit {
  editarAluno!: FormGroup;
  cursos: curso[] = [];
  isSubmitting: boolean = false;
  user: any;

  constructor(
    private alunoService: AlunoService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<EditarAlunosComponent>,
    private cursoService: CursoService,
    private _adapter: DateAdapter<any>  ) {}

  ngOnInit(): void {
    var date = new Date(this.data.data);
    var utcYear = date.getUTCFullYear();
    var utcMonth = date.getUTCMonth();
    var utcDay = date.getUTCDate();
    var utcDate = new Date(utcYear, utcMonth, utcDay);
    this.editarAluno = new FormGroup({
      prontuario: new FormControl(this.data.prontuario, [Validators.required]),
      nome: new FormControl(this.data.nome, [Validators.required]),
      data: new FormControl(utcDate, [Validators.required]),
      telefone: new FormControl(this.data.telefone, [Validators.required]),
      email: new FormControl(this.data.email, [Validators.required]),
      curso: new FormControl(this.data.curso, [Validators.required]),
    });
    this.fetchCurso();
    this._adapter.setLocale('pt-BR');
    this.displayFn(this.data.curso);
  }

  async submit() {
    if (this.editarAluno.invalid || this.isSubmitting) {
      this.openSnackBar('Campos obrigatórios!!', null);
      return;
    }

    if (this.data_nascimento && !this.verificarIdadeMinima(this.data_nascimento)) {
      this.openSnackBar('O aluno deve ter pelo menos 13 anos de idade.',null);
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
      await this.alunoService.updateAluno({
        id: this.data.id,
        prontuario: this.prontuario.toUpperCase(),
        nome: this.nome,
        dataNascimento: this.data_nascimento,
        telefone: this.telefone,
        email: this.email,  
        curso_idcurso: this.idcurso,
      });
      this.openSnackBar('Aluno editado com sucesso!!', null);
      this.dialog.close();
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.openSnackBar('Falha ao editar aluno', errorMessage);
      } else {
        this.openSnackBar(
          'Falha ao editar aluno',
          'Ocorreu um erro durante a edição do aluno.'
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

  cancelar() {
    this.dialog.close();
  }

  async fetchCurso() {
    const getCursos = await this.cursoService.getCursos();
    this.cursos = getCursos.data.cursos;
  }

  displayFn(curso: curso): string {
    return curso && curso.nomeCurso;
  }

  get prontuario() {
    return this.editarAluno.get('prontuario')!.value;
  }

  get nome() {
    return this.editarAluno.get('nome')!.value;
  }
  get data_nascimento() {
    return this.editarAluno.get('data')!.value;
  }

  get telefone() {
    return this.editarAluno.get('telefone')!.value;
  }

  get email() {
    return this.editarAluno.get('email')!.value;
  }

  get idcurso() {
    return this.editarAluno.get('curso')!.value.idcurso;
  }
}
