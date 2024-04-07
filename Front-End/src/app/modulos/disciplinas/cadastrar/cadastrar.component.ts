import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, startWith, map } from 'rxjs';

import { DisciplinaService } from 'src/app/services/disciplina.service';
import { CursoService } from '../../../services/cursos.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

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
  filteredCursos: Observable<any[]> | undefined;

  constructor(
    private snackBarService: SnackBarService,
    private router: Router,
    private disciplinaService: DisciplinaService,
    private cursoService: CursoService
  ) {}

  ngOnInit(): void {
    this.cadastrarDisciplina = new FormGroup({
      sigla: new FormControl('', [Validators.required]),
      nomeDisciplina: new FormControl('', [Validators.required]),
      Curso: new FormControl('', [Validators.required]),
    });
    this.buscarCursos();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    this.filterCurso();
  }

  async submit() {
    // Verifica se algum campo obrigatório é apenas espaços em branco
    if (this.nomeDisciplina.trim() === '' || this.sigla.trim() === '') {
      this.snackBarService.open('Campos devem ser preenchidos corretamente.');
      return;
    }
    if (this.cadastrarDisciplina.invalid || this.isSubmitting) {
      this.snackBarService.open('Campos Obrigatórios');
      return;
    } else {
      this.isSubmitting = true;
      try {
        console.log(this.curso_idcurso);
        await this.disciplinaService.createDisciplina({
          sigla: this.sigla.trim().toUpperCase(),
          nomeDisciplina: this.nomeDisciplina.trim(),
          curso_idcurso: this.curso_idcurso,
        });
        this.snackBarService.open('Disciplina cadastrada com sucesso!');
        this.voltar();
      } catch (error: any) {
        const errorData = error.error.data;
        const errorPrisma = error.error.error;

        if (errorPrisma) {
          const campoErro = errorPrisma.meta['target'].split('_')[0];
          if (errorPrisma.code === 'P2002') {
            this.snackBarService.open(
              `Falha ao cadastrar disciplina: Campo ${campoErro} já cadastrado`,
              '',
              7000
            );
          } else {
            this.snackBarService.open(
              `Falha ao cadastrar disciplina: Erro ${errorPrisma.code}`
            );
          }
        } else if (errorData) {
          this.snackBarService.open(
            `Falha ao cadastrar disciplina: ${errorData}`
          );
        } else {
          this.snackBarService.open('Falha ao cadastrar disciplina');
        }
      }
    }
  }

  displayFn(Curso: any): string {
    return Curso && Curso.nomeCurso;
  }

  async buscarCursos() {
    const response = await this.cursoService.getCursos();
    this.cursos = response.data.cursos;
  }

  filterCurso() {
    if (this.cadastrarDisciplina && this.cadastrarDisciplina.get('Curso')) {
      this.filteredCursos = this.cadastrarDisciplina
        .get('Curso')!
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

  voltar() {
    this.router.navigate([`/${this.user.tiposervidor}/listarDisciplinas`]);
  }

  get sigla() {
    return this.cadastrarDisciplina.get('sigla')!.value;
  }

  get nomeDisciplina() {
    return this.cadastrarDisciplina.get('nomeDisciplina')!.value;
  }

  get curso_idcurso() {
    return this.cadastrarDisciplina.get('Curso')!.value.idcurso;
  }
}
