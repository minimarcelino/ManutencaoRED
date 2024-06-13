import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Observable, startWith, map } from 'rxjs';

import { DisciplinaService } from 'src/app/services/disciplina.service';
import { CursoService } from '../../../services/cursos.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { EntityUpdateService } from 'src/app/services/entityUpdate.service';

// Validador personalizado para verificar se o curso existe na lista de cursos
function cursoValidoValidator(cursos: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = cursos.some(
      (curso) => curso.nomeCurso === control.value.nomeCurso
    );
    return isValid ? null : { cursoInvalido: true };
  };
}

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
  disciplinas: any[] = [];
  disciplina: any;
  private data: any;
  private editar: boolean = false;
  private desabilitar: boolean = false;
  private cadastrar: boolean = false;
  private idDisciplina: any;

  constructor(
    private snackBarService: SnackBarService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private disciplinaService: DisciplinaService,
    private cursoService: CursoService,
    private entityUpdateService: EntityUpdateService,
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

    if (this.data == null) {
      this.cadastrar = true;
    }
    const desabilitarControle = this.desabilitar || this.editar;

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
      nomeDisciplina: new FormControl(
        {
          value: this.data ? this.data.nomeDisciplina : '',
          disabled: this.desabilitar,
        },
        [Validators.required]
      ),
      Curso: new FormControl(
        {
          value: this.data ? this.data.curso : '',
          disabled: desabilitarControle,
        },
        [Validators.required]
      ),
    });
    this.buscarCursos();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    this.filterCurso();
    if (this.cadastrar) {
      this.buscarDisciplinas();
      this.verificarSigla();
    }
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
      let modo = '';
      try {
        if (this.editar) {
          this.updateDiscipina();
          modo = 'editar';
        } else {
          this.createDisciplina();
          modo = 'cadastrar';
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

  private async createDisciplina() {
    console.log(this.curso_idcurso);
    await this.disciplinaService.createDisciplina({
      sigla: this.sigla.trim().toUpperCase(),
      nomeDisciplina: this.nomeDisciplina.trim(),
      curso_idcurso: this.curso_idcurso,
    });
    this.snackBarService.open(`Disciplina cadastrada com sucesso!`);
  }

  private async updateDiscipina() {
    let id;
    if (this.idDisciplina != undefined) {
      id = this.idDisciplina;
    } else {
      id = this.data.iddisciplinas;
    }
    await this.disciplinaService.updateDisciplina({
      iddisciplinas: id,
      sigla: this.sigla.trim().toUpperCase(),
      nomeDisciplina: this.nomeDisciplina.trim(),
      curso_idcurso: this.curso_idcurso,
    });
    this.snackBarService.open('Disciplina editada com sucesso!');
  }

  displayFn(Curso: any): string {
    return Curso && Curso.nomeCurso ? Curso.nomeCurso : '';
  }

  async buscarCursos() {
    const response = await this.cursoService.getCursos();
    this.cursos = response.data.cursos;
    this.filterCurso(); // Chamar a filtragem após buscar os cursos
    this.formularioDisciplina
      .get('Curso')!
      .setValidators([Validators.required, cursoValidoValidator(this.cursos)]);
    this.formularioDisciplina.get('Curso')!.updateValueAndValidity();
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
    this.entityUpdateService.notifyUpdate('disciplina');
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

  async verificarSiglaCadastrada(sigla: string): Promise<boolean> {
    // Obtém a lista de disciplina do segundo elemento (índice 1) de this.disciplina
    const listaDisciplina = this.disciplinas[1].disciplinas;
    // Retorna true se encontrar um curso com a sigla desejada, false caso contrário
    return listaDisciplina.some(
      (disciplina: any) => disciplina.sigla === sigla
    );
  }

  async buscarDisciplinas(): Promise<void> {
    try {
      this.disciplinas = await this.disciplinaService.getDisciplina();
      this.disciplinas = Object.values(this.disciplinas);
    } catch (error) {
      console.error('Erro ao carregar as disciplinas:', error);
    }
  }
  // Função para preencher o formulário com os dados do curso existente
  preencherFormulario(disciplina: any) {
    if (disciplina) {
      this.idDisciplina = disciplina.iddisciplinas;
      console.log(this.idDisciplina);
      this.formularioDisciplina.patchValue({
        nomeDisciplina: disciplina.nomeDisciplina,
        Curso: disciplina.curso,
      });
    }
  }

  // Função para esvaziar o formulário
  esvaziarFormulario() {
    this.formularioDisciplina.patchValue({
      nomeDisciplina: '',
      Curso: '',
    });
  }
  async verificarSigla() {
    this.formularioDisciplina
      .get('sigla')!
      .valueChanges.subscribe(async (value) => {
        console.log('entrou');
        if (value) {
          const siglaCadastrada = await this.verificarSiglaCadastrada(
            value.toUpperCase()
          );
          if (siglaCadastrada) {
            this.editar = true;
            const listarDisciplinas = this.disciplinas[1].disciplinas;
            this.disciplina = listarDisciplinas.find(
              (disciplina: any) => disciplina.sigla === value.toUpperCase()
            );
            this.preencherFormulario(this.disciplina);
          } else {
            if (this.editar == true) {
              this.editar = false;
              this.disciplina = null;
              this.esvaziarFormulario();
            }
          }
        }
      });
  }
}
