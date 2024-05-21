import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ServidorService } from 'src/app/services/servidor.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-formulario-servidor',
  templateUrl: './formulario-servidor.component.html',
  styleUrls: ['./formulario-servidor.component.css'],
})
export class FormularioServidoresComponent implements OnInit {
  formularioServidor!: FormGroup;
  cursos: any[] = [];
  isSubmitting: boolean = false;
  error: Error | null = null;
  user: any;
  tipoServidores: string[] = [
    'administrador',
    'professor',
    'coordenador',
    'cra',
    'csp',
  ];
  private data: any;
  private editar: boolean = false;
  private desabilitar: boolean = false;

  constructor(
    private servidorService: ServidorService,
    private snackBarService: SnackBarService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {}

  ngOnInit(): void {
    let pront = '';
    this.activatedRoute.paramMap.subscribe(() => {
      if (window.history.state) {
        this.data = window.history.state.servidor;
        this.desabilitar = window.history.state.visualizar;
      }
    });

    if (this.data != null) {
      this.editar = true;
      pront = String(this.data.prontuario);
    }

    console.log(this.data);


    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);

    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);

    this.formularioServidor = new FormGroup({
      prontuario: new FormControl(
        {
          valeu: this.data ? String(this.data.prontuario) : '',
          disabled: this.desabilitar,
        },
        [Validators.required]
      ),
      nome: new FormControl(
        {
          value: this.data ? this.data.nome : '',
          disabled: this.desabilitar,
        },
        [Validators.required]
      ),
      email: new FormControl(
        {
          value: this.data ? this.data.email : '',
          disabled: this.desabilitar,
        },
        [Validators.required, Validators.email]
      ),
      tiposervidor: new FormControl({
        value: this.data ? this.data.tiposervidor : '',
        disabled: this.desabilitar,
      }),
    });

    if (this.data) {
      this.formularioServidor.get('prontuario')?.setValue(String(this.data.prontuario));
    }
  }

  async submit() {
    // Verifica se algum campo obrigatório é apenas espaços em branco
    if (this.nome.trim() === '') {
      this.snackBarService.open('Nome deve ser preenchido corretamente.');
      const element = document.getElementById('nome');
      if (element) {
        element.focus();
      }
      return;
    }

    if (this.email.trim() === '') {
      this.snackBarService.open('E-mail deve ser preenchido corretamente.');
      const element = document.getElementById('email');
      if (element) {
        element.focus();
      }
      return;
    }

    let catServidor =
      this.tiposervidor.charAt(0).toUpperCase() + this.tiposervidor.slice(1);
    if (this.formularioServidor.invalid || this.isSubmitting) {
      this.snackBarService.open('Campos Obrigatórios');
      const fields = Object.keys(this.formularioServidor.controls);
      const firstInvalidField = fields.find(
        (field) => this.formularioServidor.get(field)!.invalid
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
      try {
        if (this.editar) {
          this.updateServidor();
        } else {
          this.createServidor(catServidor);
        }
        this.retornarParaLista();
        this.isSubmitting = true;
      } catch (error: any) {
        if (error && error.error && error.error.data) {
          const errorMessage = error.error.data;
          this.snackBarService.open(
            `Falha ao cadastrar ${catServidor}: ${errorMessage}`
          );
        } else {
          this.snackBarService.open(`Falha ao cadastrar ${catServidor}`);
        }
      }
    }
  }

  private async createServidor(catServidor: string) {
    await this.servidorService.createServidor({
      prontuario: this.prontuario.trim().toUpperCase(),
      nome: this.nome.trim(),
      email: this.email.trim(),
      tiposervidor: this.tiposervidor || 'professor',
      senha: this.gerarPalavraAleatoria(8),
    });
    this.snackBarService.open(`${catServidor} cadastrado com sucesso!!`);
  }

  private async updateServidor() {
    await this.servidorService.updateServidor({
      idservidor: this.data.idservidor,
      prontuario: this.prontuario.toUpperCase(),
      nome: this.nome,
      email: this.email,
      tiposervidor: this.tiposervidor,
      senha: this.data.senha,
    });
    this.snackBarService.open('Docente editado com sucesso!!');
  }

  retornarParaLista() {
    this.router.navigate([`/${this.user.tiposervidor}/listarServidores`]);
  }

  get prontuario() {
    return this.formularioServidor.get('prontuario')!.value;
  }

  get nome() {
    return this.formularioServidor.get('nome')!.value;
  }

  get email() {
    return this.formularioServidor.get('email')!.value;
  }

  get tiposervidor() {
    return this.formularioServidor.get('tiposervidor')!.value;
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

  isADM() {
    return this.user.tiposervidor === 'administrador';
  }

  gerarPalavraAleatoria(tamanho: number) {
    var letras = 'abcdefghijklmnopqrstuvwxyz@#1234567890';
    var palavra = '';
    for (var i = 0; i < tamanho; i++) {
      var indice = Math.floor(Math.random() * letras.length);
      palavra += letras.charAt(indice);
    }
    console.log(palavra);
    return palavra;
  }
}
