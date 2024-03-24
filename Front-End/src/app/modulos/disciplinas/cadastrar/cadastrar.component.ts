import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { DisciplinaService } from 'src/app/services/disciplina.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';
import { CursoService } from '../../../services/cursos.service';
import { ValidationService } from 'src/app/utils/validation.service';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css'],
})
export class CadastrarDisciplinaComponent implements OnInit {
  cadastrarDisciplina!: FormGroup;
  isSubmitting: boolean = false;
  error: Error | null = null;
  cursos: any[] = [];
  user: any;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private disciplinaService: DisciplinaService,
    private cursoService: CursoService,
    public validationService: ValidationService
  ) {}

  ngOnInit(): void {
    this.cadastrarDisciplina = new FormGroup({
      sigla: new FormControl('', [Validators.required]),
      nomedisciplina: new FormControl('', [Validators.required]),
      Curso: new FormControl('', [Validators.required]),
    });
    this.fetchCurso();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async submit() {
    // Verifica se algum campo obrigatório é apenas espaços em branco
    if (this.nomedisciplina.trim() === '') {
      this.openSnackBar('Nome da disciiplina deve ser preenchido corretamente.', null);
      return;
    }

    if (this.sigla.trim() === '') {
      this.openSnackBar('Sigla deve ser preenchida corretamente.', null);
      return;
    }
    
    if (this.cadastrarDisciplina.invalid || this.isSubmitting) {
      this.openSnackBar('Campos Obrigatórios', null);
      return;
    } else {
      this.isSubmitting = true;
      try {
        console.log(this.curso_idcurso);
        await this.disciplinaService.createDisciplina({
          sigla: this.sigla.trim().toUpperCase(),
          nomeDisciplina: this.nomedisciplina.trim(),
          curso_idcurso: this.curso_idcurso,
        });
        this.openSnackBar('Disciplina cadastrada com sucesso!', null);
        this.voltar();
      } catch (error: any) {
        if (error && error.error && error.error.data) {
          const errorMessage = error.error.data;
          this.openSnackBar('Falha ao cadastrar disciplina', errorMessage);
        } else {
          this.openSnackBar(
            'Falha ao cadastrar disciplina',
            'Ocorreu um erro durante o cadastro da disciplina.'
          );
        }
      }
    }
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

  displayFn(Curso: any): string {
    return Curso && Curso.nomeCurso;
  }

  async fetchCurso() {
    const response = await this.cursoService.getCursos();
    this.cursos = response.data.cursos;
  }

  voltar() {
    this.router.navigate([`/${this.user.tiposervidor}/listarDisciplinas`]);
  }

  get sigla() {
    return this.cadastrarDisciplina.get('sigla')!.value;
  }

  get nomedisciplina() {
    return this.cadastrarDisciplina.get('nomedisciplina')!.value;
  }

  get curso_idcurso() {
    return this.cadastrarDisciplina.get('Curso')!.value.idcurso;
  }
}
