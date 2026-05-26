import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

import { CursoService } from '../../../services/cursos.service';
import { CoordenadorService } from 'src/app/services/coordenador.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { EntityUpdateService } from 'src/app/services/entityUpdate.service';

@Component({
  selector: 'app-formulario-curso',
  templateUrl: './formulario-curso.component.html',
  styleUrls: ['./formulario-curso.component.css'],
})
export class FormularioCursoComponent implements OnInit {
  formularioCurso!: FormGroup;
  servidores: any[] = [];
  coordenadores: any[] = [];
  isSubmitting: boolean = false;
  user: any;
  cursos: any[] = [];
  curso: any;
  private data: any;
  private editar: boolean = false;
  private desabilitar: boolean = false;
  private cadastrar: boolean = false;

  constructor(
    private cursoService: CursoService,
    private coodenadorService: CoordenadorService,
    private snackBarService: SnackBarService,
    private entityUpdateService: EntityUpdateService,
    private activatedRoute: ActivatedRoute,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(() => {
      if (window.history.state) {
        this.data = window.history.state.curso;
        this.desabilitar = window.history.state.visualizar;
      }
    });

    if (this.data != null) {
      this.editar = true;
    }

    if(this.data == null)
    {
      this.cadastrar = true;
    }

    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);

    this.formularioCurso = new FormGroup({
      sigla: new FormControl(
        {
          value: this.data ? this.data.sigla : '',
          disabled: this.desabilitar,
        },
        [Validators.required]
      ),
      nomeCurso: new FormControl(
        {
          value: this.data ? this.data.nomeCurso : '',
          disabled: this.desabilitar,
        },
        [Validators.required]
      ),
      Coordenador: new FormControl(
        {
          value: this.data ? this.data.servidor : '',
          disabled: this.desabilitar,
        },
        [Validators.required]
      ),
    });

    if(this.cadastrar){
      this.buscarCursos();
      this.verificarSigla();
    }

    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    this.buscarCoordenador();
  }

  async submit() {

  if (this.formularioCurso.invalid || this.isSubmitting) {

    this.snackBarService.open('Campos Obrigatórios');

    const fields = Object.keys(this.formularioCurso.controls);

    const firstInvalidField = fields.find(
      (field) => this.formularioCurso.get(field)!.invalid
    );

    if (firstInvalidField) {

      const element = document.getElementById(firstInvalidField);

      if (element) {
        element.focus();
      }

    }

    return;
  }

  if (this.sigla.trim() === '') {

    this.snackBarService.open(
      'Sigla deve ser preenchida corretamente.'
    );

    return;
  }

  if (this.nomeCurso.trim() === '') {

    this.snackBarService.open(
      'Nome do curso deve ser preenchido corretamente.'
    );

    return;
  }

  try {

    this.isSubmitting = true;

    // 🔥 ESPERA SALVAR
    if (this.editar) {

      await this.updateCurso();

    } else {

      await this.createCurso();

    }

    // 🔥 SÓ VOLTA DEPOIS DE SALVAR
    this.retornarParaLista();

  } catch (error: any) {

    console.error(error);

    this.isSubmitting = false;

    if (error && error.error && error.error.data) {

      const errorMessage = error.error.data;

      this.snackBarService.open(
        `Falha ao cadastrar curso: ${errorMessage}`
      );

    } else {

      this.snackBarService.open(
        'Falha ao cadastrar curso'
      );

    }

  }

}

  private async createCurso() {
    await this.cursoService.createCurso({
      sigla: this.sigla.toUpperCase(),
      nomeCurso: this.nomeCurso,
      coordenador: this.idcordenador,
    });
    this.snackBarService.open('Curso cadastrado com sucesso!!');
  }

  private async updateCurso() {
    let idCurso;
    if(this.cadastrar){
       idCurso = this.curso.idcurso;
    }else{
       idCurso = this.data.idcurso;
    }
    await this.cursoService.updateCurso({
      idcurso: idCurso,
      sigla: this.sigla.toUpperCase(),
      nomeCurso: this.nomeCurso,
      coordenador: this.idcordenador,
    });
    this.snackBarService.open('Curso editado com sucesso!!');
  }

  retornarParaLista() {

  this.entityUpdateService.notifyUpdate('curso');

  // 🔥 volta atualizando cursos
  this.router.navigate(
    [`/${this.user.tiposervidor}/formularioAluno`],
    {
      state: {
        atualizarCursos: true
      }
    }
  );

}

  displayFn(Coordenador: any): string {
    return Coordenador && Coordenador.nome;
  }

  async buscarCoordenador() {
    const response = await this.coodenadorService.getCoordenador();
    this.coordenadores = response.data;
  }

  get sigla() {
    return this.formularioCurso.get('sigla')!.value;
  }

  get nomeCurso() {
    return this.formularioCurso.get('nomeCurso')!.value;
  }

  get idcordenador() {
    return this.formularioCurso.get('Coordenador')!.value.idservidor;
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
      titulo = 'Cadastro de Curso';
    } else {
      titulo = 'Edição de Curso';
    }
    return titulo;
  }

  async verificarSiglaCadastrada(sigla: string): Promise<boolean> {
    // Obtém a lista de cursos do segundo elemento (índice 1) de this.cursos
    const listaCursos = this.cursos[1].cursos;
    // Retorna true se encontrar um curso com a sigla desejada, false caso contrário
    return listaCursos.some((curso: any) => curso.sigla === sigla);
  }

  async buscarCursos(): Promise<void> {
    try {
      this.cursos = await this.cursoService.getCursos();
      this.cursos = Object.values(this.cursos);
    } catch (error) {
      console.error('Erro ao carregar os cursos:', error);
    }
  }
    // Função para preencher o formulário com os dados do curso existente
  preencherFormulario(curso: any) {
    if (curso) {
      this.formularioCurso.patchValue({
        nomeCurso: curso.nomeCurso,
        Coordenador: curso.servidor
      });
    }
  }

  // Função para esvaziar o formulário
  esvaziarFormulario() {
    this.formularioCurso.patchValue({
      nomeCurso: "",
      Coordenador: ""
    });
  }
  async verificarSigla(){
        this.formularioCurso.get('sigla')!.valueChanges.subscribe(async (value) => {
          console.log("entrou")
          if (value) {
            const siglaCadastrada = await this.verificarSiglaCadastrada(value.toUpperCase());
            if (siglaCadastrada) {
              this.editar = true;
              const listaCursos = this.cursos[1].cursos;
              this.curso = listaCursos.find((curso: any) => curso.sigla === value.toUpperCase());
              this.preencherFormulario(this.curso);
            }
            else{
              if(this.editar == true){
                this.editar = false;
                this.curso = null;
                this.esvaziarFormulario();
              }
            }
          }
        });
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.idservidor === c2.idservidor : c1 === c2;
  }

}
