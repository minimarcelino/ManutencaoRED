import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Observable, startWith, map } from 'rxjs';

import { DisciplinaService } from 'src/app/services/disciplina.service';
import { CursoService } from '../../../services/cursos.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-formulario-disciplina',
  templateUrl: './formulario-disciplina.component.html',
  styleUrls: ['./formulario-disciplina.component.css'],
})
export class FormularioDisciplinaComponent implements OnInit {
  formularioDisciplina!: FormGroup;
  isSubmitting: boolean = false;
  error: Error | null = null;
  cursos: any[] = [];
  user: any;
  filteredCursos: Observable<any[]> | undefined;
  private data: any;
  private editar: boolean = false;
  private desabilitar: boolean = false;

  constructor(
    private snackBarService: SnackBarService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private disciplinaService: DisciplinaService,
    private cursoService: CursoService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(() => {
      if (window.history.state) {
        this.data = window.history.state.disciplina;
        this.desabilitar = window.history.state.visualizar;
      }
    });

    if (this.data != null) {
      this.editar = true;
    }
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);

    this.formularioDisciplina = new FormGroup({
      sigla: new FormControl(
        {
          value: this.data ? this.data.sigla : '',
          disabled: this.desabilitar,
        },
        [Validators.required]
      ),
      nomeDisciplina: new FormControl({
        value: this.data ? this.data.nomeDisciplina : '',
        disabled: this.desabilitar
      }, [Validators.required]),
      Curso: new FormControl({
        value: this.data ? this.data.curso : '',
        disabled: this.desabilitar
      }, [Validators.required]),
    });
    this.buscarCursos();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
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

    if (this.formularioDisciplina.invalid || this.isSubmitting) {
      this.snackBarService.open('Campos Obrigatórios');
      // Encontra o primeiro campo inválido e coloca o foco nele
      const fields = Object.keys(this.formularioDisciplina.controls);
      const firstInvalidField = fields.find(
        (field) => this.formularioDisciplina.get(field)!.invalid
      );
      if (firstInvalidField) {
        const element = document.getElementById(firstInvalidField);
        if (element) {
          element.focus();
        }
      }
      return;
    } else {
      this.isSubmitting = true;
      let modo = ''
      try {
        if (this.editar) {
          this.updateDiscipina();
          modo = 'editar';
        } else {
          this.createDisciplina();
          modo= 'cadastrar';
        }
        this.retornarParaLista();
      } catch (error: any) {
        const errorData = error.error.data;
        const errorPrisma = error.error.error;

        if (errorPrisma) {
          const campoErro = errorPrisma.meta['target'].split('_')[0];
          if (errorPrisma.code === 'P2002') {
            this.snackBarService.open(
              `Falha ao ${modo} disciplina: Campo ${campoErro} já existente`,
              '',
              7000
            );
          } else {
            this.snackBarService.open(
              `Falha ao ${modo} disciplina: Erro ${errorPrisma.code}`
            );
          }
        } else if (errorData) {
          this.snackBarService.open(
            `Falha ao ${modo} disciplina: ${errorData}`
          );
        } else {
          this.snackBarService.open('Falha ao ${modo} disciplina');
        }
      }
    }
  }

  private async createDisciplina(){
    await this.disciplinaService.createDisciplina({
      sigla: this.sigla.trim().toUpperCase(),
      nomeDisciplina: this.nomeDisciplina.trim(),
      curso_idcurso: this.curso_idcurso,
    });
    this.snackBarService.open(`Disciplina cadastrada com sucesso!`);
  }

  private async updateDiscipina(){
    await this.disciplinaService.updateDisciplina({
      iddisciplinas: this.data.iddisciplinas,
      sigla: this.sigla.trim().toUpperCase(),
      nomeDisciplina: this.nomeDisciplina.trim(),
      curso_idcurso: this.curso_idcurso,
    });
    this.snackBarService.open('Disciplina editada com sucesso!');
  }

  displayFn(Curso: any): string {
    return Curso && Curso.nomeCurso;
  }

  async buscarCursos() {
    const response = await this.cursoService.getCursos();
    this.cursos = response.data.cursos;
  }

  filterCurso() {
    if (this.formularioDisciplina && this.formularioDisciplina.get('Curso')) {
      this.filteredCursos = this.formularioDisciplina
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

  retornarParaLista() {
    this.router.navigate([`/${this.user.tiposervidor}/listarDisciplinas`]);
  }

  get sigla() {
    return this.formularioDisciplina.get('sigla')!.value;
  }

  get nomeDisciplina() {
    return this.formularioDisciplina.get('nomeDisciplina')!.value;
  }

  get curso_idcurso() {
    return this.formularioDisciplina.get('Curso')!.value.idcurso;
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
      titulo = 'Cadastro de Disciplina';
    } else {
      titulo = 'Edição de Disciplina';
    }

    if (this.desabilitar) {
      titulo = 'Visualização de Disciplina';
    }

    return titulo;
  }
}
