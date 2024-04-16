import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, startWith, map } from 'rxjs';

import { curso } from 'src/app/modelo/curso';
import { CursoService } from 'src/app/services/cursos.service';
import { DisciplinaService } from 'src/app/services/disciplina.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
})
export class EditarDisciplinaComponent implements OnInit {
  editarDisciplina!: FormGroup;
  cursos: curso[] = [];
  filteredCursos: Observable<any[]> | undefined;
  isSubmitting: boolean = false;
  user: any;

  constructor(
    private disciplinaService: DisciplinaService,
    private snackBarService: SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cursoService: CursoService,
    private dialog: MatDialogRef<EditarDisciplinaComponent>,
  ) {}

  ngOnInit(): void {
    this.editarDisciplina = new FormGroup({
      sigla: new FormControl(this.data.sigla, [Validators.required]),
      nomeDisciplina: new FormControl(this.data.nomeDisciplina, [Validators.required]),
      curso: new FormControl(this.data.curso, [Validators.required]),
    });
    this.fetchCurso();
    this.displayFn(this.data.curso);
    this.filterCurso();
  }

  async submit() {
    // Verifica se algum campo obrigatório é apenas espaços em branco
    if (this.sigla.trim() === '') {
      this.snackBarService.open('Campos devem ser preenchidos corretamente.');
      const element = document.getElementById('sigla');
      if (element) {
        element.focus();
      }
      return;
    }
    
    if (this.nomeDisciplina.trim() === '') {
      this.snackBarService.open('Campos devem ser preenchidos corretamente.');
      const element = document.getElementById('nome');
      if (element) {
        element.focus();
      }
      return;
    }

    if (this.editarDisciplina.invalid || this.isSubmitting) {
      this.snackBarService.open('Campos Obrigatórios');
      // Encontra o primeiro campo inválido e coloca o foco nele
      const fields = Object.keys(this.editarDisciplina.controls);
      const firstInvalidField = fields.find(field => this.editarDisciplina.get(field)!.invalid);
      if (firstInvalidField) {
        const element = document.getElementById(firstInvalidField);
        if (element) {
          element.focus();
        }
      }
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
        this.snackBarService.open('Disciplina editada com sucesso!!');
        this.dialog.close();
      } catch (error: any) {
        const errorData = error.error.data;
        const errorPrisma = error.error.error;

       if (errorPrisma) {
          const campoErro = errorPrisma.meta['target'].split('_')[0];
          if (errorPrisma.code === 'P2002') {
            this.snackBarService.open(`Falha ao cadastrar disciplina: Campo ${campoErro} já cadastrado`,'', 7000);
          } else {
            this.snackBarService.open(`Falha ao cadastrar disciplina: Erro ${errorPrisma.code}`);
          }
        } else if (errorData) {
          this.snackBarService.open(`Falha ao cadastrar disciplina: ${errorData}`);
        } else {
          this.snackBarService.open('Falha ao cadastrar disciplina');
        }
      }
    }
  }

  filterCurso() {
    if (this.editarDisciplina && this.editarDisciplina.get('curso')) {
      this.filteredCursos = this.editarDisciplina
        .get('curso')!
        .valueChanges.pipe(
          startWith(''),
          map((value) => (typeof value === 'string' ? value : value.nomeCurso)),
          map((nomeCurso) =>
            nomeCurso ? this._filterCursos(nomeCurso) : this.cursos.slice()
          )
        );
    }
  }

  private _filterCursos(nomeCurso: string): any[] {
    const filterValue = nomeCurso.toLowerCase();
    return this.cursos.filter(
      (curso) => curso.nomeCurso.toLowerCase().indexOf(filterValue) !== -1
    );
  }

  selecionarTodoTexto(){
    const cursoInput = document.getElementById('curso-input') as HTMLInputElement;
    if (cursoInput) {
      cursoInput.select();
    }
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

  get sigla() {
    return this.editarDisciplina.get('sigla')!.value;
  }

  get nomeDisciplina() {
    return this.editarDisciplina.get('nomeDisciplina')!.value;
  }

  get idcurso() {
    return this.editarDisciplina.get('Curso')!.value.idcurso;
  }
}
