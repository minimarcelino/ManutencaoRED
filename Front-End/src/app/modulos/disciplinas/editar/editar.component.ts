import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { curso } from 'src/app/modelo/curso';
import { CursoService } from 'src/app/services/cursos.service';
import { DisciplinaService } from 'src/app/services/disciplina.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';
import { ValidationService } from 'src/app/utils/validation.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
})
export class EditarDisciplinaComponent implements OnInit {
  editarDisciplina!: FormGroup;
  cursos: curso[] = [];
  isSubmitting: boolean = false;
  user: any;

  constructor(
    private disciplinaService: DisciplinaService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cursoService: CursoService,
    private dialog: MatDialogRef<EditarDisciplinaComponent>,
    public validationService: ValidationService
  ) {}

  ngOnInit(): void {
    this.editarDisciplina = new FormGroup({
      sigla: new FormControl(this.data.sigla, [Validators.required]),
      nomeDisciplina: new FormControl(this.data.nomeDisciplina, [
        Validators.required,
      ]),
      curso: new FormControl(this.data.curso, [Validators.required]),
    });
    this.fetchCurso();
    this.displayFn(this.data.curso);
  }

  async submit() {
    if (this.editarDisciplina.invalid || this.isSubmitting) {
      this.openSnackBar('Campos obrigatórios!!', null);
      return;
    } else {
      this.isSubmitting = true;
      try {
        await this.disciplinaService.updateDisciplina({
          iddisciplinas: this.data.iddisciplinas,
          sigla: this.sigla.trim().toUpperCase(),
          nomeDisciplina: this.nomeDisciplina.trim(),
          curso_idcurso: this.idcurso,
        });
        this.openSnackBar('Disciplina editada com sucesso!!', null);
        this.dialog.close();
      } catch (error: any) {
        if (error && error.error && error.error.data) {
          const errorMessage = error.error.data;
          this.openSnackBar('Falha ao editar disciplina', errorMessage);
        } else {
          this.openSnackBar(
            'Falha ao editar disciplina',
            'Ocorreu um erro durante a edição da disciplina.'
          );
        }
      }
    }
  }

  cancelar() {
    this.dialog.close();
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

  async fetchCurso() {
    const getCursos = await this.cursoService.getCursos();
    this.cursos = getCursos.data.cursos;
  }

  displayFn(curso: curso): string {
    return curso && curso.nomeCurso;
  }

  get sigla() {
    return this.editarDisciplina.get('sigla')!.value;
  }

  get nomeDisciplina() {
    return this.editarDisciplina.get('nomeDisciplina')!.value;
  }

  get idcurso() {
    return this.editarDisciplina.get('curso')!.value.idcurso;
  }
}
